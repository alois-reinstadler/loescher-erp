<script lang="ts">
	import SearchIcon from '@tabler/icons-svelte/icons/search';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	const results = [
		{ type: 'Customer', title: 'Billa Central Einkauf', detail: 'Meeting follow-up due Friday' },
		{ type: 'Purchase Order', title: 'PO-SZ-104', detail: 'Waiting for signed sales confirmation' },
		{ type: 'Shipment', title: 'LCL Ningbo 43A', detail: 'Customs documents ready for check' },
		{ type: 'Invoice', title: 'INV-2026-0184', detail: 'Payment reminder scheduled' }
	];
</script>

<svelte:head>
	<title>Search - Loescher ERP</title>
</svelte:head>

<div class="flex flex-col gap-6 py-4 md:py-6">
	<header class="px-4 lg:px-6">
		<p class="text-muted-foreground text-sm font-medium">Global Lookup</p>
		<h1 class="text-foreground mt-1 text-2xl font-semibold tracking-tight md:text-3xl">Search</h1>
		<p class="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed md:text-base">
			Find customers, supplier documents, shipments, invoices, and task references from one place.
		</p>
	</header>

	<div class="px-4 lg:px-6">
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center gap-2">
					<SearchIcon class="size-5" aria-hidden="true" />
					Search Workspace
				</Card.Title>
				<Card.Description>Static preview results until backend indexing is wired.</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<Input
					aria-label="Search workspace"
					placeholder="Search customer, order, shipment, invoice..."
				/>
				<div class="divide-border divide-y rounded-lg border">
					{#each results as result (result.title)}
						<div class="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<p class="font-medium">{result.title}</p>
								<p class="text-muted-foreground text-sm">{result.detail}</p>
							</div>
							<Badge variant="outline">{result.type}</Badge>
						</div>
					{/each}
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
