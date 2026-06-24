import type { Customer, PaymentReminderData } from '$lib/components/pdf/types.js';

export function paymentReminderFixture(customer: Customer): PaymentReminderData {
	return {
		reminder: {
			number: 'MA-2026-0072',
			level: 2,
			level_label: '2. Mahnung',
			invoice_number: 'RE-2026-0418',
			invoice_date: '02.05.2026',
			due_date: '16.05.2026',
			days_overdue: '21',
			new_deadline: '13.06.2026',
			intro_text: `Sehr geehrte${customer.salutation ? ` ${customer.salutation}` : ' Damen und Herren'}, trotz unserer Erinnerung vom 22.05.2026 ist die unten angeführte Forderung noch immer offen. Wir ersuchen Sie höflich, den Betrag bis spätestens zum unten genannten Datum zu begleichen.`,
			escalation_text:
				'Sollte die Zahlung bis zum 13.06.2026 nicht eingehen, sehen wir uns gezwungen, den Vorgang an unseren Inkasso-Partner zu übergeben — verbunden mit weiteren Kosten zu Ihren Lasten.'
		},
		open_items: [
			{
				number: 'RE-2026-0418',
				description: 'Heizungstausch Donaustadt',
				date: '02.05.2026',
				due: '16.05.2026',
				days: '21',
				amount: '7.476,00'
			}
		],
		totals: { principal: '7.476,00', interest: '42,30', fees: '20,00', gross: '7.538,30' }
	};
}
