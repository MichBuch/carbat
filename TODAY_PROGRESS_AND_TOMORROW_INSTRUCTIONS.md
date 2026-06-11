# CarBat - Today’s Progress + Tomorrow’s Instructions

**Date:** (current session)  
**Repo:** https://github.com/MichBuch/carbat  
**Neon Project:** https://console.neon.tech/app/projects/old-fire-49211263 (named "carbat")

This file captures the entire chat context, decisions, what was built, fixes applied, and exact next steps so you can continue tomorrow without losing context.

---

## Project Goal (recap from original request)

Build a Next.js + Tailwind + NeonDB website where users enter a UK car registration number and get matching car batteries.

Must consider:
- Start/stop (EFB/AGM vs standard)
- Engine size
- Capacity (60Ah vs 70Ah etc.)
- Polarity (terminal layout 0 = + on right when terminals face you)
- Physical dimensions (will it fit the tray?)
- Other battery specs (CCA, warranty, technology)

Monetization:
- Adsterra ads
- Affiliate / price comparison jump-off links to UK battery sellers (Tayna, Halfords, Euro Car Parts, Amazon, etc.)

Disclaimers everywhere: "guide only", user is responsible for verifying fitment.

Tech stack (modeled after your `padellight` project):
- Next.js 16 + React 19 + TS + Tailwind 4 + Geist
- Neon Postgres + Drizzle ORM
- Smart dual driver (neon-http on Vercel, pg locally)
- Demo data fallback so the app never hard-crashes
- Deploy to Vercel from Git

---

## What Was Built / Completed Today

### Core Application
- Full Next.js project scaffolded and customized to match padellight patterns.
- Database schema (`db/schema.ts`, `db/init.sql`, `db/seed.sql`):
  - `vehicles` table with start/stop flag, battery requirements (polarity, max dims, min Ah/CCA, recommended type).
  - `batteries` table with full specs (Ah, CCA, type, dimensions, polarity, warranty, etc.).
  - `reg_lookups` for fast exact reg → vehicle mapping.
  - Explicit "best match" recommendations.
- Rich **in-memory demo data** (`data/demo-data.ts`) + pure matching logic (`lib/battery-fit.ts`).
  - The app works **completely** without a database (demo fallback).
- Smart lookup (`lib/vehicle-lookup.ts`):
  - Normalizes UK regs (strips spaces, uppercases).
  - Tries real DB first → falls back to demo data if no `DATABASE_URL` or DB error.
  - Returns `usingDemoData` flag so UI can show nice banners.
- Matching logic considers all the things you asked for (start/stop, polarity, dimensions, Ah/CCA, technology).
- UI:
  - Clean hero + reg input on `/`.
  - `/results?reg=AB12CDE` with vehicle card + filtered battery cards.
  - Client-side filters on results (type, min Ah, sort).
  - Battery cards show "why it fits", warnings, price comparison links.
  - `/batteries` full catalogue table.
  - `/how-it-works` and strong `/disclaimer`.
- Monetization scaffolding:
  - `lib/affiliates.ts` with UK retailers + dynamic search links (easy to turn into real affiliates).
  - Multiple `<AdPlaceholder />` locations (homepage, results top + in-content, batteries).
  - Comments in `layout.tsx` for proper Next.js `<Script>` integration.
- Resilience:
  - If DB is missing or fails → beautiful demo mode with same matching logic.
  - All pages show friendly "demo data" notices when appropriate.
- Scripts (matching padellight):
  - `npm run db:setup` (raw SQL via pg for Windows reliability)
  - `npm run db:seed`
  - `npm run db:studio`
- `.env.example` updated with Neon guidance.
- `vercel.json` present.
- README heavily updated with local + deploy instructions.

### Git & Deploy Readiness
- `.gitignore` correctly ignores `.env*`.
- Build passes cleanly (`npm run build` succeeds).
- README contains full Vercel-from-Git instructions referencing your exact repo.
- Last local commit before your push attempt: "First take on carbat" (contains all the demo fallback work + polish).

### Known State at End of Session
- You had done `git add` + `git commit`.
- Push failed because **no remote `origin` was configured** ("no configured push destination").
- We added the remote in the workspace for diagnosis:
  ```powershell
  git remote add origin https://github.com/MichBuch/carbat.git
  ```
- You have a real Neon project ready.
- You signed up for Adsterra but have not yet provided the actual ad code snippets / zone formats.

---

## Tomorrow’s To-Do List (Prioritized)

1. **Finish the Git push** (if not already done when you read this).
2. **Deploy to Vercel** from the Git repo.
3. **Connect & seed the real Neon database**.
4. **Integrate real Adsterra ads** (you signed up — we need your codes).
5. **Polish & test** (optional but recommended before going live).
6. **Optional future enhancements** (notes below).

---

## Exact Instructions for Tomorrow

### 1. Fix & Complete the Git Push

In PowerShell, inside `C:\lib\dev\carbat`:

```powershell
# Add remote (safe to run again)
git remote add origin https://github.com/MichBuch/carbat.git

# Verify
git remote -v

# Push (first time sets upstream)
git push -u origin main
```

If you get "unrelated histories" or rejected:

```powershell
git pull origin main --allow-unrelated-histories
git push -u origin main
```

**Authentication tip (Windows):**  
First push usually needs a GitHub Personal Access Token (not your password).  
Easiest: `winget install --id GitHub.cli` then `gh auth login`.

