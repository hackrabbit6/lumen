ALTER TABLE `user` ADD `role` text DEFAULT 'admin' NOT NULL;--> statement-breakpoint
CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`company` text NOT NULL,
	`contact_name` text NOT NULL,
	`contact_email` text NOT NULL,
	`status` text DEFAULT 'New' NOT NULL,
	`priority` text DEFAULT 'Medium' NOT NULL,
	`owner` text NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`action` text NOT NULL,
	`resource` text NOT NULL,
	`resource_id` text NOT NULL,
	`summary` text NOT NULL,
	`created_at` integer NOT NULL
);
