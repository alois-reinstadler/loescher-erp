<script lang="ts">
	import BookIcon from '@tabler/icons-svelte/icons/book';
	import LifebuoyIcon from '@tabler/icons-svelte/icons/lifebuoy';
	import MessageCircleQuestionIcon from '@tabler/icons-svelte/icons/message-circle-question';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
</script>

<svelte:head>
	<title>Get Help - Loescher ERP</title>
</svelte:head>

<div class="flex flex-col gap-6 py-4 md:py-6">
	<header class="px-4 lg:px-6">
		<p class="text-muted-foreground text-sm font-medium">Support</p>
		<h1 class="text-foreground mt-1 text-2xl font-semibold tracking-tight md:text-3xl">Get Help</h1>
		<p class="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed md:text-base">
			Internal support entry points for operational questions, document workflows, and rollout
			notes.
		</p>
	</header>

	<div class="grid gap-4 px-4 md:grid-cols-3 lg:px-6">
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center gap-2 text-base">
					<LifebuoyIcon class="size-5" aria-hidden="true" />
					ERP Support
				</Card.Title>
				<Card.Description>Route urgent workflow issues to operations support.</Card.Description>
			</Card.Header>
			<Card.Content>
				<Button variant="outline" class="w-full">Open Support Request</Button>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center gap-2 text-base">
					<BookIcon class="size-5" aria-hidden="true" />
					Process Notes
				</Card.Title>
				<Card.Description
					>Sourcing, samples, procurement, logistics, and invoicing references.</Card.Description
				>
			</Card.Header>
			<Card.Content>
				<Button variant="outline" class="w-full">View Handbook</Button>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center gap-2 text-base">
					<MessageCircleQuestionIcon class="size-5" aria-hidden="true" />
					Product Feedback
				</Card.Title>
				<Card.Description
					>Collect page gaps and automation requests during the prototype phase.</Card.Description
				>
			</Card.Header>
			<Card.Content>
				<Button variant="outline" class="w-full">Send Feedback</Button>
			</Card.Content>
		</Card.Root>
	</div>
</div>
