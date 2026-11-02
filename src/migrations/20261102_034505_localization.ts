import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_exports_locale" AS ENUM('all', 'fr', 'en');
  CREATE TABLE "offerings_price_options_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "offerings_extras_locales" (
  	"label" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "offerings_locales" (
  	"title" varchar NOT NULL,
  	"kicker" varchar,
  	"summary" varchar NOT NULL,
  	"description" jsonb,
  	"price_note" varchar,
  	"cancellation_policy" varchar,
  	"trip_region" varchar,
  	"guide" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "packages_locales" (
  	"title" varchar NOT NULL,
  	"summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"content" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "categories_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "testimonials_locales" (
  	"quote" varchar NOT NULL,
  	"highlight" varchar,
  	"context" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "home_locales" (
  	"eyebrow" varchar DEFAULT 'Ayurveda · Méditation · Yoga · Sciences védiques',
  	"intro" varchar,
  	"manifesto" varchar,
  	"manifesto_aside" varchar,
  	"ritual_title" varchar,
  	"ritual_text" varchar,
  	"ritual_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "about_chapters_locales" (
  	"place" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_credentials_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_locales" (
  	"lead" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "home" DROP CONSTRAINT "home_ritual_image_id_media_id_fk";
  
  DROP INDEX "home_ritual_ritual_image_idx";
  ALTER TABLE "offerings_highlights" ADD COLUMN "_locale" "_locales" DEFAULT 'fr' NOT NULL;
  ALTER TABLE "offerings_itinerary" ADD COLUMN "_locale" "_locales" DEFAULT 'fr' NOT NULL;
  ALTER TABLE "offerings_included" ADD COLUMN "_locale" "_locales" DEFAULT 'fr' NOT NULL;
  ALTER TABLE "offerings_not_included" ADD COLUMN "_locale" "_locales" DEFAULT 'fr' NOT NULL;
  ALTER TABLE "_posts_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_posts_v" ADD COLUMN "published_locale" "enum__posts_v_published_locale";
  ALTER TABLE "exports" ADD COLUMN "locale" "enum_exports_locale" DEFAULT 'all';
  ALTER TABLE "home_headline" ADD COLUMN "_locale" "_locales" DEFAULT 'fr' NOT NULL;
  ALTER TABLE "home_pillars" ADD COLUMN "_locale" "_locales" DEFAULT 'fr' NOT NULL;
  ALTER TABLE "offerings_price_options_locales" ADD CONSTRAINT "offerings_price_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offerings_price_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offerings_extras_locales" ADD CONSTRAINT "offerings_extras_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offerings_extras"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offerings_locales" ADD CONSTRAINT "offerings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offerings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "packages_locales" ADD CONSTRAINT "packages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials_locales" ADD CONSTRAINT "testimonials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_locales" ADD CONSTRAINT "home_locales_ritual_image_id_media_id_fk" FOREIGN KEY ("ritual_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_locales" ADD CONSTRAINT "home_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_chapters_locales" ADD CONSTRAINT "about_chapters_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_chapters"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_credentials_locales" ADD CONSTRAINT "about_credentials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_credentials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_locales" ADD CONSTRAINT "about_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "offerings_price_options_locales_locale_parent_id_unique" ON "offerings_price_options_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "offerings_price_options_locales_parent_id_idx" ON "offerings_price_options_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "offerings_extras_locales_locale_parent_id_unique" ON "offerings_extras_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "offerings_extras_locales_parent_id_idx" ON "offerings_extras_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "offerings_locales_locale_parent_id_unique" ON "offerings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "offerings_locales_parent_id_idx" ON "offerings_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "packages_locales_locale_parent_id_unique" ON "packages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "packages_locales_parent_id_idx" ON "packages_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_locales_parent_id_idx" ON "posts_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_locales_parent_id_idx" ON "_posts_v_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "categories_locales_locale_parent_id_unique" ON "categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_locales_parent_id_idx" ON "categories_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "testimonials_locales_locale_parent_id_unique" ON "testimonials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "testimonials_locales_parent_id_idx" ON "testimonials_locales" USING btree ("_parent_id");
  CREATE INDEX "home_ritual_ritual_image_idx" ON "home_locales" USING btree ("ritual_image_id");
  CREATE UNIQUE INDEX "home_locales_locale_parent_id_unique" ON "home_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_locales_parent_id_idx" ON "home_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_chapters_locales_locale_parent_id_unique" ON "about_chapters_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_chapters_locales_parent_id_idx" ON "about_chapters_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_credentials_locales_locale_parent_id_unique" ON "about_credentials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_credentials_locales_parent_id_idx" ON "about_credentials_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_locales_locale_parent_id_unique" ON "about_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_locales_parent_id_idx" ON "about_locales" USING btree ("_parent_id");
  CREATE INDEX "offerings_highlights_locale_idx" ON "offerings_highlights" USING btree ("_locale");
  CREATE INDEX "offerings_itinerary_locale_idx" ON "offerings_itinerary" USING btree ("_locale");
  CREATE INDEX "offerings_included_locale_idx" ON "offerings_included" USING btree ("_locale");
  CREATE INDEX "offerings_not_included_locale_idx" ON "offerings_not_included" USING btree ("_locale");
  CREATE INDEX "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  CREATE INDEX "home_headline_locale_idx" ON "home_headline" USING btree ("_locale");
  CREATE INDEX "home_pillars_locale_idx" ON "home_pillars" USING btree ("_locale");
  -- Keep existing content: copy it into the French locale before the old columns are dropped.
  INSERT INTO "offerings_price_options_locales" ("label", "_locale", "_parent_id") SELECT "label", 'fr', "id" FROM "offerings_price_options" WHERE "label" IS NOT NULL;
  INSERT INTO "offerings_extras_locales" ("label", "description", "_locale", "_parent_id") SELECT "label", "description", 'fr', "id" FROM "offerings_extras" WHERE "label" IS NOT NULL;
  INSERT INTO "offerings_locales" ("title", "kicker", "summary", "description", "price_note", "cancellation_policy", "trip_region", "guide", "seo_title", "seo_description", "_locale", "_parent_id") SELECT "title", "kicker", "summary", "description", "price_note", "cancellation_policy", "trip_region", "guide", "seo_title", "seo_description", 'fr', "id" FROM "offerings" WHERE "title" IS NOT NULL;
  INSERT INTO "packages_locales" ("title", "summary", "_locale", "_parent_id") SELECT "title", "summary", 'fr', "id" FROM "packages" WHERE "title" IS NOT NULL;
  INSERT INTO "posts_locales" ("title", "excerpt", "content", "seo_title", "seo_description", "_locale", "_parent_id") SELECT "title", "excerpt", "content", "seo_title", "seo_description", 'fr', "id" FROM "posts";
  INSERT INTO "_posts_v_locales" ("version_title", "version_excerpt", "version_content", "version_seo_title", "version_seo_description", "_locale", "_parent_id") SELECT "version_title", "version_excerpt", "version_content", "version_seo_title", "version_seo_description", 'fr', "id" FROM "_posts_v";
  INSERT INTO "categories_locales" ("title", "_locale", "_parent_id") SELECT "title", 'fr', "id" FROM "categories" WHERE "title" IS NOT NULL;
  INSERT INTO "testimonials_locales" ("quote", "highlight", "context", "_locale", "_parent_id") SELECT "quote", "highlight", "context", 'fr', "id" FROM "testimonials" WHERE "quote" IS NOT NULL;
  INSERT INTO "home_locales" ("eyebrow", "intro", "manifesto", "manifesto_aside", "ritual_title", "ritual_text", "ritual_image_id", "_locale", "_parent_id") SELECT "eyebrow", "intro", "manifesto", "manifesto_aside", "ritual_title", "ritual_text", "ritual_image_id", 'fr', "id" FROM "home";
  INSERT INTO "about_chapters_locales" ("place", "text", "_locale", "_parent_id") SELECT "place", "text", 'fr', "id" FROM "about_chapters" WHERE "place" IS NOT NULL;
  INSERT INTO "about_credentials_locales" ("title", "_locale", "_parent_id") SELECT "title", 'fr', "id" FROM "about_credentials" WHERE "title" IS NOT NULL;
  INSERT INTO "about_locales" ("lead", "body", "_locale", "_parent_id") SELECT "lead", "body", 'fr', "id" FROM "about";
  ALTER TABLE "offerings_highlights" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "offerings_itinerary" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "offerings_included" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "offerings_not_included" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "home_headline" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "home_pillars" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "offerings_price_options" DROP COLUMN "label";
  ALTER TABLE "offerings_extras" DROP COLUMN "label";
  ALTER TABLE "offerings_extras" DROP COLUMN "description";
  ALTER TABLE "offerings" DROP COLUMN "title";
  ALTER TABLE "offerings" DROP COLUMN "kicker";
  ALTER TABLE "offerings" DROP COLUMN "summary";
  ALTER TABLE "offerings" DROP COLUMN "description";
  ALTER TABLE "offerings" DROP COLUMN "price_note";
  ALTER TABLE "offerings" DROP COLUMN "cancellation_policy";
  ALTER TABLE "offerings" DROP COLUMN "trip_region";
  ALTER TABLE "offerings" DROP COLUMN "guide";
  ALTER TABLE "offerings" DROP COLUMN "seo_title";
  ALTER TABLE "offerings" DROP COLUMN "seo_description";
  ALTER TABLE "packages" DROP COLUMN "title";
  ALTER TABLE "packages" DROP COLUMN "summary";
  ALTER TABLE "posts" DROP COLUMN "title";
  ALTER TABLE "posts" DROP COLUMN "excerpt";
  ALTER TABLE "posts" DROP COLUMN "content";
  ALTER TABLE "posts" DROP COLUMN "seo_title";
  ALTER TABLE "posts" DROP COLUMN "seo_description";
  ALTER TABLE "_posts_v" DROP COLUMN "version_title";
  ALTER TABLE "_posts_v" DROP COLUMN "version_excerpt";
  ALTER TABLE "_posts_v" DROP COLUMN "version_content";
  ALTER TABLE "_posts_v" DROP COLUMN "version_seo_title";
  ALTER TABLE "_posts_v" DROP COLUMN "version_seo_description";
  ALTER TABLE "categories" DROP COLUMN "title";
  ALTER TABLE "testimonials" DROP COLUMN "quote";
  ALTER TABLE "testimonials" DROP COLUMN "highlight";
  ALTER TABLE "testimonials" DROP COLUMN "context";
  ALTER TABLE "home" DROP COLUMN "eyebrow";
  ALTER TABLE "home" DROP COLUMN "intro";
  ALTER TABLE "home" DROP COLUMN "manifesto";
  ALTER TABLE "home" DROP COLUMN "manifesto_aside";
  ALTER TABLE "home" DROP COLUMN "ritual_title";
  ALTER TABLE "home" DROP COLUMN "ritual_text";
  ALTER TABLE "home" DROP COLUMN "ritual_image_id";
  ALTER TABLE "about_chapters" DROP COLUMN "place";
  ALTER TABLE "about_chapters" DROP COLUMN "text";
  ALTER TABLE "about_credentials" DROP COLUMN "title";
  ALTER TABLE "about" DROP COLUMN "lead";
  ALTER TABLE "about" DROP COLUMN "body";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "offerings_price_options_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "offerings_extras_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "offerings_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "packages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "categories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "testimonials_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_chapters_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_credentials_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "offerings_price_options_locales" CASCADE;
  DROP TABLE "offerings_extras_locales" CASCADE;
  DROP TABLE "offerings_locales" CASCADE;
  DROP TABLE "packages_locales" CASCADE;
  DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "_posts_v_locales" CASCADE;
  DROP TABLE "categories_locales" CASCADE;
  DROP TABLE "testimonials_locales" CASCADE;
  DROP TABLE "home_locales" CASCADE;
  DROP TABLE "about_chapters_locales" CASCADE;
  DROP TABLE "about_credentials_locales" CASCADE;
  DROP TABLE "about_locales" CASCADE;
  DROP INDEX "offerings_highlights_locale_idx";
  DROP INDEX "offerings_itinerary_locale_idx";
  DROP INDEX "offerings_included_locale_idx";
  DROP INDEX "offerings_not_included_locale_idx";
  DROP INDEX "_posts_v_snapshot_idx";
  DROP INDEX "_posts_v_published_locale_idx";
  DROP INDEX "home_headline_locale_idx";
  DROP INDEX "home_pillars_locale_idx";
  ALTER TABLE "offerings_price_options" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "offerings_extras" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "offerings_extras" ADD COLUMN "description" varchar;
  ALTER TABLE "offerings" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "offerings" ADD COLUMN "kicker" varchar;
  ALTER TABLE "offerings" ADD COLUMN "summary" varchar NOT NULL;
  ALTER TABLE "offerings" ADD COLUMN "description" jsonb;
  ALTER TABLE "offerings" ADD COLUMN "price_note" varchar;
  ALTER TABLE "offerings" ADD COLUMN "cancellation_policy" varchar;
  ALTER TABLE "offerings" ADD COLUMN "trip_region" varchar;
  ALTER TABLE "offerings" ADD COLUMN "guide" varchar;
  ALTER TABLE "offerings" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "offerings" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "packages" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "packages" ADD COLUMN "summary" varchar;
  ALTER TABLE "posts" ADD COLUMN "title" varchar;
  ALTER TABLE "posts" ADD COLUMN "excerpt" varchar;
  ALTER TABLE "posts" ADD COLUMN "content" jsonb;
  ALTER TABLE "posts" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "posts" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_excerpt" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_content" jsonb;
  ALTER TABLE "_posts_v" ADD COLUMN "version_seo_title" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_seo_description" varchar;
  ALTER TABLE "categories" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "testimonials" ADD COLUMN "quote" varchar NOT NULL;
  ALTER TABLE "testimonials" ADD COLUMN "highlight" varchar;
  ALTER TABLE "testimonials" ADD COLUMN "context" varchar;
  ALTER TABLE "home" ADD COLUMN "eyebrow" varchar DEFAULT 'Ayurveda · Méditation · Yoga · Sciences védiques';
  ALTER TABLE "home" ADD COLUMN "intro" varchar;
  ALTER TABLE "home" ADD COLUMN "manifesto" varchar;
  ALTER TABLE "home" ADD COLUMN "manifesto_aside" varchar;
  ALTER TABLE "home" ADD COLUMN "ritual_title" varchar;
  ALTER TABLE "home" ADD COLUMN "ritual_text" varchar;
  ALTER TABLE "home" ADD COLUMN "ritual_image_id" integer;
  ALTER TABLE "about_chapters" ADD COLUMN "place" varchar NOT NULL;
  ALTER TABLE "about_chapters" ADD COLUMN "text" varchar NOT NULL;
  ALTER TABLE "about_credentials" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "about" ADD COLUMN "lead" varchar;
  ALTER TABLE "about" ADD COLUMN "body" jsonb;
  ALTER TABLE "home" ADD CONSTRAINT "home_ritual_image_id_media_id_fk" FOREIGN KEY ("ritual_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_ritual_ritual_image_idx" ON "home" USING btree ("ritual_image_id");
  ALTER TABLE "offerings_highlights" DROP COLUMN "_locale";
  ALTER TABLE "offerings_itinerary" DROP COLUMN "_locale";
  ALTER TABLE "offerings_included" DROP COLUMN "_locale";
  ALTER TABLE "offerings_not_included" DROP COLUMN "_locale";
  ALTER TABLE "_posts_v" DROP COLUMN "snapshot";
  ALTER TABLE "_posts_v" DROP COLUMN "published_locale";
  ALTER TABLE "exports" DROP COLUMN "locale";
  ALTER TABLE "home_headline" DROP COLUMN "_locale";
  ALTER TABLE "home_pillars" DROP COLUMN "_locale";
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum__posts_v_published_locale";
  DROP TYPE "public"."enum_exports_locale";`)
}
