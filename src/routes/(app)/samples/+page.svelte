<script lang="ts">
	import PackageIcon from '@tabler/icons-svelte/icons/package';
	import TruckIcon from '@tabler/icons-svelte/icons/truck';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { BadgeVariant } from '$lib/components/ui/badge/index.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function statusVariant(status: string): BadgeVariant {
		if (status === 'In transit') return 'default';
		if (status === 'Forwarded') return 'secondary';
		if (status === 'Received') return 'outline';
		return 'destructive';
	}
</script>

<svelte:head>
	<title>Samples - Loescher ERP</title>
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
				Sample Requests
			</h1>
			<p class="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed md:text-base">
				Track sample shipments from Chinese and Indian suppliers via UPS and GLS. Monitor tracking
				numbers and forwarding status.
			</p>
		</header>

		<div class="grid gap-4 px-4 md:grid-cols-3 lg:px-6">
			{#each operations.sampleRequests as sr (sr.id)}
				<Card.Root>
					<Card.Header class="pb-3">
						<div class="flex items-start justify-between">
							<div>
								<Card.Title class="text-base">{sr.supplier}</Card.Title>
								<Card.Description>{sr.id} · {sr.origin}</Card.Description>
							</div>
							<Badge variant={statusVariant(sr.status)}>{sr.status}</Badge>
						</div>
					</Card.Header>
					<Card.Content class="flex flex-col gap-3">
						<div class="flex items-center gap-2 text-sm">
							<PackageIcon aria-hidden="true" class="text-muted-foreground size-4 shrink-0" />
							<span>{sr.articles}</span>
						</div>
						<div class="flex items-center gap-2 text-sm">
							<TruckIcon aria-hidden="true" class="text-muted-foreground size-4 shrink-0" />
							<span class="font-mono text-xs">{sr.tracking}</span>
						</div>
						<div class="flex items-center justify-between text-sm">
							<Badge variant="outline">{sr.courier}</Badge>
							<span class="text-muted-foreground">ETA {sr.eta}</span>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>

		<div class="px-4 lg:px-6">
			<Card.Root>
				<Card.Header>
					<Card.Title>All Sample Requests</Card.Title>
					<Card.Description
						>Complete tracking list for incoming samples from suppliers.</Card.Description
					>
				</Card.Header>
				<Card.Content>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>ID</Table.Head>
								<Table.Head>Supplier</Table.Head>
								<Table.Head>Articles</Table.Head>
								<Table.Head>Courier</Table.Head>
								<Table.Head>Tracking</Table.Head>
								<Table.Head>ETA</Table.Head>
								<Table.Head>Status</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each operations.sampleRequests as sr (sr.id)}
								<Table.Row>
									<Table.Cell class="font-mono text-xs">{sr.id}</Table.Cell>
									<Table.Cell>{sr.supplier}</Table.Cell>
									<Table.Cell>{sr.articles}</Table.Cell>
									<Table.Cell><Badge variant="outline">{sr.courier}</Badge></Table.Cell>
									<Table.Cell class="font-mono text-xs">{sr.tracking}</Table.Cell>
									<Table.Cell>{sr.eta}</Table.Cell>
									<Table.Cell
										><Badge variant={statusVariant(sr.status)}>{sr.status}</Badge></Table.Cell
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
