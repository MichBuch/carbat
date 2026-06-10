/**
 * Dev server helper (mirrors padellight pattern).
 * Usage: npm run dev
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { spawn } from "node:child_process";

const child = spawn("next", ["dev"], { stdio: "inherit", shell: true });

child.on("exit", (code) => process.exit(code ?? 0));
