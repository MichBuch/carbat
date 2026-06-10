import Link from "next/link";

export default function Disclaimer() {
  return (
    <div className="max-w-3xl py-8 text-sm leading-relaxed text-ink/90">
      <h1 className="text-2xl font-black tracking-tight text-ink">Disclaimer &amp; Legal</h1>

      <div className="disclaimer my-6">
        <strong>CarBat is an informational guide only.</strong> We are not a retailer, mechanic, or vehicle manufacturer. The information provided may be incomplete, out of date, or incorrect for your specific vehicle.
      </div>

      <h2 className="mt-6 font-semibold">Your responsibilities</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Always consult your vehicle owner’s manual and the battery label fitted to the car.</li>
        <li>Verify dimensions, terminal positions, battery type (AGM/EFB/standard), Ah and CCA with the chosen retailer’s fitment checker.</li>
        <li>Professional fitting is strongly recommended — especially on vehicles with start/stop, complex electronics or stop/start sensors.</li>
        <li>Incorrect battery choice can cause: no-start conditions, electrical system damage, voided warranties, or fire risk in extreme cases.</li>
      </ul>

      <h2 className="mt-6 font-semibold">No liability</h2>
      <p>
        To the maximum extent permitted by law, the operators of this site accept no liability for any loss, damage, injury or expense arising from reliance on the information on this website or from the purchase or use of any battery recommended or listed here.
      </p>

      <h2 className="mt-6 font-semibold">Affiliate &amp; advertising disclosure</h2>
      <p>
        This site is monetised through advertising (Adsterra and similar networks) and affiliate/referral links to UK battery retailers. When you click retailer links and make a purchase we may receive a commission at no extra cost to you. This does not influence our matching logic.
      </p>

      <h2 className="mt-6 font-semibold">Data</h2>
      <p>
        Vehicle and battery data is compiled from publicly available sources and is provided “as is”. No guarantee is made of completeness or accuracy. Registrations used for demo purposes are fictional.
      </p>

      <p className="mt-8 text-xs text-ink/50">Last updated: 2026. This page forms part of the terms of use of the site.</p>

      <p className="mt-4"><Link href="/" className="font-semibold text-emerald-600">Return to finder</Link></p>
    </div>
  );
}
