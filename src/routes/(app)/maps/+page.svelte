<script lang="ts">
	import MapPinIcon from '@tabler/icons-svelte/icons/map-pin';
	import RouteIcon from '@tabler/icons-svelte/icons/route';
	import TruckIcon from '@tabler/icons-svelte/icons/truck';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Maps - Loescher ERP</title>
</svelte:head>

{#await data.operations.data}
	<div class="flex flex-col gap-6 p-4 lg:p-6">
		<Skeleton class="h-24 rounded-4xl" />
		<Skeleton class="h-[32rem] rounded-4xl" />
	</div>
{:then operations}
	<div class="flex flex-col gap-6 py-4 md:py-6">
		<header class="px-4 lg:px-6">
			<p class="text-muted-foreground text-sm font-medium">Movement</p>
			<h1 class="text-foreground mt-1 text-2xl font-semibold tracking-tight md:text-3xl">Maps</h1>
			<p class="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed md:text-base">
				Mock logistics map for UPS samples, GLS forwarding, container movement, and branch delivery.
			</p>
		</header>

		<div class="grid gap-4 px-4 lg:grid-cols-[1.5fr_0.75fr] lg:px-6">
			<Card.Root class="min-h-[32rem]">
				<Card.Header>
					<Card.Title>Shipment Control Map</Card.Title>
					<Card.Description
						>Placeholder coordinate layer until live tracking is connected.</Card.Description
					>
				</Card.Header>
				<Card.Content>
					<div
						class="bg-muted relative min-h-[24rem] overflow-hidden rounded-4xl border bg-[linear-gradient(90deg,var(--border)_1px,transparent_1px),linear-gradient(var(--border)_1px,transparent_1px)] bg-[size:48px_48px]"
					>
						<div class="bg-background/70 absolute inset-x-8 top-1/2 h-px"></div>
						<div class="bg-background/70 absolute inset-y-8 left-1/2 w-px"></div>
						{#each operations.shipments as shipment (shipment.id)}
							<div
								class="absolute -translate-x-1/2 -translate-y-1/2"
								style="left: {shipment.x}%; top: {shipment.y}%;"
							>
								<div
									class="bg-card text-card-foreground flex min-w-40 flex-col gap-2 rounded-3xl border p-3 shadow-md"
								>
									<div class="flex items-center gap-2">
										<span
											class="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full"
										>
											<MapPinIcon aria-hidden="true" />
										</span>
										<div class="min-w-0">
											<p class="truncate text-sm font-semibold">{shipment.label}</p>
											<p class="text-muted-foreground truncate text-xs">{shipment.location}</p>
										</div>
									</div>
									<Badge variant="secondary">{shipment.status}</Badge>
								</div>
							</div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title>Active Lanes</Card.Title>
					<Card.Description>Tracking summary across carriers and forwarders.</Card.Description>
				</Card.Header>
				<Card.Content class="flex flex-col gap-3">
					{#each operations.shipments as shipment (shipment.id)}
						<div class="border-border flex flex-col gap-3 rounded-3xl border p-4">
							<div class="flex items-start justify-between gap-3">
								<div>
									<p class="font-medium">{shipment.label}</p>
									<p class="text-muted-foreground text-sm">{shipment.lane}</p>
								</div>
								<TruckIcon aria-hidden="true" />
							</div>
							<div class="text-muted-foreground flex items-center justify-between text-sm">
								<span class="flex items-center gap-2"
									><RouteIcon aria-hidden="true" />{shipment.location}</span
								>
								<span>ETA {shipment.eta}</span>
							</div>
						</div>
					{/each}
				</Card.Content>
			</Card.Root>
		</div>
	</div>
{/await}
