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
}

export function normalizeReg(input: string): string {
  return input.toUpperCase().replace(/[\s-]/g, "").trim();
}

export async function lookupVehicleByReg(reg: string): Promise<LookupResult> {
  const normalized = normalizeReg(reg);
  if (!normalized || normalized.length < 4) {
    return { vehicle: null, batteries: [], matchedBy: "none", error: "Please enter a valid UK registration" };
  }

  // --- Fast path: no database configured at all -> instant demo mode ---
  if (!DATABASE_URL) {
    const demo = demoLookupVehicleByReg(normalized);
    if (!demo.vehicle) {
      return {
        vehicle: null,
        batteries: [],
        matchedBy: "none",
        error: `No exact match for ${normalized} in demo data. Try one of the demo registrations shown on the homepage (e.g. AB12CDE, BX15KLM, DE68FNP).`,
        usingDemoData: true,
      };
    }
    return { ...demo, usingDemoData: true };
  }

  try {
    // 1. Try exact reg lookup
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

    if (!vehicle) {
      // No vehicle found in DB for this reg. Fall back to demo for a nice experience.
      const demo = demoLookupVehicleByReg(normalized);
      if (demo.vehicle) {
        return { ...demo, usingDemoData: true };
      }
      return {
        vehicle: null,
        batteries: [],
        matchedBy: "none",
        error: `No exact match for ${normalized}. Try one of the demo registrations (AB12CDE, BX15KLM, DE68FNP, etc).`,
      };
    }

    // Load batteries + explicit recs (real DB path)
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
    };
  } catch (err) {
    console.warn("Database unavailable, falling back to demo data for reg lookup.", err);
    const demo = demoLookupVehicleByReg(normalized);
    if (demo.vehicle) {
      return { ...demo, usingDemoData: true };
    }
    return {
      vehicle: null,
      batteries: [],
      matchedBy: "none",
      error: "Using demo data — full database not available. Register a free Neon DB and run npm run db:setup + db:seed for live data.",
      usingDemoData: true,
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
