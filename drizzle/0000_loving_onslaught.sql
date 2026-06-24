CREATE TABLE `approval_decisions` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`approval_request_id` text NOT NULL,
	`decided_by_user_id` text,
	`decision` text NOT NULL,
	`comment` text,
	`decided_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`approval_request_id`) REFERENCES `approval_requests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `approval_decisions_request_idx` ON `approval_decisions` (`approval_request_id`);--> statement-breakpoint
CREATE TABLE `approval_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`requested_by_user_id` text,
	`assigned_to_user_id` text,
	`due_at` text,
	`resolved_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `approval_requests_entity_idx` ON `approval_requests` (`tenant_id`,`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `approval_requests_assignee_idx` ON `approval_requests` (`assigned_to_user_id`,`status`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`user_id` text,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`before` text,
	`after` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `audit_logs_entity_idx` ON `audit_logs` (`tenant_id`,`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `audit_logs_user_idx` ON `audit_logs` (`user_id`);--> statement-breakpoint
CREATE INDEX `audit_logs_created_idx` ON `audit_logs` (`tenant_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `collections` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `collections_tenant_slug_unique` ON `collections` (`tenant_id`,`slug`);--> statement-breakpoint
CREATE TABLE `customer_invoice_items` (
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
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`customer_invoice_id`) REFERENCES `customer_invoices`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sales_order_item_id`) REFERENCES `sales_order_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`delivery_note_item_id`) REFERENCES `delivery_note_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `customer_invoice_items_invoice_idx` ON `customer_invoice_items` (`customer_invoice_id`);--> statement-breakpoint
CREATE TABLE `customer_invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`customer_id` text NOT NULL,
	`customer_location_id` text,
	`sales_order_id` text,
	`delivery_note_id` text,
	`invoice_number` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`currency` text DEFAULT 'EUR' NOT NULL,
	`issued_at` text,
	`due_at` text,
	`total_net_cents` integer DEFAULT 0 NOT NULL,
	`total_vat_cents` integer DEFAULT 0 NOT NULL,
	`total_gross_cents` integer DEFAULT 0 NOT NULL,
	`file_id` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customer_location_id`) REFERENCES `customer_locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sales_order_id`) REFERENCES `sales_orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`delivery_note_id`) REFERENCES `delivery_notes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customer_invoices_tenant_number_unique` ON `customer_invoices` (`tenant_id`,`invoice_number`);--> statement-breakpoint
CREATE INDEX `customer_invoices_customer_idx` ON `customer_invoices` (`customer_id`);--> statement-breakpoint
CREATE TABLE `customer_locations` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`customer_id` text NOT NULL,
	`name` text NOT NULL,
	`code` text,
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
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customer_locations_customer_code_unique` ON `customer_locations` (`customer_id`,`code`);--> statement-breakpoint
CREATE INDEX `customer_locations_tenant_idx` ON `customer_locations` (`tenant_id`);--> statement-breakpoint
CREATE TABLE `customer_meeting_selections` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`meeting_id` text NOT NULL,
	`quotation_item_id` text,
	`variant_id` text,
	`description` text NOT NULL,
	`target_quantity` integer,
	`target_price_cents` integer,
	`status` text DEFAULT 'selected' NOT NULL,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`meeting_id`) REFERENCES `customer_meetings`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`quotation_item_id`) REFERENCES `supplier_photo_quotation_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `customer_meeting_selections_meeting_idx` ON `customer_meeting_selections` (`meeting_id`);--> statement-breakpoint
CREATE INDEX `customer_meeting_selections_variant_idx` ON `customer_meeting_selections` (`variant_id`);--> statement-breakpoint
CREATE TABLE `customer_meetings` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`customer_id` text NOT NULL,
	`title` text NOT NULL,
	`meeting_at` text NOT NULL,
	`location` text,
	`status` text DEFAULT 'planned' NOT NULL,
	`owner_user_id` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `customer_meetings_customer_idx` ON `customer_meetings` (`customer_id`);--> statement-breakpoint
CREATE TABLE `customer_order_confirmation_items` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`confirmation_id` text NOT NULL,
	`meeting_selection_id` text,
	`variant_id` text,
	`description` text NOT NULL,
	`quantity` integer NOT NULL,
	`unit_price_cents` integer NOT NULL,
	`requested_delivery_at` text,
	`notes` text,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`confirmation_id`) REFERENCES `customer_order_confirmations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`meeting_selection_id`) REFERENCES `customer_meeting_selections`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `customer_order_confirmation_items_confirmation_idx` ON `customer_order_confirmation_items` (`confirmation_id`);--> statement-breakpoint
