import { lookupVehicleByReg } from "@/lib/vehicle-lookup";
import VehicleCard from "@/components/VehicleCard";
import RegForm from "@/components/RegForm";
import AdPlaceholder from "@/components/AdPlaceholder";
import ResultsFilters from "@/components/ResultsFilters";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const reg = (sp.reg || "").trim();

  const result = reg ? await lookupVehicleByReg(reg) : null;
  const usingDemo = result?.usingDemoData;

  return (
    <div className="py-8">
      <div className="mb-6">
        <Link href="/" className="text-sm text-emerald-600 hover:underline">← New search</Link>
      </div>

      <h1 className="text-3xl font-black tracking-tight">Battery matches</h1>
      <p className="mt-1 text-ink/70">
        {reg ? `For registration ${reg.toUpperCase()}` : "Enter a registration to begin"}
      </p>

      {usingDemo && (
        <div className="mt-3 max-w-2xl rounded-xl border border-amber-400/40 bg-amber-50 px-4 py-2 text-xs text-amber-800">
          Showing <strong>demo data</strong>. Real database not connected. The matching logic, filters, and price comparison links all work exactly the same as production.
        </div>
      )}

      <div className="mt-4 max-w-md">
        <RegForm initialReg={reg} />
      </div>

      {!result || result.error || !result.vehicle ? (
        <div className="mt-8 card max-w-2xl border-amber-400/40 bg-amber-50">
          <p className="font-semibold">No exact match found for this registration.</p>
          {result?.error && <p className="mt-1 text-sm text-ink/80">{result.error}</p>}
          <p className="mt-3 text-sm">
            Demo registrations that work right now: <strong>AB12CDE</strong>, <strong>BX15KLM</strong>, <strong>DE68FNP</strong>, <strong>GV17XYZ</strong>, <strong>LC65MNO</strong>.
            <br />You can also browse the full catalogue or go back and try another plate.
          </p>
          <div className="mt-4 flex gap-3">
            <Link href="/batteries" className="btn-secondary">Browse all batteries</Link>
            <Link href="/" className="btn-secondary">Try another reg</Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-6">
            <VehicleCard vehicle={result.vehicle} />
          </div>

          <AdPlaceholder label="Adsterra — top / leaderboard placement" />

          <div className="mt-6">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-semibold">Recommended batteries that fit</h2>
              <span className="text-sm text-ink/50">{result.batteries.length} matching options</span>
            </div>

            {result.batteries.length === 0 ? (
              <p className="mt-4 text-sm">No batteries in our current catalogue exactly match the requirements for this vehicle.</p>
            ) : (
              <ResultsFilters items={result.batteries} />
            )}
          </div>

          <div className="disclaimer mt-8">
            This is a guide based on publicly available specifications and our seeded database. Always verify the battery’s dimensions, terminal layout, technology (AGM/EFB/standard), Ah and CCA against your vehicle’s requirements and the retailer’s fitment tool. We accept no liability for incorrect fitment.
          </div>

          <AdPlaceholder label="Adsterra — in-content or results sidebar" />
        </>
      )}

      <div className="mt-10 text-center">
        <Link href="/how-it-works" className="text-sm underline">Learn what we consider when matching batteries</Link>
      </div>
    </div>
  );
}
