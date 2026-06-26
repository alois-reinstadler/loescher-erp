CREATE TABLE `companies` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`legal_name` text NOT NULL,
	`address_lines` text NOT NULL,
	`country_code` text NOT NULL,
	`vat_id` text,
	`iban` text,
	`bic` text,
	`email` text,
	`phone` text,
	`branding` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `companies_tenant_slug_unique` ON `companies` (`tenant_id`,`slug`);--> statement-breakpoint
CREATE INDEX `companies_tenant_idx` ON `companies` (`tenant_id`);--> statement-breakpoint
CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);--> statement-breakpoint
ALTER TABLE `customer_invoices` ADD `company_id` text REFERENCES companies(id);--> statement-breakpoint
ALTER TABLE `customer_order_confirmations` ADD `company_id` text REFERENCES companies(id);--> statement-breakpoint
ALTER TABLE `customer_returns` ADD `company_id` text REFERENCES companies(id);--> statement-breakpoint
ALTER TABLE `delivery_notes` ADD `company_id` text REFERENCES companies(id);--> statement-breakpoint
ALTER TABLE `goods_receipts` ADD `company_id` text REFERENCES companies(id);--> statement-breakpoint
ALTER TABLE `import_shipments` ADD `company_id` text REFERENCES companies(id);--> statement-breakpoint
ALTER TABLE `inventory_movements` ADD `company_id` text REFERENCES companies(id);--> statement-breakpoint
ALTER TABLE `packaging_details` ADD `company_id` text REFERENCES companies(id);--> statement-breakpoint
ALTER TABLE `pre_production_samples` ADD `company_id` text REFERENCES companies(id);--> statement-breakpoint
ALTER TABLE `purchase_orders` ADD `company_id` text REFERENCES companies(id);--> statement-breakpoint
ALTER TABLE `quality_inspections` ADD `company_id` text REFERENCES companies(id);--> statement-breakpoint
ALTER TABLE `sales_orders` ADD `company_id` text REFERENCES companies(id);--> statement-breakpoint
ALTER TABLE `sample_requests` ADD `company_id` text REFERENCES companies(id);--> statement-breakpoint
ALTER TABLE `sample_shipments` ADD `company_id` text REFERENCES companies(id);--> statement-breakpoint
ALTER TABLE `shipping_marks` ADD `company_id` text REFERENCES companies(id);--> statement-breakpoint
ALTER TABLE `supplier_artworks` ADD `company_id` text REFERENCES companies(id);--> statement-breakpoint
ALTER TABLE `supplier_invoices` ADD `company_id` text REFERENCES companies(id);--> statement-breakpoint
ALTER TABLE `supplier_payments` ADD `company_id` text REFERENCES companies(id);--> statement-breakpoint
ALTER TABLE `supplier_photo_quotations` ADD `company_id` text REFERENCES companies(id);--> statement-breakpoint
ALTER TABLE `supplier_price_negotiations` ADD `company_id` text REFERENCES companies(id);--> statement-breakpoint
ALTER TABLE `supplier_sales_confirmations` ADD `company_id` text REFERENCES companies(id);--> statement-breakpoint
ALTER TABLE `trade_documents` ADD `company_id` text REFERENCES companies(id);