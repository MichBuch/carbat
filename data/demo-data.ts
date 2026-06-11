/**
 * Demo / fallback data for CarBat when no DATABASE_URL is configured.
 * This lets the site work immediately for testing the full UX (reg search, matching, filters, price links).
 * The data mirrors the content in db/seed.sql.
 */

import type { Vehicle, Battery } from "@/lib/types";
import type { FitResult } from "@/lib/battery-fit";
import { doesBatteryFit, sortBatteriesByFit } from "@/lib/battery-fit";

// Practical demo types — only the fields we actually use for display + matching logic
export type DemoVehicle = {
  id: string;
  slug: string;
  make: string;
  model: string;
  variant?: string | null;
  yearFrom: number;
  yearTo: number;
  engineCc?: number | null;
  fuel: "petrol" | "diesel" | "hybrid" | "other";
  startStop: boolean;
  batteryPolarity: "0" | "1";
  batteryLengthMaxMm?: number | null;
  batteryWidthMaxMm?: number | null;
  batteryHeightMaxMm?: number | null;
  minAh?: number | null;
  recommendedAh?: number | null;
  minCca?: number | null;
  recommendedType?: "standard" | "efb" | "agm" | null;
  holdDown?: string | null;
  notes?: string | null;
  active: boolean;
};

export type DemoBattery = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  ah: number;
  cca: number;
  type: "standard" | "efb" | "agm";
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  polarity: "0" | "1";
  weightKg?: number | null;
  warrantyMonths: number;
  technology?: string | null;
  groupSize?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
  active: boolean;
};

