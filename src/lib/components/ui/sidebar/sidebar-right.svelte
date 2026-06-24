<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { SIDEBAR_RIGHT_WIDTH, SIDEBAR_WIDTH_MOBILE } from './constants.js';
	import { useSidebarRight } from './context.svelte.js';

	let {
		ref = $bindable(null),
		collapsible = 'offcanvas',
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		collapsible?: 'offcanvas' | 'none';
	} = $props();

	const sidebar = useSidebarRight();
</script>

{#if collapsible === 'none'}
	<div
		class={cn('bg-sidebar text-sidebar-foreground flex h-full flex-col', className)}
		style="width: {SIDEBAR_RIGHT_WIDTH}"
		bind:this={ref}
		{...restProps}
	>
		{@render children?.()}
	</div>
{:else if sidebar.isMobile}
	<Sheet.Root bind:open={() => sidebar.openMobile, (v) => sidebar.setOpenMobile(v)}>
		<Sheet.Content
			bind:ref
			data-sidebar="sidebar"
			data-slot="sidebar"
			data-mobile="true"
			class={cn(
				'bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden',
				className
			)}
			style="--sidebar-width: {SIDEBAR_WIDTH_MOBILE};"
			side="right"
		>
			<Sheet.Header class="sr-only">
				<Sheet.Title>Right Sidebar</Sheet.Title>
				<Sheet.Description>Displays the right sidebar panel.</Sheet.Description>
			</Sheet.Header>
			<div class="flex h-full w-full flex-col">
				{@render children?.()}
			</div>
		</Sheet.Content>
	</Sheet.Root>
{:else}
	<div
		bind:this={ref}
		class="text-sidebar-foreground group peer hidden md:block"
		data-state={sidebar.state}
		data-collapsible={sidebar.state === 'collapsed' ? collapsible : ''}
		data-variant="sidebar"
		data-side="right"
		data-slot="sidebar"
	>
		<div
			data-slot="sidebar-gap"
			class="relative bg-transparent transition-[width] duration-200 ease-linear group-data-[collapsible=offcanvas]:w-0"
			style="width: {SIDEBAR_RIGHT_WIDTH}; --sidebar-right-width: {SIDEBAR_RIGHT_WIDTH}"
		></div>
		<div
			data-slot="sidebar-container"
			class={cn(
				'fixed inset-y-0 end-0 z-10 hidden h-svh w-[var(--sidebar-right-width)] border-s transition-[right,width] duration-200 ease-linear md:flex',
				'group-data-[collapsible=offcanvas]:end-[calc(var(--sidebar-right-width)*-1)]',
				className
			)}
			style="--sidebar-right-width: {SIDEBAR_RIGHT_WIDTH}"
			{...restProps}
		>
			<div
				data-sidebar="sidebar"
				data-slot="sidebar-inner"
				class="bg-sidebar flex size-full flex-col"
			>
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}
