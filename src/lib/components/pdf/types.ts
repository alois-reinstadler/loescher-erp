export type IssuerTheme = {
	primary?: string;
	primaryForeground?: string;
	accent?: string;
	accentForeground?: string;
};

export type Issuer = {
	name: string;
	brand_initial: string;
	tagline: string;
	address_line1: string;
	address_line2: string;
	email: string;
	phone: string;
	web: string;
	uid: string;
	fn: string;
	sitz: string;
	bank?: string;
	iban?: string;
	bic?: string;
	logo_svg?: string;
	logo_width?: string;
	theme?: IssuerTheme;
};

export type Party = {
	name: string;
	address: string;
	number?: string;
};

export type Customer = Party & {
	uid?: string;
	salutation?: string;
};

export type Contact = {
	name: string;
	email: string;
	phone: string;
};

export type LineItem = {
	pos: string;
	title: string;
	description: string;
	sku?: string;
	qty: string;
	unit?: string;
	unit_price?: string;
	line_total: string;
};

export type InvoiceLineItem = LineItem & { vat_rate: string; meta?: string };

export type Totals = {
	net: string;
	vat: string;
	gross: string;
};

export type AddressBlock = {
	label: string;
	name: string;
	address: string;
};

export type KvEntry = {
	k: string;
	v: string;
};

export type VatBreakdown = {
	rate: string;
	base: string;
	amount: string;
};

export type VatTotals = {
	net: string;
	vat_breakdown: VatBreakdown[];
	gross: string;
};

export type OpenItem = {
	number: string;
	description: string;
	date: string;
	due: string;
	days: string;
	amount: string;
};

export type ReminderTotals = {
	principal: string;
	interest?: string;
	fees?: string;
	gross: string;
};

export type DeliveryItem = {
	pos: string;
	title: string;
	description: string;
	sku: string;
	qty: string;
	unit: string;
	weight: string;
};

export type DeliveryTotals = {
	line_count: string;
	packages: string;
	weight: string;
};

export type CurrencyCode = 'EUR' | 'USD' | 'GBP' | string;

export type Money = {
	amount: number;
	currency: CurrencyCode;
};

// --- Document data shapes (no issuer, no customer — supplied by route from registries) ---

export type PurchaseOrderMeta = {
	number: string;
	issue_date: string;
	requested_date: string;
	handler: string;
	intro_text: string;
	delivery_terms: string;
	payment_terms: string;
};

export type PurchaseOrderData = {
	supplier: Party;
	shipping: Party;
	po: PurchaseOrderMeta;
	items: LineItem[];
	totals: Totals;
};

export type InvoiceMeta = {
	number: string;
	issue_date: string;
	service_date: string;
	due_date: string;
	intro_text: string;
	terms: string;
	skonto?: string;
};

export type InvoiceData = {
	status: 'draft' | 'paid' | 'overdue';
	shipping: Party;
	invoice: InvoiceMeta;
	items: InvoiceLineItem[];
	totals: VatTotals;
	vat: {
		standard: boolean;
		reverse_charge: boolean;
		ig_lieferung: boolean;
		kleinunternehmer: boolean;
	};
};

export type OfferMeta = {
	number: string;
	issue_date: string;
	valid_until: string;
	project_name: string;
	intro_text: string;
	conditions: string;
	lead_time: string;
};

export type OfferData = {
	contact: Contact;
	offer: OfferMeta;
	items: LineItem[];
	totals: Totals;
};

export type DeliveryMeta = {
	number: string;
	date: string;
	order_ref: string;
	carrier: string;
	tracking: string;
	intro_text: string;
	notes: string;
};

export type DeliveryNoteData = {
	shipping: Party;
	delivery: DeliveryMeta;
	items: DeliveryItem[];
	totals: DeliveryTotals;
};

export type CreditMeta = {
	number: string;
	issue_date: string;
	original_invoice: string;
	original_date: string;
	reason_short: string;
	intro_text: string;
	reason_long: string;
};

export type CreditNoteData = {
	credit: CreditMeta;
	items: InvoiceLineItem[];
	totals: VatTotals;
};

export type OrderMeta = {
	number: string;
	issue_date: string;
	delivery_date: string;
	customer_po: string;
	offer_number: string;
	offer_date: string;
	handler: string;
	intro_text: string;
	delivery_terms: string;
	payment_terms: string;
};

export type OrderConfirmationData = {
	order: OrderMeta;
	items: LineItem[];
	totals: Totals;
};

export type ReminderMeta = {
	number: string;
	level: number;
	level_label: string;
	invoice_number: string;
	invoice_date: string;
	due_date: string;
	days_overdue: string;
	new_deadline: string;
	intro_text: string;
	escalation_text: string;
};

export type PaymentReminderData = {
	reminder: ReminderMeta;
	open_items: OpenItem[];
	totals: ReminderTotals;
};

export type DocumentId =
	| 'purchase-order'
	| 'invoice'
	| 'long-invoice'
	| 'offer'
	| 'delivery-note'
	| 'credit-note'
	| 'order-confirmation'
	| 'payment-reminder';
