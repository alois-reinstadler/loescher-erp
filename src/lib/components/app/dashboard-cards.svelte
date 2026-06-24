<script lang="ts">
	import TrendingDownIcon from '@tabler/icons-svelte/icons/trending-down';
	import TrendingUpIcon from '@tabler/icons-svelte/icons/trending-up';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import type { Metric } from '$lib/app/data.js';

	let { metrics }: { metrics: Metric[] } = $props();
</script>

<div
	class="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card"
>
	{#each metrics as metric (metric.id)}
		<Card.Root class="@container/card">
			<Card.Header>
				<Card.Description>{metric.label}</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
					{metric.value}
				</Card.Title>
				<Card.Action>
					<Badge variant="outline">
						{#if metric.trend === 'up'}
							<TrendingUpIcon />
						{:else}
							<TrendingDownIcon />
						{/if}
						{metric.change}
					</Badge>
				</Card.Action>
			</Card.Header>
			<Card.Footer class="flex-col items-start gap-1.5 text-sm">
				<div class="line-clamp-1 flex gap-2 font-medium">
					{metric.summary}
					{#if metric.trend === 'up'}
						<TrendingUpIcon />
					{:else}
						<TrendingDownIcon />
					{/if}
				</div>
				<div class="text-muted-foreground">{metric.description}</div>
			</Card.Footer>
		</Card.Root>
	{/each}
</div>
