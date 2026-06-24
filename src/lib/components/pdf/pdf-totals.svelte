<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Totals } from './types.js';

	let {
		ref = $bindable(null),
		class: className,
		totals,
		notes,
		currency = '€',
		netLabel = 'Netto',
		vatLabel = 'USt. 20 %',
		grossLabel = 'Gesamtsumme',
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		totals: Totals;
		notes?: Snippet;
		currency?: string;
		netLabel?: string;
		vatLabel?: string;
		grossLabel?: string;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="pdf-totals"
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
					{currency}
					{totals.net}
				</td>
			</tr>
			<tr class="vat">
				<td class="py-1 pr-5 text-[8.5pt] text-muted-foreground">{vatLabel}</td>
				<td class="py-1 text-right font-mono text-[8.5pt]">{currency} {totals.vat}</td>
			</tr>
			<tr class="grand">
				<td class="border-t-2 border-foreground pt-1.5 pr-5 text-[10pt] font-semibold">
					{grossLabel}
				</td>
				<td
					class="border-t-2 border-foreground pt-1.5 text-right font-mono text-[10pt] font-semibold"
				>
					{currency}
					{totals.gross}
				</td>
			</tr>
		</tbody>
	</table>
</div>
