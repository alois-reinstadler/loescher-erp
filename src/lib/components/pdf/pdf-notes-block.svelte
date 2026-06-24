<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		label,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		label: string;
		children: Snippet;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="pdf-notes-block"
	class={cn(
		'my-2.5 border-l-4 border-primary bg-muted/60 px-2.5 py-2 text-[8.2pt] leading-snug',
		className
	)}
	{...restProps}
>
	<span class="mb-1 block font-mono text-[7.5pt] tracking-widest text-primary uppercase"
		>{label}</span
	>
	{@render children()}
</div>
