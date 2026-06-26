CREATE TABLE `comments` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`author_user_id` text,
	`body` text NOT NULL,
	`visibility` text DEFAULT 'internal' NOT NULL,
	`edited_at` text,
	`deleted_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `comments_entity_idx` ON `comments` (`tenant_id`,`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `comments_author_idx` ON `comments` (`author_user_id`);--> statement-breakpoint
CREATE INDEX `comments_created_idx` ON `comments` (`tenant_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `customer_price_lists` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`customer_id` text NOT NULL,
	`price_list_id` text NOT NULL,
	`priority` integer DEFAULT 0 NOT NULL,
	`valid_from` text,
	`valid_until` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`price_list_id`) REFERENCES `price_lists`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customer_price_lists_customer_list_unique` ON `customer_price_lists` (`customer_id`,`price_list_id`);--> statement-breakpoint
CREATE INDEX `customer_price_lists_customer_idx` ON `customer_price_lists` (`customer_id`);--> statement-breakpoint
CREATE INDEX `customer_price_lists_price_list_idx` ON `customer_price_lists` (`price_list_id`);--> statement-breakpoint
CREATE TABLE `customer_return_items` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`customer_return_id` text NOT NULL,
	`sales_order_item_id` text,
	`delivery_note_item_id` text,
	`customer_invoice_item_id` text,
	`variant_id` text NOT NULL,
	`quantity_requested` integer NOT NULL,
	`quantity_received` integer DEFAULT 0 NOT NULL,
	`quantity_accepted` integer DEFAULT 0 NOT NULL,
	`condition` text,
	`resolution` text,
	`reason` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`customer_return_id`) REFERENCES `customer_returns`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sales_order_item_id`) REFERENCES `sales_order_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`delivery_note_item_id`) REFERENCES `delivery_note_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customer_invoice_item_id`) REFERENCES `customer_invoice_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `customer_return_items_return_idx` ON `customer_return_items` (`customer_return_id`);--> statement-breakpoint
CREATE INDEX `customer_return_items_variant_idx` ON `customer_return_items` (`variant_id`);--> statement-breakpoint
CREATE TABLE `customer_returns` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`customer_id` text NOT NULL,
	`customer_location_id` text,
	`sales_order_id` text,
	`delivery_note_id` text,
	`customer_invoice_id` text,
	`warehouse_id` text,
	`rma_number` text NOT NULL,
	`status` text DEFAULT 'requested' NOT NULL,
	`reason` text,
	`requested_at` text NOT NULL,
	`authorized_at` text,
	`received_at` text,
	`closed_at` text,
	`refund_amount_cents` integer,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customer_location_id`) REFERENCES `customer_locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sales_order_id`) REFERENCES `sales_orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`delivery_note_id`) REFERENCES `delivery_notes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customer_invoice_id`) REFERENCES `customer_invoices`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customer_returns_tenant_rma_unique` ON `customer_returns` (`tenant_id`,`rma_number`);--> statement-breakpoint
CREATE INDEX `customer_returns_customer_idx` ON `customer_returns` (`customer_id`);--> statement-breakpoint
CREATE INDEX `customer_returns_status_idx` ON `customer_returns` (`tenant_id`,`status`);--> statement-breakpoint
CREATE TABLE `price_list_items` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`price_list_id` text NOT NULL,
	`variant_id` text NOT NULL,
	`min_quantity` integer DEFAULT 1 NOT NULL,
	`unit_price_cents` integer NOT NULL,
	`valid_from` text,
	`valid_until` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`price_list_id`) REFERENCES `price_lists`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `price_list_items_list_variant_qty_unique` ON `price_list_items` (`price_list_id`,`variant_id`,`min_quantity`);--> statement-breakpoint
CREATE INDEX `price_list_items_variant_idx` ON `price_list_items` (`variant_id`);--> statement-breakpoint
CREATE TABLE `price_lists` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`name` text NOT NULL,
	`code` text NOT NULL,
	`currency` text DEFAULT 'EUR' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`valid_from` text,
	`valid_until` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `price_lists_tenant_code_unique` ON `price_lists` (`tenant_id`,`code`);--> statement-breakpoint
CREATE INDEX `price_lists_status_idx` ON `price_lists` (`tenant_id`,`status`);--> statement-breakpoint
CREATE TABLE `quality_inspection_checks` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`quality_inspection_item_id` text NOT NULL,
	`check_type` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`expected_value` text,
	`actual_value` text,
	`defect_quantity` integer,
	`severity` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`quality_inspection_item_id`) REFERENCES `quality_inspection_items`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `quality_inspection_checks_item_idx` ON `quality_inspection_checks` (`quality_inspection_item_id`);--> statement-breakpoint
