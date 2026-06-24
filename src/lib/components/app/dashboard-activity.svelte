<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { ActivityItem } from '$lib/app/data.js';

	let { activity }: { activity: ActivityItem[] } = $props();

	function variant(status: ActivityItem['status']) {
		return status === 'Overdue' ? 'destructive' : status === 'Paid' ? 'secondary' : 'outline';
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Recent activity</Card.Title>
		<Card.Description>Documents moving through the mock workflow</Card.Description>
	</Card.Header>
	<Card.Content>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Customer</Table.Head>
					<Table.Head>Document</Table.Head>
					<Table.Head>Status</Table.Head>
					<Table.Head class="text-right">Amount</Table.Head>
					<Table.Head class="text-right">Updated</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each activity as item (item.id)}
					<Table.Row>
						<Table.Cell class="font-medium">{item.customer}</Table.Cell>
						<Table.Cell>{item.document}</Table.Cell>
						<Table.Cell>
							<Badge variant={variant(item.status)}>{item.status}</Badge>
						</Table.Cell>
						<Table.Cell class="text-right tabular-nums">{item.amount}</Table.Cell>
						<Table.Cell class="text-muted-foreground text-right">{item.updated}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
