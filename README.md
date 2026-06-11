# CarBat

UK car registration → correct battery finder. Considers start/stop, polarity, dimensions, Ah, CCA and more.

**Monetised with Adsterra + affiliate jump links to UK battery retailers (Tayna, Halfords, Euro Car Parts, Amazon, etc).**

GitHub: https://github.com/MichBuch/carbat

## Stack (following padellight patterns)
- Next.js 16 + React 19 + TypeScript + Tailwind 4
- Neon Postgres (serverless) + Drizzle ORM
- Vercel deploy

## Getting started locally

```bash
cp .env.example .env.local
# Add your Neon DATABASE_URL

npm install

# One-time DB setup (reliable on Windows)
npm run db:setup
npm run db:seed

npm run dev
```

Open http://localhost:3000 — try the demo registrations shown on the homepage (AB12CDE etc).

## Database

- Schema & seed are in `db/init.sql` + `db/seed.sql` (raw SQL for maximum reliability).
- Also have `db/schema.ts` for Drizzle types.
- Scripts: `db:setup`, `db:seed`, `db:studio`, `db:push` etc.

After changing schema you can also run `npm run db:push`.

## Key pages
- `/` — Reg entry + popular vehicles
- `/results?reg=AB12CDE` — Matching batteries + price comparison links
- `/batteries` — Full catalogue table
- `/how-it-works` & `/disclaimer` — Important consumer information

## Current status (June 2026)

**WIP / early beta.** Prominent banners are shown on the site. The core experience (enter reg → see vehicle + matching batteries with dimensions, Ah, CCA, stop/start tech, seller links) works great in demo mode and with a real Postgres.

**Goal**: Convenient "jump off" site for UK drivers looking for the right battery. Revenue primarily from **Adsterra advertising** (high-intent traffic on results page is valuable) + affiliate commissions on battery purchases.

A live reg lookup feature is included (more data = better battery recommendations).

## Live registration lookup costs & limits (important)

Live lookup (real plates → rich make/model/variant + extras) is **optional and cached**.

- **Apify** (the screenscraper actor we use by default): 
  - **No hard daily cap**.
  - Free plan: **$5 platform credits per month**.
  - Each lookup is a lightweight run. Real-world cost is usually very low (fractions of a cent per successful reg check on the free tier).
  - $5 often covers hundreds to low-thousands of unique lookups depending on the actor's exact pay-per-event pricing.
  - After credits run out: live lookups gracefully fall back to demo/cached data (no breakage).
  - Upgrade path: Starter plan ($29/mo) gives $29 credits + higher concurrent limits.

- **UK Vehicle Data (recommended for better battery data)**: Free no-time-limit **sandbox/trial** (but restricted to test regs with 'A' and **cannot be used on a public production site**). Production is pure pay-per-lookup (typically a few pence per successful VRM; battery data is a separate cheap add-on). Volume discounts apply. No "included daily checks".

- **Caching saves money**: Once any plate is successfully looked up (or seeded), it is stored in your Postgres. Subsequent visitors get it for free instantly. Popular plates become almost zero-cost very quickly.

**Recommendation for an ad-revenue site**: Leave live lookup enabled (it improves the product) but don't worry about high costs at modest traffic. Monitor your Apify dashboard. You can set `VEHICLE_LOOKUP_PROVIDER=off` at any time to disable external calls completely.

## Monetisation (Adsterra focus)

Primary revenue = **advertising** (Adsterra). Secondary = affiliate links on the battery cards.

### Activating real Adsterra ads (step-by-step)

1. Sign up / log in at https://adsterra.com/ and create ad zones for the placements we have:
   - Homepage banner/native
   - Results page top + in-content/sidebar (very high intent — users are actively choosing a battery)
   - Batteries catalogue page

2. For each zone, Adsterra will give you a code snippet (usually an `atOptions` object + a `<script src="...invoke.js">` URL, or a full HTML block, or popunder/direct link code).

3. **Easiest way right now**:
   - Open the new `components/AdsterraAd.tsx`
   - Look at the props: `zoneId`, `scriptSrc`, `atOptions`, or `rawHtml`.
   - Either:
     - Paste the **full raw HTML/script block** they gave you into the `rawHtml` prop on the pages, **or**
     - Extract the parts and pass `atOptions` + `scriptSrc` + `zoneId`.

4. The pages (`app/page.tsx`, `app/results/page.tsx`, `app/batteries/page.tsx`) already call `<AdsterraAd label="..." />` with good comments. Replace the calls with your real data.

5. Add an `ads.txt` file (we already created `public/ads.txt` as a starter — replace the placeholder lines with the exact verification line Adsterra gives you).

6. (Optional) Add popunder / social bar / direct link codes once in `app/layout.tsx` using `<Script strategy="afterInteractive" ... />`.

7. Push a commit → Vercel redeploys.

**Tips for revenue**:
- Results page after a reg search is your highest-value inventory (user has clear intent).
- Use responsive / native formats where possible.
- Keep core UX clean — don't let ads push the battery list too far down.
- We already have good disclosures in the footer + disclaimer page.

