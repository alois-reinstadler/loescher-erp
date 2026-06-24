<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
</script>

<svelte:head>
	<title>Terms of Service - Loescher ERP</title>
</svelte:head>

<Card.Root>
	<Card.Header>
		<Card.Title>Terms of Service</Card.Title>
		<Card.Description>Internal prototype terms for Loescher ERP access.</Card.Description>
	</Card.Header>
	<Card.Content class="space-y-4 text-sm leading-relaxed">
		<p>
			This ERP prototype is intended for authorized Loescher workflow evaluation, sample data, and
			document rendering checks.
		</p>
		<p>
			Production terms, data handling rules, and account governance should be reviewed before real
			authentication or customer records are enabled.
		</p>
		<Button href={resolve('/login')} variant="outline">Back to Login</Button>
	</Card.Content>
</Card.Root>
