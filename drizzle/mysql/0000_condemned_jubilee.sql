CREATE TABLE `posts` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`author_id` bigint UNSIGNED NOT NULL);
--> statement-breakpoint
CREATE TABLE `types` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`int` int,
	`tinyint` tinyint,
	`smallint` smallint,
	`mediumint` mediumint,
	`bigint` bigint,
	`real` real,
	`decimal` decimal,
	`double` double,
	`float` float,
	`char` char,
	`varchar` varchar(10),
	`text` text,
	`text_enum` text,
	`enum` enum('lorem','ipsum','dolor'),
	`boolean` boolean,
	`date` date,
	`datetime` datetime,
	`time` time,
	`year` year,
	`timestamp` timestamp,
	`binary` binary,
	`varbinary` varbinary(2),
	`json` json);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`name` text NOT NULL);
--> statement-breakpoint
ALTER TABLE `posts` ADD CONSTRAINT `posts_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;