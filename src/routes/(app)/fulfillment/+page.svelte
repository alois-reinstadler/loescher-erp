<script lang="ts">
	import ShoppingCartIcon from '@tabler/icons-svelte/icons/shopping-cart';
	import TruckIcon from '@tabler/icons-svelte/icons/truck';
	import FileInvoiceIcon from '@tabler/icons-svelte/icons/file-invoice';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { BadgeVariant } from '$lib/components/ui/badge/index.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function statusVariant(status: string): BadgeVariant {
		if (status === 'Invoiced') return 'default';
		if (status === 'Shipped') return 'secondary';
		if (status === 'Picking') return 'outline';
		return 'destructive';
	}
</script>

<svelte:head>
	<title>Fulfillment - Loescher ERP</title>
</svelte:head>

{#await data.operations.data}
	<div class="flex flex-col gap-6 p-4 lg:p-6">
		<Skeleton class="h-24 rounded-4xl" />
		<Skeleton class="h-96 rounded-4xl" />
	</div>
{:then operations}
	{@const invoiced = operations.fulfillmentOrders.filter((fo) => fo.status === 'Invoiced').length}
	{@const shipped = operations.fulfillmentOrders.filter((fo) => fo.status === 'Shipped').length}
	{@const picking = operations.fulfillmentOrders.filter((fo) => fo.status === 'Picking').length}
	{@const ordered = operations.fulfillmentOrders.filter((fo) => fo.status === 'Ordered').length}
	<div class="flex flex-col gap-6 py-4 md:py-6">
		<header class="px-4 lg:px-6">
			<p class="text-muted-foreground text-sm font-medium">Fulfillment</p>
			<h1 class="text-foreground mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
				Sales Orders
			</h1>
			<p class="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed md:text-base">
				Branch orders from XXXLutz, Möbelix, and other retail partners. Track from order creation
				through picking, shipping, invoicing, and payment.
			</p>
		</header>

		<div class="grid gap-4 px-4 md:grid-cols-4 lg:px-6">
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Title class="text-sm">Ordered</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-3xl font-semibold">{ordered}</p>
					<p class="text-muted-foreground text-sm">awaiting picking</p>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Title class="text-sm">Picking</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-3xl font-semibold">{picking}</p>
					<p class="text-muted-foreground text-sm">warehouse staff</p>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Title class="text-sm">Shipped</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-3xl font-semibold">{shipped}</p>
					<p class="text-muted-foreground text-sm">in transit to customer</p>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Title class="text-sm">Invoiced</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-3xl font-semibold">{invoiced}</p>
					<p class="text-muted-foreground text-sm">awaiting payment</p>
				</Card.Content>
			</Card.Root>
		</div>

		<div class="grid gap-4 px-4 md:grid-cols-4 lg:px-6">
			{#each operations.fulfillmentOrders.slice(0, 4) as fo (fo.id)}
				<Card.Root>
					<Card.Header class="pb-3">
						<div class="flex items-start justify-between">
							<div>
								<Card.Title class="text-base">{fo.customer}</Card.Title>
								<Card.Description>{fo.branch}</Card.Description>
							</div>
							<Badge variant={statusVariant(fo.status)}>{fo.status}</Badge>
						</div>
					</Card.Header>
					<Card.Content class="flex flex-col gap-2 text-sm">
						<div class="flex items-center gap-2">
							<ShoppingCartIcon aria-hidden="true" class="text-muted-foreground size-4 shrink-0" />
							<span>{fo.items}</span>
						</div>
						<div class="flex items-center gap-2">
							<TruckIcon aria-hidden="true" class="text-muted-foreground size-4 shrink-0" />
							<span>{fo.deliveryNote}</span>
						</div>
						<div class="flex items-center gap-2">
							<FileInvoiceIcon aria-hidden="true" class="text-muted-foreground size-4 shrink-0" />
							<span>{fo.invoice}</span>
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
						>Complete order flow from branch order through delivery note to invoice.</Card.Description
					>
				</Card.Header>
				<Card.Content>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>ID</Table.Head>
								<Table.Head>Customer</Table.Head>
								<Table.Head>Branch</Table.Head>
								<Table.Head>Items</Table.Head>
								<Table.Head>Order</Table.Head>
								<Table.Head>Delivery Note</Table.Head>
								<Table.Head>Invoice</Table.Head>
								<Table.Head>Payment</Table.Head>
								<Table.Head>Status</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each operations.fulfillmentOrders as fo (fo.id)}
								<Table.Row>
									<Table.Cell class="font-mono text-xs">{fo.id}</Table.Cell>
									<Table.Cell class="font-medium">{fo.customer}</Table.Cell>
									<Table.Cell>{fo.branch}</Table.Cell>
									<Table.Cell>{fo.items}</Table.Cell>
									<Table.Cell>{fo.order}</Table.Cell>
									<Table.Cell>{fo.deliveryNote}</Table.Cell>
									<Table.Cell>{fo.invoice}</Table.Cell>
									<Table.Cell>{fo.payment}</Table.Cell>
									<Table.Cell
										><Badge variant={statusVariant(fo.status)}>{fo.status}</Badge></Table.Cell
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
