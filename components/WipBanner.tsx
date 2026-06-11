"use client";

import { AlertTriangle } from "lucide-react";

export default function WipBanner({ variant = "default", className = "" }: { variant?: "default" | "compact"; className?: string }) {
  if (variant === "compact") {
    return (
      <div className="mx-auto max-w-3xl rounded-lg border border-amber-400/60 bg-amber-50 px-3 py-1.5 text-center text-[11px] text-amber-800">
        <strong>Work in progress</strong> — live reg lookup &amp; battery data are experimental. Always verify fitment yourself.
      </div>
    );
  }

  return (
    <div className={`mx-auto mb-6 max-w-3xl rounded-2xl border border-amber-400/70 bg-amber-50 px-4 py-3 text-sm text-amber-900 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
        <div>
          <div className="font-semibold">Work in progress (WIP) — early beta</div>
          <p className="mt-1 text-amber-800">
            CarBat is a convenient jump-off guide to help you find the right battery fast. 
            Vehicle data (especially from live reg lookups) and recommended fits are best-effort and can be incomplete. 
            <strong> Always cross-check dimensions, start/stop requirements, polarity and specs in your vehicle handbook and on the retailer’s site before buying.</strong>
          </p>
          <p className="mt-1 text-[11px] text-amber-700">
            This site earns from advertising (Adsterra) and affiliate links. Using it helps keep the tool free.
          </p>
        </div>
      </div>
    </div>
  );
}
