CREATE TABLE `blog_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`authorId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`category` enum('update','tips','progress','nutrition','training','mindset') DEFAULT 'update',
	`featuredImageUrl` text,
	`videoUrl` text,
	`published` boolean DEFAULT false,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `health_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`entryDate` date NOT NULL,
	`weight` decimal(5,2),
	`bloodPressureSystolic` int,
	`bloodPressureDiastolic` int,
	`heartRate` int,
	`waterIntake` decimal(4,2),
	`sleepHours` decimal(4,2),
	`sleepQuality` enum('poor','fair','good','excellent'),
	`trainingDone` boolean DEFAULT false,
	`trainingType` varchar(100),
	`trainingDuration` int,
	`trainingNotes` text,
	`saunaVisit` boolean DEFAULT false,
	`saunaDuration` int,
	`notes` text,
	`mood` enum('bad','okay','good','great'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `health_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(50),
	`serviceId` int,
	`message` text NOT NULL,
	`status` enum('new','contacted','closed') DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`features` text,
	`price` decimal(10,2),
	`currency` varchar(3) DEFAULT 'EUR',
	`billingPeriod` enum('once','monthly','yearly') DEFAULT 'once',
	`category` enum('coaching','membership','program') DEFAULT 'program',
	`isActive` boolean DEFAULT true,
	`sortOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `avatarUrl` text;--> statement-breakpoint
ALTER TABLE `users` ADD `challengeStartDate` date;--> statement-breakpoint
ALTER TABLE `users` ADD `targetWeight` decimal(5,2);