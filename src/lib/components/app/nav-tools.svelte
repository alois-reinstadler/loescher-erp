<script lang="ts">
	import { page } from '$app/state';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { AppNavItem } from '$lib/app/data.js';
	import { getAppIcon } from './app-icons.js';

	let { items }: { items: AppNavItem[] } = $props();
</script>

<Sidebar.Group>
	<Sidebar.GroupLabel>Tools</Sidebar.GroupLabel>
	<Sidebar.GroupContent>
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
