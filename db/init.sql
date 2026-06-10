-- Run via: npm run db:setup
-- Or paste into Neon SQL Editor (recommended for first run on Windows).

-- Enums (idempotent)
DO $$ BEGIN CREATE TYPE "battery_type" AS ENUM('standard', 'efb', 'agm'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "fuel_type" AS ENUM('petrol', 'diesel', 'hybrid', 'other'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "polarity" AS ENUM('0', '1'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Vehicles (car fitment profiles)
CREATE TABLE IF NOT EXISTS "vehicles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "make" text NOT NULL,
  "model" text NOT NULL,
  "variant" text,
  "year_from" integer NOT NULL,
  "year_to" integer NOT NULL,
  "engine_cc" integer,
  "engine_code" text,
  "fuel" "fuel_type" DEFAULT 'petrol' NOT NULL,
  "start_stop" boolean DEFAULT false NOT NULL,
  "battery_polarity" "polarity" DEFAULT '0' NOT NULL,
  "battery_length_max_mm" integer,
  "battery_width_max_mm" integer,
  "battery_height_max_mm" integer,
  "min_ah" integer,
  "recommended_ah" integer,
  "min_cca" integer,
  "recommended_type" "battery_type",
  "hold_down" text,
  "notes" text,
  "active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "vehicles_make_model_idx" ON "vehicles" ("make", "model");
CREATE INDEX IF NOT EXISTS "vehicles_start_stop_idx" ON "vehicles" ("start_stop");

-- Exact reg (normalized uppercase no spaces) -> vehicle mapping for fast lookup
CREATE TABLE IF NOT EXISTS "reg_lookups" (
  "reg" text PRIMARY KEY,
  "vehicle_id" uuid NOT NULL REFERENCES "vehicles"("id") ON DELETE cascade,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "reg_lookups_vehicle_idx" ON "reg_lookups" ("vehicle_id");

-- Batteries catalog
CREATE TABLE IF NOT EXISTS "batteries" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "brand" text NOT NULL,
  "model" text NOT NULL,
  "ah" integer NOT NULL,
  "cca" integer NOT NULL,
  "type" "battery_type" DEFAULT 'standard' NOT NULL,
  "length_mm" integer NOT NULL,
  "width_mm" integer NOT NULL,
  "height_mm" integer NOT NULL,
  "polarity" "polarity" DEFAULT '0' NOT NULL,
  "weight_kg" integer,
  "warranty_months" integer DEFAULT 24,
  "technology" text,
  "group_size" text,
  "slug" text NOT NULL UNIQUE,
  "active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "batteries_ah_idx" ON "batteries" ("ah");
CREATE INDEX IF NOT EXISTS "batteries_cca_idx" ON "batteries" ("cca");
CREATE INDEX IF NOT EXISTS "batteries_type_idx" ON "batteries" ("type");
CREATE INDEX IF NOT EXISTS "batteries_polarity_idx" ON "batteries" ("polarity");
CREATE INDEX IF NOT EXISTS "batteries_dims_idx" ON "batteries" ("length_mm", "width_mm", "height_mm");

-- Explicit recommendations (can mark "best" for popular vehicles)
CREATE TABLE IF NOT EXISTS "vehicle_battery_recommendations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "vehicle_id" uuid NOT NULL REFERENCES "vehicles"("id") ON DELETE cascade,
  "battery_id" uuid NOT NULL REFERENCES "batteries"("id") ON DELETE cascade,
  "is_best_match" boolean DEFAULT false NOT NULL,
  "fit_notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "vbr_vehicle_battery_idx" ON "vehicle_battery_recommendations" ("vehicle_id", "battery_id");
CREATE INDEX IF NOT EXISTS "vbr_vehicle_idx" ON "vehicle_battery_recommendations" ("vehicle_id");
