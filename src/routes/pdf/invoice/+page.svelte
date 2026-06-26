<script lang="ts">
	import * as Pdf from '$lib/components/pdf/index.js';
	import { page } from '$app/state';
	import { getBrand } from '$lib/pdf/brands.js';
	import { getCustomer } from '$lib/pdf/customers.js';
	import { invoiceFixture } from '$lib/pdf/fixtures/index.js';
	import type { PageData } from './$types';

	let { data: pageData }: { data: PageData } = $props();

	const brand = $derived(getBrand(page.url.searchParams.get('brand')));
	const customerEntry = $derived(getCustomer(page.url.searchParams.get('customer')));
	const issuer = $derived(pageData.issuer ?? brand.issuer);
	const customer = $derived(customerEntry.customer);
	const data = $derived(invoiceFixture(customer));
</script>

<svelte:head>
	<title>Invoice {data.invoice.number}</title>
</svelte:head>

<Pdf.Sheet theme={issuer.theme}>
	<Pdf.Page>
		{#if data.status === 'draft'}
			<Pdf.Stamp variant="draft">Entwurf</Pdf.Stamp>
		{:else if data.status === 'paid'}
			<Pdf.Stamp variant="paid">Bezahlt</Pdf.Stamp>
		{:else if data.status === 'overdue'}
			<Pdf.Stamp variant="overdue">Überfällig</Pdf.Stamp>
		{/if}

		<Pdf.DocHead {issuer} />

		<Pdf.AddressGrid
			blocks={[
				{
					label: 'Rechnung an / Bill to',
					name: customer.name,
					address: `${customer.address}${customer.uid ? `\nUID: ${customer.uid}` : ''}`
				},
				{
					label: 'Lieferadresse / Ship to',
					name: data.shipping.name,
					address: data.shipping.address
				}
			]}
		/>

		<Pdf.DocTitleRow
			typeLabel="Rechnung · Invoice"
			title="Rechnung"
			bilingualTitle="/ Invoice"
			number={data.invoice.number}
		/>

		<Pdf.KvStrip
			items={[
				{ k: 'Rechnungsdatum', v: data.invoice.issue_date },
				{ k: 'Leistungsdatum', v: data.invoice.service_date },
				{ k: 'Fälligkeit', v: data.invoice.due_date },
				{ k: 'Kunden-Nr.', v: customer.number ?? '—' }
			]}
		/>

		<Pdf.Intro>{data.invoice.intro_text}</Pdf.Intro>

		<Pdf.InvoiceItemTable items={data.items} />

		<Pdf.VatTotals
			totals={data.totals}
			grossLabel="Gesamtbetrag"
			dueLabel="Fällig bis"
			dueValue={data.invoice.due_date}
		>
			{#snippet notes()}
				<strong>Zahlungsbedingungen / Payment terms:</strong>
				{data.invoice.terms}<br />
				{#if data.invoice.skonto}
					<span>{data.invoice.skonto}</span>
				{/if}
			{/snippet}
		</Pdf.VatTotals>

		<Pdf.PaymentBlock
			{issuer}
			title="Zahlungsdaten / Bank details"
			reference={data.invoice.number}
			amount={data.totals.gross}
		/>

		<Pdf.LegalNotes>
			{#if data.vat.reverse_charge}
				<p>
					<strong>Steuerschuldnerschaft des Leistungsempfängers</strong> gemäß § 19 UStG /
					<em>Reverse Charge — VAT liability transfers to recipient.</em>
				</p>
			{/if}
			{#if data.vat.ig_lieferung}
				<p>
					<strong>Steuerfreie innergemeinschaftliche Lieferung</strong> gemäß Art. 6 Abs. 1 UStG /
					<em>VAT-exempt intra-Community supply.</em>
				</p>
			{/if}
			{#if data.vat.kleinunternehmer}
				<p>
					<strong>Hinweis:</strong> Wegen Kleinunternehmerregelung gemäß § 6 Abs. 1 Z 27 UStG keine USt.
					ausgewiesen.
				</p>
			{/if}
			{#if data.vat.standard}
				<p>
					Verzugszinsen 9,2 % p.a. gemäß § 456 UGB. Eigentumsvorbehalt bis vollständiger Zahlung.
					Gerichtsstand Wien.
				</p>
			{/if}
		</Pdf.LegalNotes>

		<Pdf.DocFooter {issuer} />
	</Pdf.Page>
</Pdf.Sheet>
