import type { LineItem, InvoiceLineItem } from '$lib/components/pdf/types.js';

export const offerItems: LineItem[] = [
	{
		pos: '01',
		title: 'Heizungstausch — Demontage Altanlage',
		description: 'Ausbau Bestandsbrennwertgerät, fachgerechte Entsorgung.',
		qty: '1,00',
		unit: 'pausch.',
		unit_price: '1.840,00',
		line_total: '1.840,00'
	},
	{
		pos: '02',
		title: 'Brennwertgerät 24 kW',
		description: 'Vaillant ecoTEC plus VC 24, inkl. Speicher 200 L.',
		qty: '1,00',
		unit: 'Stk.',
		unit_price: '4.210,00',
		line_total: '4.210,00'
	},
	{
		pos: '03',
		title: 'Anfahrt & Logistik',
		description: 'Wien 22 — drei Termine.',
		qty: '3,00',
		unit: 'Fahrt',
		unit_price: '60,00',
		line_total: '180,00'
	}
];

export const invoiceItems: InvoiceLineItem[] = [
	{
		pos: '01',
		title: 'Heizungstausch — Demontage Altanlage',
		description: 'Ausbau Bestandsbrennwertgerät, fachgerechte Entsorgung inkl. Altölbehälter.',
		meta: '3 Tage · Geselle + Lehrling',
		qty: '1,00',
		unit: 'pausch.',
		unit_price: '1.840,00',
		vat_rate: '20',
		line_total: '1.840,00'
	},
	{
		pos: '02',
		title: 'Brennwertgerät 24 kW',
		description: 'Vaillant ecoTEC plus VC 24, inkl. Speicher 200 L und Anbindeleitungen.',
		meta: 'Material',
		qty: '1,00',
		unit: 'Stk.',
		unit_price: '4.210,00',
		vat_rate: '20',
		line_total: '4.210,00'
	},
	{
		pos: '03',
		title: 'Anfahrt & Logistik',
		description: 'Wien 22 — drei Termine zu je 38 km.',
		meta: '',
		qty: '3,00',
		unit: 'Fahrt',
		unit_price: '60,00',
		vat_rate: '20',
		line_total: '180,00'
	}
];

