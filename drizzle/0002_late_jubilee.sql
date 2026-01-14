CREATE TABLE `blood_pressure_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`entryDate` date NOT NULL,
	`measurementTime` timestamp,
	`systolic` int NOT NULL,
	`diastolic` int NOT NULL,
	`pulse` int,
	`position` enum('sitting','standing','lying') DEFAULT 'sitting',
	`arm` enum('left','right') DEFAULT 'left',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blood_pressure_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `body_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`entryDate` date NOT NULL,
	`weight` decimal(5,2),
	`bodyFat` decimal(4,1),
	`visceralFat` int,
	`muscleMass` decimal(5,2),
	`boneMass` decimal(4,2),
	`bodyWater` decimal(4,1),
	`bmi` decimal(4,1),
	`bmr` int,
	`metabolicAge` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `body_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `daily_summaries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`entryDate` date NOT NULL,
	`mood` enum('terrible','bad','okay','good','great'),
	`energyLevel` int,
	`stressLevel` int,
	`goalsAchieved` int,
	`totalGoals` int,
	`gratitude` text,
	`wins` text,
	`challenges` text,
	`tomorrowFocus` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `daily_summaries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nutrition_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`entryDate` date NOT NULL,
	`mealType` enum('breakfast','lunch','dinner','snack'),
	`mealTime` timestamp,
	`description` text,
	`calories` int,
	`protein` decimal(5,1),
	`carbs` decimal(5,1),
	`fat` decimal(5,1),
	`fiber` decimal(5,1),
	`sugar` decimal(5,1),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `nutrition_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sauna_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`entryDate` date NOT NULL,
	`saunaType` enum('finnish','infrared','steam','bio') DEFAULT 'finnish',
	`duration` int NOT NULL,
	`temperature` int,
	`rounds` int DEFAULT 1,
	`coldPlunge` boolean DEFAULT false,
	`coldDuration` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sauna_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sleep_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`entryDate` date NOT NULL,
	`bedTime` timestamp,
	`wakeTime` timestamp,
	`totalSleep` int,
	`deepSleep` int,
	`remSleep` int,
	`lightSleep` int,
	`awakeTime` int,
	`sleepQuality` enum('poor','fair','good','excellent'),
	`sleepScore` int,
	`avgHeartRate` int,
	`minHeartRate` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sleep_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `training_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`entryDate` date NOT NULL,
	`workoutType` varchar(100) NOT NULL,
	`startTime` timestamp,
	`duration` int,
	`caloriesBurned` int,
	`avgHeartRate` int,
	`maxHeartRate` int,
	`distance` decimal(6,2),
	`steps` int,
	`intensity` enum('light','moderate','intense','maximum'),
	`exercises` json,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `training_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `water_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`entryDate` date NOT NULL,
	`entryTime` timestamp,
	`amount` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `water_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `health_entries`;--> statement-breakpoint
ALTER TABLE `services` MODIFY COLUMN `features` json;--> statement-breakpoint
ALTER TABLE `users` ADD `height` int;--> statement-breakpoint
ALTER TABLE `users` ADD `birthDate` date;--> statement-breakpoint
ALTER TABLE `users` ADD `gender` enum('male','female','other');