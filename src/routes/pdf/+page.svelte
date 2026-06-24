<script lang="ts">
	import { page } from '$app/state';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { brandList, defaultBrandId } from '$lib/pdf/brands.js';
	import { createPdfPreviewHref, PDF_DOCUMENTS, type PdfDocumentSpec } from '$lib/pdf/catalog.js';
	import { customerList, defaultCustomerId } from '$lib/pdf/customers.js';

	const brandId = $derived(page.url.searchParams.get('brand') ?? defaultBrandId);
	const customerId = $derived(page.url.searchParams.get('customer') ?? defaultCustomerId);

	function buildHref(doc: PdfDocumentSpec): string {
		return createPdfPreviewHref(doc, brandId, customerId);
	}

	function buildSelectorHref(updates: Record<string, string>): string {
		const params = new SvelteURLSearchParams({ brand: brandId, customer: customerId, ...updates });
		return `/pdf?${params.toString()}`;
	}
</script>

<svelte:head>
	<title>PDF Documents</title>
</svelte:head>

<main class="min-h-svh bg-zinc-100 px-6 py-10 text-zinc-950">
	<div class="mx-auto max-w-5xl">
		<div class="mb-8">
			<p class="text-sm font-medium tracking-wide text-amber-700 uppercase">PDF templates</p>
			<h1 class="mt-2 text-3xl font-semibold tracking-tight">Document previews</h1>
			<p class="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
				Preview any document for any (brand × customer) combination. Brand controls the issuer
				identity (name, bank, logo, theme). Customer controls the recipient block.
			</p>
		</div>

		<div class="mb-6 grid gap-4 rounded-lg border border-zinc-200 bg-white p-4 sm:grid-cols-2">
			<div>
				<div class="mb-2 text-xs font-semibold tracking-wide text-zinc-500 uppercase">Brand</div>
				<div class="flex flex-wrap gap-2">
					{#each brandList as b (b.id)}
						<a
							href={buildSelectorHref({ brand: b.id })}
							class="rounded-md border px-3 py-1.5 text-sm transition {b.id === brandId
								? 'border-amber-500 bg-amber-50 font-medium text-amber-900'
								: 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'}"
						>
							{b.label}
						</a>
					{/each}
				</div>
			</div>
			<div>
				<div class="mb-2 text-xs font-semibold tracking-wide text-zinc-500 uppercase">Customer</div>
				<div class="flex flex-wrap gap-2">
					{#each customerList as c (c.id)}
						<a
							href={buildSelectorHref({ customer: c.id })}
							class="rounded-md border px-3 py-1.5 text-sm transition {c.id === customerId
								? 'border-amber-500 bg-amber-50 font-medium text-amber-900'
								: 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'}"
						>
							{c.label}
						</a>
					{/each}
				</div>
			</div>
		</div>

		<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each PDF_DOCUMENTS as doc (doc.id)}
				<a
					href={buildHref(doc)}
					class="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-amber-500 hover:shadow-md"
				>
					<div class="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
						{doc.label}
					</div>
					<div class="mt-2 text-lg font-semibold">{doc.title}</div>
					<p class="mt-2 text-sm leading-6 text-zinc-600">{doc.description}</p>
					{#if !doc.usesCustomer}
						<p class="mt-3 text-[11px] text-zinc-500">Customer N/A — addressed to a supplier.</p>
					{/if}
				</a>
			{/each}
		</div>
	</div>
</main>
