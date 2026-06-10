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

## Development tips

- The lookup is resilient: if DB not ready it shows a helpful message.
- New vehicles/batteries: add rows to the seed SQL (or write a small import script).
- Polarity convention documented in code: 0 = + on right (terminals facing you).
