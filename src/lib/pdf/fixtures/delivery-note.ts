import type { Customer, DeliveryNoteData } from '$lib/components/pdf/types.js';

export function deliveryNoteFixture(customer: Customer): DeliveryNoteData {
	return {
		shipping: {
			name: `${customer.name} — Baustelle Süd`,
			address: 'Lieferadresse 14\n1220 Wien\nz.Hd. Polier Müller'
		},
		delivery: {
			number: 'LS-2026-0301',
			date: '14.05.2026',
			order_ref: 'AB-2026-0188',
			carrier: 'Eigene Anlieferung',
			tracking: '—',
			intro_text:
				'Wir liefern Ihnen heute folgende Positionen. Bitte prüfen Sie Vollständigkeit und Zustand bei Übernahme.',
			notes:
				'Anlieferung Werktags 07:00–15:00. Ausladen vor Ort durch Kunde. Bei Beschädigungen bitte sofort vermerken.'
		},
		items: [
			{
				pos: '01',
				title: 'Brennwertgerät 24 kW',
				description: 'Vaillant ecoTEC plus VC 24',
				sku: 'VAI-VC24-PLUS',
				qty: '1',
				unit: 'Stk.',
				weight: '38,4'
			},
			{
				pos: '02',
				title: 'Pufferspeicher 200 L',
				description: 'Edelstahl, isoliert',
				sku: 'BUF-200-EDS',
				qty: '1',
				unit: 'Stk.',
				weight: '62,0'
			},
			{
				pos: '03',
				title: 'Anbindeleitungen DN20',
				description: 'Kupfer, gedämmt, 6 m',
				sku: 'CU-DN20-6M',
				qty: '2',
				unit: 'Set',
				weight: '9,2'
			}
		],
		totals: { line_count: '3', packages: '5', weight: '118,8' }
	};
}
