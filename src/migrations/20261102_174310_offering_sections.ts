import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "offerings_sections_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "offerings_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "offerings_sections_items" ADD CONSTRAINT "offerings_sections_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offerings_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offerings_sections" ADD CONSTRAINT "offerings_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offerings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "offerings_sections_items_order_idx" ON "offerings_sections_items" USING btree ("_order");
  CREATE INDEX "offerings_sections_items_parent_id_idx" ON "offerings_sections_items" USING btree ("_parent_id");
  CREATE INDEX "offerings_sections_items_locale_idx" ON "offerings_sections_items" USING btree ("_locale");
  CREATE INDEX "offerings_sections_order_idx" ON "offerings_sections" USING btree ("_order");
  CREATE INDEX "offerings_sections_parent_id_idx" ON "offerings_sections" USING btree ("_parent_id");
  CREATE INDEX "offerings_sections_locale_idx" ON "offerings_sections" USING btree ("_locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "offerings_sections_items" CASCADE;
  DROP TABLE "offerings_sections" CASCADE;`)
}
