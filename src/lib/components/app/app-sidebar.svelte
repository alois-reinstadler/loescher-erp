<script lang="ts">
	import { Icon } from '$lib/components/ui/icon/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import type { AppShellData } from '$lib/app/data.js';
	import type { ComponentProps } from 'svelte';
	import NavDocuments from './nav-documents.svelte';
	import NavMain from './nav-main.svelte';
	import NavSecondary from './nav-secondary.svelte';
	import NavTools from './nav-tools.svelte';
	import NavUser from './nav-user.svelte';

	let {
		shell,
		...restProps
	}: { shell: Promise<AppShellData> } & ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root collapsible="offcanvas" {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton class="data-[slot=sidebar-menu-button]:!p-1.5">
					{#snippet child({ props })}
						<a href="/dashboard" {...props}>
							<Icon icon="Brand" class="!size-5" aria-hidden="true" />
							<span class="text-base font-semibold">Loescher ERP</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		{#await shell}
			<Sidebar.Group>
				<Sidebar.GroupContent class="flex flex-col gap-2">
					<Sidebar.Menu>
						{#each Array.from({ length: 5 }) as _, index (index)}
							<Sidebar.MenuItem>
								<Skeleton class="h-9 w-full rounded-xl" />
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{:then data}
			<NavMain items={data.navMain} />
			<NavDocuments items={data.documents} />
			<NavTools items={data.tools} />
			<NavSecondary items={data.navSecondary} class="mt-auto" />
		{/await}
	</Sidebar.Content>
	<Sidebar.Footer>
		{#await shell}
			<div class="flex items-center gap-2 p-2">
				<Skeleton class="size-8 rounded-lg" />
				<div class="flex min-w-0 flex-1 flex-col gap-1.5">
					<Skeleton class="h-3 w-24" />
					<Skeleton class="h-3 w-32" />
				</div>
			</div>
		{:then data}
			<NavUser user={data.user} />
		{/await}
	</Sidebar.Footer>
</Sidebar.Root>
