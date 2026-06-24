import type { Customer, OrderConfirmationData } from '$lib/components/pdf/types.js';
import type { Issuer } from '$lib/components/pdf/types.js';
import { offerItems } from './items.js';

export function orderConfirmationFixture(
	customer: Customer,
	issuer: Issuer
): OrderConfirmationData {
	return {
		order: {
			number: 'AB-2026-0188',
			issue_date: '06.05.2026',
			delivery_date: 'KW 22 / 2026',
			customer_po: 'BS-2026-44',
			offer_number: 'AN-2026-0418',
			offer_date: '02.05.2026',
			handler: issuer.name,
			intro_text: `Sehr geehrte${customer.salutation ? ` ${customer.salutation}` : ' Damen und Herren'}, vielen Dank für Ihre Bestellung. Wir bestätigen Ihnen den folgenden Auftrag:`,
			delivery_terms: 'frei Haus, Wien 22',
			payment_terms: '30 % Anzahlung, 70 % bei Fertigstellung'
		},
		items: offerItems,
		totals: { net: '6.230,00', vat: '1.246,00', gross: '7.476,00' }
	};
}