Affiliate note: Update the URLs in `lib/affiliates.ts` with your real tracking/affiliate tags.

## Deploy / update on Vercel (from Git)

The code was just pushed to `main` (commit includes WIP banner, live lookup, Adsterra components, ads.txt, etc.).

1. If not already connected: Go to https://vercel.com/new → Import **MichBuch/carbat**.

2. **Required environment variables** (Production + Preview):
   - `DATABASE_URL` (Neon pooled connection)
   - `NEXT_PUBLIC_SITE_URL` (your final domain)
   - For live reg lookup (optional): `VEHICLE_LOOKUP_PROVIDER=apify` + `APIFY_API_TOKEN=...`
   - For Adsterra you can use `NEXT_PUBLIC_ADSTERRA_BANNER` etc. if you want to drive content from env, but the component approach above is more flexible.

3. Deploy.

4. After first deploy:
   - Seed your DB (Neon SQL editor is easiest: paste `db/init.sql` then `db/seed.sql`).
   - Add your real Adsterra codes + push one more commit (or use Vercel dashboard env + redeploy).

You can also run `npx vercel --prod` from the folder once locally configured.

## After changes

- The site shows a clear **WIP beta banner** on the homepage and results.
- All live lookup and ad work is behind clear labels so you can finish wiring your specific Adsterra zones quickly.
- Demo mode (no DB) still gives a full working experience including the MT19XHU Renault Trafic example.

## Important disclaimers (built into the site)

Users are responsible for verifying fitment. The site is a guide only. See `/disclaimer`.

Live data and battery recommendations are best-effort. The prominent WIP banner + disclaimers make the "guide only" nature very clear to visitors (important for ad network compliance and user trust).

## Live registration (VRM) lookup — real reg numbers

The site now supports **live lookup of real UK registrations** (e.g. `MT19 XHU` → Renault Trafic with rich details).

### How it works (cost-aware)
1. Exact match in local DB / reg cache (free + instant after first lookup).
2. If not cached: call a configured external provider for make/model/variant/year/engine/fuel + extras (MOT/tax status, CO₂, colour, body etc.).
3. Derive battery tray / electrical requirements using heuristics + model knowledge (start/stop flag, Ah/CCA minima, dimensions). Some providers return battery data directly.
4. Run the same high-quality fitment logic + your local battery catalogue.
5. Persist the result (vehicle row + reg mapping) so the next person with that plate gets it free.

**More data from the reg = better battery matches** (exact variant, start/stop presence, etc.).

### Recommended low-cost / screenscraping options (2026)

| Provider                  | Type                  | Approx. cost (low vol)      | Battery-specific data? | Notes |
|---------------------------|-----------------------|-----------------------------|------------------------|-------|
| **Apify `car_map/apify-vehicle-lookup`** | Screenscraper (public DVLA) | Pay-per-event, very cheap for small sites | No (we enrich) | Easiest to enable. No long-term contract. Set `VEHICLE_LOOKUP_PROVIDER=apify` + `APIFY_API_TOKEN`. |
| **UK Vehicle Data (ukvehicledata.co.uk)** | Licensed DVLA + extras | Free trial (no time limit) then ~few pence/lookup | **Yes** — dedicated Battery Data + Start/Stop endpoints | Excellent for us. Get a trial key and we can add a direct `ukvd` provider. |
| VehicleDataGlobal / CheckCarDetails / MotorCheck | Licensed | 2p–15p per lookup (volume discounts) | Some have battery packs | Good fallbacks. |
| Official DVLA VES API     | Government            | Free (in theory)            | No                     | Registration currently closed for new users. |

**AutoTrader APIs** are trade-oriented and generally too expensive for a consumer battery finder — we avoided them for cost reasons.

### Enable live lookup locally / on Vercel

1. Sign up for Apify (free tier + pay for runs) → get API token from Integrations.
2. Add to `.env.local` (and Vercel env vars):

   ```
   VEHICLE_LOOKUP_PROVIDER=apify
   APIFY_API_TOKEN=apify_api_...
   ```

3. (Optional but recommended) Also sign up for UK Vehicle Data free trial — their battery endpoint will let us return even more precise "suitable batteries" data in future.

4. Restart dev server. Try a real plate like `MT19XHU`.

Live results are cached in your Postgres (vehicles + reg_lookups tables), so costs stay near zero after the first lookup of a plate.

### Adding / improving battery data for a model

- The battery catalogue + `doesBatteryFit` logic lives in `lib/battery-fit.ts` + `db/seed.sql`.
- Add more vehicles or explicit recommendations in the seed, or improve the heuristics in `lib/live-lookup.ts`.
- For ultimate accuracy, secondary calls to a battery-aware provider (UKVD Battery Data) or curated mapping tables are the next step.

## Development tips

- The lookup is resilient: if DB not ready it shows a helpful message.
- New vehicles/batteries: add rows to the seed SQL (or write a small import script).
- Polarity convention documented in code: 0 = + on right (terminals facing you).
