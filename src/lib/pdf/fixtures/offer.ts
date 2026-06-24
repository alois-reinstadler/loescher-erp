import type { Customer, OfferData } from '$lib/components/pdf/types.js';
import type { Issuer } from '$lib/components/pdf/types.js';
import { offerItems } from './items.js';

export function offerFixture(customer: Customer, issuer: Issuer): OfferData {
	return {
		contact: {
			name: issuer.name,
			email: issuer.email,
			phone: issuer.phone
		},
		offer: {
			number: 'AN-2026-0418',
			issue_date: '02.05.2026',
			valid_until: '30.05.2026',
			project_name: 'Heizungstausch Donaustadt',
			intro_text: `Sehr geehrte${customer.salutation ? ` ${customer.salutation}` : ' Damen und Herren'}, wir freuen uns über Ihre Anfrage und unterbreiten Ihnen folgendes Angebot:`,
			conditions: '30 % bei Auftragserteilung, 70 % bei Fertigstellung',
			lead_time: 'ca. 4 Wochen ab Auftragsbestätigung'
		},
		items: offerItems,
		totals: { net: '6.230,00', vat: '1.246,00', gross: '7.476,00' }
	};
}
