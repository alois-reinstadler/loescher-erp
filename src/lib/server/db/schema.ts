import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const tenants = sqliteTable(
	'tenants',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		name: text('name').notNull(),
		slug: text('slug').notNull(),
		defaultCurrency: text('default_currency').notNull().default('EUR'),
		active: integer('active', { mode: 'boolean' }).notNull().default(true),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [uniqueIndex('tenants_slug_unique').on(table.slug)]
);

export const tenantMemberships = sqliteTable(
	'tenant_memberships',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		userId: text('user_id').notNull(),
		role: text('role').notNull().default('member'),
		status: text('status').notNull().default('active'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		uniqueIndex('tenant_memberships_tenant_user_unique').on(table.tenantId, table.userId),
		index('tenant_memberships_user_idx').on(table.userId)
	]
);

export const files = sqliteTable(
	'files',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		uploadedByUserId: text('uploaded_by_user_id'),
		storageKey: text('storage_key').notNull(),
		fileName: text('file_name').notNull(),
		mimeType: text('mime_type'),
		sizeBytes: integer('size_bytes'),
		checksum: text('checksum'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		uniqueIndex('files_storage_key_unique').on(table.storageKey),
		index('files_tenant_idx').on(table.tenantId)
	]
);

export const fileLinks = sqliteTable(
	'file_links',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		fileId: text('file_id')
			.notNull()
			.references(() => files.id, { onDelete: 'cascade' }),
		entityType: text('entity_type').notNull(),
		entityId: text('entity_id').notNull(),
		linkType: text('link_type').notNull().default('attachment'),
		sortOrder: integer('sort_order').notNull().default(0),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		index('file_links_entity_idx').on(table.tenantId, table.entityType, table.entityId),
		index('file_links_file_idx').on(table.fileId)
	]
);

export const suppliers = sqliteTable(
	'suppliers',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		code: text('code').notNull(),
		countryCode: text('country_code').notNull(),
		defaultCurrency: text('default_currency').notNull().default('USD'),
		defaultIncoterm: text('default_incoterm'),
		defaultPaymentTerms: text('default_payment_terms'),
		email: text('email'),
		phone: text('phone'),
		active: integer('active', { mode: 'boolean' }).notNull().default(true),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		deletedAt: text('deleted_at')
	},
	(table) => [
		uniqueIndex('suppliers_tenant_code_unique').on(table.tenantId, table.code),
		index('suppliers_tenant_idx').on(table.tenantId)
	]
);

export const customers = sqliteTable(
	'customers',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		code: text('code').notNull(),
		countryCode: text('country_code').notNull(),
		defaultCurrency: text('default_currency').notNull().default('EUR'),
		defaultPaymentTerms: text('default_payment_terms'),
		email: text('email'),
		phone: text('phone'),
		active: integer('active', { mode: 'boolean' }).notNull().default(true),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		deletedAt: text('deleted_at')
	},
	(table) => [
		uniqueIndex('customers_tenant_code_unique').on(table.tenantId, table.code),
		index('customers_tenant_idx').on(table.tenantId)
	]
);

export const customerLocations = sqliteTable(
	'customer_locations',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		customerId: text('customer_id')
			.notNull()
			.references(() => customers.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		code: text('code').notNull(),
		type: text('type').notNull().default('branch'),
		countryCode: text('country_code').notNull(),
		addressLine1: text('address_line_1'),
		addressLine2: text('address_line_2'),
		postalCode: text('postal_code'),
		city: text('city'),
		email: text('email'),
		phone: text('phone'),
		active: integer('active', { mode: 'boolean' }).notNull().default(true),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		deletedAt: text('deleted_at')
	},
	(table) => [
		uniqueIndex('customer_locations_customer_code_unique').on(table.customerId, table.code),
		index('customer_locations_tenant_idx').on(table.tenantId)
	]
);

export const forwarders = sqliteTable(
	'forwarders',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		code: text('code'),
		email: text('email'),
		phone: text('phone'),
		active: integer('active', { mode: 'boolean' }).notNull().default(true),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		deletedAt: text('deleted_at')
	},
	(table) => [uniqueIndex('forwarders_tenant_code_unique').on(table.tenantId, table.code)]
);

export const collections = sqliteTable(
	'collections',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		slug: text('slug').notNull(),
		description: text('description'),
		active: integer('active', { mode: 'boolean' }).notNull().default(true),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		deletedAt: text('deleted_at')
	},
	(table) => [uniqueIndex('collections_tenant_slug_unique').on(table.tenantId, table.slug)]
);