After push, visit https://github.com/MichBuch/carbat and confirm the latest commit is there.

### 2. Deploy to Vercel (from Git)

1. Go to https://vercel.com/new
2. Import Git Repository → choose **MichBuch/carbat**
3. Add Environment Variables (Production + Preview):
   - `DATABASE_URL` = the **Pooled** connection string from your Neon project (old-fire-49211263)
   - `NEXT_PUBLIC_SITE_URL` = `https://carbat.vercel.app` (update later if you add custom domain)
4. Deploy.

The site will be live immediately (thanks to demo data fallback).

### 3. Seed the Real Database (after first Vercel deploy)

**Recommended easiest method (no local DB needed):**

1. Go to your Neon console → SQL Editor for the `carbat` project.
2. Paste the **entire contents** of `db/init.sql` and run.
3. Paste the **entire contents** of `db/seed.sql` and run.

Alternative (if you prefer local):

```powershell
# Make sure .env.local has the same DATABASE_URL as Vercel
npm run db:setup
npm run db:seed
```

Verify with:
```powershell
npm run db:studio
```

Test real data on the live site with demo regs: `AB12CDE`, `BX15KLM`, `DE68FNP`, etc.

### 4. Integrate Real Adsterra Ads

You said you already signed up.

**What we still need from you (paste tomorrow):**
- The actual ad code snippets / zone codes Adsterra gave you.
- What formats you created (e.g. 300x250 banner, 728x90, Popunder, In-page push, etc.).
- Rough placement preference (how many ads, where they should appear).

Once you give us the codes, we will:
- Replace the `<AdPlaceholder />` components with real working Adsterra code.
- Use `next/script` with proper strategies (`afterInteractive`, `lazyOnload`) for best performance.
- Handle popunders vs banners correctly.
- Make it easy to toggle via env vars if you want.

Current placeholder locations (easy to find):
- `app/page.tsx` (homepage)
- `app/results/page.tsx` (two places: top + in-content)
- `app/batteries/page.tsx`
- Comments in `app/layout.tsx`

### 5. Quick Polish / Verification Checklist

- Visit the deployed site and test several regs (both demo and after seeding).
- Check that "demo data" banners disappear once real DB is seeded.
- Click price comparison links — make sure they go to sensible UK retailer searches (we can improve `lib/affiliates.ts` with your real affiliate tags later).
- Mobile/responsive check.
- Add any final disclaimers or copy tweaks.
- (Optional) Update `NEXT_PUBLIC_SITE_URL` in Vercel if you buy a custom domain.

---

## Important Files & Notes

### Key Commands (always run from project root)
```powershell
npm run dev
npm run build
npm run db:setup
npm run db:seed
npm run db:studio
```

### Environment Variables
- `DATABASE_URL` (required for real data)
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_ADSTERRA_*` (optional, we can wire these when you give codes)

### Current Architecture Highlights (for context)
- `lib/db.ts` — smart proxy (neon-http on Vercel, pg locally)
- `lib/vehicle-lookup.ts` + `data/demo-data.ts` — the magic that makes the app never break
- `lib/battery-fit.ts` — all the polarity/dimensions/start-stop/Ah/CCA logic
- `lib/affiliates.ts` — price comparison jump links (very easy to make real affiliates)
- Strong disclaimers live in the UI + footer.

### Polarity Convention (documented in code)
`0` = positive terminal on the **right** when the terminals are facing you.  
`1` = positive on the left.

---

## What Was Hard / Decisions Made

- Original problem: reg search threw "DATABASE_URL missing" hard error.
- Solution: Full demo data layer + graceful fallback everywhere. The matching logic is identical in demo vs real DB mode.
- Git push issue was purely "no remote configured" (very common right after local `git init` + first commits).
- We followed padellight patterns closely (drizzle + raw SQL setup scripts, env handling, vercel.json, component structure, etc.).
- Adsterra left as clean placeholders because you hadn't shared the actual codes yet.

---

## Tomorrow Quick-Start (copy-paste this block)

```powershell
cd C:\lib\dev\carbat

# 1. Push (if not done)
git remote add origin https://github.com/MichBuch/carbat.git
git push -u origin main

# 2. (After push) Deploy on Vercel, add env vars

# 3. Seed DB (easiest via Neon SQL Editor)
#    → paste db/init.sql
#    → paste db/seed.sql

# 4. Test live site with AB12CDE etc.

# 5. Paste your Adsterra codes here so we can wire them in.
```

---

## Future / Nice-to-Have Ideas (not required)

- Real-time DVLA VES API proxy (for better make/model/year from any reg) — still needs your internal fitment table for battery specifics.
- Manual make/model/year selector as fallback.
- More vehicles/batteries in seed (very easy — just add rows to `db/seed.sql`).
- Better affiliate tracking (Awin links, UTM params, etc.).
- Analytics (Vercel Analytics or Plausible).
- "Report wrong fitment" feedback form.

---

**You are in a great spot.** The hard parts (data model, matching logic, resilience, demo fallback, deployment scaffolding) are done. Tomorrow is mostly "connect the dots" (push + Vercel + seed + Adsterra codes).

When you’re ready tomorrow, just open this file and start at the "Tomorrow’s To-Do List" section. Paste any errors or your Adsterra codes and we’ll knock it out quickly.

Good luck — this is going to be a solid little tool! 

(End of captured chat context + instructions)