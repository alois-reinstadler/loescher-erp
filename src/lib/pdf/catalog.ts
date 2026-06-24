export type PdfDocumentId =
	| 'purchase-order'
	| 'invoice'
	| 'long-invoice'
	| 'offer'
	| 'delivery-note'
	| 'credit-note'
	| 'order-confirmation'
	| 'payment-reminder';

export type PdfDocumentSpec = {
	id: PdfDocumentId;
	title: string;
	label: string;
	path: string;
	description: string;
	usesCustomer: boolean;
};

export const PDF_DOCUMENTS = [
	{
		id: 'purchase-order',
		title: 'Purchase Order',
		label: 'Bestellung',
		path: '/pdf/purchase-order',
		description: 'Supplier order with shipping address, conditions, and signature lines.',
		usesCustomer: false
	},
	{
		id: 'invoice',
		title: 'Invoice',
		label: 'Rechnung',
		path: '/pdf/invoice',
		description: 'Invoice with VAT breakdown, payment block, and legal notes.',
		usesCustomer: true
	},
	{
		id: 'long-invoice',
		title: 'Long Invoice',
		label: 'Mehrseitige Rechnung',
		path: '/pdf/long-invoice',
		description: 'Multi-page invoice with repeated headers and continued tables.',
		usesCustomer: true
	},
	{
		id: 'offer',
		title: 'Offer',
		label: 'Angebot',
		path: '/pdf/offer',
		description: 'Customer offer with acceptance block and commercial terms.',
		usesCustomer: true
	},
	{
		id: 'delivery-note',
		title: 'Delivery Note',
		label: 'Lieferschein',
		path: '/pdf/delivery-note',
		description: 'Goods delivery document with package and weight totals.',
		usesCustomer: true
	},
	{
		id: 'credit-note',
		title: 'Credit Note',
		label: 'Gutschrift',
		path: '/pdf/credit-note',
		description: 'Credit correction linked to an original invoice.',
		usesCustomer: true
	},
	{
		id: 'order-confirmation',
		title: 'Order Confirmation',
		label: 'Auftragsbestätigung',
		path: '/pdf/order-confirmation',
		description: 'Confirmed order with customer reference and delivery terms.',
		usesCustomer: true
	},
	{
		id: 'payment-reminder',
		title: 'Payment Reminder',
		label: 'Mahnung',
		path: '/pdf/payment-reminder',
		description: 'Open-items reminder with deadline, fees, and SEPA payment details.',
		usesCustomer: true
	}
] as const satisfies readonly PdfDocumentSpec[];

export const PDF_BRAND_IDS = ['alrein', 'mahler-bau', 'nordlicht'] as const;
export const PDF_CUSTOMER_IDS = ['mahler', 'huber', 'lindemann'] as const;

export type PdfBrandId = (typeof PDF_BRAND_IDS)[number];
export type PdfCustomerId = (typeof PDF_CUSTOMER_IDS)[number];

export function createPdfPreviewHref(
	doc: PdfDocumentSpec,
	brandId: string,
	customerId: string
): string {
	const params = new URLSearchParams({ brand: brandId });
	if (doc.usesCustomer) params.set('customer', customerId);
	return `${doc.path}?${params.toString()}`;
}