// Demo vehicles (key fields for fitment logic)
export const demoVehicles: DemoVehicle[] = [
  { id: "v1", slug: "ford-fiesta-2013-2019-1.0-ecoboost", make: "Ford", model: "Fiesta", variant: "1.0 EcoBoost", yearFrom: 2013, yearTo: 2019, engineCc: 998, fuel: "petrol", startStop: false, batteryPolarity: "0", batteryLengthMaxMm: 208, batteryWidthMaxMm: 175, batteryHeightMaxMm: 190, minAh: 44, recommendedAh: 52, minCca: 440, recommendedType: "standard", holdDown: "B0", notes: "Common supermini.", active: true },
  { id: "v2", slug: "ford-fiesta-2018-2023-1.0-startstop", make: "Ford", model: "Fiesta", variant: "1.0 EcoBoost s/s", yearFrom: 2018, yearTo: 2023, engineCc: 998, fuel: "petrol", startStop: true, batteryPolarity: "0", batteryLengthMaxMm: 242, batteryWidthMaxMm: 175, batteryHeightMaxMm: 190, minAh: 60, recommendedAh: 65, minCca: 580, recommendedType: "efb", holdDown: "B13", notes: "Start/stop requires EFB or AGM.", active: true },
  { id: "v3", slug: "vw-golf-2013-2020-1.6-tdi", make: "Volkswagen", model: "Golf", variant: "1.6 TDI", yearFrom: 2013, yearTo: 2020, engineCc: 1598, fuel: "diesel", startStop: true, batteryPolarity: "0", batteryLengthMaxMm: 278, batteryWidthMaxMm: 175, batteryHeightMaxMm: 190, minAh: 68, recommendedAh: 72, minCca: 680, recommendedType: "efb", holdDown: "B13", notes: "MK7 Golf diesel often EFB.", active: true },
  { id: "v4", slug: "vw-golf-2017-2024-1.5-tsi", make: "Volkswagen", model: "Golf", variant: "1.5 TSI Evo", yearFrom: 2017, yearTo: 2024, engineCc: 1498, fuel: "petrol", startStop: true, batteryPolarity: "0", batteryLengthMaxMm: 278, batteryWidthMaxMm: 175, batteryHeightMaxMm: 190, minAh: 68, recommendedAh: 70, minCca: 640, recommendedType: "agm", holdDown: "B13", notes: "Many later use AGM.", active: true },
  { id: "v5", slug: "vauxhall-corsa-2015-2019-1.4", make: "Vauxhall", model: "Corsa", variant: "1.4", yearFrom: 2015, yearTo: 2019, engineCc: 1398, fuel: "petrol", startStop: false, batteryPolarity: "0", batteryLengthMaxMm: 207, batteryWidthMaxMm: 175, batteryHeightMaxMm: 190, minAh: 44, recommendedAh: 50, minCca: 420, recommendedType: "standard", holdDown: "B0", notes: "Pre-facelift non s/s.", active: true },
  { id: "v6", slug: "vauxhall-corsa-2019-2023-1.2-startstop", make: "Vauxhall", model: "Corsa", variant: "1.2 Turbo s/s", yearFrom: 2019, yearTo: 2023, engineCc: 1199, fuel: "petrol", startStop: true, batteryPolarity: "0", batteryLengthMaxMm: 242, batteryWidthMaxMm: 175, batteryHeightMaxMm: 190, minAh: 60, recommendedAh: 65, minCca: 600, recommendedType: "efb", holdDown: "B13", notes: "F 5th gen with auto start/stop.", active: true },
  { id: "v7", slug: "bmw-320d-2015-2019-f30", make: "BMW", model: "3 Series", variant: "320d (F30)", yearFrom: 2015, yearTo: 2019, engineCc: 1995, fuel: "diesel", startStop: true, batteryPolarity: "0", batteryLengthMaxMm: 315, batteryWidthMaxMm: 175, batteryHeightMaxMm: 190, minAh: 80, recommendedAh: 90, minCca: 800, recommendedType: "agm", holdDown: "B13", notes: "High spec AGM preferred.", active: true },
  { id: "v8", slug: "ford-focus-2015-2018-1.5-tdci", make: "Ford", model: "Focus", variant: "1.5 TDCi", yearFrom: 2015, yearTo: 2018, engineCc: 1499, fuel: "diesel", startStop: true, batteryPolarity: "0", batteryLengthMaxMm: 278, batteryWidthMaxMm: 175, batteryHeightMaxMm: 190, minAh: 68, recommendedAh: 72, minCca: 680, recommendedType: "efb", holdDown: "B13", notes: "MK3.5 Focus.", active: true },
  { id: "v9", slug: "nissan-qashqai-2014-2021-1.5-dci", make: "Nissan", model: "Qashqai", variant: "1.5 dCi", yearFrom: 2014, yearTo: 2021, engineCc: 1461, fuel: "diesel", startStop: true, batteryPolarity: "0", batteryLengthMaxMm: 278, batteryWidthMaxMm: 175, batteryHeightMaxMm: 190, minAh: 65, recommendedAh: 70, minCca: 640, recommendedType: "efb", holdDown: "B13", notes: "J11 Qashqai.", active: true },
  { id: "v10", slug: "toyota-yaris-2014-2020-1.33", make: "Toyota", model: "Yaris", variant: "1.33 VVT-i", yearFrom: 2014, yearTo: 2020, engineCc: 1329, fuel: "petrol", startStop: false, batteryPolarity: "0", batteryLengthMaxMm: 207, batteryWidthMaxMm: 175, batteryHeightMaxMm: 190, minAh: 40, recommendedAh: 45, minCca: 400, recommendedType: "standard", holdDown: "B0", notes: "Reliable non start/stop.", active: true },
  { id: "v11", slug: "audi-a3-2013-2020-2.0-tdi", make: "Audi", model: "A3", variant: "2.0 TDI", yearFrom: 2013, yearTo: 2020, engineCc: 1968, fuel: "diesel", startStop: true, batteryPolarity: "0", batteryLengthMaxMm: 278, batteryWidthMaxMm: 175, batteryHeightMaxMm: 190, minAh: 68, recommendedAh: 72, minCca: 680, recommendedType: "agm", holdDown: "B13", notes: "8V A3 often AGM.", active: true },
  { id: "v12", slug: "mercedes-c220-2015-2021-w205", make: "Mercedes-Benz", model: "C-Class", variant: "C220d (W205)", yearFrom: 2015, yearTo: 2021, engineCc: 2143, fuel: "diesel", startStop: true, batteryPolarity: "0", batteryLengthMaxMm: 315, batteryWidthMaxMm: 175, batteryHeightMaxMm: 190, minAh: 80, recommendedAh: 95, minCca: 850, recommendedType: "agm", holdDown: "B13", notes: "Premium AGM.", active: true },
  // Renault Trafic van example (user example MT19 XHU)
  { id: "v13", slug: "renault-trafic-2014-2022-1.6-dci", make: "Renault", model: "Trafic", variant: "1.6 dCi 120 Panel Van", yearFrom: 2014, yearTo: 2022, engineCc: 1598, fuel: "diesel", startStop: false, batteryPolarity: "0", batteryLengthMaxMm: 278, batteryWidthMaxMm: 175, batteryHeightMaxMm: 190, minAh: 70, recommendedAh: 80, minCca: 640, recommendedType: "standard", holdDown: "B13", notes: "Common LCV. Later models or options may have start/stop requiring EFB.", active: true },
];

