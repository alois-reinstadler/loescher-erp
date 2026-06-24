CREATE TABLE `exchange_rates` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`from_currency` text NOT NULL,
	`to_currency` text NOT NULL,
	`rate` integer NOT NULL,
	`effective_at` text NOT NULL,
	`source` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `exchange_rates_tenant_idx` ON `exchange_rates` (`tenant_id`);--> statement-breakpoint
CREATE INDEX `exchange_rates_currencies_idx` ON `exchange_rates` (`from_currency`,`to_currency`,`effective_at`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_customer_invoice_items` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`customer_invoice_id` text NOT NULL,
	`sales_order_item_id` text,
	`delivery_note_item_id` text,
	`variant_id` text NOT NULL,
	`description` text NOT NULL,
	`quantity` integer NOT NULL,
	`unit_price_cents` integer NOT NULL,
	`vat_rate_bps` integer DEFAULT 2000 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`customer_invoice_id`) REFERENCES `customer_invoices`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sales_order_item_id`) REFERENCES `sales_order_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`delivery_note_item_id`) REFERENCES `delivery_note_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
INSERT INTO `__new_customer_invoice_items`("id", "tenant_id", "customer_invoice_id", "sales_order_item_id", "delivery_note_item_id", "variant_id", "description", "quantity", "unit_price_cents", "vat_rate_bps", "created_at", "updated_at") SELECT "id", "tenant_id", "customer_invoice_id", "sales_order_item_id", "delivery_note_item_id", "variant_id", "description", "quantity", "unit_price_cents", "vat_rate_bps", datetime('now'), datetime('now') FROM `customer_invoice_items`;--> statement-breakpoint
DROP TABLE `customer_invoice_items`;--> statement-breakpoint
ALTER TABLE `__new_customer_invoice_items` RENAME TO `customer_invoice_items`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `customer_invoice_items_tenant_idx` ON `customer_invoice_items` (`tenant_id`);--> statement-breakpoint
CREATE INDEX `customer_invoice_items_invoice_idx` ON `customer_invoice_items` (`customer_invoice_id`);--> statement-breakpoint
CREATE TABLE `__new_goods_receipt_items` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`goods_receipt_id` text NOT NULL,
	`purchase_order_item_id` text,
	`variant_id` text NOT NULL,
	`quantity_expected` integer,
	`quantity_received` integer NOT NULL,
	`quantity_damaged` integer DEFAULT 0 NOT NULL,
	`quantity_accepted` integer NOT NULL,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`goods_receipt_id`) REFERENCES `goods_receipts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`purchase_order_item_id`) REFERENCES `purchase_order_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
