DO $$ BEGIN
 CREATE TYPE "enum" AS ENUM('lorem', 'ipsum', 'dolor');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"author_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "types" (
	"id" serial PRIMARY KEY NOT NULL,
	"serial" serial NOT NULL,
	"smallserial" serial NOT NULL,
	"bigserial" bigserial NOT NULL,
	"integer" integer,
	"smallint" smallint,
	"bigint" bigint,
	"numeric" numeric,
	"real" real,
	"double_precision" double precision,
	"text" text,
	"varchar" varchar,
	"enum" "enum",
	"text_enum" text,
	"varchar_enum" varchar,
	"boolean" boolean,
	"time" time,
	"timestamp" timestamp,
	"date" date,
	"interval" interval,
	"json" json,
	"jsonb" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