export const products = sqliteTable(
	'products',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		collectionId: text('collection_id').references(() => collections.id),
		name: text('name').notNull(),
		slug: text('slug').notNull(),
		category: text('category').notNull(),
		description: text('description'),
		active: integer('active', { mode: 'boolean' }).notNull().default(true),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		deletedAt: text('deleted_at')
	},
	(table) => [
		uniqueIndex('products_tenant_slug_unique').on(table.tenantId, table.slug),
		index('products_collection_idx').on(table.collectionId)
	]
);

export const productVariants = sqliteTable(
	'product_variants',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		productId: text('product_id')
			.notNull()
			.references(() => products.id, { onDelete: 'cascade' }),
		sku: text('sku').notNull(),
		ean: text('ean'),
		supplierArticleNo: text('supplier_article_no'),
		colorName: text('color_name'),
		colorHex: text('color_hex'),
		sizeLabel: text('size_label'),
		widthMm: integer('width_mm'),
		lengthMm: integer('length_mm'),
		heightMm: integer('height_mm'),
		netWeightG: integer('net_weight_g'),
		materialSummary: text('material_summary'),
		customsTariffCode: text('customs_tariff_code'),
		status: text('status').notNull().default('development'),
		active: integer('active', { mode: 'boolean' }).notNull().default(true),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		deletedAt: text('deleted_at')
	},
	(table) => [
		uniqueIndex('product_variants_tenant_sku_unique').on(table.tenantId, table.sku),
		index('product_variants_product_idx').on(table.productId),
		index('product_variants_ean_idx').on(table.ean)
	]
);

export const productVariantImages = sqliteTable(
	'product_variant_images',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		variantId: text('variant_id')
			.notNull()
			.references(() => productVariants.id, { onDelete: 'cascade' }),
		fileId: text('file_id').references(() => files.id),
		url: text('url'),
		type: text('type').notNull().default('product'),
		alt: text('alt'),
		sortOrder: integer('sort_order').notNull().default(0),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		index('product_variant_images_variant_idx').on(table.variantId),
		index('product_variant_images_tenant_idx').on(table.tenantId)
	]
);

export const productVariantMaterials = sqliteTable(
	'product_variant_materials',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		variantId: text('variant_id')
			.notNull()
			.references(() => productVariants.id, { onDelete: 'cascade' }),
		part: text('part').notNull(),
		material: text('material').notNull(),
		percentageBps: integer('percentage_bps'),
		gsm: integer('gsm'),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		index('product_variant_materials_tenant_idx').on(table.tenantId),
		index('product_variant_materials_variant_idx').on(table.variantId)
	]
);

export const supplierPhotoQuotations = sqliteTable(
	'supplier_photo_quotations',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		supplierId: text('supplier_id')
			.notNull()
			.references(() => suppliers.id),
		quoteNumber: text('quote_number'),
		status: text('status').notNull().default('received'),
		currency: text('currency').notNull().default('USD'),
		quotedAt: text('quoted_at'),
		validUntil: text('valid_until'),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		index('supplier_photo_quotations_supplier_idx').on(table.supplierId),
		index('supplier_photo_quotations_tenant_status_idx').on(table.tenantId, table.status)
	]
);

export const supplierPhotoQuotationItems = sqliteTable(
	'supplier_photo_quotation_items',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		quotationId: text('quotation_id')
			.notNull()
			.references(() => supplierPhotoQuotations.id, { onDelete: 'cascade' }),
		variantId: text('variant_id').references(() => productVariants.id),
		supplierArticleNo: text('supplier_article_no'),
		description: text('description').notNull(),
		colorName: text('color_name'),
		sizeLabel: text('size_label'),
		materialSummary: text('material_summary'),
		moq: integer('moq'),
		unitCostCents: integer('unit_cost_cents'),
		imageFileId: text('image_file_id').references(() => files.id),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		index('supplier_photo_quotation_items_quotation_idx').on(table.quotationId),
		index('supplier_photo_quotation_items_variant_idx').on(table.variantId)
	]
);

export const sampleRequests = sqliteTable(
	'sample_requests',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		supplierId: text('supplier_id')
			.notNull()
			.references(() => suppliers.id),
		quotationId: text('quotation_id').references(() => supplierPhotoQuotations.id),
		requestNumber: text('request_number').notNull(),
		status: text('status').notNull().default('requested'),
		requestedAt: text('requested_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		neededBy: text('needed_by'),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		uniqueIndex('sample_requests_tenant_number_unique').on(table.tenantId, table.requestNumber),
		index('sample_requests_supplier_idx').on(table.supplierId)
	]
);

