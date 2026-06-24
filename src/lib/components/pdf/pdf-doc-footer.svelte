<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Issuer } from './types.js';

	let {
		ref = $bindable(null),
		class: className,
		issuer,
		fourthColumn,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLElement>> & {
		issuer: Issuer;
		fourthColumn?: Snippet;
	} = $props();
</script>

<footer
	bind:this={ref}
	data-slot="pdf-doc-footer"
	class={cn(
		'mt-auto grid grid-cols-4 gap-4 border-t border-border pt-2 text-[6.8pt] leading-snug text-muted-foreground [&_strong]:mb-1 [&_strong]:block [&_strong]:font-mono [&_strong]:text-[7pt] [&_strong]:font-semibold [&_strong]:tracking-widest [&_strong]:text-foreground [&_strong]:uppercase',
		className
	)}
	{...restProps}
>
	<div>
		<strong>Firma</strong>
		{issuer.name}<br />
		{issuer.address_line1}<br />
		{issuer.address_line2}
	</div>
	<div>
		<strong>Kontakt</strong>
		{issuer.email}<br />
		{issuer.phone}<br />
		{issuer.web}
	</div>
	<div>
		<strong>Register</strong>
		FN {issuer.fn}<br />
		UID {issuer.uid}<br />
		Sitz {issuer.sitz}
	</div>
	<div>
		{#if fourthColumn}
			{@render fourthColumn()}
		{:else}
			<strong>Bank</strong>
			{issuer.bank ?? '—'}<br />
			IBAN {issuer.iban ?? '—'}<br />
			BIC {issuer.bic ?? '—'}
		{/if}
	</div>
</footer>
