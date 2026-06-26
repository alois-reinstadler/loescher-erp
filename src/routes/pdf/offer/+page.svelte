<script lang="ts">
	import * as Pdf from '$lib/components/pdf/index.js';
	import { page } from '$app/state';
	import { getBrand } from '$lib/pdf/brands.js';
	import { getCustomer } from '$lib/pdf/customers.js';
	import { offerFixture } from '$lib/pdf/fixtures/index.js';
	import type { PageData } from './$types';

	let { data: pageData }: { data: PageData } = $props();

	const brand = $derived(getBrand(page.url.searchParams.get('brand')));
	const customerEntry = $derived(getCustomer(page.url.searchParams.get('customer')));
	const issuer = $derived(pageData.issuer ?? brand.issuer);
	const customer = $derived(customerEntry.customer);
	const data = $derived(offerFixture(customer, issuer));
</script>

<svelte:head>
	<title>Offer {data.offer.number}</title>
</svelte:head>

<Pdf.Sheet theme={issuer.theme}>
	<Pdf.Page>
		<Pdf.DocHead {issuer} />

		<Pdf.AddressGrid
			blocks={[
				{
					label: 'Angebot an / Offer to',
					name: customer.name,
					address: customer.address
				},
				{
					label: 'Sachbearbeiter / Contact',
					name: data.contact.name,
					address: `${data.contact.email}\n${data.contact.phone}`
				}
			]}
		/>

		<Pdf.DocTitleRow
			typeLabel="Angebot · Offer"
			title="Angebot"
			bilingualTitle="/ Offer"
			number={data.offer.number}
		/>

		<Pdf.KvStrip
			cols={3}
			items={[
				{ k: 'Angebotsdatum', v: data.offer.issue_date },
				{ k: 'Gültig bis', v: data.offer.valid_until },
				{ k: 'Projekt', v: data.offer.project_name }
			]}
		/>

		<Pdf.Intro>{data.offer.intro_text}</Pdf.Intro>

		<Pdf.LineItemTable items={data.items} />

		<Pdf.Totals totals={data.totals} grossLabel="Angebotssumme">
			{#snippet notes()}
				<strong>Konditionen:</strong>
				{data.offer.conditions}<br />
				<strong>Lieferzeit:</strong>
				{data.offer.lead_time}
			{/snippet}
		</Pdf.Totals>

		<Pdf.NotesBlock label="Annahme / Acceptance">
			Bitte bestätigen Sie das Angebot per E-Mail an {issuer.email} oder unterzeichnet zurück. Mit Annahme
			gelten unsere AGB ({issuer.web}/agb).
		</Pdf.NotesBlock>

		<Pdf.SignatureGrid
			lines={['Ort, Datum / Place, Date', 'Unterschrift / Signature']}
			spacer={false}
		/>

		<Pdf.DocFooter {issuer} />
	</Pdf.Page>
</Pdf.Sheet>
