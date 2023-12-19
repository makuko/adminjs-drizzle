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
	`real` real,
	`bigint` blob,
	`text` text,
	`enum` text,
	`boolean` integer,
	`timestamp` integer,
	`timestamp_ms` integer,
	`buffer` blob,
	`json` blob
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
