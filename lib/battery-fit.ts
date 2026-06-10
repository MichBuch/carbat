import type { Battery, Vehicle } from "./types";
import type { DemoBattery, DemoVehicle } from "@/data/demo-data";

export type BatteryType = "standard" | "efb" | "agm";
export type Polarity = "0" | "1";

export interface FitResult {
  fits: boolean;
  score: number; // 0-100
  reasons: string[];
  upgrade: boolean; // higher spec than minimum
  warnings: string[];
}

export interface VehicleRequirement {
  polarity: Polarity;
  lengthMax?: number | null;
  widthMax?: number | null;
  heightMax?: number | null;
  minAh?: number | null;
  minCca?: number | null;
  preferredType?: BatteryType | null;
  startStop: boolean;
}

export function getVehicleRequirements(v: Vehicle | DemoVehicle): VehicleRequirement {
  return {
    polarity: v.batteryPolarity as Polarity,
    lengthMax: v.batteryLengthMaxMm,
    widthMax: v.batteryWidthMaxMm,
    heightMax: v.batteryHeightMaxMm,
    minAh: v.minAh,
    minCca: v.minCca,
    preferredType: v.recommendedType as BatteryType | null,
    startStop: v.startStop,
  };
}

export function doesBatteryFit(vehicle: Vehicle | DemoVehicle, battery: Battery | DemoBattery): FitResult {
  const req = getVehicleRequirements(vehicle);
  const reasons: string[] = [];
  const warnings: string[] = [];
  let score = 70; // base
  let fits = true;

  // Polarity - hard requirement
  if (battery.polarity !== req.polarity) {
    fits = false;
    warnings.push(`Polarity mismatch: battery is layout ${battery.polarity} (vehicle needs ${req.polarity})`);
  } else {
    reasons.push("Correct terminal polarity");
    score += 8;
  }

  // Dimensions (if vehicle specifies tray max)
  if (req.lengthMax && battery.lengthMm > req.lengthMax) {
    fits = false;
    warnings.push(`Too long: ${battery.lengthMm}mm > max ${req.lengthMax}mm`);
  } else if (req.lengthMax) {
    score += 5;
  }
  if (req.widthMax && battery.widthMm > req.widthMax) {
    fits = false;
    warnings.push(`Too wide: ${battery.widthMm}mm > max ${req.widthMax}mm`);
  } else if (req.widthMax) {
    score += 4;
  }
  if (req.heightMax && battery.heightMm > req.heightMax) {
    fits = false;
    warnings.push(`Too tall: ${battery.heightMm}mm > max ${req.heightMax}mm`);
  } else if (req.heightMax) {
    score += 4;
  }
  if (fits && req.lengthMax && req.widthMax && req.heightMax) {
    reasons.push("Fits battery housing dimensions");
  }

  // Electrical minimums
  const ahOk = !req.minAh || battery.ah >= req.minAh;
  if (!ahOk) {
    fits = false;
    warnings.push(`Capacity too low: ${battery.ah}Ah (min ${req.minAh}Ah)`);
  } else {
    reasons.push(`${battery.ah}Ah meets or exceeds requirement`);
    if (req.minAh && battery.ah > req.minAh + 5) {
      score += 6;
      reasons.push("Extra capacity — good for high electrical load");
    }
  }

  const ccaOk = !req.minCca || battery.cca >= req.minCca;
  if (!ccaOk) {
    fits = false;
    warnings.push(`Cranking power too low: ${battery.cca}CCA (min ${req.minCca}CCA)`);
  } else {
    reasons.push(`${battery.cca}CCA provides strong starting power`);
    if (req.minCca && battery.cca > req.minCca + 50) {
      score += 5;
    }
  }

  // Technology / start-stop match
  if (req.startStop) {
    if (battery.type === "agm") {
      score += 12;
      reasons.push("AGM technology — ideal for start/stop + regenerative charging");
    } else if (battery.type === "efb") {
      score += 8;
      reasons.push("EFB technology — suitable for start/stop systems");
    } else {
      // Standard on start/stop car is risky
      score -= 15;
      warnings.push("Standard battery on a start/stop vehicle is not recommended — consider EFB or AGM");
    }
  } else {
    // Non start/stop: AGM/EFB still fine (often better), standard perfect match
    if (battery.type === "standard") {
      score += 5;
    } else {
      score += 2; // premium is still good
    }
  }

  // Preferred type bonus
  if (req.preferredType && battery.type === req.preferredType) {
    score += 6;
    reasons.push(`Matches recommended ${req.preferredType.toUpperCase()} type`);
  }

  // Clamp score
  score = Math.max(10, Math.min(100, Math.round(score)));

  const upgrade =
    !!req.minAh && battery.ah >= req.minAh + 8 ||
    !!req.minCca && battery.cca >= req.minCca + 80 ||
    (req.preferredType === "standard" && (battery.type === "efb" || battery.type === "agm"));

  return { fits, score, reasons, warnings, upgrade };
}

export function sortBatteriesByFit(batteriesWithFit: Array<{ battery: Battery | DemoBattery; fit: FitResult }>) {
  return [...batteriesWithFit].sort((a, b) => {
    // Best matches first, then by score desc, then by Ah asc (value), then CCA
    if (a.fit.fits !== b.fit.fits) return a.fit.fits ? -1 : 1;
    if (b.fit.score !== a.fit.score) return b.fit.score - a.fit.score;
    if (a.battery.ah !== b.battery.ah) return a.battery.ah - b.battery.ah;
    return b.battery.cca - a.battery.cca;
  });
}