export const sampleRequestItems = sqliteTable(
	'sample_request_items',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		sampleRequestId: text('sample_request_id')
			.notNull()
			.references(() => sampleRequests.id, { onDelete: 'cascade' }),
		quotationItemId: text('quotation_item_id').references(() => supplierPhotoQuotationItems.id),
		variantId: text('variant_id').references(() => productVariants.id),
		description: text('description').notNull(),
		quantity: integer('quantity').notNull().default(1),
		status: text('status').notNull().default('requested'),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		index('sample_request_items_tenant_idx').on(table.tenantId),
		index('sample_request_items_request_idx').on(table.sampleRequestId)
	]
);

export const sampleShipments = sqliteTable(
	'sample_shipments',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		sampleRequestId: text('sample_request_id').references(() => sampleRequests.id),
		direction: text('direction').notNull(),
		carrier: text('carrier').notNull(),
		trackingNumber: text('tracking_number'),
		status: text('status').notNull().default('created'),
		supplierId: text('supplier_id').references(() => suppliers.id),
		customerId: text('customer_id').references(() => customers.id),
		customerLocationId: text('customer_location_id').references(() => customerLocations.id),
		shippedAt: text('shipped_at'),
		deliveredAt: text('delivered_at'),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		index('sample_shipments_request_idx').on(table.sampleRequestId),
		index('sample_shipments_tracking_idx').on(table.carrier, table.trackingNumber)
	]
);

export const customerMeetings = sqliteTable(
	'customer_meetings',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		customerId: text('customer_id')
			.notNull()
			.references(() => customers.id),
		title: text('title').notNull(),
		meetingAt: text('meeting_at').notNull(),
		location: text('location'),
		status: text('status').notNull().default('planned'),
		ownerUserId: text('owner_user_id'),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [index('customer_meetings_customer_idx').on(table.customerId)]
);

export const customerMeetingSelections = sqliteTable(
	'customer_meeting_selections',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		meetingId: text('meeting_id')
			.notNull()
			.references(() => customerMeetings.id, { onDelete: 'cascade' }),
		quotationItemId: text('quotation_item_id').references(() => supplierPhotoQuotationItems.id),
		variantId: text('variant_id').references(() => productVariants.id),
		description: text('description').notNull(),
		targetQuantity: integer('target_quantity'),
		targetPriceCents: integer('target_price_cents'),
		status: text('status').notNull().default('selected'),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		index('customer_meeting_selections_meeting_idx').on(table.meetingId),
		index('customer_meeting_selections_variant_idx').on(table.variantId)
	]
);

export const customerOrderConfirmations = sqliteTable(
	'customer_order_confirmations',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		customerId: text('customer_id')
			.notNull()
			.references(() => customers.id),
		confirmationNumber: text('confirmation_number').notNull(),
		status: text('status').notNull().default('draft'),
		currency: text('currency').notNull().default('EUR'),
		issuedAt: text('issued_at'),
		acceptedAt: text('accepted_at'),
		validUntil: text('valid_until'),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		uniqueIndex('customer_order_confirmations_tenant_number_unique').on(
			table.tenantId,
			table.confirmationNumber
		),
		index('customer_order_confirmations_customer_idx').on(table.customerId)
	]
);

export const customerOrderConfirmationItems = sqliteTable(
	'customer_order_confirmation_items',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		confirmationId: text('confirmation_id')
			.notNull()
			.references(() => customerOrderConfirmations.id, { onDelete: 'cascade' }),
		meetingSelectionId: text('meeting_selection_id').references(() => customerMeetingSelections.id),
		variantId: text('variant_id').references(() => productVariants.id),
		description: text('description').notNull(),
		quantity: integer('quantity').notNull(),
		unitPriceCents: integer('unit_price_cents').notNull(),
		requestedDeliveryAt: text('requested_delivery_at'),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		index('customer_order_confirmation_items_confirmation_idx').on(table.confirmationId),
		index('customer_order_confirmation_items_variant_idx').on(table.variantId)
	]
);

