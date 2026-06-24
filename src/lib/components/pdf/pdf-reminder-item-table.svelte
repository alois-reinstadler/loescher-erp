<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLTableAttributes } from 'svelte/elements';
	import type { OpenItem } from './types.js';

	let {
		ref = $bindable(null),
		class: className,
		items,
		...restProps
	}: WithElementRef<HTMLTableAttributes> & { items: OpenItem[] } = $props();
</script>

<table
	bind:this={ref}
	data-slot="pdf-reminder-item-table"
	class={cn('mb-4 w-full border-collapse', className)}
	{...restProps}
>
	<thead>
		<tr>
			<th
				class="border-b border-foreground py-1.5 pr-2 text-left font-mono text-[6.8pt] font-semibold tracking-widest text-muted-foreground uppercase"
				>Beleg / Document</th
			>
			<th
				class="border-b border-foreground py-1.5 pr-2 text-right font-mono text-[6.8pt] font-semibold tracking-widest text-muted-foreground uppercase"
				>Datum</th
			>
			<th
				class="border-b border-foreground py-1.5 pr-2 text-right font-mono text-[6.8pt] font-semibold tracking-widest text-muted-foreground uppercase"
				>Fälligkeit</th
			>
			<th
				class="border-b border-foreground py-1.5 pr-2 text-right font-mono text-[6.8pt] font-semibold tracking-widest text-muted-foreground uppercase"
				>Tage offen</th
			>
			<th
				class="w-24 border-b border-foreground py-1.5 pr-0 text-right font-mono text-[6.8pt] font-semibold tracking-widest text-muted-foreground uppercase"
				>Offener Betrag</th
			>
		</tr>
	</thead>
	<tbody>
		{#each items as item (item.number)}
			<tr>
				<td class="border-b border-border py-1 pr-2 align-top">
					<div class="font-semibold">{item.number}</div>
					<div class="text-[8pt] leading-tight text-muted-foreground">{item.description}</div>
				</td>
				<td class="border-b border-border py-1 pr-2 text-right align-top font-mono">
					{item.date}
				</td>
				<td class="border-b border-border py-1 pr-2 text-right align-top font-mono">
					{item.due}
				</td>
				<td class="border-b border-border py-1 pr-2 text-right align-top font-mono">
					{item.days}
				</td>
				<td class="border-b border-border py-1 pr-0 text-right align-top font-mono">
					€ {item.amount}
				</td>
			</tr>
		{/each}
	</tbody>
</table>
