<script lang="ts">
	import UsersGroupIcon from '@tabler/icons-svelte/icons/users-group';
	import CalendarIcon from '@tabler/icons-svelte/icons/calendar';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { BadgeVariant } from '$lib/components/ui/badge/index.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function statusVariant(status: string): BadgeVariant {
		if (status === 'Confirmation sent') return 'default';
		if (status === 'Samples selected') return 'secondary';
		if (status === 'Cross-offer') return 'outline';
		return 'destructive';
	}
</script>

<svelte:head>
	<title>Customer Meetings - Loescher ERP</title>
</svelte:head>

{#await data.operations.data}
	<div class="flex flex-col gap-6 p-4 lg:p-6">
		<Skeleton class="h-24 rounded-4xl" />
		<Skeleton class="h-96 rounded-4xl" />
	</div>
{:then operations}
	<div class="flex flex-col gap-6 py-4 md:py-6">
		<header class="px-4 lg:px-6">
			<p class="text-muted-foreground text-sm font-medium">Sales</p>
			<h1 class="text-foreground mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
				Customer Meetings
			</h1>
			<p class="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed md:text-base">
				Sample selection meetings with XXXLutz, Möbelix, and other retail partners. Track which
				samples customers picked and cross-offer opportunities.
			</p>
		</header>

		<div class="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-3 lg:px-6">
			{#each operations.customerSelections as cs (cs.id)}
				<Card.Root>
					<Card.Header class="pb-3">
						<div class="flex items-start justify-between">
							<div>
								<Card.Title class="text-base">{cs.customer}</Card.Title>
								<Card.Description>{cs.market}</Card.Description>
							</div>
							<Badge variant={statusVariant(cs.status)}>{cs.status}</Badge>
						</div>
					</Card.Header>
					<Card.Content class="flex flex-col gap-3">
						<div class="flex items-center gap-2 text-sm">
							<CalendarIcon aria-hidden="true" class="text-muted-foreground size-4 shrink-0" />
							<span>{cs.meeting}</span>
						</div>
						<div class="flex items-center gap-2 text-sm">
							<UsersGroupIcon aria-hidden="true" class="text-muted-foreground size-4 shrink-0" />
							<span>{cs.selectedSamples} samples selected</span>
						</div>
						<div class="text-sm">
							<p class="text-muted-foreground">Confirmation</p>
							<p class="font-medium">{cs.confirmation}</p>
						</div>
						{#if cs.offerToOthers !== '—' && cs.offerToOthers !== 'Open'}
							<div class="text-sm">
								<p class="text-muted-foreground">Cross-offer to</p>
								<p class="font-medium">{cs.offerToOthers}</p>
							</div>
						{/if}
					</Card.Content>
				</Card.Root>
			{/each}
		</div>

		<div class="grid gap-4 px-4 lg:grid-cols-[1.5fr_0.75fr] lg:px-6">
			<Card.Root>
				<Card.Header>
					<Card.Title>Meeting Overview</Card.Title>
					<Card.Description
						>All customer meetings and their sample selection progress.</Card.Description
					>
				</Card.Header>
				<Card.Content>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Customer</Table.Head>
								<Table.Head>Market</Table.Head>
								<Table.Head>Meeting</Table.Head>
								<Table.Head>Samples</Table.Head>
								<Table.Head>Confirmation</Table.Head>
								<Table.Head>Cross-offer</Table.Head>
								<Table.Head>Status</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each operations.customerSelections as cs (cs.id)}
								<Table.Row>
									<Table.Cell class="font-medium">{cs.customer}</Table.Cell>
									<Table.Cell>{cs.market}</Table.Cell>
									<Table.Cell>{cs.meeting}</Table.Cell>
									<Table.Cell>{cs.selectedSamples}</Table.Cell>
									<Table.Cell>{cs.confirmation}</Table.Cell>
									<Table.Cell>{cs.offerToOthers}</Table.Cell>
									<Table.Cell
										><Badge variant={statusVariant(cs.status)}>{cs.status}</Badge></Table.Cell
									>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title>Selection Summary</Card.Title>
					<Card.Description>Aggregate sample selections across customers.</Card.Description>
				</Card.Header>
				<Card.Content class="flex flex-col gap-4">
					{@const totalSamples = operations.customerSelections.reduce(
						(sum, cs) => sum + cs.selectedSamples,
						0
					)}
					{@const confirmed = operations.customerSelections.filter(
						(cs) => cs.status === 'Confirmation sent'
					).length}
					<div>
						<p class="text-3xl font-semibold">{totalSamples}</p>
						<p class="text-muted-foreground text-sm">total samples selected</p>
					</div>
					<Progress
						value={totalSamples > 0
							? Math.round((confirmed / operations.customerSelections.length) * 100)
							: 0}
					/>
					<div class="flex flex-col gap-2">
						{#each ['Confirmation sent', 'Samples selected', 'Meeting booked', 'Cross-offer'] as status (status)}
							{@const count = operations.customerSelections.filter(
								(cs) => cs.status === status
							).length}
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">{status}</span>
								<Badge variant={statusVariant(status)}>{count}</Badge>
							</div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
{/await}
