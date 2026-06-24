import type { Issuer, PurchaseOrderData } from '$lib/components/pdf/types.js';

// Purchase orders go to a supplier (not a customer in our customer registry).
// Supplier is part of the document data; customer URL param is N/A here.
export function purchaseOrderFixture(issuer: Issuer): PurchaseOrderData {
	return {
		supplier: {
			name: 'Vaillant Group Austria GmbH',
			address: 'Clemens-Holzmeister-Straße 6\n1100 Wien\nÖsterreich',
			number: 'L-00214'
		},
		shipping: {
			name: issuer.name,
			address: `${issuer.address_line1}\n${issuer.address_line2}`
		},
		po: {
			number: 'BE-2026-0094',
			issue_date: '05.05.2026',
			requested_date: '12.05.2026',
			handler: issuer.name,
			intro_text:
				'Sehr geehrte Damen und Herren, wir bestellen wie unten angeführt. Bitte bestätigen Sie Liefertermin und Konditionen.',
			delivery_terms: `DAP ${issuer.sitz}`,
			payment_terms: '30 Tage netto'
		},
		items: [
			{
				pos: '01',
				title: 'Brennwertgerät VC 24',
				description: 'Vaillant ecoTEC plus VC 24',
				sku: 'VAI-VC24-PLUS',
				qty: '2',
				unit: 'Stk.',
				unit_price: '3.180,00',
				line_total: '6.360,00'
			},
			{
				pos: '02',
				title: 'Pufferspeicher 200 L',
				description: 'VPS 200 R',
				sku: 'VAI-VPS-200R',
				qty: '2',
				unit: 'Stk.',
				unit_price: '640,00',
				line_total: '1.280,00'
			}
		],
		totals: { net: '7.640,00', vat: '1.528,00', gross: '9.168,00' }
	};
}
