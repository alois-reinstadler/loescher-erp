<script lang="ts">
	import PackageIcon from '@tabler/icons-svelte/icons/package';
	import PaletteIcon from '@tabler/icons-svelte/icons/palette';
	import StampIcon from '@tabler/icons-svelte/icons/clipboard-check';
	import TruckIcon from '@tabler/icons-svelte/icons/truck';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function stepDone(val: string) {
		const lower = val.toLowerCase();
		return lower.includes('confirmed') || lower.includes('approved') || lower.includes('customer');
	}

	function stepColor(val: string) {
		return stepDone(val) ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground';
	}
</script>

<svelte:head>
	<title>Production - Loescher ERP</title>
</svelte:head>

{#await data.operations.data}
	<div class="flex flex-col gap-6 p-4 lg:p-6">
		<Skeleton class="h-24 rounded-4xl" />
		<Skeleton class="h-96 rounded-4xl" />
	</div>
{:then operations}
	{@const avgProgress = Math.round(
		operations.productionApprovals.reduce((sum, pa) => sum + pa.progress, 0) /
			operations.productionApprovals.length
	)}
	{@const complete = operations.productionApprovals.filter((pa) => pa.progress === 100).length}
	<div class="flex flex-col gap-6 py-4 md:py-6">
		<header class="px-4 lg:px-6">
			<p class="text-muted-foreground text-sm font-medium">Production</p>
			<h1 class="text-foreground mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
				Production Approvals
			</h1>
			<p class="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed md:text-base">
				Pre-production samples, packaging, artwork, and shipping marks. Track approval status before
				production begins.
			</p>
		</header>

		<div class="grid gap-4 px-4 md:grid-cols-4 lg:px-6">
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Title class="text-sm">Avg. Progress</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-3xl font-semibold">{avgProgress}%</p>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Title class="text-sm">Fully Approved</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-3xl font-semibold">{complete}</p>
					<p class="text-muted-foreground text-sm">of {operations.productionApprovals.length}</p>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Title class="text-sm">Awaiting Approval</Card.Title>
				</Card.Header>
				<Card.Content>
					{@const awaiting = operations.productionApprovals.filter(
						(pa) => pa.progress < 100 && pa.progress > 50
					).length}
					<p class="text-3xl font-semibold">{awaiting}</p>
					<p class="text-muted-foreground text-sm">near completion</p>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Title class="text-sm">Not Started</Card.Title>
				</Card.Header>
				<Card.Content>
					{@const notStarted = operations.productionApprovals.filter(
						(pa) => pa.progress <= 25
					).length}
					<p class="text-3xl font-semibold">{notStarted}</p>
					<p class="text-muted-foreground text-sm">early stage</p>
				</Card.Content>
			</Card.Root>
		</div>

		<div class="grid gap-4 px-4 lg:grid-cols-2 lg:px-6">
			{#each operations.productionApprovals as pa (pa.id)}
				<Card.Root>
					<Card.Header class="pb-3">
						<div class="flex items-start justify-between">
							<div>
								<Card.Title class="text-base">{pa.supplier}</Card.Title>
								<Card.Description>{pa.id} · Customer: {pa.customer}</Card.Description>
							</div>
							<span class="text-foreground text-lg font-semibold">{pa.progress}%</span>
						</div>
					</Card.Header>
					<Card.Content class="flex flex-col gap-3">
						<Progress value={pa.progress} />
						<div class="grid grid-cols-2 gap-3 text-sm">
							<div class="flex items-start gap-2">
								<TruckIcon
									aria-hidden="true"
									class="mt-0.5 size-4 shrink-0 {stepColor(pa.preProductionSample)}"
								/>
								<div>
									<p class="text-muted-foreground">Pre-production sample</p>
									<p class="font-medium">{pa.preProductionSample}</p>
								</div>
							</div>
							<div class="flex items-start gap-2">
								<PackageIcon
									aria-hidden="true"
									class="mt-0.5 size-4 shrink-0 {stepColor(pa.packaging)}"
								/>
								<div>
									<p class="text-muted-foreground">Packaging</p>
									<p class="font-medium">{pa.packaging}</p>
								</div>
							</div>
							<div class="flex items-start gap-2">
								<PaletteIcon
									aria-hidden="true"
									class="mt-0.5 size-4 shrink-0 {stepColor(pa.artwork)}"
								/>
								<div>
									<p class="text-muted-foreground">Artwork</p>
									<p class="font-medium">{pa.artwork}</p>
								</div>
							</div>
							<div class="flex items-start gap-2">
								<StampIcon
									aria-hidden="true"
									class="mt-0.5 size-4 shrink-0 {stepColor(pa.shippingMarks)}"
								/>
								<div>
									<p class="text-muted-foreground">Shipping marks</p>
									<p class="font-medium">{pa.shippingMarks}</p>
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</div>
{/await}
