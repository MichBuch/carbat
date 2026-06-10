import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { Pool } from "pg";
import { drizzle as drizzlePg, type NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "@/db/schema";
import { DATABASE_URL } from "@/lib/env";

type AppDb = NeonHttpDatabase<typeof schema> | NodePgDatabase<typeof schema>;

let _db: AppDb | undefined;

function getDb(): AppDb {
  if (_db) return _db;
  if (!DATABASE_URL) {
    // We handle this gracefully in vehicle-lookup.ts with rich demo data.
    // Throwing here keeps other code paths honest.
    throw new Error("DATABASE_URL missing — the app will use built-in demo data for reg lookups and browsing.");
  }

  // Vercel serverless: Neon HTTP driver (pg pools break on lambdas)
  if (process.env.VERCEL) {
    _db = drizzleNeon(neon(DATABASE_URL), { schema });
    return _db;
  }

  // Parse the connection string to check if SSL is needed (Neon always needs it).
  const requireSsl = DATABASE_URL.includes("neon.tech") || DATABASE_URL.includes("sslmode");
  const pool = new Pool({
    connectionString: DATABASE_URL.replace(/[?&]sslmode=[^&]*/g, ""),
    ssl: requireSsl ? { rejectUnauthorized: true } : false,
    max: 5,
  });
  _db = drizzlePg(pool, { schema });
  return _db;
}

export const db = new Proxy({} as AppDb, {
  get(_t, prop) {
    const inst = getDb() as unknown as Record<string | symbol, unknown>;
    const v = inst[prop];
    return typeof v === "function" ? v.bind(inst) : v;
  },
});

export type DB = AppDb;
