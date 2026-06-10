import { listAllBatteries } from "@/lib/vehicle-lookup";
import { getPriceComparisonLinks } from "@/lib/affiliates";
import AdPlaceholder from "@/components/AdPlaceholder";
import Link from "next/link";
import type { Battery } from "@/lib/types";
import { DATABASE_URL } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function BatteriesPage() {
  const all = (await listAllBatteries()) as Battery[];
  const usingDemo = !DATABASE_URL;

  return (
    <div className="py-8">
      <h1 className="text-3xl font-black tracking-tight">All batteries in our guide</h1>
      <p className="mt-1 max-w-prose text-ink/70">
        Our current catalogue of common UK batteries. Use the reg finder for personalised matches. Always verify fitment.
      </p>

      {usingDemo && (
        <div className="mt-2 max-w-prose rounded-lg border border-amber-400/40 bg-amber-50 px-3 py-1.5 text-xs text-amber-800">
          Demo catalogue (no live database). All price comparison links and specs are real examples.
        </div>
      )}

      <AdPlaceholder label="Adsterra — above or below battery catalogue" />

      {all.length === 0 ? (
        <div className="mt-8 card">
          No batteries loaded yet. Run <code>npm run db:seed</code> locally or via your Neon console.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[880px] border-collapse text-sm">
            <thead>
              <tr className="border-b text-left text-ink/60">
                <th className="py-2 pr-3 font-medium">Brand / Model</th>
                <th className="py-2 px-3 font-medium">Ah</th>
                <th className="py-2 px-3 font-medium">CCA</th>
                <th className="py-2 px-3 font-medium">Type</th>
                <th className="py-2 px-3 font-medium">Size (mm)</th>
                <th className="py-2 px-3 font-medium">Polarity</th>
                <th className="py-2 px-3 font-medium">Warranty</th>
                <th className="py-2 pl-3 font-medium">Compare prices</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {all.map((b) => {
                const links = getPriceComparisonLinks(b.brand, b.model, b.ah).slice(0, 2);
                return (
                  <tr key={b.id} className="hover:bg-white/60">
                    <td className="py-2.5 pr-3 font-medium">{b.brand} {b.model}</td>
                    <td className="py-2.5 px-3 tabular-nums font-semibold">{b.ah}</td>
                    <td className="py-2.5 px-3 tabular-nums">{b.cca}</td>
                    <td className="py-2.5 px-3"><span className="pill bg-ink/80 text-white text-[10px]">{b.type}</span></td>
                    <td className="py-2.5 px-3 tabular-nums text-ink/70">{b.lengthMm}×{b.widthMm}×{b.heightMm}</td>
                    <td className="py-2.5 px-3">{b.polarity}</td>
                    <td className="py-2.5 px-3 text-ink/70">{b.warrantyMonths}mo</td>
                    <td className="py-2.5 pl-3">
                      <div className="flex flex-wrap gap-1">
                        {links.map((l, i) => (
                          <a key={i} href={l.url} target="_blank" rel="noopener" className="text-xs rounded border px-2 py-0.5 hover:bg-emerald-50">{l.retailer}</a>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="disclaimer mt-8">
        Catalogue is illustrative. Real-world fitment, stock and pricing change constantly. This is not an offer to sell.
      </div>

      <div className="mt-6">
        <Link href="/" className="btn-primary inline-flex">Find battery for my reg →</Link>
      </div>
    </div>
  );
}
