<script lang="ts" generics="T">
	import { tick, untrack } from 'svelte';
	import { cn, type WithElementRef } from '$lib/utils.js';
	import { paginateBlocks, type PdfBlock } from '$lib/pdf/index.js';
	import MeasureContainer from '../measure/measure-container.svelte';
	import Page from '../page/page.svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type DocumentPageContext<T> = {
		items: T[];
		pageIndex: number;
		pageNumber: number;
		totalPages: number;
		isFirstPage: boolean;
		isLastPage: boolean;
	};

	let {
		ref = $bindable(null),
		class: className,
		pageClass,
		contentClass,
		items,
		getId,
		gap = 0,
		reserveHeight = 0,
		measure,
		header,
		footer,
		children,
		placeholder,
		onPaginated,
		...restProps
	}: WithElementRef<Omit<HTMLAttributes<HTMLDivElement>, 'children'>> & {
		pageClass?: string;
		contentClass?: string;
		items: T[];
		getId: (item: T, index: number) => string;
		gap?: number;
		reserveHeight?: number;
		measure: Snippet<[T, number]>;
		header?: Snippet<[DocumentPageContext<T>]>;
		footer?: Snippet<[DocumentPageContext<T>]>;
		children: Snippet<[DocumentPageContext<T>]>;
		placeholder?: Snippet;
		onPaginated?: (pages: T[][]) => void;
	} = $props();

	let measured = $state(false);
	let pages = $state<T[][]>([]);
	let measureElements = $state<(HTMLElement | undefined)[]>([]);
	let contentMeasureElement = $state<HTMLElement | null>(null);

	const measureContext = $derived({
		items: [],
		pageIndex: 0,
		pageNumber: 1,
		totalPages: 1,
		isFirstPage: true,
		isLastPage: true
	} satisfies DocumentPageContext<T>);

	function createContext(items: T[], pageIndex: number): DocumentPageContext<T> {
		return {
			items,
			pageIndex,
			pageNumber: pageIndex + 1,
			totalPages: pages.length,
			isFirstPage: pageIndex === 0,
			isLastPage: pageIndex === pages.length - 1
		};
	}

	async function measureAndPaginate() {
		if (typeof window !== 'undefined') {
			window.__PDF_READY__ = false;
		}

		measured = false;
		pages = [];
		measureElements = [];
		contentMeasureElement = null;

		await tick();
		await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

		const measuredContentElement = contentMeasureElement as HTMLElement | null;
		const pageContentHeight = Math.max(
			0,
			(measuredContentElement?.getBoundingClientRect().height || 920) - reserveHeight
		);
		const measuredBlocks = Array.from(
			ref?.querySelectorAll<HTMLElement>('[data-pdf-measure-block]') ?? []
		);
		const blocks: PdfBlock<T>[] = items.map((item, index) => ({
			id: getId(item, index),
			data: item,
			height:
				measuredBlocks[index]?.getBoundingClientRect().height ??
				measureElements[index]?.getBoundingClientRect().height ??
				0
		}));
		const paginated = paginateBlocks(blocks, pageContentHeight, gap);

		pages = paginated.map((page) => page.map((block) => block.data));
		measured = true;
		onPaginated?.(pages);

		await tick();

		if (typeof window !== 'undefined') {
			window.__PDF_READY__ = true;
		}
	}

	$effect(() => {
		const inputs = { items, gap, pageClass, reserveHeight };

		void inputs;
		void untrack(() => measureAndPaginate());
	});
</script>

<div bind:this={ref} data-slot="pdf-document" class={cn('contents', className)} {...restProps}>
	{#if !measured}
		<MeasureContainer class="w-auto">
			<Page class={cn('shadow-none ring-0', pageClass)}>
				{#if header}
					<div data-slot="pdf-document-header-measure">
						{@render header(measureContext)}
					</div>
				{/if}

				<div
					bind:this={contentMeasureElement}
					data-slot="pdf-document-content-measure"
					class={cn('min-h-0 flex-1', contentClass)}
				></div>

				{#if footer}
					<div data-slot="pdf-document-footer-measure" class="mt-auto">
						{@render footer(measureContext)}
					</div>
				{/if}
			</Page>

			<div data-slot="pdf-document-block-measure" class="w-[178mm]">
				{#each items as item, index (getId(item, index))}
					<div
						bind:this={measureElements[index]}
						data-pdf-measure-block={index}
						class="break-inside-avoid"
					>
						{@render measure(item, index)}
					</div>
				{/each}
			</div>
		</MeasureContainer>

		{#if placeholder}
			{@render placeholder()}
		{/if}
	{:else}
		{#each pages as pageItems, pageIndex (pageIndex)}
			{@const context = createContext(pageItems, pageIndex)}
			<Page class={pageClass}>
				{#if header}
					<div data-slot="pdf-document-header">
						{@render header(context)}
					</div>
				{/if}

				<div data-slot="pdf-document-content" class={cn('min-h-0 flex-1', contentClass)}>
					{@render children(context)}
				</div>

				{#if footer}
					<div data-slot="pdf-document-footer" class="mt-auto">
						{@render footer(context)}
					</div>
				{/if}
			</Page>
		{/each}
	{/if}
</div>