export const supplierPriceNegotiations = sqliteTable(
	'supplier_price_negotiations',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		supplierId: text('supplier_id')
			.notNull()
			.references(() => suppliers.id),
		status: text('status').notNull().default('open'),
		startedAt: text('started_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		closedAt: text('closed_at'),
		ownerUserId: text('owner_user_id'),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [index('supplier_price_negotiations_supplier_idx').on(table.supplierId)]
);

export const supplierPriceNegotiationItems = sqliteTable(
	'supplier_price_negotiation_items',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		negotiationId: text('negotiation_id')
			.notNull()
			.references(() => supplierPriceNegotiations.id, { onDelete: 'cascade' }),
		variantId: text('variant_id').references(() => productVariants.id),
		quotationItemId: text('quotation_item_id').references(() => supplierPhotoQuotationItems.id),
		requestedQuantity: integer('requested_quantity'),
		targetCostCents: integer('target_cost_cents'),
		offeredCostCents: integer('offered_cost_cents'),
		finalCostCents: integer('final_cost_cents'),
		moq: integer('moq'),
		notes: text('notes')
	},
	(table) => [index('supplier_price_negotiation_items_negotiation_idx').on(table.negotiationId)]
);

export const purchaseOrders = sqliteTable(
	'purchase_orders',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		supplierId: text('supplier_id')
			.notNull()
			.references(() => suppliers.id),
		purchaseOrderNumber: text('purchase_order_number').notNull(),
		status: text('status').notNull().default('draft'),
		currency: text('currency').notNull().default('USD'),
		incoterm: text('incoterm'),
		paymentTerms: text('payment_terms'),
		originPort: text('origin_port'),
		destinationPort: text('destination_port'),
		orderedAt: text('ordered_at'),
		expectedShipAt: text('expected_ship_at'),
		expectedArrivalAt: text('expected_arrival_at'),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		uniqueIndex('purchase_orders_tenant_number_unique').on(
			table.tenantId,
			table.purchaseOrderNumber
		),
		index('purchase_orders_supplier_idx').on(table.supplierId),
		index('purchase_orders_status_idx').on(table.tenantId, table.status)
	]
);

export const purchaseOrderItems = sqliteTable(
	'purchase_order_items',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		purchaseOrderId: text('purchase_order_id')
			.notNull()
			.references(() => purchaseOrders.id, { onDelete: 'cascade' }),
		variantId: text('variant_id')
			.notNull()
			.references(() => productVariants.id, { onDelete: 'restrict' }),
		supplierArticleNo: text('supplier_article_no'),
		description: text('description').notNull(),
		quantityOrdered: integer('quantity_ordered').notNull(),
		unitCostCents: integer('unit_cost_cents').notNull(),
		customsTariffCode: text('customs_tariff_code'),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		index('purchase_order_items_tenant_idx').on(table.tenantId),
		index('purchase_order_items_po_idx').on(table.purchaseOrderId),
		index('purchase_order_items_variant_idx').on(table.variantId)
	]
);

export const purchaseOrderItemAllocations = sqliteTable(
	'purchase_order_item_allocations',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		purchaseOrderItemId: text('purchase_order_item_id')
			.notNull()
			.references(() => purchaseOrderItems.id, { onDelete: 'cascade' }),
		customerOrderConfirmationItemId: text('customer_order_confirmation_item_id').references(
			() => customerOrderConfirmationItems.id
		),
		quantity: integer('quantity').notNull(),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		index('purchase_order_item_allocations_tenant_idx').on(table.tenantId),
		index('purchase_order_item_allocations_po_item_idx').on(table.purchaseOrderItemId)
	]
);

export const supplierSalesConfirmations = sqliteTable(
	'supplier_sales_confirmations',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		purchaseOrderId: text('purchase_order_id')
			.notNull()
			.references(() => purchaseOrders.id, { onDelete: 'cascade' }),
		confirmationNumber: text('confirmation_number'),
		status: text('status').notNull().default('received'),
		receivedAt: text('received_at'),
		signedAt: text('signed_at'),
		returnedAt: text('returned_at'),
		fileId: text('file_id').references(() => files.id),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [index('supplier_sales_confirmations_po_idx').on(table.purchaseOrderId)]
);

export const preProductionSamples = sqliteTable(
	'pre_production_samples',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		purchaseOrderId: text('purchase_order_id')
			.notNull()
			.references(() => purchaseOrders.id, { onDelete: 'cascade' }),
		status: text('status').notNull().default('requested'),
		requestedAt: text('requested_at'),
		receivedAt: text('received_at'),
		sentToCustomerAt: text('sent_to_customer_at'),
		customerApprovedAt: text('customer_approved_at'),
		productionReleasedAt: text('production_released_at'),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [index('pre_production_samples_po_idx').on(table.purchaseOrderId)]
);

