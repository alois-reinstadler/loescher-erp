<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		IconLayoutSidebarRightCollapse,
		IconLayoutSidebarRightExpand
	} from '@tabler/icons-svelte';
	import { cn } from '$lib/utils.js';
	import type { ComponentProps } from 'svelte';
	import { useSidebarRight } from './context.svelte.js';

	let {
		ref = $bindable(null),
		class: className,
		onclick,
		...restProps
	}: ComponentProps<typeof Button> & {
		onclick?: (e: MouseEvent) => void;
	} = $props();

	const sidebar = useSidebarRight();
</script>

<Button
	bind:ref
	data-sidebar="right-trigger"
	data-slot="sidebar-right-trigger"
	variant="ghost"
	size="icon-sm"
	class={cn('cn-sidebar-right-trigger', className)}
	type="button"
	onclick={(e) => {
		onclick?.(e);
		sidebar.toggle();
	}}
	{...restProps}
>
	{#if sidebar.state === 'expanded'}
		<IconLayoutSidebarRightCollapse />
	{:else}
		<IconLayoutSidebarRightExpand />
	{/if}
	<span class="sr-only">Toggle Right Sidebar</span>
</Button>