CREATE INDEX `customer_order_confirmation_items_variant_idx` ON `customer_order_confirmation_items` (`variant_id`);--> statement-breakpoint
CREATE TABLE `customer_order_confirmations` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`customer_id` text NOT NULL,
	`confirmation_number` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`currency` text DEFAULT 'EUR' NOT NULL,
	`issued_at` text,
	`accepted_at` text,
	`valid_until` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customer_order_confirmations_tenant_number_unique` ON `customer_order_confirmations` (`tenant_id`,`confirmation_number`);--> statement-breakpoint
CREATE INDEX `customer_order_confirmations_customer_idx` ON `customer_order_confirmations` (`customer_id`);--> statement-breakpoint
CREATE TABLE `customers` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`name` text NOT NULL,
	`code` text,
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
CREATE UNIQUE INDEX `customers_tenant_code_unique` ON `customers` (`tenant_id`,`code`);--> statement-breakpoint
CREATE INDEX `customers_tenant_idx` ON `customers` (`tenant_id`);--> statement-breakpoint
CREATE TABLE `delivery_note_items` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`delivery_note_id` text NOT NULL,
	`sales_order_item_id` text,
	`variant_id` text NOT NULL,
	`quantity` integer NOT NULL,
	`notes` text,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`delivery_note_id`) REFERENCES `delivery_notes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sales_order_item_id`) REFERENCES `sales_order_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `delivery_note_items_delivery_note_idx` ON `delivery_note_items` (`delivery_note_id`);--> statement-breakpoint
CREATE TABLE `delivery_notes` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`sales_order_id` text NOT NULL,
	`customer_id` text NOT NULL,
	`customer_location_id` text,
	`warehouse_id` text NOT NULL,
	`delivery_note_number` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`picked_at` text,
	`shipped_at` text,
	`carrier` text,
	`tracking_number` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sales_order_id`) REFERENCES `sales_orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customer_location_id`) REFERENCES `customer_locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `delivery_notes_tenant_number_unique` ON `delivery_notes` (`tenant_id`,`delivery_note_number`);--> statement-breakpoint
CREATE INDEX `delivery_notes_sales_order_idx` ON `delivery_notes` (`sales_order_id`);--> statement-breakpoint
CREATE TABLE `file_links` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`file_id` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`link_type` text DEFAULT 'attachment' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `file_links_entity_idx` ON `file_links` (`tenant_id`,`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `file_links_file_idx` ON `file_links` (`file_id`);--> statement-breakpoint
CREATE TABLE `files` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`uploaded_by_user_id` text,
	`storage_key` text NOT NULL,
	`file_name` text NOT NULL,
	`mime_type` text,
	`size_bytes` integer,
	`checksum` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `files_storage_key_unique` ON `files` (`storage_key`);--> statement-breakpoint
CREATE INDEX `files_tenant_idx` ON `files` (`tenant_id`);--> statement-breakpoint
CREATE TABLE `forwarders` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`name` text NOT NULL,
	`code` text,
	`email` text,
	`phone` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `forwarders_tenant_code_unique` ON `forwarders` (`tenant_id`,`code`);--> statement-breakpoint
CREATE TABLE `goods_receipt_items` (
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
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`goods_receipt_id`) REFERENCES `goods_receipts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`purchase_order_item_id`) REFERENCES `purchase_order_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `goods_receipt_items_receipt_idx` ON `goods_receipt_items` (`goods_receipt_id`);--> statement-breakpoint
CREATE TABLE `goods_receipts` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`warehouse_id` text NOT NULL,
	`import_shipment_id` text,
	`purchase_order_id` text,
	`supplier_invoice_id` text,
	`receipt_number` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`received_at` text,
	`checked_by_user_id` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`import_shipment_id`) REFERENCES `import_shipments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`supplier_invoice_id`) REFERENCES `supplier_invoices`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `goods_receipts_tenant_number_unique` ON `goods_receipts` (`tenant_id`,`receipt_number`);--> statement-breakpoint
