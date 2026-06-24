<script lang="ts">
	import * as Pdf from '$lib/components/pdf/index.js';
	import { page } from '$app/state';
	import { getBrand } from '$lib/pdf/brands.js';
	import { purchaseOrderFixture } from '$lib/pdf/fixtures/index.js';

	const brand = $derived(getBrand(page.url.searchParams.get('brand')));
	const issuer = $derived(brand.issuer);
	const data = $derived(purchaseOrderFixture(issuer));
</script>

<svelte:head>
	<title>Purchase Order {data.po.number}</title>
</svelte:head>

<Pdf.Sheet theme={issuer.theme}>
	<Pdf.Page>
		<Pdf.DocHead {issuer} />

		<Pdf.AddressGrid
			blocks={[
				{ label: 'Lieferant / Supplier', name: data.supplier.name, address: data.supplier.address },
				{
					label: 'Lieferadresse / Ship to',
					name: data.shipping.name,
					address: data.shipping.address
				}
			]}
		/>

		<Pdf.DocTitleRow
			typeLabel="Bestellung · Purchase Order"
			title="Bestellung"
			bilingualTitle="/ Purchase Order"
			number={data.po.number}
		/>

		<Pdf.KvStrip
			items={[
				{ k: 'Bestelldatum', v: data.po.issue_date },
				{ k: 'Wunschtermin', v: data.po.requested_date },
				{ k: 'Lieferant-Nr.', v: data.supplier.number ?? '—' },
				{ k: 'Sachbearbeiter', v: data.po.handler }
			]}
		/>

		<Pdf.Intro>{data.po.intro_text}</Pdf.Intro>

		<Pdf.LineItemTable items={data.items} />

		<Pdf.Totals totals={data.totals} grossLabel="Bestellsumme">
			{#snippet notes()}
				<strong>Lieferbedingungen:</strong>
				{data.po.delivery_terms}<br />
				<strong>Zahlungsbedingungen:</strong>
				{data.po.payment_terms}<br />
				<strong>Versand an:</strong>
				{data.shipping.name}
			{/snippet}
		</Pdf.Totals>

		<Pdf.NotesBlock label="Bedingungen / Conditions">
			Bitte beziehen Sie sich auf unsere Bestellnummer {data.po.number} bei sämtlichen Lieferpapieren
			und Rechnungen. Abweichende Mengen oder Termine bitte vor Versand mit uns abstimmen.
		</Pdf.NotesBlock>

		<Pdf.SignatureGrid lines={['Datum, Unterschrift Besteller', 'Bestätigung Lieferant']} />

		<Pdf.DocFooter {issuer} />
	</Pdf.Page>
</Pdf.Sheet>
