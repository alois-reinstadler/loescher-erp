<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		typeLabel,
		title,
		bilingualTitle,
		number,
		numberLabel = 'Nummer · No.',
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		typeLabel: string;
		title: string;
		bilingualTitle?: string;
		number: string;
		numberLabel?: string;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="pdf-doc-title-row"
	class={cn('my-2.5 flex items-baseline justify-between', className)}
	{...restProps}
>
	<div>
		<div class="mb-1 font-mono text-[8.5pt] tracking-widest text-primary uppercase">
			{typeLabel}
		</div>
		<div class="font-heading text-[22pt] leading-none font-semibold tracking-tight">
			{title}
			{#if bilingualTitle}
				<span class="ml-2 text-[11pt] font-medium tracking-normal text-muted-foreground">
					{bilingualTitle}
				</span>
			{/if}
		</div>
	</div>
	<div class="text-right">
		<div class="mb-1 font-mono text-[8.5pt] tracking-widest text-primary uppercase">
			{numberLabel}
		</div>
		<div class="font-heading text-[16pt] font-semibold tracking-tight">{number}</div>
	</div>
</div>
