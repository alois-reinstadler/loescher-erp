<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { VatTotals } from './types.js';

	let {
		ref = $bindable(null),
		class: className,
		totals,
		notes,
		currency = '€',
		netLabel = 'Zwischensumme netto',
		grossLabel = 'Gesamtsumme',
		dueLabel,
		dueValue,
		negate = false,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		totals: VatTotals;
		notes?: Snippet;
		netLabel?: string;
		grossLabel?: string;
		dueLabel?: string;
		dueValue?: string;
		currency?: string;
		negate?: boolean;
	} = $props();

	const prefix = $derived(negate ? `−${currency}` : currency);
</script>

<div
	bind:this={ref}
	data-slot="pdf-vat-totals"
	class={cn('mb-3 grid grid-cols-[1fr_280px] gap-4', className)}
	{...restProps}
>
	<div class="text-[9pt] leading-snug text-muted-foreground">
		{#if notes}
			{@render notes()}
		{/if}
	</div>
	<table class="w-full border-collapse">
		<tbody>
			<tr class="subtotal">
				<td class="border-b border-border py-1 pr-5 text-[8.5pt] text-muted-foreground">
					{netLabel}
				</td>
				<td class="border-b border-border py-1 text-right font-mono text-[8.5pt]">
					{prefix}
					{totals.net}
				</td>
			</tr>
			{#each totals.vat_breakdown as vat (`${vat.rate}-${vat.base}-${vat.amount}`)}
				<tr class="vat">
					<td class="py-1 pr-5 text-[8.5pt] text-muted-foreground">
						USt. {vat.rate}% auf € {vat.base}
					</td>
					<td class="py-1 text-right font-mono text-[8.5pt]">{prefix} {vat.amount}</td>
				</tr>
			{/each}
			<tr class="grand">
				<td class="border-t-2 border-foreground pt-1.5 pr-5 text-[10pt] font-semibold">
					{grossLabel}
				</td>
				<td
					class="border-t-2 border-foreground pt-1.5 text-right font-mono text-[10pt] font-semibold"
				>
					{prefix}
					{totals.gross}
				</td>
			</tr>
			{#if dueLabel && dueValue}
				<tr class="due">
					<td class="pt-1 pr-5 text-[8.5pt] text-muted-foreground">{dueLabel}</td>
					<td class="pt-1 text-right text-[8.5pt] text-muted-foreground">{dueValue}</td>
				</tr>
			{/if}
		</tbody>
	</table>
</div>
