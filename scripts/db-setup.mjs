/**
 * Reliable schema setup when drizzle-kit push fails on Windows.
 * Usage: npm run db:setup
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
const sqlPath = join(__dirname, "..", "db", "init.sql");
const sql = readFileSync(sqlPath, "utf8");

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  console.log("Connected. Applying schema from db/init.sql …");
  await client.query(sql);
  const tables = await client.query(
    "select tablename from pg_tables where schemaname = 'public' order by tablename"
  );
  console.log("Done. Tables:", tables.rows.map((r) => r.tablename).join(", "));
} catch (e) {
  console.error("db:setup failed:", e.message);
  console.error("\nCheck DATABASE_URL in .env.local is your real Neon connection string.");
  process.exit(1);
} finally {
  await client.end();
}