CREATE INDEX `goods_receipts_po_idx` ON `goods_receipts` (`purchase_order_id`);--> statement-breakpoint
CREATE TABLE `import_shipment_purchase_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`import_shipment_id` text NOT NULL,
	`purchase_order_id` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`import_shipment_id`) REFERENCES `import_shipments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `import_shipment_purchase_orders_unique` ON `import_shipment_purchase_orders` (`import_shipment_id`,`purchase_order_id`);--> statement-breakpoint
CREATE INDEX `import_shipment_purchase_orders_po_idx` ON `import_shipment_purchase_orders` (`purchase_order_id`);--> statement-breakpoint
CREATE TABLE `import_shipments` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`supplier_id` text,
	`forwarder_id` text,
	`shipment_number` text NOT NULL,
	`mode` text NOT NULL,
	`status` text DEFAULT 'booking_pending' NOT NULL,
	`booking_number` text,
	`container_number` text,
	`vessel_name` text,
	`origin_port` text,
	`destination_port` text,
	`etd` text,
	`eta` text,
	`arrived_at` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`forwarder_id`) REFERENCES `forwarders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `import_shipments_tenant_number_unique` ON `import_shipments` (`tenant_id`,`shipment_number`);--> statement-breakpoint
CREATE INDEX `import_shipments_status_idx` ON `import_shipments` (`tenant_id`,`status`);--> statement-breakpoint
CREATE TABLE `inventory_movements` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`warehouse_id` text NOT NULL,
	`variant_id` text NOT NULL,
	`movement_type` text NOT NULL,
	`quantity_delta` integer NOT NULL,
	`source_type` text,
	`source_id` text,
	`occurred_at` text NOT NULL,
	`created_by_user_id` text,
	`notes` text,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `inventory_movements_stock_idx` ON `inventory_movements` (`tenant_id`,`warehouse_id`,`variant_id`);--> statement-breakpoint
CREATE INDEX `inventory_movements_source_idx` ON `inventory_movements` (`source_type`,`source_id`);--> statement-breakpoint
CREATE TABLE `packaging_details` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`purchase_order_id` text NOT NULL,
	`variant_id` text,
	`version` integer DEFAULT 1 NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`details` text,
	`sent_to_supplier_at` text,
	`approved_at` text,
	`file_id` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `packaging_details_po_idx` ON `packaging_details` (`purchase_order_id`);--> statement-breakpoint
CREATE TABLE `pre_production_sample_items` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`pre_production_sample_id` text NOT NULL,
	`purchase_order_item_id` text,
	`variant_id` text,
	`quantity` integer DEFAULT 1 NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`notes` text,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`pre_production_sample_id`) REFERENCES `pre_production_samples`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`purchase_order_item_id`) REFERENCES `purchase_order_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `pre_production_sample_items_sample_idx` ON `pre_production_sample_items` (`pre_production_sample_id`);--> statement-breakpoint
CREATE TABLE `pre_production_samples` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`purchase_order_id` text NOT NULL,
	`status` text DEFAULT 'requested' NOT NULL,
	`requested_at` text,
	`received_at` text,
	`sent_to_customer_at` text,
	`customer_approved_at` text,
	`production_released_at` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pre_production_samples_po_idx` ON `pre_production_samples` (`purchase_order_id`);--> statement-breakpoint
CREATE TABLE `product_variant_images` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`variant_id` text NOT NULL,
	`file_id` text,
	`url` text,
	`type` text DEFAULT 'product' NOT NULL,
	`alt` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `product_variant_images_variant_idx` ON `product_variant_images` (`variant_id`);--> statement-breakpoint
CREATE INDEX `product_variant_images_tenant_idx` ON `product_variant_images` (`tenant_id`);--> statement-breakpoint
CREATE TABLE `product_variant_materials` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`variant_id` text NOT NULL,
	`part` text NOT NULL,
	`material` text NOT NULL,
	`percentage_bps` integer,
	`gsm` integer,
	`notes` text,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `product_variant_materials_variant_idx` ON `product_variant_materials` (`variant_id`);--> statement-breakpoint
CREATE TABLE `product_variants` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`product_id` text NOT NULL,
	`sku` text NOT NULL,
	`ean` text,
	`supplier_article_no` text,
	`color_name` text,
	`color_hex` text,
	`size_label` text,
	`width_mm` integer,
	`length_mm` integer,
	`height_mm` integer,
	`net_weight_g` integer,
	`material_summary` text,
	`customs_tariff_code` text,
	`status` text DEFAULT 'development' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `product_variants_tenant_sku_unique` ON `product_variants` (`tenant_id`,`sku`);--> statement-breakpoint
CREATE INDEX `product_variants_product_idx` ON `product_variants` (`product_id`);--> statement-breakpoint
CREATE INDEX `product_variants_ean_idx` ON `product_variants` (`ean`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`collection_id` text,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`category` text NOT NULL,
	`description` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_tenant_slug_unique` ON `products` (`tenant_id`,`slug`);--> statement-breakpoint
