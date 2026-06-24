<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		children: Snippet;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="pdf-measure-container"
	data-pdf-pending="true"
	class={cn('fixed top-0 left-[-9999px] w-[182mm] opacity-0', className)}
	aria-hidden="true"
	{...restProps}
>
	{@render children()}
</div>
