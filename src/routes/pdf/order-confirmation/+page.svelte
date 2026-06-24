<script lang="ts">
	import * as Pdf from '$lib/components/pdf/index.js';
	import { page } from '$app/state';
	import { getBrand } from '$lib/pdf/brands.js';
	import { getCustomer } from '$lib/pdf/customers.js';
	import { orderConfirmationFixture } from '$lib/pdf/fixtures/index.js';

	const brand = $derived(getBrand(page.url.searchParams.get('brand')));
	const customerEntry = $derived(getCustomer(page.url.searchParams.get('customer')));
	const issuer = $derived(brand.issuer);
	const customer = $derived(customerEntry.customer);
	const data = $derived(orderConfirmationFixture(customer, issuer));
</script>

<svelte:head>
	<title>Order Confirmation {data.order.number}</title>
</svelte:head>

<Pdf.Sheet theme={issuer.theme}>
	<Pdf.Page>
		<Pdf.DocHead {issuer} />

		<Pdf.AddressGrid
			blocks={[
				{
					label: 'Auftraggeber / Customer',
					name: customer.name,
					address: customer.address
				},
				{
					label: 'Bezug / Reference',
					name: `Angebot ${data.order.offer_number}`,
					address: `vom ${data.order.offer_date}`
				}
			]}
		/>

		<Pdf.DocTitleRow
			typeLabel="Auftragsbestätigung · Order Confirmation"
			title="Auftragsbestätigung"
			bilingualTitle="/ Order Confirmation"
			number={data.order.number}
		/>

		<Pdf.KvStrip
			items={[
				{ k: 'Bestätigt am', v: data.order.issue_date },
				{ k: 'Liefertermin', v: data.order.delivery_date },
				{ k: 'Bestellnr. Kunde', v: data.order.customer_po },
				{ k: 'Sachbearbeiter', v: data.order.handler }
			]}
		/>

		<Pdf.Intro>{data.order.intro_text}</Pdf.Intro>

		<Pdf.LineItemTable items={data.items} />

		<Pdf.Totals totals={data.totals} grossLabel="Auftragssumme">
			{#snippet notes()}
				<strong>Lieferbedingungen:</strong>
				{data.order.delivery_terms}<br />
				<strong>Zahlungsbedingungen:</strong>
				{data.order.payment_terms}
			{/snippet}
		</Pdf.Totals>

		<Pdf.NotesBlock label="Hinweis / Note">
			Mit dieser Auftragsbestätigung kommt zwischen Ihnen und uns ein Vertrag zustande. Sollten
			Abweichungen zu Ihrer Bestellung bestehen, melden Sie sich bitte binnen 5 Werktagen.
		</Pdf.NotesBlock>

		<Pdf.DocFooter {issuer} />
	</Pdf.Page>
</Pdf.Sheet>
