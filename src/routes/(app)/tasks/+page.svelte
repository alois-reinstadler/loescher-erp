<script lang="ts">
	import FilterIcon from '@tabler/icons-svelte/icons/filter';
	import PlusIcon from '@tabler/icons-svelte/icons/plus';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { BadgeVariant } from '$lib/components/ui/badge/index.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function statusVariant(status: string): BadgeVariant {
		if (status === 'Blocked') return 'destructive';
		if (status === 'Done') return 'secondary';
		if (status === 'Waiting') return 'outline';
		return 'default';
	}
</script>

<svelte:head>
	<title>Tasks - Loescher ERP</title>
</svelte:head>

{#await data.operations.data}
	<div class="flex flex-col gap-6 p-4 lg:p-6">
		<Skeleton class="h-24 rounded-4xl" />
		<Skeleton class="h-96 rounded-4xl" />
	</div>
{:then operations}
	{@const done = operations.tasks.filter((task) => task.status === 'Done').length}
	{@const progress = Math.round((done / operations.tasks.length) * 100)}
	<div class="flex flex-col gap-6 py-4 md:py-6">
		<header class="flex flex-col gap-4 px-4 lg:flex-row lg:items-end lg:justify-between lg:px-6">
			<div>
				<p class="text-muted-foreground text-sm font-medium">Work Queue</p>
				<h1 class="text-foreground mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
					Tasks
				</h1>
				<p class="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed md:text-base">
					Cross-process task list for sourcing, samples, confirmations, logistics, and billing.
				</p>
			</div>
			<div class="flex gap-2">
				<Button variant="outline">
					<FilterIcon data-icon="inline-start" />
					Filter
				</Button>
				<Button>
					<PlusIcon data-icon="inline-start" />
					New Task
				</Button>
			</div>
		</header>

		<div class="grid gap-4 px-4 md:grid-cols-4 lg:px-6">
			<Card.Root class="md:col-span-3">
				<Card.Header>
					<Card.Title>Open Work</Card.Title>
					<Card.Description
						>Mock responsibilities until task schemas are finalized.</Card.Description
					>
				</Card.Header>
				<Card.Content>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Task</Table.Head>
								<Table.Head>Process</Table.Head>
								<Table.Head>Owner</Table.Head>
								<Table.Head>Due</Table.Head>
								<Table.Head>Status</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each operations.tasks as task (task.id)}
								<Table.Row>
									<Table.Cell>
										<div class="flex flex-col">
											<span class="font-medium">{task.title}</span>
											<span class="text-muted-foreground text-xs"
												>{task.id} · {task.priority} priority</span
											>
										</div>
									</Table.Cell>
									<Table.Cell>{task.process}</Table.Cell>
									<Table.Cell>{task.owner}</Table.Cell>
									<Table.Cell>{task.due}</Table.Cell>
									<Table.Cell
										><Badge variant={statusVariant(task.status)}>{task.status}</Badge></Table.Cell
									>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title>Completion</Card.Title>
					<Card.Description>Draft task throughput.</Card.Description>
				</Card.Header>
				<Card.Content class="flex flex-col gap-4">
					<div>
						<p class="text-3xl font-semibold">{progress}%</p>
						<p class="text-muted-foreground text-sm">
							{done} of {operations.tasks.length} tasks complete
						</p>
					</div>
					<Progress value={progress} />
					<div class="flex flex-col gap-2">
						{#each ['Open', 'Waiting', 'Blocked', 'Done'] as status (status)}
							{@const count = operations.tasks.filter((task) => task.status === status).length}
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