CREATE INDEX `products_collection_idx` ON `products` (`collection_id`);--> statement-breakpoint
CREATE TABLE `purchase_order_item_allocations` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`purchase_order_item_id` text NOT NULL,
	`customer_order_confirmation_item_id` text,
	`quantity` integer NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`purchase_order_item_id`) REFERENCES `purchase_order_items`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`customer_order_confirmation_item_id`) REFERENCES `customer_order_confirmation_items`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `purchase_order_item_allocations_po_item_idx` ON `purchase_order_item_allocations` (`purchase_order_item_id`);--> statement-breakpoint
CREATE TABLE `purchase_order_items` (
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
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `purchase_order_items_po_idx` ON `purchase_order_items` (`purchase_order_id`);--> statement-breakpoint
CREATE INDEX `purchase_order_items_variant_idx` ON `purchase_order_items` (`variant_id`);--> statement-breakpoint
CREATE TABLE `purchase_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`supplier_id` text NOT NULL,
	`purchase_order_number` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`incoterm` text,
	`payment_terms` text,
	`origin_port` text,
	`destination_port` text,
	`ordered_at` text,
	`expected_ship_at` text,
	`expected_arrival_at` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `purchase_orders_tenant_number_unique` ON `purchase_orders` (`tenant_id`,`purchase_order_number`);--> statement-breakpoint
CREATE INDEX `purchase_orders_supplier_idx` ON `purchase_orders` (`supplier_id`);--> statement-breakpoint
CREATE INDEX `purchase_orders_status_idx` ON `purchase_orders` (`tenant_id`,`status`);--> statement-breakpoint
CREATE TABLE `sales_order_items` (
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
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sales_order_id`) REFERENCES `sales_orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`customer_order_confirmation_item_id`) REFERENCES `customer_order_confirmation_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `sales_order_items_order_idx` ON `sales_order_items` (`sales_order_id`);--> statement-breakpoint
CREATE INDEX `sales_order_items_variant_idx` ON `sales_order_items` (`variant_id`);--> statement-breakpoint
CREATE TABLE `sales_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`customer_id` text NOT NULL,
	`customer_location_id` text,
	`customer_order_confirmation_id` text,
	`order_number` text NOT NULL,
	`customer_purchase_order_number` text,
	`status` text DEFAULT 'open' NOT NULL,
	`currency` text DEFAULT 'EUR' NOT NULL,
	`ordered_at` text NOT NULL,
	`requested_delivery_at` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customer_location_id`) REFERENCES `customer_locations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customer_order_confirmation_id`) REFERENCES `customer_order_confirmations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sales_orders_tenant_number_unique` ON `sales_orders` (`tenant_id`,`order_number`);--> statement-breakpoint
CREATE INDEX `sales_orders_customer_idx` ON `sales_orders` (`customer_id`);--> statement-breakpoint
CREATE INDEX `sales_orders_status_idx` ON `sales_orders` (`tenant_id`,`status`);--> statement-breakpoint
CREATE TABLE `sample_request_items` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`sample_request_id` text NOT NULL,
	`quotation_item_id` text,
	`variant_id` text,
	`description` text NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`status` text DEFAULT 'requested' NOT NULL,
	`notes` text,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sample_request_id`) REFERENCES `sample_requests`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`quotation_item_id`) REFERENCES `supplier_photo_quotation_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `sample_request_items_request_idx` ON `sample_request_items` (`sample_request_id`);--> statement-breakpoint
