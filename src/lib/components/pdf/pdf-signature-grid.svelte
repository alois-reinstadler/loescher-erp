<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		lines,
		spacer = true,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		lines: string[];
		spacer?: boolean;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="pdf-signature-grid"
	class={cn('mt-4 grid grid-cols-2 gap-8', className)}
	{...restProps}
>
	{#each lines as line (line)}
		<div>
			{#if spacer}
				<div class="h-[30px]"></div>
			{/if}
			<div
				class="border-t border-foreground pt-1.5 font-mono text-[8.5pt] tracking-wider text-muted-foreground uppercase"
			>
				{line}
			</div>
		</div>
	{/each}
</div>