export const preProductionSampleItems = sqliteTable(
	'pre_production_sample_items',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		preProductionSampleId: text('pre_production_sample_id')
			.notNull()
			.references(() => preProductionSamples.id, { onDelete: 'cascade' }),
		purchaseOrderItemId: text('purchase_order_item_id').references(() => purchaseOrderItems.id),
		variantId: text('variant_id').references(() => productVariants.id),
		quantity: integer('quantity').notNull().default(1),
		status: text('status').notNull().default('pending'),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		index('pre_production_sample_items_tenant_idx').on(table.tenantId),
		index('pre_production_sample_items_sample_idx').on(table.preProductionSampleId)
	]
);

export const packagingDetails = sqliteTable(
	'packaging_details',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		purchaseOrderId: text('purchase_order_id')
			.notNull()
			.references(() => purchaseOrders.id, { onDelete: 'cascade' }),
		variantId: text('variant_id').references(() => productVariants.id),
		version: integer('version').notNull().default(1),
		status: text('status').notNull().default('draft'),
		details: text('details', { mode: 'json' }),
		sentToSupplierAt: text('sent_to_supplier_at'),
		approvedAt: text('approved_at'),
		fileId: text('file_id').references(() => files.id),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [index('packaging_details_po_idx').on(table.purchaseOrderId)]
);

export const supplierArtworks = sqliteTable(
	'supplier_artworks',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		purchaseOrderId: text('purchase_order_id')
			.notNull()
			.references(() => purchaseOrders.id, { onDelete: 'cascade' }),
		variantId: text('variant_id').references(() => productVariants.id),
		status: text('status').notNull().default('received'),
		receivedAt: text('received_at'),
		approvedAt: text('approved_at'),
		fileId: text('file_id').references(() => files.id),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [index('supplier_artworks_po_idx').on(table.purchaseOrderId)]
);

export const shippingMarks = sqliteTable(
	'shipping_marks',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		purchaseOrderId: text('purchase_order_id')
			.notNull()
			.references(() => purchaseOrders.id, { onDelete: 'cascade' }),
		status: text('status').notNull().default('received'),
		receivedAt: text('received_at'),
		approvedAt: text('approved_at'),
		fileId: text('file_id').references(() => files.id),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [index('shipping_marks_po_idx').on(table.purchaseOrderId)]
);

export const importShipments = sqliteTable(
	'import_shipments',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		supplierId: text('supplier_id').references(() => suppliers.id),
		forwarderId: text('forwarder_id').references(() => forwarders.id),
		shipmentNumber: text('shipment_number').notNull(),
		mode: text('mode').notNull(),
		status: text('status').notNull().default('booking_pending'),
		bookingNumber: text('booking_number'),
		containerNumber: text('container_number'),
		vesselName: text('vessel_name'),
		originPort: text('origin_port'),
		destinationPort: text('destination_port'),
		etd: text('etd'),
		eta: text('eta'),
		arrivedAt: text('arrived_at'),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		uniqueIndex('import_shipments_tenant_number_unique').on(table.tenantId, table.shipmentNumber),
		index('import_shipments_status_idx').on(table.tenantId, table.status)
	]
);

export const importShipmentPurchaseOrders = sqliteTable(
	'import_shipment_purchase_orders',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		importShipmentId: text('import_shipment_id')
			.notNull()
			.references(() => importShipments.id, { onDelete: 'cascade' }),
		purchaseOrderId: text('purchase_order_id')
			.notNull()
			.references(() => purchaseOrders.id, { onDelete: 'cascade' })
	},
	(table) => [
		uniqueIndex('import_shipment_purchase_orders_unique').on(
			table.importShipmentId,
			table.purchaseOrderId
		),
		index('import_shipment_purchase_orders_po_idx').on(table.purchaseOrderId)
	]
);

export const supplierInvoices = sqliteTable(
	'supplier_invoices',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		supplierId: text('supplier_id')
			.notNull()
			.references(() => suppliers.id),
		purchaseOrderId: text('purchase_order_id').references(() => purchaseOrders.id),
		importShipmentId: text('import_shipment_id').references(() => importShipments.id),
		invoiceNumber: text('invoice_number').notNull(),
		status: text('status').notNull().default('received'),
		currency: text('currency').notNull().default('USD'),
		invoiceDate: text('invoice_date'),
		dueDate: text('due_date'),
		totalCents: integer('total_cents').notNull().default(0),
		fileId: text('file_id').references(() => files.id),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		uniqueIndex('supplier_invoices_supplier_number_unique').on(
			table.tenantId,
			table.supplierId,
			table.invoiceNumber
		),
		index('supplier_invoices_po_idx').on(table.purchaseOrderId)
	]
);