CREATE TABLE `sample_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`supplier_id` text NOT NULL,
	`quotation_id` text,
	`request_number` text,
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
CREATE UNIQUE INDEX `sample_requests_tenant_number_unique` ON `sample_requests` (`tenant_id`,`request_number`);--> statement-breakpoint
CREATE INDEX `sample_requests_supplier_idx` ON `sample_requests` (`supplier_id`);--> statement-breakpoint
CREATE TABLE `sample_shipments` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`sample_request_id` text,
	`direction` text NOT NULL,
	`carrier` text NOT NULL,
	`tracking_number` text,
	`status` text DEFAULT 'created' NOT NULL,
	`supplier_id` text,
	`customer_id` text,
	`customer_location_id` text,
	`shipped_at` text,
	`delivered_at` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sample_request_id`) REFERENCES `sample_requests`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customer_location_id`) REFERENCES `customer_locations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `sample_shipments_request_idx` ON `sample_shipments` (`sample_request_id`);--> statement-breakpoint
CREATE INDEX `sample_shipments_tracking_idx` ON `sample_shipments` (`carrier`,`tracking_number`);--> statement-breakpoint
CREATE TABLE `shipping_marks` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`purchase_order_id` text NOT NULL,
	`status` text DEFAULT 'received' NOT NULL,
	`received_at` text,
	`approved_at` text,
	`file_id` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `shipping_marks_po_idx` ON `shipping_marks` (`purchase_order_id`);--> statement-breakpoint
CREATE TABLE `supplier_artworks` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`purchase_order_id` text NOT NULL,
	`variant_id` text,
	`status` text DEFAULT 'received' NOT NULL,
	`received_at` text,
	`approved_at` text,
	`file_id` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `supplier_artworks_po_idx` ON `supplier_artworks` (`purchase_order_id`);--> statement-breakpoint
CREATE TABLE `supplier_invoice_items` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`supplier_invoice_id` text NOT NULL,
	`purchase_order_item_id` text,
	`variant_id` text,
	`description` text NOT NULL,
	`quantity` integer NOT NULL,
	`unit_cost_cents` integer NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`supplier_invoice_id`) REFERENCES `supplier_invoices`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`purchase_order_item_id`) REFERENCES `purchase_order_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `supplier_invoice_items_invoice_idx` ON `supplier_invoice_items` (`supplier_invoice_id`);--> statement-breakpoint
CREATE TABLE `supplier_invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`supplier_id` text NOT NULL,
	`purchase_order_id` text,
	`import_shipment_id` text,
	`invoice_number` text NOT NULL,
	`status` text DEFAULT 'received' NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`invoice_date` text,
	`due_date` text,
	`total_cents` integer DEFAULT 0 NOT NULL,
	`file_id` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`import_shipment_id`) REFERENCES `import_shipments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `supplier_invoices_supplier_number_unique` ON `supplier_invoices` (`tenant_id`,`supplier_id`,`invoice_number`);--> statement-breakpoint
CREATE INDEX `supplier_invoices_po_idx` ON `supplier_invoices` (`purchase_order_id`);--> statement-breakpoint
CREATE TABLE `supplier_payments` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`supplier_id` text NOT NULL,
	`supplier_invoice_id` text,
	`type` text DEFAULT 'balance' NOT NULL,
	`status` text DEFAULT 'planned' NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`amount_cents` integer NOT NULL,
	`due_at` text,
	`paid_at` text,
	`method` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`supplier_invoice_id`) REFERENCES `supplier_invoices`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `supplier_payments_invoice_idx` ON `supplier_payments` (`supplier_invoice_id`);--> statement-breakpoint
CREATE INDEX `supplier_payments_status_idx` ON `supplier_payments` (`tenant_id`,`status`);--> statement-breakpoint
CREATE TABLE `supplier_photo_quotation_items` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`quotation_id` text NOT NULL,
	`variant_id` text,
	`supplier_article_no` text,
	`description` text NOT NULL,
	`color_name` text,
	`size_label` text,
	`material_summary` text,
	`moq` integer,
	`unit_cost_cents` integer,
	`image_file_id` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`quotation_id`) REFERENCES `supplier_photo_quotations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`image_file_id`) REFERENCES `files`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `supplier_photo_quotation_items_quotation_idx` ON `supplier_photo_quotation_items` (`quotation_id`);--> statement-breakpoint
