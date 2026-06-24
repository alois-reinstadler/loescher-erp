<script lang="ts">
	import { page } from '$app/state';
	import CirclePlusFilledIcon from '@tabler/icons-svelte/icons/circle-plus-filled';
	import MailIcon from '@tabler/icons-svelte/icons/mail';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { AppNavItem } from '$lib/app/data.js';
	import { getAppIcon } from './app-icons.js';

	let { items }: { items: AppNavItem[] } = $props();
</script>

<Sidebar.Group>
	<Sidebar.GroupContent class="flex flex-col gap-2">
		<Sidebar.Menu>
			<Sidebar.MenuItem class="flex items-center gap-2">
				<Sidebar.MenuButton
					class="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
					tooltipContent="Quick create"
				>
					<CirclePlusFilledIcon />
					<span>Quick Create</span>
				</Sidebar.MenuButton>
				<Button size="icon-sm" class="group-data-[collapsible=icon]:opacity-0" variant="outline">
					<MailIcon />
					<span class="sr-only">Inbox</span>
				</Button>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
		<Sidebar.Menu>
			{#each items as item (item.title)}
				{@const ItemIcon = getAppIcon(item.icon)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton tooltipContent={item.title} isActive={page.url.pathname === item.url}>
						{#snippet child({ props })}
							<a href={item.url} {...props}>
								<ItemIcon />
								<span>{item.title}</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
	</Sidebar.GroupContent>
</Sidebar.Group>
