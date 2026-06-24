<script lang="ts">
	import * as Pdf from '$lib/components/pdf/index.js';
	import { page } from '$app/state';
	import { getBrand } from '$lib/pdf/brands.js';
	import { getCustomer } from '$lib/pdf/customers.js';
	import { deliveryNoteFixture } from '$lib/pdf/fixtures/index.js';

	const brand = $derived(getBrand(page.url.searchParams.get('brand')));
	const customerEntry = $derived(getCustomer(page.url.searchParams.get('customer')));
	const issuer = $derived(brand.issuer);
	const customer = $derived(customerEntry.customer);
	const data = $derived(deliveryNoteFixture(customer));
</script>

<svelte:head>
	<title>Delivery Note {data.delivery.number}</title>
</svelte:head>

<Pdf.Sheet theme={issuer.theme}>
	<Pdf.Page>
		<Pdf.DocHead {issuer} />

		<Pdf.AddressGrid
			blocks={[
				{
					label: 'Lieferadresse / Ship to',
					name: data.shipping.name,
					address: data.shipping.address
				},
				{ label: 'Rechnung an / Bill to', name: customer.name, address: customer.address }
			]}
		/>

		<Pdf.DocTitleRow
			typeLabel="Lieferschein · Delivery Note"
			title="Lieferschein"
			bilingualTitle="/ Delivery Note"
			number={data.delivery.number}
		/>

		<Pdf.KvStrip
			items={[
				{ k: 'Lieferdatum', v: data.delivery.date },
				{ k: 'Bezug Auftrag', v: data.delivery.order_ref },
				{ k: 'Spedition', v: data.delivery.carrier },
				{ k: 'Sendungs-Nr.', v: data.delivery.tracking }
			]}
		/>

		<Pdf.Intro>{data.delivery.intro_text}</Pdf.Intro>

		<Pdf.DeliveryItemTable items={data.items} />

		<Pdf.DeliveryTotals
			lineCount={data.totals.line_count}
			packages={data.totals.packages}
			weight={data.totals.weight}
		/>

		<Pdf.NotesBlock label="Anweisungen / Instructions">{data.delivery.notes}</Pdf.NotesBlock>

		<Pdf.SignatureGrid
			lines={['Übergeben am, durch / Released by', 'Übernommen am, durch / Received by']}
		/>

		<Pdf.DocFooter {issuer}>
			{#snippet fourthColumn()}
				<strong>Hinweis</strong>
				Lieferung erfolgt unter Eigentumsvorbehalt bis zur vollständigen Bezahlung.
			{/snippet}
		</Pdf.DocFooter>
	</Pdf.Page>
</Pdf.Sheet>
