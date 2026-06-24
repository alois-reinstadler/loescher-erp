<script lang="ts">
	import PhotoIcon from '@tabler/icons-svelte/icons/photo';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { BadgeVariant } from '$lib/components/ui/badge/index.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function statusVariant(status: string): BadgeVariant {
		if (status === 'Negotiating') return 'default';
		if (status === 'Shortlisted') return 'secondary';
		if (status === 'Received') return 'outline';
		return 'destructive';
	}

	function countryFlag(country: string) {
		return country === 'China' ? '🇨🇳' : '🇮🇳';
	}
</script>

<svelte:head>
	<title>Sourcing - Loescher ERP</title>
</svelte:head>

{#await data.operations.data}
	<div class="flex flex-col gap-6 p-4 lg:p-6">
		<Skeleton class="h-24 rounded-4xl" />
		<Skeleton class="h-96 rounded-4xl" />
	</div>
{:then operations}
	<div class="flex flex-col gap-6 py-4 md:py-6">
		<header class="px-4 lg:px-6">
			<p class="text-muted-foreground text-sm font-medium">Sourcing</p>
			<h1 class="text-foreground mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
				Photo Quotations
			</h1>
			<p class="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed md:text-base">
				Requests sent to Chinese and Indian suppliers. Track pricing, MOQ, lead times, and
				negotiation status.
			</p>
		</header>

		<div class="grid gap-4 px-4 md:grid-cols-3 lg:px-6">
			{#each operations.photoQuotations as pq (pq.id)}
				<Card.Root>
					<Card.Header class="pb-3">
						<div class="flex items-start justify-between">
							<div class="flex items-center gap-2">
								<span class="text-lg">{countryFlag(pq.country)}</span>
								<div>
									<Card.Title class="text-base">{pq.supplier}</Card.Title>
									<Card.Description>{pq.id}</Card.Description>
								</div>
							</div>
							<Badge variant={statusVariant(pq.status)}>{pq.status}</Badge>
						</div>
					</Card.Header>
					<Card.Content class="flex flex-col gap-3">
						<div class="flex items-center gap-2 text-sm">
							<PhotoIcon aria-hidden="true" class="text-muted-foreground size-4 shrink-0" />
							<span>{pq.product}</span>
						</div>
						<div class="grid grid-cols-3 gap-2 text-sm">
							<div>
								<p class="text-muted-foreground">Price</p>
								<p class="font-medium">{pq.price}</p>
							</div>
							<div>
								<p class="text-muted-foreground">MOQ</p>
								<p class="font-medium">{pq.moq}</p>
							</div>
							<div>
								<p class="text-muted-foreground">Lead Time</p>
								<p class="font-medium">{pq.leadTime}</p>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>

		<div class="px-4 lg:px-6">
			<Card.Root>
				<Card.Header>
					<Card.Title>All Quotations</Card.Title>
					<Card.Description
						>Complete list of photoquotation requests and their status.</Card.Description
					>
				</Card.Header>
				<Card.Content>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>ID</Table.Head>
								<Table.Head>Supplier</Table.Head>
								<Table.Head>Product</Table.Head>
								<Table.Head>Price</Table.Head>
								<Table.Head>MOQ</Table.Head>
								<Table.Head>Lead Time</Table.Head>
								<Table.Head>Status</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each operations.photoQuotations as pq (pq.id)}
								<Table.Row>
									<Table.Cell class="font-mono text-xs">{pq.id}</Table.Cell>
									<Table.Cell>
										<div class="flex items-center gap-2">
											<span>{countryFlag(pq.country)}</span>
											<span>{pq.supplier}</span>
										</div>
									</Table.Cell>
									<Table.Cell>{pq.product}</Table.Cell>
									<Table.Cell class="font-medium">{pq.price}</Table.Cell>
									<Table.Cell>{pq.moq}</Table.Cell>
									<Table.Cell>{pq.leadTime}</Table.Cell>
									<Table.Cell
										><Badge variant={statusVariant(pq.status)}>{pq.status}</Badge></Table.Cell
									>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
{/await}
