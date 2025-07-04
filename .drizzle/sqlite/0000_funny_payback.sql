CREATE TABLE `posts` (
	`id` integer PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`author_id` integer NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `types` (
	`id` integer PRIMARY KEY NOT NULL,
	`integer` integer,
	`integer_boolean` integer,
	`integer_timstamp_ms` integer,
	`integer_timestamp` integer,
	`real` real,
	`text` text,
	`text_enum` text,
	`text_json` text,
	`blob_buffer` blob,
	`blob_json` blob,
	`blob_bigint` blob,
	`numeric` numeric,
	`numeric_num` numeric,
	`numeric_big` numeric
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
