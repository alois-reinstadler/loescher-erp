<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLParagraphElement>> & { children: Snippet } = $props();
</script>

<p
	bind:this={ref}
	data-slot="pdf-intro"
	class={cn('mb-2 text-[8.5pt] leading-snug text-muted-foreground', className)}
	{...restProps}
>
	{@render children()}
</p>
