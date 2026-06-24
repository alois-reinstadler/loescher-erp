<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import { formatMoney } from '$lib/pdf/index.js';
	import type { HTMLTableAttributes } from 'svelte/elements';
	import type { InvoiceLineItem, Money } from './types.js';

	type CarryRow = {
		label: string;
		value: Money | string;
		note?: string;
	};

	let {
		ref = $bindable(null),
		class: className,
		items,
		currency = '€',
		carryIn,
		carryOut,
		locale = 'de-AT',
		...restProps
	}: WithElementRef<HTMLTableAttributes> & {
		items: InvoiceLineItem[];
		currency?: string;
		carryIn?: CarryRow;
		carryOut?: CarryRow;
		locale?: string;
	} = $props();

	function formatCarryValue(value: Money | string) {
		return typeof value === 'string' ? value : formatMoney(value, locale);
	}
</script>

<table
	bind:this={ref}
	data-slot="pdf-invoice-item-table"
	class={cn('mb-4 w-full border-collapse', className)}
	{...restProps}
>
	<thead>
		<tr>
			<th
				class="w-7 border-b border-foreground py-1.5 pr-2 text-left font-mono text-[6.8pt] font-semibold tracking-widest text-muted-foreground uppercase"
				>#</th
			>
			<th
				class="border-b border-foreground py-1.5 pr-2 text-left font-mono text-[6.8pt] font-semibold tracking-widest text-muted-foreground uppercase"
				>Beschreibung / Description</th
			>
			<th
				class="w-16 border-b border-foreground py-1.5 pr-2 text-right font-mono text-[6.8pt] font-semibold tracking-widest text-muted-foreground uppercase"
				>Menge</th
			>
			<th
				class="w-14 border-b border-foreground py-1.5 pr-2 text-right font-mono text-[6.8pt] font-semibold tracking-widest text-muted-foreground uppercase"
				>Einh.</th
			>
			<th
				class="w-24 border-b border-foreground py-1.5 pr-2 text-right font-mono text-[6.8pt] font-semibold tracking-widest text-muted-foreground uppercase"
				>Einzelpreis</th
			>
			<th
				class="w-14 border-b border-foreground py-1.5 pr-2 text-right font-mono text-[6.8pt] font-semibold tracking-widest text-muted-foreground uppercase"
				>USt.</th
			>
			<th
				class="w-24 border-b border-foreground py-1.5 pr-0 text-right font-mono text-[6.8pt] font-semibold tracking-widest text-muted-foreground uppercase"
				>Gesamt</th
			>
		</tr>
	</thead>
	<tbody>
		{#if carryIn}
			<tr data-slot="pdf-invoice-item-table-carry-in">
				<td class="border-b border-border py-1 pr-2 align-top"></td>
				<td class="border-b border-border py-1 pr-2 align-top">
					<div class="font-semibold">{carryIn.label}</div>
					{#if carryIn.note}
						<div class="text-[8pt] leading-tight text-muted-foreground">{carryIn.note}</div>
					{/if}
				</td>
				<td class="border-b border-border py-1 pr-2 text-right align-top font-mono"></td>
				<td class="border-b border-border py-1 pr-2 text-right align-top font-mono"></td>
				<td class="border-b border-border py-1 pr-2 text-right align-top font-mono"></td>
				<td class="border-b border-border py-1 pr-2 text-right align-top font-mono"></td>
				<td class="border-b border-border py-1 pr-0 text-right align-top font-mono font-semibold">
					{formatCarryValue(carryIn.value)}
				</td>
			</tr>
		{/if}

		{#each items as item (item.pos)}
			<tr>
				<td
					class="border-b border-border py-1 pr-2 align-top font-mono text-[9pt] text-muted-foreground"
				>
					{item.pos}
				</td>
				<td>
					<div class="border-b border-border py-1 pr-2 align-top">
						<div class="font-semibold">{item.title}</div>
						<div class="text-[8pt] leading-tight text-muted-foreground">{item.description}</div>
						{#if item.meta}
							<div class="mt-0.5 font-mono text-[7.4pt] text-muted-foreground">{item.meta}</div>
						{/if}
					</div>
				</td>
				<td class="border-b border-border py-1 pr-2 text-right align-top font-mono">{item.qty}</td>
				<td class="border-b border-border py-1 pr-2 text-right align-top font-mono">
					{item.unit ?? '—'}
				</td>
				<td class="border-b border-border py-1 pr-2 text-right align-top font-mono">
					{currency}
					{item.unit_price ?? '—'}
				</td>
				<td class="border-b border-border py-1 pr-2 text-right align-top font-mono">
					{item.vat_rate}%
				</td>
				<td class="border-b border-border py-1 pr-0 text-right align-top font-mono">
					{currency}
					{item.line_total}
				</td>
			</tr>
		{/each}

		{#if carryOut}
			<tr data-slot="pdf-invoice-item-table-carry-out">
				<td class="border-b border-border py-1 pr-2 align-top"></td>
				<td class="border-b border-border py-1 pr-2 align-top">
					<div class="font-semibold">{carryOut.label}</div>
					{#if carryOut.note}
						<div class="text-[8pt] leading-tight text-muted-foreground">{carryOut.note}</div>
					{/if}
				</td>
				<td class="border-b border-border py-1 pr-2 text-right align-top font-mono"></td>
				<td class="border-b border-border py-1 pr-2 text-right align-top font-mono"></td>
				<td class="border-b border-border py-1 pr-2 text-right align-top font-mono"></td>
				<td class="border-b border-border py-1 pr-2 text-right align-top font-mono"></td>
				<td class="border-b border-border py-1 pr-0 text-right align-top font-mono font-semibold">
					{formatCarryValue(carryOut.value)}
				</td>
			</tr>
		{/if}
	</tbody>
</table>