export const longInvoiceItems: InvoiceLineItem[] = (
	[
		{
			title: 'Projektleitung und technische Abstimmung',
			description:
				'Koordination der Gewerke, Abstimmung mit Auftraggeber und laufende Fortschrittskontrolle.',
			meta: 'Kalenderwoche 17 · remote und vor Ort',
			qty: '6,00',
			unit: 'Std.',
			unit_price: '115,00',
			line_total: '690,00'
		},
		{
			title: 'Bestandsaufnahme und Dokumentation',
			description:
				'Erhebung der bestehenden Prozesse, Datenflüsse und Schnittstellen inklusive Fotodokumentation.',
			meta: 'Workshop, Protokoll, strukturierte Findings',
			qty: '1,00',
			unit: 'pausch.',
			unit_price: '980,00',
			line_total: '980,00'
		},
		{
			title: 'Datenmodell und Migrationsplan',
			description:
				'Konzeption der Zielstruktur, Mapping der Stammdaten und Planung der schrittweisen Migration.',
			meta: 'inkl. Review mit Fachbereich',
			qty: '8,00',
			unit: 'Std.',
			unit_price: '125,00',
			line_total: '1.000,00'
		},
		{
			title: 'Backend-Implementierung',
			description:
				'Entwicklung der API-Endpunkte, Validierungsschichten, Berechtigungslogik und Fehlerbehandlung.',
			meta: 'SvelteKit server routes · TypeScript',
			qty: '18,00',
			unit: 'Std.',
			unit_price: '125,00',
			line_total: '2.250,00'
		},
		{
			title: 'Frontend-Implementierung',
			description:
				'Umsetzung der Arbeitsoberflächen für Disposition, Auftragsdetails und Statusverfolgung.',
			meta: 'Svelte 5 · Tailwind · shadcn-style components',
			qty: '20,00',
			unit: 'Std.',
			unit_price: '115,00',
			line_total: '2.300,00'
		},
		{
			title: 'PDF-Dokumentenvorlagen',
			description:
				'Erstellung druckoptimierter Vorlagen für Rechnungen, Angebote, Lieferscheine und Mahnungen.',
			meta: 'Playwright PDF · A4 Layout · Light Mode',
			qty: '12,00',
			unit: 'Std.',
			unit_price: '115,00',
			line_total: '1.380,00'
		},
		{
			title: 'Automatisierte PDF-Generierung',
			description:
				'Script-Workflow für die Erzeugung einzelner Dokumente oder aller Dokumenttypen in einem Lauf.',
			meta: 'Chromium headless · printBackground · preferCSSPageSize',
			qty: '5,00',
			unit: 'Std.',
			unit_price: '125,00',
			line_total: '625,00'
		},
		{
			title: 'Zahlungs- und Mahnlogik',
			description:
				'Regelwerk für Fälligkeiten, offene Posten, Mahnstufen, Gebühren und Zahlungsreferenzen.',
			meta: 'inkl. Testdaten und Edge Cases',
			qty: '7,00',
			unit: 'Std.',
			unit_price: '125,00',
			line_total: '875,00'
		},
		{
			title: 'Import bestehender Kundendaten',
			description:
				'Bereinigung und Import der vorhandenen Kunden-, Liefer- und Rechnungsdaten in die neue Struktur.',
			meta: 'CSV/Excel Normalisierung',
			qty: '1,00',
			unit: 'pausch.',
			unit_price: '1.240,00',
			line_total: '1.240,00'
		},
		{
			title: 'Rollen- und Rechtemodell',
			description:
				'Einrichtung von Zugriffsebenen für Administration, Backoffice und externe Lesezugriffe.',
			meta: 'better-auth Integration',
			qty: '6,00',
			unit: 'Std.',
			unit_price: '125,00',
			line_total: '750,00'
		},
		{
			title: 'Dashboard Kennzahlen',
			description:
				'Übersicht für Umsatz, offene Forderungen, Angebotsstatus und operative Tagesaufgaben.',
			meta: 'kompakte Karten und Tabellenansicht',
			qty: '9,00',
			unit: 'Std.',
			unit_price: '115,00',
			line_total: '1.035,00'
		},
		{
			title: 'E-Mail-Vorlagen',
			description:
				'Transaktionale Vorlagen für Rechnungsversand, Zahlungserinnerung und Angebotsannahme.',
			meta: 'deutsch/englisch · responsive HTML',
			qty: '4,00',
			unit: 'Std.',
			unit_price: '105,00',
			line_total: '420,00'
		},
		{
			title: 'Audit-Log',
			description:
				'Nachvollziehbarkeit kritischer Aktionen inklusive Benutzer, Zeitpunkt und betroffener Entität.',
			meta: 'Datenbankmodell und UI-Ausgabe',
			qty: '8,00',
			unit: 'Std.',
			unit_price: '125,00',
			line_total: '1.000,00'
		},
		{
			title: 'Suche und Filter',
			description:
				'Schnelle Suche über Kunden, Dokumentnummern, Status, Beträge und Datumsbereiche.',
			meta: 'serverseitig paginiert',
			qty: '6,00',
			unit: 'Std.',
			unit_price: '115,00',
			line_total: '690,00'
		},
		{
			title: 'Status-Automationen',
			description:
				'Automatische Aktualisierung von Dokumentstatus nach Versand, Zahlung und Storno.',
			meta: 'inkl. Schutz gegen doppelte Verarbeitung',
			qty: '7,00',
			unit: 'Std.',
			unit_price: '125,00',
			line_total: '875,00'
		},
		{
			title: 'Testabdeckung',
			description:
				'Gezielte Unit- und Integrationstests für Rechnungsberechnung, Routen und PDF-Fixtures.',
			meta: 'Vitest · Playwright smoke checks',
			qty: '10,00',
			unit: 'Std.',
			unit_price: '115,00',
			line_total: '1.150,00'
		},
		{
			title: 'Deployment-Pipeline',
			description:
				'Konfiguration für Build, Check, Migration und kontrollierte Veröffentlichung der Anwendung.',
			meta: 'pnpm · SvelteKit adapter',
			qty: '5,00',
			unit: 'Std.',
			unit_price: '125,00',
			line_total: '625,00'
		},
		{
			title: 'Datenbankmigrationen',
			description:
				'Erstellung und Prüfung der Schemaänderungen für Dokumente, Kunden und Zahlungen.',
			meta: 'Drizzle migrations',
			qty: '5,00',
			unit: 'Std.',
			unit_price: '125,00',
			line_total: '625,00'
		},
		{
			title: 'Abnahmebegleitung',
			description:
				'Gemeinsame Prüfung der Kernabläufe, Einarbeitung der Rückmeldungen und Abschlussprotokoll.',
			meta: 'remote Session',
			qty: '4,00',
			unit: 'Std.',
			unit_price: '115,00',
			line_total: '460,00'
		},
		{
			title: 'Betriebsdokumentation',
			description:
				'Kurze technische Dokumentation zu Umgebung, Scripts, PDF-Generierung und Wartungsaufgaben.',
			meta: 'Markdown im Repository',
			qty: '3,00',
			unit: 'Std.',
			unit_price: '105,00',
			line_total: '315,00'
		},
		{
			title: 'Reserve für Änderungswünsche',
			description: 'Kleiner Aufwandspuffer für priorisierte Anpassungen während der Abnahmephase.',
			meta: 'nach tatsächlichem Aufwand',
			qty: '6,00',
			unit: 'Std.',
			unit_price: '115,00',
			line_total: '690,00'
		}
	] as Omit<InvoiceLineItem, 'pos' | 'vat_rate'>[]
).map((item, index) => ({
	...item,
	pos: String(index + 1).padStart(2, '0'),
	vat_rate: '20'
}));
