<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { AppShellData, ShellTask } from '$lib/app/data.js';

	let { shell }: { shell: Promise<AppShellData> } = $props();

	function taskVariant(status: ShellTask['status']) {
		return status === 'done' ? 'secondary' : 'outline';
	}
</script>

<Sidebar.RightRoot>
	<Sidebar.Header class="border-b px-4 py-3">
		<p class="text-sm font-semibold">Work queue</p>
		<p class="text-muted-foreground text-xs">Mock async panel data</p>
	</Sidebar.Header>
	<Sidebar.Content class="px-4 py-4">
		{#await shell}
			<div class="flex flex-col gap-3">
				{#each Array.from({ length: 3 }) as _, index (index)}
					<div class="flex flex-col gap-2 rounded-lg border p-3">
						<Skeleton class="h-4 w-4/5" />
						<Skeleton class="h-3 w-24" />
					</div>
				{/each}
			</div>
		{:then data}
			<div class="flex flex-col gap-3">
				{#each data.tasks as task (task.id)}
					<article class="flex flex-col gap-2 rounded-lg border bg-background p-3">
						<div class="flex items-start justify-between gap-3">
							<p class="text-sm font-medium leading-snug">{task.title}</p>
							<Badge variant={taskVariant(task.status)}>{task.status}</Badge>
						</div>
						<p class="text-muted-foreground text-xs">{task.due}</p>
					</article>
				{/each}
			</div>
		{/await}
	</Sidebar.Content>
</Sidebar.RightRoot>
