<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { IssuerTheme } from './types.js';

	let {
		ref = $bindable(null),
		class: className,
		theme,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		children: Snippet;
		theme?: IssuerTheme;
	} = $props();

	const themeStyle = $derived(
		theme
			? [
					theme.primary ? `--primary:${theme.primary}` : '',
					theme.primaryForeground ? `--primary-foreground:${theme.primaryForeground}` : '',
					theme.accent ? `--accent:${theme.accent}` : '',
					theme.accentForeground ? `--accent-foreground:${theme.accentForeground}` : ''
				]
					.filter(Boolean)
					.join(';')
			: undefined
	);

	onMount(() => {
		window.__PDF_READY__ = true;
	});
</script>

<svelte:head>
	<style>
		@page {
			size: A4 portrait;
			margin: 0;
		}
	</style>
</svelte:head>

<div
	data-slot="pdf-preview"
	class="min-h-svh bg-muted px-4 py-8 print:min-h-0 print:bg-background print:p-0"
>
	<div
		bind:this={ref}
		data-slot="pdf-sheet"
		class={cn('mx-auto flex w-fit flex-col gap-6 print:block print:w-auto', className)}
		style={themeStyle}
		{...restProps}
	>
		{@render children()}
	</div>
</div>

<style>
	:global(html),
	:global(body) {
		margin: 0;
		padding: 0;
		-webkit-print-color-adjust: exact;
		print-color-adjust: exact;
	}

	@media print {
		:global(html),
		:global(body),
		:global(#svelte) {
			min-height: 0 !important;
			background: white !important;
		}

		:global(.no-print) {
			display: none !important;
		}

		:global(.page-break) {
			break-before: page;
		}

		:global(thead) {
			display: table-header-group;
		}

		:global(tfoot) {
			display: table-footer-group;
		}

		:global(tr),
		:global(td),
		:global(th) {
			break-inside: avoid;
		}
	}
</style>
