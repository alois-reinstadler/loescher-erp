<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { ReminderTotals } from './types.js';

	let {
		ref = $bindable(null),
		class: className,
		totals,
		deadline,
		reference,
		currency = '€',
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		totals: ReminderTotals;
		deadline: string;
		reference: string;
		currency?: string;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="pdf-reminder-totals"
	class={cn('mb-3 grid grid-cols-[1fr_280px] gap-4', className)}
	{...restProps}
>
	<div class="text-[9pt] leading-snug text-muted-foreground">
		<strong>Zahlung erbeten bis:</strong>
		{deadline}<br />
		<strong>Verwendungszweck:</strong>
		{reference}
	</div>
	<table class="w-full border-collapse">
		<tbody>
			<tr>
				<td class="border-b border-border py-1 pr-5 text-[8.5pt] text-muted-foreground">
					Hauptforderung
				</td>
				<td class="border-b border-border py-1 text-right font-mono text-[8.5pt]">
					{currency}
					{totals.principal}
				</td>
			</tr>
			{#if totals.interest}
				<tr>
					<td class="py-1 pr-5 text-[8.5pt] text-muted-foreground">Verzugszinsen 9,2 %</td>
					<td class="py-1 text-right font-mono text-[8.5pt]">
						{currency}
						{totals.interest}
					</td>
				</tr>
			{/if}
			{#if totals.fees}
				<tr>
					<td class="py-1 pr-5 text-[8.5pt] text-muted-foreground">Mahnspesen</td>
					<td class="py-1 text-right font-mono text-[8.5pt]">
						{currency}
						{totals.fees}
					</td>
				</tr>
			{/if}
			<tr>
				<td class="border-t-2 border-foreground pt-1.5 pr-5 text-[10pt] font-semibold">
					Gesamtforderung
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
