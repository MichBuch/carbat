import Link from "next/link";

export default function HowItWorks() {
  return (
    <div className="prose prose-neutral max-w-3xl py-8 text-ink">
      <h1>How CarBat works</h1>

      <p>We match your vehicle to batteries using the key real-world constraints that matter for fitment and reliability in the UK.</p>

      <h2>What we consider</h2>
      <ul>
        <li><strong>Start / Stop (ISS)</strong>: Vehicles with auto engine stop/start require EFB or AGM batteries. Standard flooded batteries will fail prematurely and may trigger warning lights.</li>
        <li><strong>Ah (Ampere-hour capacity)</strong>: Must meet or exceed the original equipment minimum. Extra capacity is often beneficial for cars with lots of electrical accessories.</li>
        <li><strong>CCA (Cold Cranking Amps)</strong>: Critical for reliable starting, especially in winter. Diesel engines and larger cars need higher figures.</li>
        <li><strong>Physical dimensions</strong>: Length × Width × Height. The battery must physically fit the tray and under the hold-down clamp. Even 5-10mm too big and it won’t go in.</li>
        <li><strong>Polarity / Terminal layout</strong>: UK convention used here: 0 = positive terminal on the right when the terminals face you. 1 = positive on the left. Wrong polarity = cables won’t reach or will be reversed.</li>
        <li><strong>Hold-down / Group size</strong>: B13, B0, DIN sizes etc. affect whether the clamp and vent hose line up.</li>
        <li><strong>Technology notes</strong>: AGM for high-demand start/stop + start-stop with energy recuperation. EFB for most mild start/stop. Standard for older non-ISS cars.</li>
      </ul>

      <h2>Data &amp; limitations</h2>
      <p>Our vehicle profiles and battery catalogue are based on common UK market data. Real cars can have different batteries depending on options (stop/start delete packs, cold climate packs, large audio, etc.).</p>

      <p>When you enter a registration we first check our cache, then (if configured) use a low-cost live lookup provider (e.g. Apify screenscraper of the public DVLA service or licensed DVLA partners such as UK Vehicle Data). Battery tray dimensions, start/stop status and electrical minima are often derived via model heuristics because basic reg data does not include the exact battery specification. Providers that expose dedicated battery data (e.g. UKVD) will give even richer results.</p>

      <p>Always treat the output as a shortlist and verify on the retailer site + your vehicle handbook before buying.</p>

      <div className="disclaimer not-prose mt-8">
        CarBat is a guide. You are solely responsible for ensuring any battery you purchase is compatible with your vehicle.
      </div>

      <p className="mt-8"><Link href="/">← Back to battery finder</Link></p>
    </div>
  );
}
