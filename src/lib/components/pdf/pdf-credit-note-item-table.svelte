<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLTableAttributes } from 'svelte/elements';
	import type { InvoiceLineItem } from './types.js';

	let {
		ref = $bindable(null),
		class: className,
		items,
		currency = '€',
		...restProps
	}: WithElementRef<HTMLTableAttributes> & {
		items: InvoiceLineItem[];
		currency?: string;
	} = $props();
</script>

<table
	bind:this={ref}
	data-slot="pdf-credit-note-item-table"
	class={cn('mb-2 w-full border-collapse', className)}
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
				class="w-24 border-b border-foreground py-1.5 pr-2 text-right font-mono text-[6.8pt] font-semibold tracking-widest text-muted-foreground uppercase"
				>Einzelpreis</th
			>
			<th
				class="w-14 border-b border-foreground py-1.5 pr-2 text-right font-mono text-[6.8pt] font-semibold tracking-widest text-muted-foreground uppercase"
				>USt.</th
			>
			<th
				class="w-24 border-b border-foreground py-1.5 pr-0 text-right font-mono text-[6.8pt] font-semibold tracking-widest text-muted-foreground uppercase"
				>Gutschrift</th
			>
		</tr>
	</thead>
	<tbody>
		{#each items as item (item.pos)}
			<tr>
				<td
					class="border-b border-border py-1 pr-2 align-top font-mono text-[9pt] text-muted-foreground"
				>
					{item.pos}
				</td>
				<td class="border-b border-border py-1 pr-2 align-top">
					<div class="font-semibold">{item.title}</div>
					<div class="text-[8pt] leading-tight text-muted-foreground">{item.description}</div>
				</td>
				<td class="border-b border-border py-1 pr-2 text-right align-top font-mono">
					−{item.qty}
				</td>
				<td class="border-b border-border py-1 pr-2 text-right align-top font-mono">
					{currency}
					{item.unit_price}
				</td>
				<td class="border-b border-border py-1 pr-2 text-right align-top font-mono">
					{item.vat_rate}%
				</td>
				<td class="border-b border-border py-1 pr-0 text-right align-top font-mono">
					−{currency}
					{item.line_total}
				</td>
			</tr>
		{/each}
	</tbody>
</table>
