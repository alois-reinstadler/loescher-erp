<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { KvEntry } from './types.js';

	let {
		ref = $bindable(null),
		class: className,
		items,
		cols,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		items: KvEntry[];
		cols?: 3 | 4 | 5;
	} = $props();

	const colsClass = $derived(
		cols === 3 ? 'grid-cols-3' : cols === 5 ? 'grid-cols-5' : 'grid-cols-4'
	);
</script>

<div
	bind:this={ref}
	data-slot="pdf-kv-strip"
	class={cn(
		'mb-3 grid overflow-hidden rounded-lg border border-border bg-muted/50 shadow-sm',
		colsClass,
		className
	)}
	{...restProps}
>
	{#each items as entry (entry.k)}
		<div class="border-r border-border px-2 py-1.5 last:border-r-0">
			<div class="mb-1 font-mono text-[7.5pt] tracking-widest text-muted-foreground uppercase">
				{entry.k}
			</div>
			<div class="text-[10pt] font-medium">{entry.v}</div>
		</div>
	{/each}
</div>