CREATE INDEX `quality_inspection_checks_type_idx` ON `quality_inspection_checks` (`tenant_id`,`check_type`);--> statement-breakpoint
CREATE TABLE `quality_inspection_items` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`quality_inspection_id` text NOT NULL,
	`purchase_order_item_id` text,
	`goods_receipt_item_id` text,
	`variant_id` text NOT NULL,
	`quantity_inspected` integer,
	`quantity_passed` integer,
	`quantity_failed` integer,
	`result` text,
	`defect_summary` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`quality_inspection_id`) REFERENCES `quality_inspections`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`purchase_order_item_id`) REFERENCES `purchase_order_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`goods_receipt_item_id`) REFERENCES `goods_receipt_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `quality_inspection_items_inspection_idx` ON `quality_inspection_items` (`quality_inspection_id`);--> statement-breakpoint
CREATE INDEX `quality_inspection_items_variant_idx` ON `quality_inspection_items` (`variant_id`);--> statement-breakpoint
CREATE TABLE `quality_inspections` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`inspection_number` text NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'planned' NOT NULL,
	`supplier_id` text,
	`purchase_order_id` text,
	`import_shipment_id` text,
	`goods_receipt_id` text,
	`warehouse_id` text,
	`inspected_by_user_id` text,
	`planned_at` text,
	`started_at` text,
	`completed_at` text,
	`result` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`import_shipment_id`) REFERENCES `import_shipments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`goods_receipt_id`) REFERENCES `goods_receipts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `quality_inspections_tenant_number_unique` ON `quality_inspections` (`tenant_id`,`inspection_number`);--> statement-breakpoint
CREATE INDEX `quality_inspections_status_idx` ON `quality_inspections` (`tenant_id`,`status`);--> statement-breakpoint
CREATE INDEX `quality_inspections_po_idx` ON `quality_inspections` (`purchase_order_id`);--> statement-breakpoint
CREATE INDEX `quality_inspections_receipt_idx` ON `quality_inspections` (`goods_receipt_id`);--> statement-breakpoint
CREATE TABLE `shipment_tracking_events` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`import_shipment_id` text NOT NULL,
	`event_type` text NOT NULL,
	`status` text DEFAULT 'reported' NOT NULL,
	`location` text,
	`port_code` text,
	`eta` text,
	`etd` text,
	`occurred_at` text,
	`reported_at` text NOT NULL,
	`source` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`import_shipment_id`) REFERENCES `import_shipments`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `shipment_tracking_events_shipment_idx` ON `shipment_tracking_events` (`import_shipment_id`);--> statement-breakpoint
CREATE INDEX `shipment_tracking_events_type_idx` ON `shipment_tracking_events` (`tenant_id`,`event_type`);--> statement-breakpoint
CREATE INDEX `shipment_tracking_events_reported_idx` ON `shipment_tracking_events` (`tenant_id`,`reported_at`);--> statement-breakpoint
CREATE TABLE `stock_reservations` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`warehouse_id` text NOT NULL,
	`variant_id` text NOT NULL,
	`sales_order_item_id` text NOT NULL,
	`status` text DEFAULT 'reserved' NOT NULL,
	`quantity_reserved` integer NOT NULL,
	`quantity_released` integer DEFAULT 0 NOT NULL,
	`quantity_fulfilled` integer DEFAULT 0 NOT NULL,
	`reserved_at` text NOT NULL,
	`released_at` text,
	`fulfilled_at` text,
	`created_by_user_id` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`sales_order_item_id`) REFERENCES `sales_order_items`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `stock_reservations_stock_idx` ON `stock_reservations` (`tenant_id`,`warehouse_id`,`variant_id`);--> statement-breakpoint
CREATE INDEX `stock_reservations_sales_order_item_idx` ON `stock_reservations` (`sales_order_item_id`);--> statement-breakpoint
CREATE INDEX `stock_reservations_status_idx` ON `stock_reservations` (`tenant_id`,`status`);--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`entity_type` text,
	`entity_id` text,
	`title` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'open' NOT NULL,
	`priority` text DEFAULT 'normal' NOT NULL,
	`assigned_to_user_id` text,
	`created_by_user_id` text,
	`due_at` text,
	`completed_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `tasks_entity_idx` ON `tasks` (`tenant_id`,`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `tasks_assignee_idx` ON `tasks` (`assigned_to_user_id`,`status`);--> statement-breakpoint
CREATE INDEX `tasks_status_idx` ON `tasks` (`tenant_id`,`status`);--> statement-breakpoint
CREATE INDEX `tasks_due_idx` ON `tasks` (`tenant_id`,`due_at`);