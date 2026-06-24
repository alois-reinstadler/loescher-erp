<script lang="ts">
	import DashboardActivity from '$lib/components/app/dashboard-activity.svelte';
	import DashboardCards from '$lib/components/app/dashboard-cards.svelte';
	import DashboardChart from '$lib/components/app/dashboard-chart.svelte';
	import DashboardSkeleton from '$lib/components/app/dashboard-skeleton.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Dashboard - Loescher ERP</title>
</svelte:head>

{#await data.dashboard.data}
	<DashboardSkeleton />
{:then dashboard}
	<div class="flex flex-col gap-6 py-4 md:gap-8 md:py-6">
		<header class="px-4 lg:px-6">
			<p class="text-muted-foreground text-sm font-medium">Overview</p>
			<h1 class="text-foreground mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
				Dashboard
			</h1>
			<p class="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed md:text-base">
				Monitor revenue, orders, and document workflow using async mock data.
			</p>
		</header>

		<DashboardCards metrics={dashboard.metrics} />

		<div class="px-4 lg:px-6">
			<DashboardChart chart={dashboard.chart} />
		</div>

		<div class="px-4 lg:px-6">
			<DashboardActivity activity={dashboard.activity} />
		</div>
	</div>
{/await}
