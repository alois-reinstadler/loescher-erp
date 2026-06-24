<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
</script>

<svelte:head>
	<title>Privacy Policy - Loescher ERP</title>
</svelte:head>

<Card.Root>
	<Card.Header>
		<Card.Title>Privacy Policy</Card.Title>
		<Card.Description>Privacy placeholder for the current ERP prototype.</Card.Description>
	</Card.Header>
	<Card.Content class="space-y-4 text-sm leading-relaxed">
		<p>
			The current interface uses mock operational data and does not submit auth forms to a live
			identity provider.
		</p>
		<p>
			Before connecting production data, define retention, access logging, regional hosting, and
			data subject request procedures.
		</p>
		<Button href={resolve('/login')} variant="outline">Back to Login</Button>
	</Card.Content>
</Card.Root>
