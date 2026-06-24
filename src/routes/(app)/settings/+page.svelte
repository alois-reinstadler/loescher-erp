<script lang="ts">
	import DeviceDesktopCogIcon from '@tabler/icons-svelte/icons/device-desktop-cog';
	import MailCogIcon from '@tabler/icons-svelte/icons/mail-cog';
	import ShieldLockIcon from '@tabler/icons-svelte/icons/shield-lock';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
</script>

<svelte:head>
	<title>Settings - Loescher ERP</title>
</svelte:head>

<div class="flex flex-col gap-6 py-4 md:py-6">
	<header class="flex flex-col gap-4 px-4 lg:flex-row lg:items-end lg:justify-between lg:px-6">
		<div>
			<p class="text-muted-foreground text-sm font-medium">Administration</p>
			<h1 class="text-foreground mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
				Settings
			</h1>
			<p class="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed md:text-base">
				Workspace defaults, notification preferences, and compliance controls for the ERP shell.
			</p>
		</div>
		<Button>Save Changes</Button>
	</header>

	<div class="grid gap-4 px-4 lg:grid-cols-3 lg:px-6">
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center gap-2 text-base">
					<DeviceDesktopCogIcon class="size-5" aria-hidden="true" />
					Workspace
				</Card.Title>
				<Card.Description>Regional defaults used by documents and dashboards.</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4 text-sm">
				<div class="flex items-center justify-between gap-4">
					<span class="text-muted-foreground">Locale</span>
					<Badge variant="outline">de-AT</Badge>
				</div>
				<div class="flex items-center justify-between gap-4">
					<span class="text-muted-foreground">Timezone</span>
					<Badge variant="outline">Europe/Vienna</Badge>
				</div>
				<div class="flex items-center justify-between gap-4">
					<span class="text-muted-foreground">Currency</span>
					<Badge variant="outline">EUR</Badge>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center gap-2 text-base">
					<MailCogIcon class="size-5" aria-hidden="true" />
					Notifications
				</Card.Title>
				<Card.Description>Operational alert preferences.</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4 text-sm">
				<div class="flex items-center justify-between gap-4">
					<span>Shipment delays</span>
					<Switch checked={true} aria-label="Shipment delay notifications" />
				</div>
				<div class="flex items-center justify-between gap-4">
					<span>Payment reminders</span>
					<Switch checked={true} aria-label="Payment reminder notifications" />
				</div>
				<div class="flex items-center justify-between gap-4">
					<span>Sample arrivals</span>
					<Switch checked={false} aria-label="Sample arrival notifications" />
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center gap-2 text-base">
					<ShieldLockIcon class="size-5" aria-hidden="true" />
					Access
				</Card.Title>
				<Card.Description>Authentication wiring is intentionally still staged.</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4 text-sm">
				<div class="flex items-center justify-between gap-4">
					<span class="text-muted-foreground">Auth guard</span>
					<Badge variant="secondary">Pending</Badge>
				</div>
				<div class="flex items-center justify-between gap-4">
					<span class="text-muted-foreground">Password login</span>
					<Badge variant="secondary">Mock UI</Badge>
				</div>
				<div class="flex items-center justify-between gap-4">
					<span class="text-muted-foreground">Audit log</span>
					<Badge variant="outline">Planned</Badge>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
