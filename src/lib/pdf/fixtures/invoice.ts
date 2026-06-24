import type { Customer, InvoiceData } from '$lib/components/pdf/types.js';
import { invoiceItems, longInvoiceItems } from './items.js';

export function invoiceFixture(customer: Customer): InvoiceData {
	return {
		status: 'draft',
		shipping: {
			name: `${customer.name} — Baustelle Süd`,
			address: 'Lieferadresse 14\n1220 Wien'
		},
		invoice: {
			number: 'RE-2026-0418',
			issue_date: '02.05.2026',
			service_date: '28.04.2026',
			due_date: '16.05.2026',
			intro_text: `Sehr geehrte${customer.salutation ? ` ${customer.salutation}` : ' Damen und Herren'}, vielen Dank für Ihren Auftrag. Wir stellen Ihnen folgende Leistungen in Rechnung:`,
			terms: 'Zahlbar binnen 14 Tagen ohne Abzug.',
			skonto: 'Bei Zahlung innerhalb 7 Tagen 2 % Skonto.'
		},
		items: invoiceItems,
		totals: {
			net: '6.230,00',
			vat_breakdown: [{ rate: '20', base: '6.230,00', amount: '1.246,00' }],
			gross: '7.476,00'
		},
		vat: {
			standard: true,
			reverse_charge: false,
			ig_lieferung: false,
			kleinunternehmer: false
		}
	};
}

export function longInvoiceFixture(customer: Customer): InvoiceData {
	const base = invoiceFixture(customer);
	return {
		...base,
		invoice: {
			...base.invoice,
			number: 'RE-2026-0418-L',
			intro_text: `Sehr geehrte${customer.salutation ? ` ${customer.salutation}` : ' Damen und Herren'}, diese Beispielrechnung enthält bewusst viele Positionen, damit die PDF-Ausgabe mehrere A4-Seiten belegt und Seitenumbrüche überprüft werden können.`
		},
		items: longInvoiceItems,
		totals: {
			net: '23.975,00',
			vat_breakdown: [{ rate: '20', base: '23.975,00', amount: '4.795,00' }],
			gross: '28.770,00'
		}
	};
}
