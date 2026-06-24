import type { Customer, CreditNoteData } from '$lib/components/pdf/types.js';

export function creditNoteFixture(customer: Customer): CreditNoteData {
	return {
		credit: {
			number: 'GS-2026-0029',
			issue_date: '08.05.2026',
			original_invoice: 'RE-2026-0418',
			original_date: '02.05.2026',
			reason_short: 'Mengenkorrektur',
			intro_text: `Sehr geehrte${customer.salutation ? ` ${customer.salutation}` : ' Damen und Herren'}, wir gewähren Ihnen folgende Gutschrift:`,
			reason_long:
				'Bei der Endabrechnung wurde eine zusätzliche Anfahrt verrechnet, die nicht stattgefunden hat. Wir korrigieren den Betrag entsprechend.'
		},
		items: [
			{
				pos: '01',
				title: 'Anfahrt & Logistik (Korrektur)',
				description: 'Eine Fahrt nach Wien 22 wurde irrtümlich verrechnet.',
				qty: '1,00',
				unit_price: '60,00',
				vat_rate: '20',
				line_total: '60,00'
			}
		],
		totals: {
			net: '60,00',
			vat_breakdown: [{ rate: '20', base: '60,00', amount: '12,00' }],
			gross: '72,00'
		}
	};
}
