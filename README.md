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

## Monetisation

1. **Adsterra**: Replace the `<AdPlaceholder />` components (home, results, batteries pages) with your real ad units/scripts. See comments in `app/layout.tsx` for Next.js `<Script>` loading tips.
2. **Affiliates**: Update `lib/affiliates.ts` — add your Awin / Amazon Associates / custom tracking parameters to the `baseSearch` URLs.

All retailer links open in new tabs with clear "you may earn commission" style notes. Place ads thoughtfully so the core battery finder experience stays excellent.

## Deploy to Vercel (from Git)

Your repo: https://github.com/MichBuch/carbat

1. Push your latest code to the `main` branch on GitHub (you've already created the repo).

2. Go to [vercel.com/new](https://vercel.com/new) → Import Git Repository → select **MichBuch/carbat**.

3. **Important: Add these Environment Variables** (for Production + Preview):
   - `DATABASE_URL` → the **Pooled** connection string from your Neon project (carbat / old-fire-49211263).  
     Example: `postgresql://...@ep-...-pooler...neon.tech/neondb?sslmode=require`
   - `NEXT_PUBLIC_SITE_URL` → your final URL, e.g. `https://carbat.vercel.app`

4. Click Deploy.

The site will be live immediately because we built in a rich **demo data fallback**. Reg search, battery matching, filters, and price comparison links will all work with sample data even before the database is seeded.

5. **Seed the real data** (do this once after the first successful deploy):

   **Easiest option (recommended):**
   - Go to your Neon console → SQL Editor
   - Paste the entire contents of `db/init.sql` and run it.
   - Then paste the entire contents of `db/seed.sql` and run it.

   **Alternative (local):**
   - Make sure your local `.env.local` has the same `DATABASE_URL` as Vercel.
   - Run:
     ```bash
     npm run db:setup
     npm run db:seed
     ```

6. (Optional but recommended) Add your Adsterra ad codes and update affiliate links in `lib/affiliates.ts`, then push a new commit to trigger a redeploy.

You can also deploy from CLI later:
```bash
npx vercel
npx vercel --prod
```

## After Deploy

- The site is resilient: if the database isn't ready yet it shows friendly messages and falls back to high-quality demo data.
- All disclaimers about "guide only" and user responsibility are already prominent on the site.
- Update `NEXT_PUBLIC_SITE_URL` in Vercel if you add a custom domain.

## Important disclaimers (built into the site)

Users are responsible for verifying fitment. The site is a guide only. See `/disclaimer`.

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
