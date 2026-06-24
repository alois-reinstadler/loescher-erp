<script lang="ts">
	import { page } from '$app/state';
	import BellIcon from '@tabler/icons-svelte/icons/bell';
	import MoonIcon from '@tabler/icons-svelte/icons/moon';
	import SunIcon from '@tabler/icons-svelte/icons/sun';
	import { mode, toggleMode } from 'mode-watcher';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { AppShellData } from '$lib/app/data.js';

	let { shell }: { shell: Promise<AppShellData> } = $props();

	const breadcrumbs = $derived(
		page.url.pathname
			.split('/')
			.filter(Boolean)
			.map((segment, index, segments) => ({
				label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
				href: '/' + segments.slice(0, index + 1).join('/'),
				isLast: index === segments.length - 1
			}))
	);
</script>

<header
	class="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
>
	<div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
		<Sidebar.Trigger class="-ms-1" />
		<Separator orientation="vertical" class="mx-2 data-[orientation=vertical]:h-4" />

		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/dashboard">Home</Breadcrumb.Link>
				</Breadcrumb.Item>
				{#each breadcrumbs as crumb (crumb.href)}
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						{#if crumb.isLast}
							<Breadcrumb.Page>{crumb.label}</Breadcrumb.Page>
						{:else}
							<Breadcrumb.Link href={crumb.href}>{crumb.label}</Breadcrumb.Link>
						{/if}
					</Breadcrumb.Item>
				{/each}
			</Breadcrumb.List>
		</Breadcrumb.Root>

		<div class="ms-auto flex items-center gap-1">
			<Button variant="ghost" size="icon-sm" onclick={toggleMode} aria-label="Toggle theme">
				{#if mode.current === 'dark'}
					<SunIcon />
				{:else}
					<MoonIcon />
				{/if}
			</Button>

			{#await shell}
				<Skeleton class="size-8 rounded-full" />
			{:then data}
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label="{data.notificationCount} unseen notifications"
					class="relative"
				>
					<BellIcon />
					{#if data.notificationCount > 0}
						<span
							class="bg-primary text-primary-foreground absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none font-semibold"
						>
							{data.notificationCount > 99 ? '99+' : data.notificationCount}
						</span>
					{/if}
				</Button>
			{/await}
		</div>
	</div>
</header>
