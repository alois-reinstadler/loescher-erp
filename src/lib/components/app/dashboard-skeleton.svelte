<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
</script>

<div class="flex flex-col gap-6 py-4 md:gap-8 md:py-6">
	<header class="flex flex-col gap-2 px-4 lg:px-6">
		<Skeleton class="h-4 w-24" />
		<Skeleton class="h-8 w-48" />
		<Skeleton class="h-4 w-full max-w-xl" />
	</header>

	<div class="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
		{#each Array.from({ length: 4 }) as _, index (index)}
			<Card.Root>
				<Card.Header>
					<Skeleton class="h-4 w-24" />
					<Skeleton class="h-8 w-32" />
				</Card.Header>
				<Card.Footer class="flex-col items-start gap-1.5">
					<Skeleton class="h-4 w-40" />
					<Skeleton class="h-4 w-56 max-w-full" />
				</Card.Footer>
			</Card.Root>
		{/each}
	</div>

	<div class="px-4 lg:px-6">
		<Card.Root>
			<Card.Header>
				<Skeleton class="h-5 w-36" />
				<Skeleton class="h-4 w-56" />
			</Card.Header>
			<Card.Content>
				<Skeleton class="h-[270px] w-full" />
			</Card.Content>
		</Card.Root>
	</div>
</div>