export const supplierInvoiceItems = sqliteTable(
	'supplier_invoice_items',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		supplierInvoiceId: text('supplier_invoice_id')
			.notNull()
			.references(() => supplierInvoices.id, { onDelete: 'cascade' }),
		purchaseOrderItemId: text('purchase_order_item_id').references(() => purchaseOrderItems.id),
		variantId: text('variant_id').references(() => productVariants.id),
		description: text('description').notNull(),
		quantity: integer('quantity').notNull(),
		unitCostCents: integer('unit_cost_cents').notNull(),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		index('supplier_invoice_items_tenant_idx').on(table.tenantId),
		index('supplier_invoice_items_invoice_idx').on(table.supplierInvoiceId)
	]
);

export const tradeDocuments = sqliteTable(
	'trade_documents',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		importShipmentId: text('import_shipment_id').references(() => importShipments.id),
		purchaseOrderId: text('purchase_order_id').references(() => purchaseOrders.id),
		supplierInvoiceId: text('supplier_invoice_id').references(() => supplierInvoices.id),
		type: text('type').notNull(),
		documentNumber: text('document_number'),
		status: text('status').notNull().default('received'),
		receivedAt: text('received_at'),
		checkedAt: text('checked_at'),
		forwardedToForwarderAt: text('forwarded_to_forwarder_at'),
		fileId: text('file_id').references(() => files.id),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		index('trade_documents_shipment_idx').on(table.importShipmentId),
		index('trade_documents_po_idx').on(table.purchaseOrderId),
		index('trade_documents_type_idx').on(table.tenantId, table.type)
	]
);

export const tradeDocumentChecks = sqliteTable(
	'trade_document_checks',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		tradeDocumentId: text('trade_document_id')
			.notNull()
			.references(() => tradeDocuments.id, { onDelete: 'cascade' }),
		checkedAgainstPurchaseOrderId: text('checked_against_purchase_order_id').references(
			() => purchaseOrders.id
		),
		checkedByUserId: text('checked_by_user_id'),
		status: text('status').notNull(),
		issues: text('issues', { mode: 'json' }),
		checkedAt: text('checked_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [index('trade_document_checks_document_idx').on(table.tradeDocumentId)]
);

export const supplierPayments = sqliteTable(
	'supplier_payments',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		supplierId: text('supplier_id')
			.notNull()
			.references(() => suppliers.id),
		supplierInvoiceId: text('supplier_invoice_id').references(() => supplierInvoices.id),
		type: text('type').notNull().default('balance'),
		status: text('status').notNull().default('planned'),
		currency: text('currency').notNull().default('USD'),
		amountCents: integer('amount_cents').notNull(),
		dueAt: text('due_at'),
		paidAt: text('paid_at'),
		method: text('method'),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		uniqueIndex('supplier_payments_unique_idx').on(
			table.tenantId,
			table.supplierInvoiceId,
			table.amountCents,
			table.paidAt
		),
		index('supplier_payments_invoice_idx').on(table.supplierInvoiceId),
		index('supplier_payments_status_idx').on(table.tenantId, table.status)
	]
);

export const warehouses = sqliteTable(
	'warehouses',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		code: text('code').notNull(),
		addressLine1: text('address_line_1'),
		postalCode: text('postal_code'),
		city: text('city'),
		countryCode: text('country_code').notNull().default('AT'),
		active: integer('active', { mode: 'boolean' }).notNull().default(true),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		deletedAt: text('deleted_at')
	},
	(table) => [uniqueIndex('warehouses_tenant_code_unique').on(table.tenantId, table.code)]
);

export const goodsReceipts = sqliteTable(
	'goods_receipts',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		warehouseId: text('warehouse_id')
			.notNull()
			.references(() => warehouses.id),
		importShipmentId: text('import_shipment_id').references(() => importShipments.id),
		purchaseOrderId: text('purchase_order_id').references(() => purchaseOrders.id),
		supplierInvoiceId: text('supplier_invoice_id').references(() => supplierInvoices.id),
		receiptNumber: text('receipt_number').notNull(),
		status: text('status').notNull().default('draft'),
		receivedAt: text('received_at'),
		checkedByUserId: text('checked_by_user_id'),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		uniqueIndex('goods_receipts_tenant_number_unique').on(table.tenantId, table.receiptNumber),
		index('goods_receipts_po_idx').on(table.purchaseOrderId)
	]
);

