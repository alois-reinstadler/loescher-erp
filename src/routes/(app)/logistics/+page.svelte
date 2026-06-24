<script lang="ts">
	import FileTextIcon from '@tabler/icons-svelte/icons/file-text';
	import ShipIcon from '@tabler/icons-svelte/icons/ship';
	import PackageIcon from '@tabler/icons-svelte/icons/package';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { BadgeVariant } from '$lib/components/ui/badge/index.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function statusVariant(status: string): BadgeVariant {
		if (status === 'Received') return 'default';
		if (status === 'Customs ready') return 'secondary';
		if (status === 'Docs check') return 'outline';
		return 'destructive';
	}
</script>

<svelte:head>
	<title>Import Logistics - Loescher ERP</title>
</svelte:head>

{#await data.operations.data}
	<div class="flex flex-col gap-6 p-4 lg:p-6">
		<Skeleton class="h-24 rounded-4xl" />
		<Skeleton class="h-96 rounded-4xl" />
	</div>
{:then operations}
	<div class="flex flex-col gap-6 py-4 md:py-6">
		<header class="px-4 lg:px-6">
			<p class="text-muted-foreground text-sm font-medium">Logistics</p>
			<h1 class="text-foreground mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
				Import Logistics
			</h1>
			<p class="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed md:text-base">
				Container bookings, document checks, customs clearance, and warehouse receipt. Track each
				import file from booking through goods receipt.
			</p>
		</header>

		<div class="grid gap-4 px-4 md:grid-cols-3 lg:px-6">
			{#each operations.logisticsFiles as lf (lf.id)}
				<Card.Root>
					<Card.Header class="pb-3">
						<div class="flex items-start justify-between">
							<div>
								<Card.Title class="text-base">{lf.supplier}</Card.Title>
								<Card.Description>{lf.id} · {lf.container} via {lf.forwarder}</Card.Description>
							</div>
							<Badge variant={statusVariant(lf.status)}>{lf.status}</Badge>
						</div>
					</Card.Header>
					<Card.Content class="flex flex-col gap-3">
						<div class="flex items-center gap-2 text-sm">
							<FileTextIcon aria-hidden="true" class="text-muted-foreground size-4 shrink-0" />
							<span>{lf.documents}</span>
						</div>
						<div class="flex items-center gap-2 text-sm">
							<ShipIcon aria-hidden="true" class="text-muted-foreground size-4 shrink-0" />
							<span>{lf.blStatus}</span>
						</div>
						<div class="flex items-center gap-2 text-sm">
							<PackageIcon aria-hidden="true" class="text-muted-foreground size-4 shrink-0" />
							<span>{lf.warehouseReceipt}</span>
						</div>
						<div class="text-sm">
							<p class="text-muted-foreground">Customs</p>
							<p class="font-medium">{lf.customs}</p>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>

		<div class="px-4 lg:px-6">
			<Card.Root>
				<Card.Header>
					<Card.Title>All Import Files</Card.Title>
					<Card.Description>Document flow from booking to warehouse receipt.</Card.Description>
				</Card.Header>
				<Card.Content>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>ID</Table.Head>
								<Table.Head>Supplier</Table.Head>
								<Table.Head>Container</Table.Head>
								<Table.Head>Forwarder</Table.Head>
								<Table.Head>Documents</Table.Head>
								<Table.Head>B/L Status</Table.Head>
								<Table.Head>Customs</Table.Head>
								<Table.Head>Warehouse</Table.Head>
								<Table.Head>Status</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each operations.logisticsFiles as lf (lf.id)}
								<Table.Row>
									<Table.Cell class="font-mono text-xs">{lf.id}</Table.Cell>
									<Table.Cell class="font-medium">{lf.supplier}</Table.Cell>
									<Table.Cell><Badge variant="outline">{lf.container}</Badge></Table.Cell>
									<Table.Cell>{lf.forwarder}</Table.Cell>
									<Table.Cell>{lf.documents}</Table.Cell>
									<Table.Cell>{lf.blStatus}</Table.Cell>
									<Table.Cell>{lf.customs}</Table.Cell>
									<Table.Cell>{lf.warehouseReceipt}</Table.Cell>
									<Table.Cell
										><Badge variant={statusVariant(lf.status)}>{lf.status}</Badge></Table.Cell
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
