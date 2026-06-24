<script lang="ts">
	import DotsIcon from '@tabler/icons-svelte/icons/dots';
	import FolderIcon from '@tabler/icons-svelte/icons/folder';
	import Share3Icon from '@tabler/icons-svelte/icons/share-3';
	import TrashIcon from '@tabler/icons-svelte/icons/trash';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { AppDocumentItem } from '$lib/app/data.js';
	import { getAppIcon } from './app-icons.js';

	let { items }: { items: AppDocumentItem[] } = $props();

	const sidebar = Sidebar.useSidebar();
</script>

<Sidebar.Group class="group-data-[collapsible=icon]:hidden">
	<Sidebar.GroupLabel>Documents</Sidebar.GroupLabel>
	<Sidebar.Menu>
		{#each items as item (item.name)}
			{@const ItemIcon = getAppIcon(item.icon)}
			<Sidebar.MenuItem>
				<Sidebar.MenuButton>
					{#snippet child({ props })}
						<a {...props} href={item.url}>
							<ItemIcon />
							<span>{item.name}</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
				<Sidebar.MenuBadge>{item.count}</Sidebar.MenuBadge>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Sidebar.MenuAction
								{...props}
								showOnHover
								class="data-[state=open]:bg-accent rounded-sm"
							>
								<DotsIcon />
								<span class="sr-only">More</span>
							</Sidebar.MenuAction>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content
						class="w-28"
						side={sidebar.isMobile ? 'bottom' : 'right'}
						align={sidebar.isMobile ? 'end' : 'start'}
					>
						<DropdownMenu.Group>
							<DropdownMenu.Item>
								<FolderIcon />
								<span>Open</span>
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<Share3Icon />
								<span>Share</span>
							</DropdownMenu.Item>
						</DropdownMenu.Group>
						<DropdownMenu.Separator />
						<DropdownMenu.Item variant="destructive">
							<TrashIcon />
							<span>Delete</span>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Sidebar.MenuItem>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
