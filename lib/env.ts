import { config } from "dotenv";
import { z } from "zod";

config({ path: ".env.local" });
config();

const schema = z.object({
  DATABASE_URL: z.string().min(1).optional(),
  NEXT_PUBLIC_SITE_URL: z.string().default("http://localhost:3000"),
  // Adsterra - replace the zone ids / scripts in components with your publisher codes
  NEXT_PUBLIC_ADSTERRA_BANNER: z.string().optional(),
  NEXT_PUBLIC_ADSTERRA_SIDEBAR: z.string().optional(),
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
} = env;
