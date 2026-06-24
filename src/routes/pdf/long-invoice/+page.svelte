<script lang="ts">
	import * as Pdf from '$lib/components/pdf/index.js';
	import { page } from '$app/state';
	import { addMoney, parseLocalizedMoney } from '$lib/pdf/index.js';
	import { getBrand } from '$lib/pdf/brands.js';
	import { getCustomer } from '$lib/pdf/customers.js';
	import { longInvoiceFixture } from '$lib/pdf/fixtures/index.js';

	const brand = $derived(getBrand(page.url.searchParams.get('brand')));
	const customerEntry = $derived(getCustomer(page.url.searchParams.get('customer')));
	const issuer = $derived(brand.issuer);
	const customer = $derived(customerEntry.customer);
	const data = $derived(longInvoiceFixture(customer));

	const itemIndexByPosition = $derived(new Map(data.items.map((item, index) => [item.pos, index])));

	function getCarryIn(items: typeof data.items) {
		const firstIndex = itemIndexByPosition.get(items[0]?.pos ?? '') ?? 0;
		return addMoney(
			data.items.slice(0, firstIndex).map((item) => parseLocalizedMoney(item.line_total)),
			'EUR'
		);
	}

	function getCarryOut(items: typeof data.items) {
		const lastIndex = itemIndexByPosition.get(items.at(-1)?.pos ?? '') ?? -1;
		return addMoney(
			data.items.slice(0, lastIndex + 1).map((item) => parseLocalizedMoney(item.line_total)),
			'EUR'
		);
	}
</script>

<svelte:head>
	<title>Long Invoice {data.invoice.number}</title>
</svelte:head>

<Pdf.Sheet theme={issuer.theme}>
	<Pdf.Document items={data.items} getId={(item) => item.pos} reserveHeight={280}>
		{#snippet header(p)}
			{#if p.isFirstPage && data.status === 'draft'}
				<Pdf.Stamp variant="draft">Entwurf</Pdf.Stamp>
			{:else if p.isFirstPage && data.status === 'paid'}
				<Pdf.Stamp variant="paid">Bezahlt</Pdf.Stamp>
			{:else if p.isFirstPage && data.status === 'overdue'}
				<Pdf.Stamp variant="overdue">Überfällig</Pdf.Stamp>
			{/if}

			<Pdf.DocHead {issuer} />

			{#if p.isFirstPage}
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
			{:else}
				<Pdf.DocTitleRow
					typeLabel="Rechnung · Invoice"
					title="Rechnung Fortsetzung"
					bilingualTitle="/ Continued"
					number={`${data.invoice.number} · Seite ${p.pageNumber}/${p.totalPages}`}
				/>

				<Pdf.KvStrip
					cols={3}
					items={[
						{ k: 'Rechnungsnummer', v: data.invoice.number },
						{ k: 'Kunde', v: customer.number ?? '—' },
						{ k: 'Seite', v: `${p.pageNumber} von ${p.totalPages}` }
					]}
				/>
			{/if}
		{/snippet}

		{#snippet measure(item)}
			<Pdf.InvoiceItemTable items={[item]} />
		{/snippet}

		{#snippet children(p)}
			<Pdf.InvoiceItemTable
				items={p.items}
				carryIn={p.isFirstPage
					? undefined
					: {
							label: `Übertrag von Seite ${p.pageIndex}`,
							value: getCarryIn(p.items)
						}}
				carryOut={p.isLastPage
					? undefined
					: {
							label: `Zwischensumme Seite ${p.pageNumber}`,
							value: getCarryOut(p.items),
							note: `Fortsetzung auf Seite ${p.pageNumber + 1} von ${p.totalPages}`
						}}
			/>

			{#if p.isLastPage}
				<div class="mt-auto">
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
						<p>
							Verzugszinsen 9,2 % p.a. gemäß § 456 UGB. Eigentumsvorbehalt bis vollständiger
							Zahlung. Gerichtsstand Wien.
						</p>
					</Pdf.LegalNotes>
				</div>
			{/if}
		{/snippet}

		{#snippet footer()}
			<Pdf.DocFooter {issuer} />
		{/snippet}
	</Pdf.Document>
</Pdf.Sheet>
