import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "customers_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  ALTER TABLE "customers" ADD COLUMN "reset_password_token" varchar;
  ALTER TABLE "customers" ADD COLUMN "reset_password_expiration" timestamp(3) with time zone;
  ALTER TABLE "customers" ADD COLUMN "salt" varchar;
  ALTER TABLE "customers" ADD COLUMN "hash" varchar;
  ALTER TABLE "customers" ADD COLUMN "reset_password_requested_at" timestamp(3) with time zone;
  ALTER TABLE "customers" ADD COLUMN "_verified" boolean;
  ALTER TABLE "customers" ADD COLUMN "_verificationtoken" varchar;
  ALTER TABLE "customers" ADD COLUMN "login_attempts" numeric DEFAULT 0;
  ALTER TABLE "customers" ADD COLUMN "lock_until" timestamp(3) with time zone;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN "customers_id" integer;
  ALTER TABLE "customers_sessions" ADD CONSTRAINT "customers_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "customers_sessions_order_idx" ON "customers_sessions" USING btree ("_order");
  CREATE INDEX "customers_sessions_parent_id_idx" ON "customers_sessions" USING btree ("_parent_id");
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "customers_email_1_idx" ON "customers" USING btree ("email");
  CREATE INDEX "payload_preferences_rels_customers_id_idx" ON "payload_preferences_rels" USING btree ("customers_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "customers_sessions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "customers_sessions" CASCADE;
  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_customers_fk";
  
  DROP INDEX "customers_email_1_idx";
  DROP INDEX "payload_preferences_rels_customers_id_idx";
  ALTER TABLE "customers" DROP COLUMN "reset_password_token";
  ALTER TABLE "customers" DROP COLUMN "reset_password_expiration";
  ALTER TABLE "customers" DROP COLUMN "salt";
  ALTER TABLE "customers" DROP COLUMN "hash";
  ALTER TABLE "customers" DROP COLUMN "reset_password_requested_at";
  ALTER TABLE "customers" DROP COLUMN "_verified";
  ALTER TABLE "customers" DROP COLUMN "_verificationtoken";
  ALTER TABLE "customers" DROP COLUMN "login_attempts";
  ALTER TABLE "customers" DROP COLUMN "lock_until";
  ALTER TABLE "payload_preferences_rels" DROP COLUMN "customers_id";`)
}
