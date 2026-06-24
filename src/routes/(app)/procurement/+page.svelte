<script lang="ts">
	import ClipboardListIcon from '@tabler/icons-svelte/icons/clipboard-list';
	import FileCheckIcon from '@tabler/icons-svelte/icons/file-check';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { BadgeVariant } from '$lib/components/ui/badge/index.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function statusVariant(status: string): BadgeVariant {
		if (status === 'Signed back') return 'default';
		if (status === 'SC received') return 'secondary';
		if (status === 'Negotiating') return 'outline';
		return 'destructive';
	}
</script>

<svelte:head>
	<title>Procurement - Loescher ERP</title>
</svelte:head>

{#await data.operations.data}
	<div class="flex flex-col gap-6 p-4 lg:p-6">
		<Skeleton class="h-24 rounded-4xl" />
		<Skeleton class="h-96 rounded-4xl" />
	</div>
{:then operations}
	{@const signed = operations.procurementOrders.filter((po) => po.status === 'Signed back').length}
	{@const progress = Math.round((signed / operations.procurementOrders.length) * 100)}
	<div class="flex flex-col gap-6 py-4 md:py-6">
		<header class="px-4 lg:px-6">
			<p class="text-muted-foreground text-sm font-medium">Procurement</p>
			<h1 class="text-foreground mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
				Purchase Orders
			</h1>
			<p class="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed md:text-base">
				Price negotiations, purchase orders, and sales confirmations from suppliers. Track which
				orders are signed back and ready for production.
			</p>
		</header>

		<div class="grid gap-4 px-4 md:grid-cols-4 lg:px-6">
			<Card.Root class="md:col-span-2">
				<Card.Header>
					<Card.Title>Pipeline Progress</Card.Title>
					<Card.Description
						>{signed} of {operations.procurementOrders.length} orders fully signed</Card.Description
					>
				</Card.Header>
				<Card.Content class="flex flex-col gap-4">
					<div>
						<p class="text-3xl font-semibold">{progress}%</p>
						<p class="text-muted-foreground text-sm">procurement completion</p>
					</div>
					<Progress value={progress} />
					<div class="flex flex-col gap-2">
						{#each ['Negotiating', 'SC received', 'Signed back'] as status (status)}
							{@const count = operations.procurementOrders.filter(
								(po) => po.status === status
							).length}
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">{status}</span>
								<Badge variant={statusVariant(status)}>{count}</Badge>
							</div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>

			{#each operations.procurementOrders.filter((po) => po.status === 'SC received') as po (po.id)}
				<Card.Root>
					<Card.Header class="pb-3">
						<div class="flex items-start justify-between">
							<div>
								<Card.Title class="text-base">{po.supplier}</Card.Title>
								<Card.Description>{po.id}</Card.Description>
							</div>
							<Badge variant={statusVariant(po.status)}>{po.status}</Badge>
						</div>
					</Card.Header>
					<Card.Content class="flex flex-col gap-2 text-sm">
						<div class="flex items-center gap-2">
							<ClipboardListIcon aria-hidden="true" class="text-muted-foreground size-4 shrink-0" />
							<span>{po.articles}</span>
						</div>
						<div class="flex items-center gap-2">
							<FileCheckIcon aria-hidden="true" class="text-muted-foreground size-4 shrink-0" />
							<span>{po.salesConfirmation}</span>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>

		<div class="px-4 lg:px-6">
			<Card.Root>
				<Card.Header>
					<Card.Title>All Orders</Card.Title>
					<Card.Description
						>Full procurement pipeline with PO and sales confirmation status.</Card.Description
					>
				</Card.Header>
				<Card.Content>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>ID</Table.Head>
								<Table.Head>Supplier</Table.Head>
								<Table.Head>Articles</Table.Head>
								<Table.Head>Target Price</Table.Head>
								<Table.Head>Purchase Order</Table.Head>
								<Table.Head>Sales Confirmation</Table.Head>
								<Table.Head>Status</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each operations.procurementOrders as po (po.id)}
								<Table.Row>
									<Table.Cell class="font-mono text-xs">{po.id}</Table.Cell>
									<Table.Cell class="font-medium">{po.supplier}</Table.Cell>
									<Table.Cell>{po.articles}</Table.Cell>
									<Table.Cell class="font-medium">{po.targetPrice}</Table.Cell>
									<Table.Cell>{po.po}</Table.Cell>
									<Table.Cell>{po.salesConfirmation}</Table.Cell>
									<Table.Cell
										><Badge variant={statusVariant(po.status)}>{po.status}</Badge></Table.Cell
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
