<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLTableAttributes } from 'svelte/elements';
	import type { LineItem } from './types.js';

	let {
		ref = $bindable(null),
		class: className,
		items,
		currency = '€',
		...restProps
	}: WithElementRef<HTMLTableAttributes> & { items: LineItem[]; currency?: string } = $props();
</script>

<table
	bind:this={ref}
	data-slot="pdf-line-item-table"
	class={cn('mb-4 w-full border-collapse', className)}
	{...restProps}
>
	<thead>
		<tr class="border-b border-foreground">
			<th
				class="w-7 py-1.5 pr-2 text-left font-mono text-[8pt] font-semibold tracking-widest text-muted-foreground uppercase"
				>#</th
			>
			<th
				class="py-1.5 pr-2 text-left font-mono text-[8pt] font-semibold tracking-widest text-muted-foreground uppercase"
				>Artikel / Item</th
			>
			<th
				class="w-16 py-1.5 pr-2 text-right font-mono text-[8pt] font-semibold tracking-widest text-muted-foreground uppercase"
				>Menge</th
			>
			<th
				class="w-14 py-1.5 pr-2 text-right font-mono text-[8pt] font-semibold tracking-widest text-muted-foreground uppercase"
				>Einh.</th
			>
			<th
				class="py-1.5 pr-2 text-right font-mono text-[8pt] font-semibold tracking-widest text-muted-foreground uppercase"
				>Einzelpreis</th
			>
			<th
				class="py-1.5 pr-0 text-right font-mono text-[8pt] font-semibold tracking-widest text-muted-foreground uppercase"
				>Gesamt</th
			>
		</tr>
	</thead>
	<tbody>
		{#each items as item (item.pos)}
			<tr class="border-b border-border [&>*]:py-1.5 [&>*]:pr-2">
				<td class="align-middle font-mono text-[8pt] text-muted-foreground">
					{item.pos}
				</td>
				<td>
					<div class="pr-2 align-middle">
						<div class="font-semibold text-[12pt]">{item.title}</div>
						<div class="text-[8pt] leading-tight text-muted-foreground">{item.description}</div>
					</div>
					{#if item.sku}
						<div class="mt-1 font-mono text-[8pt] text-muted-foreground">SKU: {item.sku}</div>
					{/if}
				</td>
				<td class="text-right align-middle font-mono text-[10pt]">{item.qty}</td>
				<td class="text-right align-middle font-mono text-[10pt]">
					{item.unit ?? '—'}
				</td>
				<td class="text-right align-middle font-mono text-[10pt]">
					{currency}
					{item.unit_price ?? '—'}
				</td>
				<td class="pr-0 text-right align-middle font-mono text-[10pt]">
					{currency}
					{item.line_total}
				</td>
			</tr>
		{/each}
	</tbody>
</table>
