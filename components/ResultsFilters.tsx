"use client";

import { useMemo, useState } from "react";
import BatteryCard from "./BatteryCard";
import type { Battery } from "@/lib/types";
import type { FitResult } from "@/lib/battery-fit";
import type { DemoBattery } from "@/data/demo-data";

interface Item {
  battery: Battery | DemoBattery;
  fit: FitResult;
  explicitRecommendation?: { isBestMatch: boolean; fitNotes: string | null };
}

export default function ResultsFilters({ items }: { items: Item[] }) {
  const [type, setType] = useState<"all" | "standard" | "efb" | "agm">("all");
  const [minAh, setMinAh] = useState(0);
  const [sort, setSort] = useState<"best" | "ah" | "cca" | "price">("best");

  const filtered = useMemo(() => {
    let res = items.filter((i) => {
      if (type !== "all" && i.battery.type !== type) return false;
      if (minAh && i.battery.ah < minAh) return false;
      return true;
    });

    if (sort === "best") {
      res = [...res].sort((a, b) => b.fit.score - a.fit.score || a.battery.ah - b.battery.ah);
    } else if (sort === "ah") {
      res = [...res].sort((a, b) => a.battery.ah - b.battery.ah);
    } else if (sort === "cca") {
      res = [...res].sort((a, b) => b.battery.cca - a.battery.cca);
    } else if (sort === "price") {
      const getPrice = (b: any) => (b.priceMin ?? b.priceMax ?? 9999);
      res = [...res].sort((a, b) => getPrice(a.battery) - getPrice(b.battery));
    }
    return res;
  }, [items, type, minAh, sort]);

  return (
    <>
      <div className="mt-4 flex flex-wrap items-end gap-3 rounded-2xl border border-ink/10 bg-white/60 p-3 text-sm">
        <label className="flex flex-col">
          <span className="text-xs text-ink/60">Type</span>
          <select value={type} onChange={(e) => setType(e.target.value as any)} className="rounded-lg border px-2 py-1">
            <option value="all">Any</option>
            <option value="standard">Standard</option>
            <option value="efb">EFB (start/stop)</option>
            <option value="agm">AGM (premium s/s)</option>
          </select>
        </label>

        <label className="flex flex-col">
          <span className="text-xs text-ink/60">Min Ah</span>
          <input type="number" value={minAh || ""} onChange={(e) => setMinAh(Number(e.target.value) || 0)} className="w-20 rounded-lg border px-2 py-1" placeholder="0" />
        </label>

        <label className="flex flex-col">
          <span className="text-xs text-ink/60">Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="rounded-lg border px-2 py-1">
            <option value="best">Best fit first</option>
            <option value="ah">Lowest capacity first</option>
            <option value="cca">Highest CCA first</option>
            <option value="price">Lowest price first</option>
          </select>
        </label>

        <div className="ml-auto text-xs text-ink/50 self-end pb-1">{filtered.length} shown</div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {filtered.length === 0 && <p className="text-sm text-ink/60">No batteries match the current filters.</p>}
        {filtered.map((item, idx) => (
          <BatteryCard
            key={idx}
            battery={item.battery}
            fit={item.fit}
            explicit={item.explicitRecommendation}
          />
        ))}
      </div>
    </>
  );
}