export const goodsReceiptItems = sqliteTable(
	'goods_receipt_items',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		goodsReceiptId: text('goods_receipt_id')
			.notNull()
			.references(() => goodsReceipts.id, { onDelete: 'cascade' }),
		purchaseOrderItemId: text('purchase_order_item_id').references(() => purchaseOrderItems.id),
		variantId: text('variant_id')
			.notNull()
			.references(() => productVariants.id, { onDelete: 'restrict' }),
		quantityExpected: integer('quantity_expected'),
		quantityReceived: integer('quantity_received').notNull(),
		quantityDamaged: integer('quantity_damaged').notNull().default(0),
		quantityAccepted: integer('quantity_accepted').notNull(),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		index('goods_receipt_items_tenant_idx').on(table.tenantId),
		index('goods_receipt_items_receipt_idx').on(table.goodsReceiptId)
	]
);

export const inventoryMovements = sqliteTable(
	'inventory_movements',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		warehouseId: text('warehouse_id')
			.notNull()
			.references(() => warehouses.id),
		variantId: text('variant_id')
			.notNull()
			.references(() => productVariants.id),
		movementType: text('movement_type').notNull(),
		quantityDelta: integer('quantity_delta').notNull(),
		sourceType: text('source_type'),
		sourceId: text('source_id'),
		occurredAt: text('occurred_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		createdByUserId: text('created_by_user_id'),
		notes: text('notes')
	},
	(table) => [
		index('inventory_movements_stock_idx').on(table.tenantId, table.warehouseId, table.variantId),
		index('inventory_movements_source_idx').on(table.sourceType, table.sourceId)
	]
);

export const salesOrders = sqliteTable(
	'sales_orders',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		customerId: text('customer_id')
			.notNull()
			.references(() => customers.id),
		customerLocationId: text('customer_location_id').references(() => customerLocations.id),
		customerOrderConfirmationId: text('customer_order_confirmation_id').references(
			() => customerOrderConfirmations.id
		),
		orderNumber: text('order_number').notNull(),
		customerPurchaseOrderNumber: text('customer_purchase_order_number'),
		status: text('status').notNull().default('open'),
		currency: text('currency').notNull().default('EUR'),
		orderedAt: text('ordered_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		requestedDeliveryAt: text('requested_delivery_at'),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		uniqueIndex('sales_orders_tenant_number_unique').on(table.tenantId, table.orderNumber),
		index('sales_orders_customer_idx').on(table.customerId),
		index('sales_orders_status_idx').on(table.tenantId, table.status)
	]
);

export const salesOrderItems = sqliteTable(
	'sales_order_items',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		salesOrderId: text('sales_order_id')
			.notNull()
			.references(() => salesOrders.id, { onDelete: 'cascade' }),
		customerOrderConfirmationItemId: text('customer_order_confirmation_item_id').references(
			() => customerOrderConfirmationItems.id
		),
		variantId: text('variant_id')
			.notNull()
			.references(() => productVariants.id, { onDelete: 'restrict' }),
		description: text('description').notNull(),
		quantityOrdered: integer('quantity_ordered').notNull(),
		unitPriceCents: integer('unit_price_cents').notNull(),
		vatRateBps: integer('vat_rate_bps').notNull().default(2000),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		index('sales_order_items_tenant_idx').on(table.tenantId),
		index('sales_order_items_order_idx').on(table.salesOrderId),
		index('sales_order_items_variant_idx').on(table.variantId)
	]
);

export const deliveryNotes = sqliteTable(
	'delivery_notes',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		salesOrderId: text('sales_order_id')
			.notNull()
			.references(() => salesOrders.id),
		customerId: text('customer_id')
			.notNull()
			.references(() => customers.id),
		customerLocationId: text('customer_location_id').references(() => customerLocations.id),
		warehouseId: text('warehouse_id')
			.notNull()
			.references(() => warehouses.id),
		deliveryNoteNumber: text('delivery_note_number').notNull(),
		status: text('status').notNull().default('draft'),
		pickedAt: text('picked_at'),
		shippedAt: text('shipped_at'),
		carrier: text('carrier'),
		trackingNumber: text('tracking_number'),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		uniqueIndex('delivery_notes_tenant_number_unique').on(table.tenantId, table.deliveryNoteNumber),
		index('delivery_notes_sales_order_idx').on(table.salesOrderId)
	]
);

