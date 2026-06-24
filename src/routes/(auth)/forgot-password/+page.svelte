<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import {
		Field,
		FieldDescription,
		FieldGroup,
		FieldLabel
	} from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
</script>

<svelte:head>
	<title>Reset Password - Loescher ERP</title>
</svelte:head>

<Card.Root>
	<Card.Header class="text-center">
		<Card.Title class="text-xl">Reset password</Card.Title>
		<Card.Description>Enter your email address to request a reset link.</Card.Description>
	</Card.Header>
	<Card.Content>
		<form>
			<FieldGroup>
				<Field>
					<FieldLabel for="reset-email">Email</FieldLabel>
					<Input id="reset-email" type="email" placeholder="m@example.com" required />
				</Field>
				<Field>
					<Button type="submit">Send Reset Link</Button>
					<FieldDescription class="text-center">
						Remembered it? <a href={resolve('/login')}>Back to login</a>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	</Card.Content>
</Card.Root>
