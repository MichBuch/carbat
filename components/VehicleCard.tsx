import type { Vehicle } from "@/lib/types";
import type { DemoVehicle } from "@/data/demo-data";
import type { LiveVehicle } from "@/lib/live-lookup";

type VehicleLike = Vehicle | DemoVehicle;

export default function VehicleCard({
  vehicle,
  live,
  dataSource,
}: {
  vehicle: VehicleLike;
  live?: LiveVehicle | null;
  dataSource?: string;
}) {
  const years = vehicle.yearFrom === vehicle.yearTo
    ? vehicle.yearFrom
    : `${vehicle.yearFrom}–${vehicle.yearTo}`;

  const extra = live || (vehicle as any)._live;

  return (
    <div className="card border-cyan-500/30 bg-slate-800/60">
      <div className="flex flex-wrap items-start gap-x-8 gap-y-1">
        <div>
          <div className="text-xs uppercase tracking-[2px] text-cyan-400 font-semibold">
            Vehicle identified {dataSource === "live" ? "• live lookup" : dataSource === "db" ? "• from catalogue" : ""}
          </div>
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
            <span className="pill bg-slate-700 text-cyan-200 border border-cyan-700/40">{vehicle.recommendedAh}Ah rec.</span>
          )}
        </div>
      </div>

      {(vehicle.minAh || vehicle.minCca || vehicle.batteryLengthMaxMm) && (
        <div className="mt-3 border-t border-cyan-700/30 pt-3 text-sm text-cyan-200/70">
          Minimum requirements: {vehicle.minAh ? `${vehicle.minAh}Ah` : "—"} {vehicle.minCca ? `• ${vehicle.minCca}CCA` : ""}
          {vehicle.batteryLengthMaxMm && ` • max ${vehicle.batteryLengthMaxMm}×${vehicle.batteryWidthMaxMm}×${vehicle.batteryHeightMaxMm}mm`}
        </div>
      )}

      {/* Rich extra details from live reg lookup (make the "more data the better" visible) */}
      {extra && (
        <div className="mt-3 border-t border-cyan-700/30 pt-3 text-xs text-cyan-200/60 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
          {extra.bodyType && <div>Body: {extra.bodyType}</div>}
          {extra.colour && <div>Colour: {extra.colour}</div>}
          {extra.co2Emissions != null && <div>CO₂: {extra.co2Emissions} g/km</div>}
          {extra.motStatus && <div>MOT: {extra.motStatus}</div>}
          {extra.taxStatus && <div>Tax: {extra.taxStatus}</div>}
          {extra.registration && <div>Reg: {extra.registration}</div>}
        </div>
      )}

      {dataSource === "live" && (
        <div className="mt-2 text-[10px] text-cyan-400/80">
          Live data via external lookup. Battery tray specs are best-effort — always verify in your handbook or with a retailer fitment tool.
        </div>
      )}
    </div>
  );
}
