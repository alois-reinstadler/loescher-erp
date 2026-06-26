<script lang="ts">
	import * as Pdf from '$lib/components/pdf/index.js';
	import { page } from '$app/state';
	import { getBrand } from '$lib/pdf/brands.js';
	import { getCustomer } from '$lib/pdf/customers.js';
	import { creditNoteFixture } from '$lib/pdf/fixtures/index.js';
	import type { PageData } from './$types';

	let { data: pageData }: { data: PageData } = $props();

	const brand = $derived(getBrand(page.url.searchParams.get('brand')));
	const customerEntry = $derived(getCustomer(page.url.searchParams.get('customer')));
	const issuer = $derived(pageData.issuer ?? brand.issuer);
	const customer = $derived(customerEntry.customer);
	const data = $derived(creditNoteFixture(customer));
</script>

<svelte:head>
	<title>Credit Note {data.credit.number}</title>
</svelte:head>

<Pdf.Sheet theme={issuer.theme}>
	<Pdf.Page>
		<Pdf.DocHead {issuer} />

		<Pdf.AddressGrid
			blocks={[
				{
					label: 'Empfänger / Recipient',
					name: customer.name,
					address: `${customer.address}${customer.uid ? `\nUID: ${customer.uid}` : ''}`
				},
				{
					label: 'Bezug / Reference',
					name: `Rechnung ${data.credit.original_invoice}`,
					address: `vom ${data.credit.original_date}`
				}
			]}
		/>

		<Pdf.DocTitleRow
			typeLabel="Gutschrift · Credit Note"
			title="Gutschrift"
			bilingualTitle="/ Credit Note"
			number={data.credit.number}
		/>

		<Pdf.KvStrip
			cols={3}
			items={[
				{ k: 'Gutschriftsdatum', v: data.credit.issue_date },
				{ k: 'Bezug Rechnung', v: data.credit.original_invoice },
				{ k: 'Grund', v: data.credit.reason_short }
			]}
		/>

		<Pdf.Intro>{data.credit.intro_text}</Pdf.Intro>

		<Pdf.CreditNoteItemTable items={data.items} />

		<Pdf.VatTotals
			totals={data.totals}
			negate={true}
			grossLabel="Gutschriftsbetrag"
			netLabel="Netto-Gutschrift"
		>
			{#snippet notes()}
				<strong>Hinweis:</strong> Der Gutschriftsbetrag wird auf das uns bekannte Konto rücküberwiesen
				oder mit der nächsten Rechnung verrechnet.
			{/snippet}
		</Pdf.VatTotals>

		<Pdf.NotesBlock label="Begründung / Reason">{data.credit.reason_long}</Pdf.NotesBlock>

		<Pdf.LegalNotes>
			<p>
				Diese Gutschrift ersetzt anteilig die Rechnung {data.credit.original_invoice} vom
				{data.credit.original_date}. Die Originalrechnung bleibt im Übrigen aufrecht.
			</p>
		</Pdf.LegalNotes>

		<Pdf.DocFooter {issuer} />
	</Pdf.Page>
</Pdf.Sheet>