export const deliveryNoteItems = sqliteTable(
	'delivery_note_items',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		deliveryNoteId: text('delivery_note_id')
			.notNull()
			.references(() => deliveryNotes.id, { onDelete: 'cascade' }),
		salesOrderItemId: text('sales_order_item_id').references(() => salesOrderItems.id),
		variantId: text('variant_id')
			.notNull()
			.references(() => productVariants.id),
		quantity: integer('quantity').notNull(),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		index('delivery_note_items_tenant_idx').on(table.tenantId),
		index('delivery_note_items_delivery_note_idx').on(table.deliveryNoteId)
	]
);

export const customerInvoices = sqliteTable(
	'customer_invoices',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		customerId: text('customer_id')
			.notNull()
			.references(() => customers.id),
		customerLocationId: text('customer_location_id').references(() => customerLocations.id),
		salesOrderId: text('sales_order_id').references(() => salesOrders.id),
		deliveryNoteId: text('delivery_note_id').references(() => deliveryNotes.id),
		invoiceNumber: text('invoice_number').notNull(),
		status: text('status').notNull().default('draft'),
		currency: text('currency').notNull().default('EUR'),
		issuedAt: text('issued_at'),
		dueAt: text('due_at'),
		totalNetCents: integer('total_net_cents').notNull().default(0),
		totalVatCents: integer('total_vat_cents').notNull().default(0),
		totalGrossCents: integer('total_gross_cents').notNull().default(0),
		fileId: text('file_id').references(() => files.id),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		uniqueIndex('customer_invoices_tenant_number_unique').on(table.tenantId, table.invoiceNumber),
		index('customer_invoices_customer_idx').on(table.customerId)
	]
);

export const customerInvoiceItems = sqliteTable(
	'customer_invoice_items',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		customerInvoiceId: text('customer_invoice_id')
			.notNull()
			.references(() => customerInvoices.id, { onDelete: 'cascade' }),
		salesOrderItemId: text('sales_order_item_id').references(() => salesOrderItems.id),
		deliveryNoteItemId: text('delivery_note_item_id').references(() => deliveryNoteItems.id),
		variantId: text('variant_id')
			.notNull()
			.references(() => productVariants.id, { onDelete: 'restrict' }),
		description: text('description').notNull(),
		quantity: integer('quantity').notNull(),
		unitPriceCents: integer('unit_price_cents').notNull(),
		vatRateBps: integer('vat_rate_bps').notNull().default(2000),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		index('customer_invoice_items_tenant_idx').on(table.tenantId),
		index('customer_invoice_items_invoice_idx').on(table.customerInvoiceId)
	]
);

export const approvalRequests = sqliteTable(
	'approval_requests',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		entityType: text('entity_type').notNull(),
		entityId: text('entity_id').notNull(),
		title: text('title').notNull(),
		description: text('description'),
		status: text('status').notNull().default('pending'),
		requestedByUserId: text('requested_by_user_id'),
		assignedToUserId: text('assigned_to_user_id'),
		dueAt: text('due_at'),
		resolvedAt: text('resolved_at'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		index('approval_requests_entity_idx').on(table.tenantId, table.entityType, table.entityId),
		index('approval_requests_assignee_idx').on(table.assignedToUserId, table.status)
	]
);

export const approvalDecisions = sqliteTable(
	'approval_decisions',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		approvalRequestId: text('approval_request_id')
			.notNull()
			.references(() => approvalRequests.id, { onDelete: 'cascade' }),
		decidedByUserId: text('decided_by_user_id'),
		decision: text('decision').notNull(),
		comment: text('comment'),
		decidedAt: text('decided_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [index('approval_decisions_request_idx').on(table.approvalRequestId)]
);

export const auditLogs = sqliteTable(
	'audit_logs',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		userId: text('user_id'),
		action: text('action').notNull(),
		entityType: text('entity_type').notNull(),
		entityId: text('entity_id').notNull(),
		before: text('before', { mode: 'json' }),
		after: text('after', { mode: 'json' }),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		index('audit_logs_entity_idx').on(table.tenantId, table.entityType, table.entityId),
		index('audit_logs_user_idx').on(table.userId),
		index('audit_logs_created_idx').on(table.tenantId, table.createdAt)
	]
);

export const exchangeRates = sqliteTable(
	'exchange_rates',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		tenantId: text('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' }),
		fromCurrency: text('from_currency').notNull(),
		toCurrency: text('to_currency').notNull(),
		rate: integer('rate').notNull(),
		effectiveAt: text('effective_at').notNull(),
		source: text('source'),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		index('exchange_rates_tenant_idx').on(table.tenantId),
		index('exchange_rates_currencies_idx').on(
			table.fromCurrency,
			table.toCurrency,
			table.effectiveAt
		)
	]
);

export * from './auth.schema';
