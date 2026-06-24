<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Variant = 'draft' | 'paid' | 'overdue' | 'default';

	let {
		ref = $bindable(null),
		class: className,
		variant = 'default',
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		variant?: Variant;
		children: Snippet;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="pdf-stamp"
	data-variant={variant}
	class={cn(
		'absolute top-[28mm] right-[16mm] rotate-[-8deg] border-[3px] border-current px-[18px] py-2 font-heading text-[22pt] font-bold tracking-wide uppercase opacity-85',
		variant === 'paid' && 'text-emerald-700',
		variant === 'overdue' && 'text-destructive',
		(variant === 'draft' || variant === 'default') && 'text-muted-foreground',
		className
	)}
	{...restProps}
>
	{@render children()}
</div>
