import RegForm from "@/components/RegForm";
import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";
import AdsterraAd from "@/components/AdsterraAd";
import WipBanner from "@/components/WipBanner";
import { listPopularVehicles } from "@/lib/vehicle-lookup";
import { DATABASE_URL } from "@/lib/env";

export default async function Home() {
  const popular = await listPopularVehicles(12);
  const usingDemo = !DATABASE_URL;

  const demoRegs = ["AB12CDE", "BX15KLM", "DE68FNP", "MT19XHU", "GV17XYZ", "LC65MNO"];

  return (
    <>
      {/* Hero */}
      <section className="pt-10 pb-8 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="inline-block rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-bold tracking-[2px] text-emerald-700">
            UK CAR BATTERY FINDER
          </div>
          <h1 className="mt-4 text-5xl font-black tracking-tighter sm:text-6xl">
            Find the <span className="text-cyan-400">right battery</span><br />for your car.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-xl text-ink/70">
            Enter your registration. We check start/stop, engine, polarity, dimensions, Ah and CCA.
          </p>
        </div>

        <div className="mt-8">
          <RegForm />
        </div>

        <div className="mt-3 text-xs text-ink/50">
          Try demo: {demoRegs.map((r, i) => (
            <Link key={i} href={`/results?reg=${r}`} className="mx-1 underline hover:text-emerald-600">{r}</Link>
          ))}
        </div>

        {usingDemo && (
          <div className="mx-auto mt-4 max-w-xl rounded-xl border border-amber-400/40 bg-amber-50 px-4 py-2 text-xs text-amber-800">
            Running in <strong>demo mode</strong> (no database connected). Full reg search + matching works with sample data.
            Set <code>DATABASE_URL</code> in <code>.env.local</code> + run <code>npm run db:setup && npm run db:seed</code> for your own data.
          </div>
        )}

        <WipBanner className="mx-auto mt-6 max-w-3xl" />
      </section>

      {/* Trust / considerations */}
      <section className="grid gap-4 pb-8 sm:grid-cols-3">
        {[
          { title: "Start / Stop", desc: "We prefer EFB or AGM for vehicles with auto stop/start." },
          { title: "Polarity & Size", desc: "Terminal position + exact tray dimensions to ensure it physically fits." },
          { title: "Power & Capacity", desc: "Ah and CCA at least as good as the original specification." },
        ].map((f, idx) => (
          <div key={idx} className="card text-center">
            <div className="font-semibold">{f.title}</div>
            <p className="mt-1 text-sm text-ink/70">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Popular vehicles */}
      {popular.length > 0 && (
        <section className="pb-10">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-semibold tracking-tight">Popular vehicles {usingDemo ? "(demo data)" : ""}</h2>
            <Link href="/batteries" className="text-sm text-cyan-400 hover:underline">Browse all batteries →</Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {popular.slice(0, 8).map((v: any) => (
              <Link
                key={v.id}
                href={`/results?reg=${encodeURIComponent(v.slug)}`}
                className="card hover:-translate-y-px hover:shadow"
              >
                <div className="font-bold">{v.make} {v.model}</div>
                <div className="text-sm text-ink/60">{v.variant} • {v.yearFrom}-{v.yearTo}</div>
                {v.startStop && <span className="mt-1 inline-block pill badge-fit text-[10px]">s/s</span>}
              </Link>
            ))}
          </div>
          <p className="mt-3 text-center text-[11px] text-ink/50">Exact reg match is best. Manual vehicle selection coming soon.</p>
        </section>
      )}

      {/* === ADSTERRA: 728x90 Banner === */}
      <AdsterraAd
        rawHtml={`<script>
  atOptions = {
    'key' : 'e0b160958619964e1c2785d924d48bd4',
    'format' : 'iframe',
    'height' : 90,
    'width' : 728,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/e0b160958619964e1c2785d924d48bd4/invoke.js"></script>`}
        minHeight={100}
      />

      {/* Disclaimer teaser */}
      <div className="disclaimer mt-4">
        <strong>Important:</strong> CarBat is a guide only. Battery fitment depends on exact options, modifications, and market. Always confirm with your handbook and the retailer. You are responsible for the final choice.
      </div>
    </>
  );
}