CREATE INDEX `supplier_photo_quotation_items_variant_idx` ON `supplier_photo_quotation_items` (`variant_id`);--> statement-breakpoint
CREATE TABLE `supplier_photo_quotations` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`supplier_id` text NOT NULL,
	`quote_number` text,
	`status` text DEFAULT 'received' NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`quoted_at` text,
	`valid_until` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `supplier_photo_quotations_supplier_idx` ON `supplier_photo_quotations` (`supplier_id`);--> statement-breakpoint
CREATE INDEX `supplier_photo_quotations_tenant_status_idx` ON `supplier_photo_quotations` (`tenant_id`,`status`);--> statement-breakpoint
CREATE TABLE `supplier_price_negotiation_items` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`negotiation_id` text NOT NULL,
	`variant_id` text,
	`quotation_item_id` text,
	`requested_quantity` integer,
	`target_cost_cents` integer,
	`offered_cost_cents` integer,
	`final_cost_cents` integer,
	`moq` integer,
	`notes` text,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`negotiation_id`) REFERENCES `supplier_price_negotiations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`quotation_item_id`) REFERENCES `supplier_photo_quotation_items`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `supplier_price_negotiation_items_negotiation_idx` ON `supplier_price_negotiation_items` (`negotiation_id`);--> statement-breakpoint
CREATE TABLE `supplier_price_negotiations` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`supplier_id` text NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`started_at` text NOT NULL,
	`closed_at` text,
	`owner_user_id` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `supplier_price_negotiations_supplier_idx` ON `supplier_price_negotiations` (`supplier_id`);--> statement-breakpoint
CREATE TABLE `supplier_sales_confirmations` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`purchase_order_id` text NOT NULL,
	`confirmation_number` text,
	`status` text DEFAULT 'received' NOT NULL,
	`received_at` text,
	`signed_at` text,
	`returned_at` text,
	`file_id` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `supplier_sales_confirmations_po_idx` ON `supplier_sales_confirmations` (`purchase_order_id`);--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`name` text NOT NULL,
	`code` text,
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
CREATE UNIQUE INDEX `suppliers_tenant_code_unique` ON `suppliers` (`tenant_id`,`code`);--> statement-breakpoint
CREATE INDEX `suppliers_tenant_idx` ON `suppliers` (`tenant_id`);--> statement-breakpoint
CREATE TABLE `tenant_memberships` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tenant_memberships_tenant_user_unique` ON `tenant_memberships` (`tenant_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `tenant_memberships_user_idx` ON `tenant_memberships` (`user_id`);--> statement-breakpoint
CREATE TABLE `tenants` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`default_currency` text DEFAULT 'EUR' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tenants_slug_unique` ON `tenants` (`slug`);--> statement-breakpoint
CREATE TABLE `trade_document_checks` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`trade_document_id` text NOT NULL,
	`checked_against_purchase_order_id` text,
	`checked_by_user_id` text,
	`status` text NOT NULL,
	`issues` text,
	`checked_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`trade_document_id`) REFERENCES `trade_documents`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`checked_against_purchase_order_id`) REFERENCES `purchase_orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `trade_document_checks_document_idx` ON `trade_document_checks` (`trade_document_id`);--> statement-breakpoint
CREATE TABLE `trade_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`import_shipment_id` text,
	`purchase_order_id` text,
	`supplier_invoice_id` text,
	`type` text NOT NULL,
	`document_number` text,
	`status` text DEFAULT 'received' NOT NULL,
	`received_at` text,
	`checked_at` text,
	`forwarded_to_forwarder_at` text,
	`file_id` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`import_shipment_id`) REFERENCES `import_shipments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`supplier_invoice_id`) REFERENCES `supplier_invoices`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `trade_documents_shipment_idx` ON `trade_documents` (`import_shipment_id`);--> statement-breakpoint
CREATE INDEX `trade_documents_po_idx` ON `trade_documents` (`purchase_order_id`);--> statement-breakpoint
CREATE INDEX `trade_documents_type_idx` ON `trade_documents` (`tenant_id`,`type`);--> statement-breakpoint
CREATE TABLE `warehouses` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`name` text NOT NULL,
	`code` text NOT NULL,
	`address_line_1` text,
	`postal_code` text,
	`city` text,
	`country_code` text DEFAULT 'AT' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `warehouses_tenant_code_unique` ON `warehouses` (`tenant_id`,`code`);