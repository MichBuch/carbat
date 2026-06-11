/**
 * Live / external vehicle data lookup layer.
 * Goal: resolve a UK reg (VRM) to rich vehicle details (make, model, variant, year, engine, fuel, etc).
 * Battery tray / electrical specs are usually NOT returned by basic DVLA lookups, so we combine
 * with our internal catalogue + fitment logic (or secondary paid battery-specific calls).
 *
 * Providers (cost sensitive):
 * - "apify": Uses the public Apify "car_map/apify-vehicle-lookup" actor (screenscrapes the official DVLA enquiry).
 *   Very low per-lookup cost for low volume. Requires APIFY_API_TOKEN.
 * - "ukvd" (future): ukvehicledata.co.uk — licensed DVLA + explicit Battery Data + Start/Stop endpoints. Has free trial.
 * - "demo": never calls external (current fallback behaviour).
 *
 * We strongly cache: successful live results are inserted into the local DB (vehicles + regLookups)
 * so repeat lookups for the same plate are free and instant.
 *
 * IMPORTANT: Always show prominent "guide only" disclaimers. Live data can be incomplete or lag.
 */

import { normalizeReg } from "./vehicle-lookup";
import { DATABASE_URL } from "./env";

export interface LiveVehicle {
  registration: string;
  make: string;
  model: string;
  variant?: string | null;
  yearOfManufacture?: number | null;
  engineCapacityCc?: number | null;
  fuelType?: string | null; // PETROL / DIESEL / ELECTRICITY etc
  // Extra rich data when available from provider
  bodyType?: string | null;
  colour?: string | null;
  co2Emissions?: number | null;
  motStatus?: string | null;
  taxStatus?: string | null;
  // Our derived / best effort battery fitment hints (providers rarely give tray dims)
  // These are populated by heuristics or secondary calls.
  startStop?: boolean | null;
  batteryPolarity?: "0" | "1" | null;
  batteryLengthMaxMm?: number | null;
  batteryWidthMaxMm?: number | null;
  batteryHeightMaxMm?: number | null;
  minAh?: number | null;
  minCca?: number | null;
  recommendedType?: "standard" | "efb" | "agm" | null;
  notes?: string | null;
}

export type LiveLookupResult =
  | { ok: true; data: LiveVehicle; source: "apify" | "ukvd" | "cache" | string }
  | { ok: false; error: string; source?: string };

const APIFY_ACTOR_ID = "car_map/apify-vehicle-lookup";

/**
 * Main entry: resolve reg via external provider if configured + not already cached.
 * This does NOT do the full battery matching — it returns identification + partial fitment hints.
 */
export async function liveLookupByReg(reg: string): Promise<LiveLookupResult | null> {
  const normalized = normalizeReg(reg);
  if (!normalized || normalized.length < 4) return null;

  const provider = (process.env.VEHICLE_LOOKUP_PROVIDER || "auto").toLowerCase();

  // Allow explicit disable
  if (provider === "off" || provider === "none" || provider === "demo") {
    return null;
  }

  // Apify (screenscraping actor) — our concrete low-cost "engage a screenscraping tool" path
  const apifyToken = process.env.APIFY_API_TOKEN || process.env.APIFY_TOKEN;
  const wantsApify = provider === "apify" || provider === "auto" || provider === "scrape";

  if (wantsApify && apifyToken) {
    try {
      const live = await lookupViaApify(normalized, apifyToken);
      if (live) {
        return { ok: true, data: enrichWithBatteryHeuristics(live), source: "apify" };
      }
    } catch (e: any) {
      console.warn("[live-lookup] Apify call failed:", e?.message || e);
      // fall through to null (caller will use demo/DB)
    }
  }

  // Placeholder for future cheap licensed providers (ukvehicledata etc)
  // if (provider === 'ukvd' && process.env.UKVD_API_KEY) { ... }

  return null;
}

