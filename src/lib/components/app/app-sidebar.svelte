<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import BuildingIcon from '@tabler/icons-svelte/icons/building';
	import CheckIcon from '@tabler/icons-svelte/icons/check';
	import SelectorIcon from '@tabler/icons-svelte/icons/selector';
	import { setActiveCompany } from '$lib/app/company.remote';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import type { AppShellData } from '$lib/app/data.js';
	import type { ComponentProps } from 'svelte';
	import NavDocuments from './nav-documents.svelte';
	import NavMain from './nav-main.svelte';
	import NavSecondary from './nav-secondary.svelte';
	import NavTools from './nav-tools.svelte';
	import NavUser from './nav-user.svelte';

	type SidebarCompany = {
		id: string;
		name: string;
		legalName: string;
		slug: string;
	};

	let {
		shell,
		companies,
		activeCompany,
		...restProps
	}: {
		shell: Promise<AppShellData>;
		companies: SidebarCompany[];
		activeCompany: SidebarCompany | null;
	} & ComponentProps<typeof Sidebar.Root> = $props();

	let switchingCompanyId = $state<string | null>(null);

	async function switchCompany(companyId: string) {
		if (companyId === activeCompany?.id || switchingCompanyId) return;

		switchingCompanyId = companyId;

		try {
			const result = await setActiveCompany(companyId);

			if (result.ok) {
				await invalidateAll();
			}
		} finally {
			switchingCompanyId = null;
		}
	}
</script>

<Sidebar.Root collapsible="offcanvas" {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Sidebar.MenuButton
								{...props}
								size="lg"
								class="data-[slot=sidebar-menu-button]:!p-1.5 [&_*]:pointer-events-none"
							>
								<div
									class="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 items-center justify-center rounded-sm"
								>
									<BuildingIcon aria-hidden="true" />
								</div>
								<div class="grid flex-1 text-left leading-tight">
									<span class="truncate text-sm font-semibold">
										{activeCompany?.name ?? 'Company'}
									</span>
									<span class="text-muted-foreground truncate text-xs">Löscher Group</span>
								</div>
								<SelectorIcon class="ms-auto" aria-hidden="true" />
							</Sidebar.MenuButton>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-56" align="start">
						<DropdownMenu.Label>Company</DropdownMenu.Label>
						<DropdownMenu.Group>
							{#each companies as company (company.id)}
								<DropdownMenu.Item
									disabled={company.id === activeCompany?.id || switchingCompanyId !== null}
									onSelect={() => switchCompany(company.id)}
								>
									<span class="truncate">{company.name}</span>
									{#if company.id === activeCompany?.id}
										<CheckIcon class="ms-auto" aria-hidden="true" />
									{/if}
								</DropdownMenu.Item>
							{:else}
								<DropdownMenu.Item disabled>No companies</DropdownMenu.Item>
							{/each}
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
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
