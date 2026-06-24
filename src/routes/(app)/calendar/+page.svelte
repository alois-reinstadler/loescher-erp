<script lang="ts">
	import CalendarEventIcon from '@tabler/icons-svelte/icons/calendar-event';
	import ClockIcon from '@tabler/icons-svelte/icons/clock';
	import MapPinIcon from '@tabler/icons-svelte/icons/map-pin';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import type { BadgeVariant } from '$lib/components/ui/badge/index.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function typeVariant(type: string): BadgeVariant {
		if (type === 'Customer') return 'default';
		if (type === 'Supplier') return 'secondary';
		if (type === 'Logistics') return 'outline';
		return 'ghost';
	}
</script>

<svelte:head>
	<title>Calendar - Loescher ERP</title>
</svelte:head>

{#await data.operations.data}
	<div class="flex flex-col gap-6 p-4 lg:p-6">
		<Skeleton class="h-24 rounded-4xl" />
		<Skeleton class="h-96 rounded-4xl" />
	</div>
{:then operations}
	<div class="flex flex-col gap-6 py-4 md:py-6">
		<header class="flex flex-col gap-4 px-4 lg:flex-row lg:items-end lg:justify-between lg:px-6">
			<div>
				<p class="text-muted-foreground text-sm font-medium">Planning</p>
				<h1 class="text-foreground mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
					Calendar
				</h1>
				<p class="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed md:text-base">
					Customer meetings, supplier calls, sample deadlines, and import milestones.
				</p>
			</div>
			<Button variant="outline">
				<CalendarEventIcon data-icon="inline-start" />
				New Event
			</Button>
		</header>

		<div class="grid gap-4 px-4 lg:grid-cols-[1.4fr_0.8fr] lg:px-6">
			<Card.Root>
				<Card.Header>
					<Card.Title>Week Schedule</Card.Title>
					<Card.Description>Draft calendar grouped by working day.</Card.Description>
				</Card.Header>
				<Card.Content class="grid gap-3 md:grid-cols-2">
					{#each operations.calendar as event (event.id)}
						<div class="border-border bg-background flex flex-col gap-4 rounded-3xl border p-4">
							<div class="flex items-start justify-between gap-3">
								<div>
									<p class="text-sm font-semibold">{event.date}</p>
									<h2 class="mt-1 text-base font-semibold">{event.title}</h2>
								</div>
								<Badge variant={typeVariant(event.type)}>{event.type}</Badge>
							</div>
							<div class="text-muted-foreground flex flex-col gap-2 text-sm">
								<span class="flex items-center gap-2">
									<ClockIcon aria-hidden="true" />
									{event.time} · {event.owner}
								</span>
								<span class="flex items-center gap-2">
									<MapPinIcon aria-hidden="true" />
									{event.location}
								</span>
							</div>
						</div>
					{/each}
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title>Focus Windows</Card.Title>
					<Card.Description>Operational load by calendar type.</Card.Description>
				</Card.Header>
				<Card.Content class="flex flex-col gap-3">
					{#each ['Customer', 'Supplier', 'Logistics', 'Internal'] as type (type)}
						{@const count = operations.calendar.filter((event) => event.type === type).length}
						<div class="bg-muted/40 flex items-center justify-between rounded-3xl p-4">
							<div>
								<p class="font-medium">{type}</p>
								<p class="text-muted-foreground text-sm">
									{count} scheduled item{count === 1 ? '' : 's'}
								</p>
							</div>
							<Badge variant={typeVariant(type)}>{count}</Badge>
						</div>
					{/each}
				</Card.Content>
			</Card.Root>
		</div>
	</div>
{/await}