/** Call Apify actor via REST (no extra client dep). */
async function lookupViaApify(normalizedReg: string, token: string): Promise<LiveVehicle | null> {
  // 1. Start the run (supports batch, we send one)
  const startRes = await fetch(
    `https://api.apify.com/v2/acts/${encodeURIComponent(APIFY_ACTOR_ID)}/runs?token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registrations: [normalizedReg] }),
      // Keep timeout reasonable for serverless
      signal: AbortSignal.timeout(15000),
    }
  );

  if (!startRes.ok) {
    const txt = await startRes.text().catch(() => "");
    throw new Error(`Apify start failed: ${startRes.status} ${txt}`);
  }

  const startJson: any = await startRes.json();
  const runId = startJson?.data?.id;
  if (!runId) throw new Error("No run id from Apify");

  // 2. Poll for completion (simple, bounded)
  let run: any = null;
  for (let i = 0; i < 12; i++) {
    await new Promise((r) => setTimeout(r, 1200 + i * 200)); // backoff ~1.2-4s
    const pollRes = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}?token=${token}`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!pollRes.ok) continue;
    run = await pollRes.json();
    const status = run?.data?.status;
    if (status === "SUCCEEDED") break;
    if (status === "FAILED" || status === "ABORTED" || status === "TIMED-OUT") {
      throw new Error(`Apify run ${status}`);
    }
  }

  if (!run || run.data?.status !== "SUCCEEDED") {
    return null;
  }

  // 3. Get the dataset items (default dataset)
  const datasetId = run.data.defaultDatasetId;
  if (!datasetId) return null;

  const itemsRes = await fetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&clean=true&format=json`,
    { signal: AbortSignal.timeout(8000) }
  );
  if (!itemsRes.ok) return null;

  const items: any[] = await itemsRes.json();
  const item = items?.[0];
  if (!item || !item.registrationNumber) return null;

  // Map Apify output to our LiveVehicle (fields observed in their docs/examples + typical DVLA VES)
  const make = (item.make || item.Make || "").toString().trim();
  const modelRaw = (item.model || item.Model || item.vehicleModel || "").toString().trim();
  const year = item.yearOfManufacture ?? item.YearOfManufacture ?? item.year ?? null;

  const fuelRaw = (item.fuelType || item.FuelType || "").toString().toUpperCase();
  const fuel: "petrol" | "diesel" | "hybrid" | "other" =
    fuelRaw.includes("DIESEL") ? "diesel" :
    fuelRaw.includes("PETROL") ? "petrol" :
    fuelRaw.includes("HYBRID") || fuelRaw.includes("ELECTRIC") ? "hybrid" : "other";

  const engineCc = item.engineCapacity ?? item.EngineCapacity ?? item.engineCapacityCc ?? null;

  // The actor may surface limited "model" — often the make + generic. We take what we get.
  const variant = item.variant || item.Variant || null;

  return {
    registration: item.registrationNumber,
    make: make || "Unknown",
    model: modelRaw || "Vehicle",
    variant: variant || `${year || ""} ${fuel}`.trim() || null,
    yearOfManufacture: year ? Number(year) : null,
    engineCapacityCc: engineCc ? Number(engineCc) : null,
    fuelType: fuelRaw || fuel,
    bodyType: item.bodyType || item.wheelplan || null,
    colour: item.colour || null,
    co2Emissions: item.co2Emissions ? Number(item.co2Emissions) : null,
    motStatus: item.motStatus || null,
    taxStatus: item.taxStatus || null,
    // Battery hints left null here — we enrich below
    startStop: null,
    batteryPolarity: "0",
  };
}

/**
 * Heuristics + model-specific overrides to turn bare DVLA data into useful battery fitment hints.
 * This is where "more data from reg" starts to become actionable for batteries.
 * For production, replace/augment with a secondary call to a battery-aware provider (UKVD Battery Data etc)
 * or a well-maintained internal mapping table.
 */
function enrichWithBatteryHeuristics(live: LiveVehicle): LiveVehicle {
  const out = { ...live };

  const make = (live.make || "").toLowerCase();
  const model = (live.model || "").toLowerCase();
  const year = live.yearOfManufacture || 0;
  const isVan = /trafic|transit|vivaro|sprinter|crafter|custom|nv300|primastar|movano|master/.test(model) ||
                /van|panel|chassis/.test((live.bodyType || "").toLowerCase());

  // Very rough start/stop guess (many post-2015/2018 cars/vans have it; vans often don't or optional)
  if (out.startStop == null) {
    if (isVan) {
      // Many LCVs are non-s/s or have delete option. Conservative default.
      out.startStop = year >= 2020 && /renault|ford|vauxhall|peugeot|citroen/.test(make);
    } else {
      out.startStop = year >= 2016; // common on passenger cars
    }
  }

  // Polarity is almost always 0 on modern UK/EU cars
  if (!out.batteryPolarity) out.batteryPolarity = "0";

  // Sensible tray + electrical defaults by class
  if (isVan) {
    // Typical LCV: larger battery, often 096/019 case
    out.batteryLengthMaxMm ??= 353;
    out.batteryWidthMaxMm ??= 175;
    out.batteryHeightMaxMm ??= 190;
    out.minAh ??= 80;
    out.minCca ??= 720;
    out.recommendedType ??= out.startStop ? "efb" : "standard";
    out.notes = (out.notes || "") + " Van/LCV fitment — verify exact tray and any start/stop equipment.";
  } else if (/bmw|audi|mercedes|volvo|land rover|jaguar/.test(make)) {
    out.batteryLengthMaxMm ??= 315;
    out.batteryWidthMaxMm ??= 175;
    out.batteryHeightMaxMm ??= 190;
    out.minAh ??= 80;
    out.minCca ??= 800;
    out.recommendedType ??= out.startStop ? "agm" : "standard";
  } else {
    // Mainstream hatch/saloon
    out.batteryLengthMaxMm ??= year >= 2018 ? 242 : 207;
    out.batteryWidthMaxMm ??= 175;
    out.batteryHeightMaxMm ??= 190;
    out.minAh ??= out.startStop ? 60 : 44;
    out.minCca ??= out.startStop ? 580 : 420;
    out.recommendedType ??= out.startStop ? "efb" : "standard";
  }

  if (live.fuelType?.toUpperCase().includes("DIESEL") && !out.minCca) {
    out.minCca = Math.max(out.minCca || 0, 640);
  }

  return out;
}

/**
 * Convert a LiveVehicle (plus our internal knowledge) into something the existing battery-fit
 * and VehicleCard can consume. We return a shape compatible with DemoVehicle / Vehicle.
 */
export function liveVehicleToInternal(live: LiveVehicle) {
  const year = live.yearOfManufacture || new Date().getFullYear() - 5;
  const slugBase = `${live.make}-${live.model}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  const slug = `${slugBase}-${year}`;

  return {
    // Compatible with our Vehicle / DemoVehicle shapes used by cards + fit logic
    id: `live-${live.registration}`,
    slug,
    make: live.make,
    model: live.model,
    variant: live.variant || `${live.yearOfManufacture || ""} ${live.fuelType || ""}`.trim(),
    yearFrom: year,
    yearTo: year,
    engineCc: live.engineCapacityCc || null,
    fuel: (live.fuelType || "").toLowerCase().includes("diesel") ? "diesel" :
          (live.fuelType || "").toLowerCase().includes("petrol") ? "petrol" : "other",
    startStop: !!live.startStop,
    batteryPolarity: (live.batteryPolarity || "0") as "0" | "1",
    batteryLengthMaxMm: live.batteryLengthMaxMm || null,
    batteryWidthMaxMm: live.batteryWidthMaxMm || null,
    batteryHeightMaxMm: live.batteryHeightMaxMm || null,
    minAh: live.minAh || null,
    recommendedAh: live.minAh ? Math.round(live.minAh * 1.1) : null,
    minCca: live.minCca || null,
    recommendedType: live.recommendedType || null,
    holdDown: null,
    notes: live.notes || `Live data from ${live.registration}. Always double-check battery tray, start/stop equipment and polarity.`,
    active: true,
    // Extra for richer UI
    _live: live,
  };
}
