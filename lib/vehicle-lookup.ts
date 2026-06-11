import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { vehicles, regLookups, batteries, vehicleBatteryRecommendations } from "@/db/schema";
import { doesBatteryFit, sortBatteriesByFit, type FitResult } from "./battery-fit";
import type { Vehicle, Battery } from "./types";
import {
  demoLookupVehicleByReg,
  demoListPopularVehicles,
  demoListAllBatteries,
  type DemoVehicle,
  type DemoBattery,
} from "@/data/demo-data";
import { DATABASE_URL } from "@/lib/env";
import { liveLookupByReg, liveVehicleToInternal, type LiveVehicle } from "./live-lookup";

export interface LookupResult {
  vehicle: Vehicle | DemoVehicle | null;
  batteries: Array<{
    battery: Battery | DemoBattery;
    fit: FitResult;
    explicitRecommendation?: { isBestMatch: boolean; fitNotes: string | null };
  }>;
  matchedBy: "reg" | "manual" | "none";
  error?: string;
  usingDemoData?: boolean;
  /** Where the vehicle identification came from (useful for UI messaging) */
  dataSource?: "db" | "live" | "demo" | "live-fallback-demo";
  /** Raw live data when available (for richer display or debugging) */
  liveVehicle?: LiveVehicle;
}

export function normalizeReg(input: string): string {
  return input.toUpperCase().replace(/[\s-]/g, "").trim();
}

