/**
 * Seed via pg (same driver as db:setup). Use when tsx seed hits fetch failed.
 * Usage: npm run db:seed
 */
import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

config({ path: ".env.local" });
config();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL missing in .env.local");
  process.exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(__dirname, "..", "db", "seed.sql"), "utf8");

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  console.log("Seeding vehicles, batteries and demo regs from db/seed.sql …");
  await client.query(sql);

  const vCount = await client.query("select count(*)::int as n from vehicles");
  const bCount = await client.query("select count(*)::int as n from batteries");
  const rCount = await client.query("select count(*)::int as n from reg_lookups");

  console.log(`Done. Vehicles: ${vCount.rows[0].n} | Batteries: ${bCount.rows[0].n} | Reg lookups: ${rCount.rows[0].n}`);
} catch (e) {
  console.error("db:seed failed:", e.message);
  process.exit(1);
} finally {
  await client.end();
}
