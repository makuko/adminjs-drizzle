CREATE TABLE `posts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`content` text NOT NULL,
	`author_id` bigint UNSIGNED NOT NULL,
	CONSTRAINT `posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `types` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`int` int,
	`tinyint` tinyint,
	`smallint` smallint,
	`mediumint` mediumint,
	`bigint` bigint,
	`bigint_big` bigint,
	`real` real,
	`decimal` decimal,
	`decimal_num` decimal,
	`decimal_big` decimal,
	`double` double,
	`float` float,
	`binary` binary(3),
	`varbinary` varbinary(3),
	`char` char(3),
	`varchar` varchar(3),
	`varchar_enum` varchar(3),
	`text` text,
	`text_enum` text,
	`boolean` boolean,
	`date` date,
	`datetime` datetime,
	`datetime_str` datetime,
	`time` time,
	`year` year,
	`timestamp` timestamp,
	`timestamp_str` timestamp,
	`json` json,
	`enum` enum('foo','bar','baz'),
	CONSTRAINT `types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `posts` ADD CONSTRAINT `posts_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;