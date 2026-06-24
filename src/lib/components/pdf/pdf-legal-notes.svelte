<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & { children: Snippet } = $props();
</script>

<div
	bind:this={ref}
	data-slot="pdf-legal-notes"
	class={cn(
		'mt-2 border-t border-border pt-2 text-[7.4pt] leading-snug text-muted-foreground [&_p]:mt-0 [&_p]:mb-1 [&_strong]:font-semibold [&_strong]:text-foreground',
		className
	)}
	{...restProps}
>
	{@render children()}
</div>
