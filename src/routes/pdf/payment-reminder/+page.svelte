<script lang="ts">
	import * as Pdf from '$lib/components/pdf/index.js';
	import { page } from '$app/state';
	import { getBrand } from '$lib/pdf/brands.js';
	import { getCustomer } from '$lib/pdf/customers.js';
	import { paymentReminderFixture } from '$lib/pdf/fixtures/index.js';
	import type { PageData } from './$types';

	let { data: pageData }: { data: PageData } = $props();

	const brand = $derived(getBrand(page.url.searchParams.get('brand')));
	const customerEntry = $derived(getCustomer(page.url.searchParams.get('customer')));
	const issuer = $derived(pageData.issuer ?? brand.issuer);
	const customer = $derived(customerEntry.customer);
	const data = $derived(paymentReminderFixture(customer));
</script>

<svelte:head>
	<title>Payment Reminder {data.reminder.number}</title>
</svelte:head>

<Pdf.Sheet theme={issuer.theme}>
	<Pdf.Page>
		{#if data.reminder.level >= 2}
			<Pdf.Stamp variant="overdue">{data.reminder.level_label}</Pdf.Stamp>
		{/if}

		<Pdf.DocHead {issuer} />

		<Pdf.AddressGrid
			blocks={[
				{ label: 'Empfänger', name: customer.name, address: customer.address },
				{
					label: 'Bezug',
					name: `Rechnung ${data.reminder.invoice_number}`,
					address: `vom ${data.reminder.invoice_date}, fällig ${data.reminder.due_date}`
				}
			]}
		/>

		<Pdf.DocTitleRow
			typeLabel={`${data.reminder.level_label} · Payment Reminder`}
			title={data.reminder.level_label}
			number={data.reminder.number}
		/>

		<Pdf.KvStrip
			cols={3}
			items={[
				{ k: 'Mahnstufe', v: data.reminder.level_label },
				{ k: 'Tage überfällig', v: data.reminder.days_overdue },
				{ k: 'Neue Frist', v: data.reminder.new_deadline }
			]}
		/>

		<Pdf.Intro>{data.reminder.intro_text}</Pdf.Intro>

		<Pdf.ReminderItemTable items={data.open_items} />

		<Pdf.ReminderTotals
			totals={data.totals}
			deadline={data.reminder.new_deadline}
			reference={data.reminder.invoice_number}
		/>

		<Pdf.NotesBlock label="Wichtig / Important">{data.reminder.escalation_text}</Pdf.NotesBlock>

		<Pdf.PaymentBlock
			{issuer}
			title="Bitte überweisen Sie auf folgendes Konto:"
			reference={data.reminder.invoice_number}
			amount={data.totals.gross}
		/>

		<Pdf.LegalNotes>
			<p>
				Sollte sich diese Mahnung mit Ihrer Zahlung gekreuzt haben, betrachten Sie dieses Schreiben
				bitte als gegenstandslos.
			</p>
			{#if data.reminder.level >= 3}
				<p>
					<strong>Achtung:</strong> Nach Ablauf der gesetzten Frist behalten wir uns die Übergabe an unseren
					Rechtsanwalt sowie die gerichtliche Geltendmachung ohne weitere Ankündigung vor.
				</p>
			{/if}
		</Pdf.LegalNotes>

		<Pdf.DocFooter {issuer} />
	</Pdf.Page>
</Pdf.Sheet>
