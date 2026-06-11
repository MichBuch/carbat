"use client";

import Script from "next/script";
import { useEffect } from "react";

/**
 * Adsterra ad component.
 *
 * Usage:
 * 1. Go to your Adsterra dashboard and create a new ad zone (banner, native, etc.).
 * 2. Copy the exact code snippet they give you (it usually contains atOptions + a <script src="...invoke.js"> or similar).
 * 3. Paste the relevant parts into the props below, or replace the whole <div> content with their raw HTML.
 *
 * For Next.js safety we load scripts with next/script (afterInteractive or lazyOnload).
 *
 * Props:
 * - zoneId: the container id Adsterra expects (e.g. "container-123456")
 * - scriptSrc: the invoke.js or similar URL they provide
 * - atOptions: the JS object they give you (key, format, height, width, params)
 * - rawHtml: full raw ad code block if you prefer to paste the entire thing
 * - label: for placeholder / debugging
 */
interface AdsterraAdProps {
  zoneId?: string;
  scriptSrc?: string;
  atOptions?: Record<string, any>;
  rawHtml?: string;
  label?: string;
  className?: string;
  minHeight?: number;
}

export default function AdsterraAd({
  zoneId,
  scriptSrc,
  atOptions,
  rawHtml,
  label = "Advertisement",
  className = "",
  minHeight = 90,
}: AdsterraAdProps) {
  // If you have full raw HTML from Adsterra, just render it (client only)
  if (rawHtml) {
    return (
      <div
        className={`my-4 rounded-xl border border-cyan-700/30 bg-slate-800/80 p-1 ${className}`}
        style={{ minHeight }}
        dangerouslySetInnerHTML={{ __html: rawHtml }}
      />
    );
  }

  // Programmatic / script-based Adsterra placement
  useEffect(() => {
    if (atOptions && typeof window !== "undefined") {
      // Many Adsterra codes expect a global atOptions
      (window as any).atOptions = atOptions;
    }
  }, [atOptions]);

  if (!zoneId && !scriptSrc && !atOptions) {
    // Dev / placeholder mode
    return (
      <div
        className={`my-4 flex min-h-[${minHeight}px] items-center justify-center rounded-xl border border-dashed border-cyan-700/40 bg-slate-800/60 p-4 text-center text-xs text-cyan-300/60 ${className}`}
      >
        <div>
          <div className="font-medium">{label}</div>
          <div className="mt-1 text-[10px]">
            Adsterra zone — replace with your real code in AdsterraAd or the page.
            <br />
            Create zones at <span className="underline">adsterra.com</span> → get script + zone id.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`my-4 overflow-hidden rounded-xl border border-ink/10 bg-white ${className}`} style={{ minHeight }}>
      {label && (
        <div className="border-b border-ink/10 px-3 py-1 text-[10px] uppercase tracking-widest text-ink/40">
          {label}
        </div>
      )}

      {/* Container that Adsterra script will populate */}
      {zoneId && <div id={zoneId} className="min-h-[80px] w-full" />}

      {/* Load the Adsterra invoke script safely */}
      {scriptSrc && (
        <Script
          src={scriptSrc}
          strategy="afterInteractive"
          onLoad={() => {
            // Some Adsterra codes rely on document.write or immediate execution
            // afterInteractive is usually the safest
          }}
        />
      )}

      {/* If they gave you an atOptions + separate script, we set the global above */}
      {atOptions && scriptSrc && (
        <Script
          id={`adsterra-${zoneId || "inline"}`}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && !window.atOptions) {
                window.atOptions = ${JSON.stringify(atOptions)};
              }
            `,
          }}
        />
      )}

      {/* Fallback note for when code is not yet configured */}
      {!scriptSrc && !rawHtml && zoneId && (
        <div className="p-3 text-center text-[11px] text-ink/40">
          Waiting for Adsterra zone <code>{zoneId}</code> code...
        </div>
      )}
    </div>
  );
}

// Quick activation: see the big "Activating real Adsterra ads" section in README.md.
// Paste your zone codes into the AdsterraAd calls on the pages or use the rawHtml prop.
