import type { Config } from "drizzle-kit";

// Note: We do NOT call dotenv.config() here anymore.
// Next.js / Vercel injects DATABASE_URL via environment variables during build.
// For local `drizzle-kit` CLI usage, either:
//   - run via the npm scripts (which load .env), or
//   - use `dotenv -e .env.local npx drizzle-kit ...`
//   - or have your shell load .env

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