// Demo reg → vehicle id (or slug)
export const demoRegToVehicleId: Record<string, string> = {
  AB12CDE: "v1",   // Ford Fiesta non s/s
  BX15KLM: "v3",   // VW Golf 1.6 TDI
  DE68FNP: "v6",   // Vauxhall Corsa 2019 s/s
  GV17XYZ: "v9",   // Nissan Qashqai
  HK19ABC: "v8",   // Ford Focus
  LC65MNO: "v7",   // BMW 320d
  PK68RST: "v11",  // Audi A3
  WR20UVX: "v12",  // Mercedes C220
  YT14PQR: "v10",  // Toyota Yaris
  AF21BCD: "v2",   // Fiesta s/s (example)
  MX18EFG: "v3",   // Skoda approx to Golf
  BD15HIJ: "v3",   // Transit example -> use Golf for demo (or could add)
  MT19XHU: "v13",  // Renault Trafic (user example)
  MT19XHV: "v13",  // sibling reg example
};

// Demo batteries
export const demoBatteries: DemoBattery[] = [
  { id: "b1", slug: "varta-blue-dynamic-52", brand: "Varta", model: "Blue Dynamic 52Ah", ah: 52, cca: 470, type: "standard", lengthMm: 242, widthMm: 175, heightMm: 190, polarity: "0", weightKg: 12, warrantyMonths: 30, technology: "SMF", groupSize: "065", priceMin: 42, priceMax: 58, active: true },
  { id: "b2", slug: "varta-silver-dynamic-70", brand: "Varta", model: "Silver Dynamic 70Ah", ah: 70, cca: 630, type: "standard", lengthMm: 278, widthMm: 175, heightMm: 190, polarity: "0", weightKg: 15, warrantyMonths: 36, technology: "SMF Enhanced", groupSize: "096", priceMin: 58, priceMax: 72, active: true },
  { id: "b3", slug: "varta-blue-dynamic-efb-65", brand: "Varta", model: "Blue Dynamic EFB 65Ah", ah: 65, cca: 600, type: "efb", lengthMm: 242, widthMm: 175, heightMm: 190, polarity: "0", weightKg: 15, warrantyMonths: 36, technology: "EFB", groupSize: "EFB065", priceMin: 62, priceMax: 78, active: true },
  { id: "b4", slug: "varta-blue-dynamic-efb-70", brand: "Varta", model: "Blue Dynamic EFB 70Ah", ah: 70, cca: 680, type: "efb", lengthMm: 278, widthMm: 175, heightMm: 190, polarity: "0", weightKg: 16, warrantyMonths: 36, technology: "EFB", groupSize: "EFB096", priceMin: 68, priceMax: 85, active: true },
  { id: "b5", slug: "varta-silver-dynamic-agm-70", brand: "Varta", model: "Silver Dynamic AGM 70Ah", ah: 70, cca: 760, type: "agm", lengthMm: 278, widthMm: 175, heightMm: 190, polarity: "0", weightKg: 17, warrantyMonths: 48, technology: "AGM", groupSize: "AGM096", priceMin: 78, priceMax: 95, active: true },
  { id: "b6", slug: "varta-silver-dynamic-agm-80", brand: "Varta", model: "Silver Dynamic AGM 80Ah", ah: 80, cca: 800, type: "agm", lengthMm: 315, widthMm: 175, heightMm: 190, polarity: "0", weightKg: 20, warrantyMonths: 48, technology: "AGM", groupSize: "AGM H7", priceMin: 92, priceMax: 115, active: true },
  { id: "b7", slug: "yuasa-ybx7005", brand: "Yuasa", model: "YBX7005 EFB 65Ah", ah: 65, cca: 620, type: "efb", lengthMm: 242, widthMm: 175, heightMm: 190, polarity: "0", weightKg: 15, warrantyMonths: 48, technology: "EFB", groupSize: "EFB065", priceMin: 65, priceMax: 82, active: true },
  { id: "b8", slug: "yuasa-ybx9005", brand: "Yuasa", model: "YBX9005 AGM 70Ah", ah: 70, cca: 760, type: "agm", lengthMm: 278, widthMm: 175, heightMm: 190, polarity: "0", weightKg: 17, warrantyMonths: 60, technology: "AGM VRLA", groupSize: "AGM096", priceMin: 82, priceMax: 102, active: true },
  { id: "b9", slug: "bosch-s4008", brand: "Bosch", model: "S4 008 70Ah", ah: 70, cca: 630, type: "standard", lengthMm: 278, widthMm: 175, heightMm: 190, polarity: "0", weightKg: 15, warrantyMonths: 24, technology: "PowerFrame", groupSize: "096", priceMin: 52, priceMax: 68, active: true },
  { id: "b10", slug: "exide-efb-efb700", brand: "Exide", model: "EFB 700 70Ah", ah: 70, cca: 680, type: "efb", lengthMm: 278, widthMm: 175, heightMm: 190, polarity: "0", weightKg: 16, warrantyMonths: 36, technology: "EFB", groupSize: "EFB096", priceMin: 60, priceMax: 78, active: true },
  // A couple reverse for demo variety
  { id: "b11", slug: "varta-blue-dynamic-60-r", brand: "Varta", model: "Blue Dynamic 60Ah (Rev)", ah: 60, cca: 540, type: "standard", lengthMm: 242, widthMm: 175, heightMm: 190, polarity: "1", weightKg: 13, warrantyMonths: 30, technology: "SMF", groupSize: "065R", priceMin: 48, priceMax: 62, active: true },
];

