<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import AppSidebar from '$lib/components/app/app-sidebar.svelte';
	import SiteHeader from '$lib/components/app/site-header.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();
</script>

<ModeWatcher disableHeadScriptInjection={true} />

<Sidebar.Provider
	style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
>
	<AppSidebar
		shell={data.shell.data}
		companies={data.companies}
		activeCompany={data.activeCompany}
		variant="inset"
	/>
	<Sidebar.Inset>
		<SiteHeader shell={data.shell.data} />
		<div class="flex flex-1 flex-col">
			<div class="@container/main flex flex-1 flex-col gap-2">
				{@render children()}
			</div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
