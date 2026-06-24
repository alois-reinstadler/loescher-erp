<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import type { ChartPoint } from '$lib/app/data.js';

	let { chart }: { chart: ChartPoint[] } = $props();

	let timeRange = $state('12m');
	const ranges = [
		{ value: '12m', label: 'Last 12 months', take: 12 },
		{ value: '6m', label: 'Last 6 months', take: 6 },
		{ value: '3m', label: 'Last 3 months', take: 3 }
	];

	const selectedRange = $derived(ranges.find((range) => range.value === timeRange) ?? ranges[0]);
	const visibleData = $derived(chart.slice(-selectedRange.take));
	const width = 720;
	const height = 240;
	const inset = 24;
	const maxValue = $derived(
		Math.max(...visibleData.flatMap((point) => [point.revenue, point.expenses]))
	);

	function x(index: number) {
		return inset + (index * (width - inset * 2)) / Math.max(visibleData.length - 1, 1);
	}

	function y(value: number) {
		return height - inset - (value / maxValue) * (height - inset * 2);
	}

	const revenuePoints = $derived(
		visibleData.map((point, index) => `${x(index)},${y(point.revenue)}`).join(' ')
	);
	const expensePoints = $derived(
		visibleData.map((point, index) => `${x(index)},${y(point.expenses)}`).join(' ')
	);
	const revenueArea = $derived(
		`${inset},${height - inset} ${revenuePoints} ${width - inset},${height - inset}`
	);
</script>

<Card.Root class="@container/card">
	<Card.Header>
		<Card.Title>Revenue trend</Card.Title>
		<Card.Description>
			<span class="hidden @[540px]/card:block"> Revenue and expenses from mock ERP data </span>
			<span class="@[540px]/card:hidden">Mock ERP data</span>
		</Card.Description>
		<Card.Action>
			<ToggleGroup.Root
				type="single"
				bind:value={timeRange}
				variant="outline"
				class="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
			>
				{#each ranges as range (range.value)}
					<ToggleGroup.Item value={range.value}>{range.label}</ToggleGroup.Item>
				{/each}
			</ToggleGroup.Root>
			<Select.Root type="single" bind:value={timeRange}>
				<Select.Trigger
					size="sm"
					class="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
					aria-label="Select range"
				>
					<span data-slot="select-value">{selectedRange.label}</span>
				</Select.Trigger>
				<Select.Content>
					{#each ranges as range (range.value)}
						<Select.Item value={range.value}>{range.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</Card.Action>
	</Card.Header>
	<Card.Content class="px-2 pt-4 sm:px-6 sm:pt-6">
		<div class="h-[270px] w-full">
			<svg
				viewBox="0 0 {width} {height}"
				class="size-full overflow-visible"
				preserveAspectRatio="none"
				role="img"
				aria-label="Revenue and expenses trend chart"
			>
				<defs>
					<linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stop-color="var(--primary)" stop-opacity="0.22" />
						<stop offset="100%" stop-color="var(--primary)" stop-opacity="0.02" />
					</linearGradient>
				</defs>
				{#each [0, 1, 2, 3] as line (line)}
					<line
						x1={inset}
						x2={width - inset}
						y1={inset + (line * (height - inset * 2)) / 3}
						y2={inset + (line * (height - inset * 2)) / 3}
						stroke="var(--border)"
						stroke-width="1"
					/>
				{/each}
				<polygon points={revenueArea} fill="url(#revenue-fill)" />
				<polyline
					points={expensePoints}
					fill="none"
					stroke="var(--muted-foreground)"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					opacity="0.55"
				/>
				<polyline
					points={revenuePoints}
					fill="none"
					stroke="var(--primary)"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				{#each visibleData as point, index (point.date)}
					<g>
						<circle cx={x(index)} cy={y(point.revenue)} r="3.5" fill="var(--primary)" />
						<text
							x={x(index)}
							y={height - 4}
							text-anchor="middle"
							class="fill-muted-foreground text-[11px]"
						>
							{point.date}
						</text>
					</g>
				{/each}
			</svg>
		</div>
		<div class="text-muted-foreground flex flex-wrap items-center gap-4 px-2 text-xs">
			<span class="inline-flex items-center gap-2">
				<span class="bg-primary size-2 rounded-full"></span>
				Revenue
			</span>
			<span class="inline-flex items-center gap-2">
				<span class="bg-muted-foreground size-2 rounded-full opacity-60"></span>
				Expenses
			</span>
		</div>
	</Card.Content>
</Card.Root>