INSERT INTO `__new_goods_receipt_items`("id", "tenant_id", "goods_receipt_id", "purchase_order_item_id", "variant_id", "quantity_expected", "quantity_received", "quantity_damaged", "quantity_accepted", "notes", "created_at", "updated_at") SELECT "id", "tenant_id", "goods_receipt_id", "purchase_order_item_id", "variant_id", "quantity_expected", "quantity_received", "quantity_damaged", "quantity_accepted", "notes", datetime('now'), datetime('now') FROM `goods_receipt_items`;--> statement-breakpoint
DROP TABLE `goods_receipt_items`;--> statement-breakpoint
ALTER TABLE `__new_goods_receipt_items` RENAME TO `goods_receipt_items`;--> statement-breakpoint
CREATE INDEX `goods_receipt_items_tenant_idx` ON `goods_receipt_items` (`tenant_id`);--> statement-breakpoint
CREATE INDEX `goods_receipt_items_receipt_idx` ON `goods_receipt_items` (`goods_receipt_id`);--> statement-breakpoint
CREATE TABLE `__new_purchase_order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`purchase_order_id` text NOT NULL,
	`variant_id` text NOT NULL,
	`supplier_article_no` text,
	`description` text NOT NULL,
	`quantity_ordered` integer NOT NULL,
	`unit_cost_cents` integer NOT NULL,
	`customs_tariff_code` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
INSERT INTO `__new_purchase_order_items`("id", "tenant_id", "purchase_order_id", "variant_id", "supplier_article_no", "description", "quantity_ordered", "unit_cost_cents", "customs_tariff_code", "notes", "created_at", "updated_at") SELECT "id", "tenant_id", "purchase_order_id", "variant_id", "supplier_article_no", "description", "quantity_ordered", "unit_cost_cents", "customs_tariff_code", "notes", datetime('now'), datetime('now') FROM `purchase_order_items`;--> statement-breakpoint
DROP TABLE `purchase_order_items`;--> statement-breakpoint
ALTER TABLE `__new_purchase_order_items` RENAME TO `purchase_order_items`;--> statement-breakpoint
CREATE INDEX `purchase_order_items_tenant_idx` ON `purchase_order_items` (`tenant_id`);--> statement-breakpoint
CREATE INDEX `purchase_order_items_po_idx` ON `purchase_order_items` (`purchase_order_id`);--> statement-breakpoint
CREATE INDEX `purchase_order_items_variant_idx` ON `purchase_order_items` (`variant_id`);--> statement-breakpoint
CREATE TABLE `__new_sales_order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`sales_order_id` text NOT NULL,
	`customer_order_confirmation_item_id` text,
	`variant_id` text NOT NULL,
	`description` text NOT NULL,
	`quantity_ordered` integer NOT NULL,
	`unit_price_cents` integer NOT NULL,
	`vat_rate_bps` integer DEFAULT 2000 NOT NULL,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sales_order_id`) REFERENCES `sales_orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`customer_order_confirmation_item_id`) REFERENCES `customer_order_confirmation_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
INSERT INTO `__new_sales_order_items`("id", "tenant_id", "sales_order_id", "customer_order_confirmation_item_id", "variant_id", "description", "quantity_ordered", "unit_price_cents", "vat_rate_bps", "notes", "created_at", "updated_at") SELECT "id", "tenant_id", "sales_order_id", "customer_order_confirmation_item_id", "variant_id", "description", "quantity_ordered", "unit_price_cents", "vat_rate_bps", "notes", datetime('now'), datetime('now') FROM `sales_order_items`;--> statement-breakpoint
DROP TABLE `sales_order_items`;--> statement-breakpoint
ALTER TABLE `__new_sales_order_items` RENAME TO `sales_order_items`;--> statement-breakpoint
CREATE INDEX `sales_order_items_tenant_idx` ON `sales_order_items` (`tenant_id`);--> statement-breakpoint
CREATE INDEX `sales_order_items_order_idx` ON `sales_order_items` (`sales_order_id`);--> statement-breakpoint
CREATE INDEX `sales_order_items_variant_idx` ON `sales_order_items` (`variant_id`);--> statement-breakpoint
CREATE TABLE `__new_customer_locations` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`customer_id` text NOT NULL,
	`name` text NOT NULL,
	`code` text NOT NULL,
	`type` text DEFAULT 'branch' NOT NULL,
	`country_code` text NOT NULL,
	`address_line_1` text,
	`address_line_2` text,
	`postal_code` text,
	`city` text,
	`email` text,
	`phone` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_customer_locations`("id", "tenant_id", "customer_id", "name", "code", "type", "country_code", "address_line_1", "address_line_2", "postal_code", "city", "email", "phone", "active", "created_at", "updated_at", "deleted_at") SELECT "id", "tenant_id", "customer_id", "name", "code", "type", "country_code", "address_line_1", "address_line_2", "postal_code", "city", "email", "phone", "active", "created_at", "updated_at", NULL FROM `customer_locations`;--> statement-breakpoint
DROP TABLE `customer_locations`;--> statement-breakpoint
ALTER TABLE `__new_customer_locations` RENAME TO `customer_locations`;--> statement-breakpoint
CREATE UNIQUE INDEX `customer_locations_customer_code_unique` ON `customer_locations` (`customer_id`,`code`);--> statement-breakpoint
CREATE INDEX `customer_locations_tenant_idx` ON `customer_locations` (`tenant_id`);--> statement-breakpoint
CREATE TABLE `__new_customers` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`name` text NOT NULL,
	`code` text NOT NULL,
	`country_code` text NOT NULL,
	`default_currency` text DEFAULT 'EUR' NOT NULL,
	`default_payment_terms` text,
	`email` text,
	`phone` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_customers`("id", "tenant_id", "name", "code", "country_code", "default_currency", "default_payment_terms", "email", "phone", "active", "created_at", "updated_at", "deleted_at") SELECT "id", "tenant_id", "name", "code", "country_code", "default_currency", "default_payment_terms", "email", "phone", "active", "created_at", "updated_at", NULL FROM `customers`;--> statement-breakpoint
DROP TABLE `customers`;--> statement-breakpoint
ALTER TABLE `__new_customers` RENAME TO `customers`;--> statement-breakpoint
CREATE UNIQUE INDEX `customers_tenant_code_unique` ON `customers` (`tenant_id`,`code`);--> statement-breakpoint
CREATE INDEX `customers_tenant_idx` ON `customers` (`tenant_id`);--> statement-breakpoint
CREATE TABLE `__new_sample_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`supplier_id` text NOT NULL,
	`quotation_id` text,
	`request_number` text NOT NULL,
	`status` text DEFAULT 'requested' NOT NULL,
	`requested_at` text NOT NULL,
	`needed_by` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`quotation_id`) REFERENCES `supplier_photo_quotations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_sample_requests`("id", "tenant_id", "supplier_id", "quotation_id", "request_number", "status", "requested_at", "needed_by", "notes", "created_at", "updated_at") SELECT "id", "tenant_id", "supplier_id", "quotation_id", "request_number", "status", "requested_at", "needed_by", "notes", "created_at", "updated_at" FROM `sample_requests`;--> statement-breakpoint