export async function lookupVehicleByReg(reg: string): Promise<LookupResult> {
  const normalized = normalizeReg(reg);
  if (!normalized || normalized.length < 4) {
    return { vehicle: null, batteries: [], matchedBy: "none", error: "Please enter a valid UK registration" };
  }

  // --- Fast path: no database configured at all -> try live first, then demo batteries ---
  if (!DATABASE_URL) {
    // Still allow live identification even without DB (batteries will come from demo catalogue)
    const liveRes = await liveLookupByReg(normalized);
    if (liveRes?.ok) {
      const internal = liveVehicleToInternal(liveRes.data);
      // Compute fits against demo batteries using the same pure logic
      const demoBatts = demoListAllBatteries() as any[];
      const withFit = demoBatts.map((b: any) => ({
        battery: b,
        fit: doesBatteryFit(internal as any, b as any),
      }));
      const sorted = sortBatteriesByFit(withFit as any)
        .filter((x: any) => x.fit.fits)
        .slice(0, 20);
      return {
        vehicle: internal as any,
        batteries: sorted as any,
        matchedBy: "reg",
        usingDemoData: true,
        dataSource: "live",
        liveVehicle: liveRes.data,
      };
    }

    const demo = demoLookupVehicleByReg(normalized);
    if (!demo.vehicle) {
      return {
        vehicle: null,
        batteries: [],
        matchedBy: "none",
        error: `No exact match for ${normalized} in demo data. Try one of the demo registrations shown on the homepage (e.g. AB12CDE, BX15KLM, DE68FNP).`,
        usingDemoData: true,
        dataSource: "demo",
      };
    }
    return { ...demo, usingDemoData: true, dataSource: "demo" };
  }

  try {
    // 1. Try exact reg lookup (cached from previous live or seeded)
    const regRow = await db
      .select()
      .from(regLookups)
      .where(eq(regLookups.reg, normalized))
      .limit(1);

    let vehicle: Vehicle | null = null;

    if (regRow[0]) {
      const v = await db
        .select()
        .from(vehicles)
        .where(eq(vehicles.id, regRow[0].vehicleId))
        .limit(1);
      vehicle = v[0] ?? null;
    }

    if (vehicle) {
      // Fast cached path
      const allBatteries = await db
        .select()
        .from(batteries)
        .where(eq(batteries.active, true));

      const explicitRecs = await db
        .select()
        .from(vehicleBatteryRecommendations)
        .where(eq(vehicleBatteryRecommendations.vehicleId, vehicle.id));

      const recMap = new Map(
        explicitRecs.map((r) => [r.batteryId, { isBestMatch: r.isBestMatch, fitNotes: r.fitNotes }])
      );

      const withFit = allBatteries.map((b) => {
        const fit = doesBatteryFit(vehicle!, b as Battery);
        return {
          battery: b as Battery,
          fit,
          explicitRecommendation: recMap.get(b.id),
        };
      });

      const sorted = sortBatteriesByFit(withFit)
        .filter((x) => x.fit.fits)
        .slice(0, 24);

      return {
        vehicle,
        batteries: sorted,
        matchedBy: "reg",
        usingDemoData: false,
        dataSource: "db",
      };
    }

    // 2. No cached reg. Try live lookup (the key new capability)
    const liveRes = await liveLookupByReg(normalized);
    if (liveRes?.ok && liveRes.data) {
      const internalLike = liveVehicleToInternal(liveRes.data);

      // Try to persist this as a real vehicle + reg mapping for free future lookups + explicit recs
      let persistedVehicle: Vehicle | null = null;
      try {
        // Insert a vehicle row (use ON CONFLICT on slug to be idempotent-ish)
        const inserted = await db
          .insert(vehicles)
          .values({
            slug: internalLike.slug,
            make: internalLike.make,
            model: internalLike.model,
            variant: internalLike.variant,
            yearFrom: internalLike.yearFrom,
            yearTo: internalLike.yearTo,
            engineCc: internalLike.engineCc,
            fuel: internalLike.fuel as any,
            startStop: internalLike.startStop,
            batteryPolarity: internalLike.batteryPolarity,
            batteryLengthMaxMm: internalLike.batteryLengthMaxMm,
            batteryWidthMaxMm: internalLike.batteryWidthMaxMm,
            batteryHeightMaxMm: internalLike.batteryHeightMaxMm,
            minAh: internalLike.minAh,
            recommendedAh: internalLike.recommendedAh,
            minCca: internalLike.minCca,
            recommendedType: internalLike.recommendedType as any,
            holdDown: internalLike.holdDown,
            notes: internalLike.notes,
            active: true,
          })
          .onConflictDoNothing()
          .returning();

        let vId = inserted[0]?.id;

        if (!vId) {
          // slug collision or already existed — fetch it
          const existing = await db
            .select()
            .from(vehicles)
            .where(eq(vehicles.slug, internalLike.slug))
            .limit(1);
          vId = existing[0]?.id;
        }

        if (vId) {
          // Link the reg
          await db
            .insert(regLookups)
            .values({ reg: normalized, vehicleId: vId })
            .onConflictDoNothing();

          // Reload the full row
          const full = await db.select().from(vehicles).where(eq(vehicles.id, vId)).limit(1);
          persistedVehicle = full[0] ?? null;
        }
      } catch (persistErr) {
        console.warn("Could not persist live lookup result (non-fatal):", persistErr);
      }

      const vehicleForFit = (persistedVehicle || internalLike) as any;

      // Load batteries from DB for matching (best quality)
      const allBatteries = await db
        .select()
        .from(batteries)
        .where(eq(batteries.active, true));

      const withFit = allBatteries.map((b) => ({
        battery: b as Battery,
        fit: doesBatteryFit(vehicleForFit as any, b as Battery),
      }));

      const sorted = sortBatteriesByFit(withFit as any)
        .filter((x: any) => x.fit.fits)
        .slice(0, 24);

      return {
        vehicle: vehicleForFit,
        batteries: sorted as any,
        matchedBy: "reg",
        usingDemoData: false,
        dataSource: "live",
        liveVehicle: liveRes.data,
      };
    }

    // 3. Still nothing — fall back to high quality demo data
    const demo = demoLookupVehicleByReg(normalized);
    if (demo.vehicle) {
      return { ...demo, usingDemoData: true, dataSource: "demo" };
    }

    return {
      vehicle: null,
      batteries: [],
      matchedBy: "none",
      error: `No exact match for ${normalized}. We tried live lookup and demo data. Add it to the catalogue or try another plate.`,
      dataSource: "demo",
    };
  } catch (err) {
    console.warn("Database or live lookup issue, falling back to demo data for reg lookup.", err);
    const demo = demoLookupVehicleByReg(normalized);
    if (demo.vehicle) {
      return { ...demo, usingDemoData: true, dataSource: "demo" };
    }
    return {
      vehicle: null,
      batteries: [],
      matchedBy: "none",
      error: "Using demo data — full database not available. Register a free Neon DB and run npm run db:setup + db:seed for live data.",
      usingDemoData: true,
      dataSource: "demo",
    };
  }
}

// List popular vehicles (real DB if available, otherwise rich demo data)
export async function listPopularVehicles(limit = 18) {
  if (!DATABASE_URL) {
    return demoListPopularVehicles(limit) as any;
  }
  try {
    return await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.active, true))
      .limit(limit);
  } catch {
    return demoListPopularVehicles(limit) as any;
  }
}

// Get all batteries for browse page (demo fallback)
export async function listAllBatteries() {
  if (!DATABASE_URL) {
    return demoListAllBatteries() as any;
  }
  try {
    return await db
      .select()
      .from(batteries)
      .where(eq(batteries.active, true))
      .orderBy(batteries.ah);
  } catch {
    return demoListAllBatteries() as any;
  }
}