// Best match hints (vehicleId -> batteryId)
export const demoBestMatches: Record<string, string[]> = {
  "v2": ["b3"], // Fiesta s/s -> EFB 65
  "v3": ["b7"], // Golf TDI -> Yuasa EFB
  "v7": ["b6"], // BMW -> Varta AGM 80
  "v9": ["b4"], // Qashqai -> EFB 70
  "v11": ["b8"], // Audi -> Yuasa AGM
  "v12": ["b6"], // Mercedes -> AGM 80
  "v13": ["b4"], // Trafic -> EFB 70 (good upgrade even if non s/s)
};

export function getDemoVehicleByReg(reg: string): DemoVehicle | null {
  const normalized = reg.toUpperCase().replace(/[\s-]/g, "").trim();
  const vid = demoRegToVehicleId[normalized];
  if (!vid) return null;
  return demoVehicles.find(v => v.id === vid) ?? null;
}

export function getDemoVehicleBySlug(slug: string): DemoVehicle | null {
  return demoVehicles.find(v => v.slug === slug) ?? null;
}

export function demoLookupVehicleByReg(reg: string): {
  vehicle: DemoVehicle | null;
  batteries: Array<{ battery: DemoBattery | any; fit: FitResult; explicitRecommendation?: { isBestMatch: boolean; fitNotes: string | null } }>;
  matchedBy: "reg" | "none";
  usingDemo: true;
} {
  const normalized = reg.toUpperCase().replace(/[\s-]/g, "").trim();
  const vehicle = getDemoVehicleByReg(normalized);

  if (!vehicle) {
    return {
      vehicle: null,
      batteries: [],
      matchedBy: "none",
      usingDemo: true,
    };
  }

  // Compute fits using the same logic as production
  const withFit = demoBatteries.map((b) => {
    // Cast to the expected shape for the pure function (it only reads specific fields)
    const fit = doesBatteryFit(vehicle as any, b as any);
    const isBest = (demoBestMatches[vehicle.id] || []).includes(b.id);
    return {
      battery: b,
      fit,
      explicitRecommendation: isBest ? { isBestMatch: true, fitNotes: "Recommended in demo data" } : undefined,
    };
  });

  const sorted = sortBatteriesByFit(withFit)
    .filter((x) => x.fit.fits)
    .slice(0, 48);

  return {
    vehicle,
    batteries: sorted as any,
    matchedBy: "reg",
    usingDemo: true,
  };
}

export function demoListPopularVehicles(limit = 12) {
  return demoVehicles.slice(0, limit);
}

export function demoListAllBatteries() {
  return [...demoBatteries].sort((a, b) => a.ah - b.ah);
}