DROP TABLE `sample_requests`;--> statement-breakpoint
ALTER TABLE `__new_sample_requests` RENAME TO `sample_requests`;--> statement-breakpoint
CREATE UNIQUE INDEX `sample_requests_tenant_number_unique` ON `sample_requests` (`tenant_id`,`request_number`);--> statement-breakpoint
CREATE INDEX `sample_requests_supplier_idx` ON `sample_requests` (`supplier_id`);--> statement-breakpoint
CREATE TABLE `__new_suppliers` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`name` text NOT NULL,
	`code` text NOT NULL,
	`country_code` text NOT NULL,
	`default_currency` text DEFAULT 'USD' NOT NULL,
	`default_incoterm` text,
	`default_payment_terms` text,
	`email` text,
	`phone` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_suppliers`("id", "tenant_id", "name", "code", "country_code", "default_currency", "default_incoterm", "default_payment_terms", "email", "phone", "active", "created_at", "updated_at", "deleted_at") SELECT "id", "tenant_id", "name", "code", "country_code", "default_currency", "default_incoterm", "default_payment_terms", "email", "phone", "active", "created_at", "updated_at", "deleted_at" FROM `suppliers`;--> statement-breakpoint
DROP TABLE `suppliers`;--> statement-breakpoint
ALTER TABLE `__new_suppliers` RENAME TO `suppliers`;--> statement-breakpoint
CREATE UNIQUE INDEX `suppliers_tenant_code_unique` ON `suppliers` (`tenant_id`,`code`);--> statement-breakpoint
CREATE INDEX `suppliers_tenant_idx` ON `suppliers` (`tenant_id`);--> statement-breakpoint
ALTER TABLE `customer_order_confirmation_items` ADD `created_at` text NOT NULL DEFAULT (datetime('now'));--> statement-breakpoint
ALTER TABLE `customer_order_confirmation_items` ADD `updated_at` text NOT NULL DEFAULT (datetime('now'));--> statement-breakpoint
ALTER TABLE `delivery_note_items` ADD `created_at` text NOT NULL DEFAULT (datetime('now'));--> statement-breakpoint
ALTER TABLE `delivery_note_items` ADD `updated_at` text NOT NULL DEFAULT (datetime('now'));--> statement-breakpoint
CREATE INDEX `delivery_note_items_tenant_idx` ON `delivery_note_items` (`tenant_id`);--> statement-breakpoint
ALTER TABLE `forwarders` ADD `deleted_at` text;--> statement-breakpoint
ALTER TABLE `pre_production_sample_items` ADD `created_at` text NOT NULL DEFAULT (datetime('now'));--> statement-breakpoint
ALTER TABLE `pre_production_sample_items` ADD `updated_at` text NOT NULL DEFAULT (datetime('now'));--> statement-breakpoint
CREATE INDEX `pre_production_sample_items_tenant_idx` ON `pre_production_sample_items` (`tenant_id`);--> statement-breakpoint
ALTER TABLE `product_variant_materials` ADD `created_at` text NOT NULL DEFAULT (datetime('now'));--> statement-breakpoint
ALTER TABLE `product_variant_materials` ADD `updated_at` text NOT NULL DEFAULT (datetime('now'));--> statement-breakpoint
CREATE INDEX `product_variant_materials_tenant_idx` ON `product_variant_materials` (`tenant_id`);--> statement-breakpoint
ALTER TABLE `purchase_order_item_allocations` ADD `updated_at` text NOT NULL DEFAULT (datetime('now'));--> statement-breakpoint
CREATE INDEX `purchase_order_item_allocations_tenant_idx` ON `purchase_order_item_allocations` (`tenant_id`);--> statement-breakpoint
ALTER TABLE `sample_request_items` ADD `created_at` text NOT NULL DEFAULT (datetime('now'));--> statement-breakpoint
ALTER TABLE `sample_request_items` ADD `updated_at` text NOT NULL DEFAULT (datetime('now'));--> statement-breakpoint
CREATE INDEX `sample_request_items_tenant_idx` ON `sample_request_items` (`tenant_id`);--> statement-breakpoint
ALTER TABLE `supplier_invoice_items` ADD `created_at` text NOT NULL DEFAULT (datetime('now'));--> statement-breakpoint
ALTER TABLE `supplier_invoice_items` ADD `updated_at` text NOT NULL DEFAULT (datetime('now'));--> statement-breakpoint
CREATE INDEX `supplier_invoice_items_tenant_idx` ON `supplier_invoice_items` (`tenant_id`);--> statement-breakpoint
ALTER TABLE `warehouses` ADD `deleted_at` text;--> statement-breakpoint
CREATE UNIQUE INDEX `supplier_payments_unique_idx` ON `supplier_payments` (`tenant_id`,`supplier_invoice_id`,`amount_cents`,`paid_at`);