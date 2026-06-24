<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLTableAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		lineCount,
		packages,
		weight,
		...restProps
	}: WithElementRef<HTMLTableAttributes> & {
		lineCount: string;
		packages: string;
		weight: string;
	} = $props();
</script>

<table
	bind:this={ref}
	data-slot="pdf-delivery-totals"
	class={cn('ml-auto w-[280px] border-collapse', className)}
	{...restProps}
>
	<tbody>
		<tr class="subtotal">
			<td class="border-b border-border py-1 pr-5 text-[8.5pt] text-muted-foreground">
				Anzahl Positionen
			</td>
			<td class="border-b border-border py-1 text-right font-mono text-[8.5pt]">{lineCount}</td>
		</tr>
		<tr class="vat">
			<td class="py-1 pr-5 text-[8.5pt] text-muted-foreground">Anzahl Packstücke</td>
			<td class="py-1 text-right font-mono text-[8.5pt]">{packages}</td>
		</tr>
		<tr class="grand">
			<td class="border-t-2 border-foreground pt-1.5 pr-5 text-[10pt] font-semibold">
				Gesamtgewicht
			</td>
			<td
				class="border-t-2 border-foreground pt-1.5 text-right font-mono text-[10pt] font-semibold"
			>
				{weight} kg
			</td>
		</tr>
	</tbody>
</table>
