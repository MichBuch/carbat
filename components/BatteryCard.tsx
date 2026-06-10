"use client";

import type { Battery } from "@/lib/types";
import type { FitResult } from "@/lib/battery-fit";
import type { DemoBattery } from "@/data/demo-data";
import { getPriceComparisonLinks } from "@/lib/affiliates";
import { ExternalLink } from "lucide-react";

interface Props {
  battery: Battery | DemoBattery;
  fit: FitResult;
  explicit?: { isBestMatch: boolean; fitNotes: string | null };
}

export default function BatteryCard({ battery, fit, explicit }: Props) {
  const priceLinks = getPriceComparisonLinks(battery.brand, battery.model, battery.ah);

  return (
    <div className="card group flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{battery.brand}</span>
            <span className="text-ink/60">{battery.model}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="text-3xl font-black tabular-nums tracking-tighter">
              {battery.ah}
              <span className="text-base align-super font-bold text-ink/60">Ah</span>
            </span>
            <span className="text-xl font-semibold text-ink/80">{battery.cca} CCA</span>
          </div>
        </div>

        <div className="text-right text-xs">
          <div className={`pill ${fit.upgrade ? "bg-sky-600 text-white" : "bg-emerald-600 text-white"}`}>
            {battery.type.toUpperCase()}
          </div>
          {explicit?.isBestMatch && (
            <div className="mt-1 pill badge-fit">Best match</div>
          )}
        </div>
      </div>

      {/* Specs row */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
        <div className="spec">
          {battery.lengthMm}×{battery.widthMm}×{battery.heightMm} mm
        </div>
        <div className="spec">Polarity {battery.polarity} (+{battery.polarity === "0" ? " right" : " left"})</div>
        <div className="spec">{battery.warrantyMonths} mo warranty</div>
      </div>

      {/* Fit reasons */}
      <div className="mt-3">
        <div className="text-xs font-semibold uppercase tracking-widest text-emerald-700">Why it fits</div>
        <ul className="mt-1 space-y-0.5 text-sm">
          {fit.reasons.slice(0, 4).map((r, i) => (
            <li key={i} className="flex gap-1.5 text-ink/80">
              <span className="text-emerald-600">✓</span> {r}
            </li>
          ))}
        </ul>
      </div>

      {fit.warnings.length > 0 && (
        <div className="mt-2 rounded-xl border border-amber-400/40 bg-amber-50 p-2.5 text-xs text-amber-900">
          {fit.warnings[0]}
        </div>
      )}

      {/* Price comparison / jump off */}
      <div className="mt-4 border-t border-ink/10 pt-3">
        <div className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-ink/60">
          Price comparison (guide)
          <span className="font-normal normal-case text-[10px]">opens retailer sites</span>
        </div>
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {priceLinks.slice(0, 4).map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 rounded-lg border border-ink/10 bg-white px-3 py-1.5 text-sm hover:border-emerald-600 hover:bg-emerald-50"
            >
              <span>{link.retailer}</span>
              <ExternalLink size={14} className="text-ink/40 group-hover:text-emerald-600" />
            </a>
          ))}
        </div>
        <p className="mt-1.5 text-[10px] text-ink/50">
          Prices and stock vary. Verify exact match on retailer site. We may earn from qualifying purchases.
        </p>
      </div>

      <div className="mt-auto pt-3 text-[10px] text-ink/50">
        {battery.groupSize && <span>Group: {battery.groupSize} • </span>}
        {battery.technology}
      </div>
    </div>
  );
}
