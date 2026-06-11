import { z } from "zod";

// IMPORTANT:
// Next.js automatically loads .env.local / .env / .env.production etc. into process.env
// BEFORE your app code runs (both locally with `next dev`/`next build` and on Vercel).
// Do NOT call dotenv.config() here — it is unnecessary for the Next.js app bundle
// and causes "Module not found: Can't resolve 'dotenv'" on clean Vercel builds.
//
// The db-*.mjs scripts import dotenv themselves when needed.

const schema = z.object({
  DATABASE_URL: z.string().min(1).optional(),
  NEXT_PUBLIC_SITE_URL: z.string().default("http://localhost:3000"),
  // Adsterra - replace the zone ids / scripts in components with your publisher codes
  NEXT_PUBLIC_ADSTERRA_BANNER: z.string().optional(),
  NEXT_PUBLIC_ADSTERRA_SIDEBAR: z.string().optional(),
  // Live reg lookup (optional, cost-sensitive). See README for setup.
  // VEHICLE_LOOKUP_PROVIDER=apify (or auto) + APIFY_API_TOKEN enables the Apify DVLA screenscraper actor.
  // Alternative cheap options: UK Vehicle Data (ukvehicledata.co.uk) which also provides battery-specific data.
  VEHICLE_LOOKUP_PROVIDER: z.string().optional(),
  APIFY_API_TOKEN: z.string().optional(),
  APIFY_TOKEN: z.string().optional(), // alias
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.warn("Env validation issues:", parsed.error.flatten().fieldErrors);
}

export const env = (parsed.success ? parsed.data : process.env) as z.infer<typeof schema>;

export const {
  DATABASE_URL,
  NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_ADSTERRA_BANNER,
  NEXT_PUBLIC_ADSTERRA_SIDEBAR,
  VEHICLE_LOOKUP_PROVIDER,
  APIFY_API_TOKEN,
  APIFY_TOKEN,
} = env;
