<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { AddressBlock } from './types.js';

	let {
		ref = $bindable(null),
		class: className,
		blocks,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & { blocks: AddressBlock[] } = $props();
</script>

<div
	bind:this={ref}
	data-slot="pdf-address-grid"
	class={cn('my-2.5 grid grid-cols-2 gap-6 text-[8.4pt] leading-tight', className)}
	{...restProps}
>
	{#each blocks as block (block.label)}
		<div>
			<div class="mb-1.5 font-mono text-[8pt] tracking-widest text-muted-foreground uppercase">
				{block.label}
			</div>
			<div class="mb-0.5 text-[10pt] font-semibold">{block.name}</div>
			<div class="text-[8.4pt] leading-tight whitespace-pre-line text-muted-foreground">
				{block.address}
			</div>
		</div>
	{/each}
</div>
