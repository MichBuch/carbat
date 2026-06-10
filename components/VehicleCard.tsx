import type { Vehicle } from "@/lib/types";
import type { DemoVehicle } from "@/data/demo-data";

type VehicleLike = Vehicle | DemoVehicle;

export default function VehicleCard({ vehicle }: { vehicle: VehicleLike }) {
  const years = vehicle.yearFrom === vehicle.yearTo
    ? vehicle.yearFrom
    : `${vehicle.yearFrom}–${vehicle.yearTo}`;

  return (
    <div className="card border-emerald-600/20 bg-emerald-50/40">
      <div className="flex flex-wrap items-start gap-x-8 gap-y-1">
        <div>
          <div className="text-xs uppercase tracking-[2px] text-emerald-700 font-semibold">Vehicle identified</div>
          <div className="text-2xl font-black tracking-tight">
            {vehicle.make} {vehicle.model}
          </div>
          <div className="text-ink/70">
            {vehicle.variant} • {years} {vehicle.engineCc ? `• ${vehicle.engineCc}cc` : ""} {vehicle.fuel}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {vehicle.startStop && (
            <span className="pill badge-fit">Start / Stop</span>
          )}
          <span className="pill bg-ink/90 text-white">
            Polarity {vehicle.batteryPolarity} (+{vehicle.batteryPolarity === "0" ? "R" : "L"})
          </span>
          {vehicle.recommendedType && (
            <span className="pill bg-sky-600 text-white">{vehicle.recommendedType.toUpperCase()}</span>
          )}
          {vehicle.recommendedAh && (
            <span className="pill bg-white text-ink border border-ink/20">{vehicle.recommendedAh}Ah rec.</span>
          )}
        </div>
      </div>

      {(vehicle.minAh || vehicle.minCca || vehicle.batteryLengthMaxMm) && (
        <div className="mt-3 border-t border-emerald-900/10 pt-3 text-sm text-ink/70">
          Minimum requirements: {vehicle.minAh ? `${vehicle.minAh}Ah` : "—"} {vehicle.minCca ? `• ${vehicle.minCca}CCA` : ""}
          {vehicle.batteryLengthMaxMm && ` • max ${vehicle.batteryLengthMaxMm}×${vehicle.batteryWidthMaxMm}×${vehicle.batteryHeightMaxMm}mm`}
        </div>
      )}
    </div>
  );
}
