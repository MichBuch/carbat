import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// --- Enums ---
export const batteryType = pgEnum("battery_type", ["standard", "efb", "agm"]);
export const fuelType = pgEnum("fuel_type", ["petrol", "diesel", "hybrid", "other"]);

// Polarity convention (UK/EU common): 0 = positive on RIGHT when terminals are facing you; 1 = positive on LEFT
export const polarity = pgEnum("polarity", ["0", "1"]);

export const vehicles = pgTable(
  "vehicles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    make: text("make").notNull(),
    model: text("model").notNull(),
    variant: text("variant"),
    yearFrom: integer("year_from").notNull(),
    yearTo: integer("year_to").notNull(),
    engineCc: integer("engine_cc"),
    engineCode: text("engine_code"),
    fuel: fuelType("fuel").notNull().default("petrol"),
    startStop: boolean("start_stop").notNull().default(false),
    // Battery tray / fitment requirements
    batteryPolarity: polarity("battery_polarity").notNull().default("0"),
    batteryLengthMaxMm: integer("battery_length_max_mm"),
    batteryWidthMaxMm: integer("battery_width_max_mm"),
    batteryHeightMaxMm: integer("battery_height_max_mm"),
    // Minimum / recommended specs from OE
    minAh: integer("min_ah"),
    recommendedAh: integer("recommended_ah"),
    minCca: integer("min_cca"),
    recommendedType: batteryType("recommended_type"),
    holdDown: text("hold_down"), // e.g. "B13", "B0"
    notes: text("notes"),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("vehicles_make_model_idx").on(t.make, t.model),
    index("vehicles_start_stop_idx").on(t.startStop),
  ]
);

// Fast exact reg -> vehicle lookup (demo / popular UK regs)
export const regLookups = pgTable(
  "reg_lookups",
  {
    reg: text("reg").primaryKey(), // normalized e.g. AB12CDE (no spaces)
    vehicleId: uuid("vehicle_id").notNull().references(() => vehicles.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("reg_lookups_vehicle_idx").on(t.vehicleId)]
);

export const batteries = pgTable(
  "batteries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    brand: text("brand").notNull(),
    model: text("model").notNull(),
    // Core electrical
    ah: integer("ah").notNull(),
    cca: integer("cca").notNull(),
    type: batteryType("type").notNull().default("standard"),
    // Physical
    lengthMm: integer("length_mm").notNull(),
    widthMm: integer("width_mm").notNull(),
    heightMm: integer("height_mm").notNull(),
    polarity: polarity("polarity").notNull().default("0"),
    weightKg: integer("weight_kg"),
    // Commercial
    warrantyMonths: integer("warranty_months").default(24),
    technology: text("technology"), // e.g. "Calcium", "AGM VRLA", "EFB"
    // For grouping / UX
    groupSize: text("group_size"), // e.g. "019", "096", "DIN H7"
    // Estimated UK retail price range (guide only, £)
    priceMin: integer("price_min"),
    priceMax: integer("price_max"),
    slug: text("slug").notNull().unique(),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("batteries_ah_idx").on(t.ah),
    index("batteries_cca_idx").on(t.cca),
    index("batteries_type_idx").on(t.type),
    index("batteries_polarity_idx").on(t.polarity),
    index("batteries_dims_idx").on(t.lengthMm, t.widthMm, t.heightMm),
  ]
);

// Optional explicit recommendations (overrides pure attribute matching for key popular cars)
export const vehicleBatteryRecommendations = pgTable(
  "vehicle_battery_recommendations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    vehicleId: uuid("vehicle_id").notNull().references(() => vehicles.id, { onDelete: "cascade" }),
    batteryId: uuid("battery_id").notNull().references(() => batteries.id, { onDelete: "cascade" }),
    isBestMatch: boolean("is_best_match").notNull().default(false),
    fitNotes: text("fit_notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("vbr_vehicle_battery_idx").on(t.vehicleId, t.batteryId),
    index("vbr_vehicle_idx").on(t.vehicleId),
  ]
);
