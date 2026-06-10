import type { vehicles, batteries } from "@/db/schema";

export type Vehicle = typeof vehicles.$inferSelect;
export type Battery = typeof batteries.$inferSelect;
