<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Issuer } from './types.js';

	let {
		ref = $bindable(null),
		class: className,
		issuer,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLElement>> & { issuer: Issuer } = $props();
</script>

<header
	bind:this={ref}
	data-slot="pdf-doc-head"
	class={cn(
		'relative mb-2.5 grid grid-cols-[1fr_auto] gap-6 border-b-2 border-foreground pb-2 leading-tight',
		className
	)}
	{...restProps}
>
	<div class="absolute bottom-[-5px] left-0 h-0.5 w-14 bg-primary"></div>
	<div class="flex items-center gap-3">
		{#if issuer.logo_svg}
			<div
				class="flex items-center text-primary [&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
				style:width={issuer.logo_width ?? '110px'}
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- brand logo SVG is trusted fixture/DB content -->
				{@html issuer.logo_svg}
			</div>
		{:else}
			<div
				class="grid size-7 place-items-center rounded-md bg-primary font-heading text-sm font-bold text-primary-foreground"
			>
				{issuer.brand_initial}
			</div>
			<div>
				<div class="font-heading text-[16pt] font-semibold tracking-tight">{issuer.name}</div>
				<div class="mt-0.5 text-[8.5pt] text-muted-foreground">{issuer.tagline}</div>
			</div>
		{/if}
	</div>
	<div class="text-right text-[8pt] leading-tight text-muted-foreground">
		<div>{issuer.address_line1}</div>
		<div>{issuer.address_line2}</div>
		<div>{issuer.email} · {issuer.phone}</div>
		<div>UID: {issuer.uid}</div>
	</div>
</header>
