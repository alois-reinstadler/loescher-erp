<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLElement>> & { children?: Snippet } = $props();
</script>

<section
	bind:this={ref}
	data-slot="pdf-page"
	class={cn(
		'relative mx-auto flex h-[297mm] w-[210mm] break-after-page flex-col overflow-hidden bg-card p-[18mm_16mm_22mm] text-card-foreground shadow-xl ring-1 ring-border last:break-after-auto print:m-0 print:shadow-none print:ring-0',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</section>
