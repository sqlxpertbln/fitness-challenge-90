CREATE TABLE `user_goals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`goalType` enum('weight','water','sleep','training','calories','steps','body_fat') NOT NULL,
	`targetValue` decimal(10,2) NOT NULL,
	`currentValue` decimal(10,2),
	`startValue` decimal(10,2),
	`unit` varchar(20) NOT NULL,
	`startDate` date NOT NULL,
	`targetDate` date,
	`isActive` boolean DEFAULT true,
	`isCompleted` boolean DEFAULT false,
	`completedAt` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_goals_id` PRIMARY KEY(`id`)
);
