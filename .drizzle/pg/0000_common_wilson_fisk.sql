CREATE TYPE "public"."enum" AS ENUM('foo', 'bar', 'baz');--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"author_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "types" (
	"id" serial PRIMARY KEY NOT NULL,
	"integer" integer,
	"smallint" smallint,
	"bigint" bigint,
	"serial" serial NOT NULL,
	"smallserial" "smallserial" NOT NULL,
	"bigserial" bigserial NOT NULL,
	"boolean" boolean,
	"text" text,
	"text_enum" text,
	"varchar" varchar,
	"varchar_enum" varchar,
	"char" char(3),
	"char_enum" char(3),
	"numeric" numeric,
	"numeric_num" numeric,
	"numeric_big" numeric,
	"real" real,
	"double_precision" double precision,
	"json" json,
	"jsonb" jsonb,
	"time" time,
	"timestamp" timestamp,
	"date" date,
	"date_str" date,
	"interval" interval,
	"point" "point",
	"pointObj" "point",
	"line" "line",
	"lineObj" "line",
	"enum" "enum"
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;