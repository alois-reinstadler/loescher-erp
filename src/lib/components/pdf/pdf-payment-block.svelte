<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Issuer } from './types.js';

	let {
		ref = $bindable(null),
		class: className,
		issuer,
		reference,
		amount,
		title = 'Zahlungsdaten / Bank details',
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		issuer: Issuer;
		reference: string;
		amount: string;
		title?: string;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="pdf-payment-block"
	class={cn(
		'mt-2.5 grid grid-cols-[1fr_64px] items-start gap-3 rounded-lg border border-border p-2.5',
		className
	)}
	{...restProps}
>
	<div>
		<h3 class="mb-1 font-heading text-[9.5pt] font-semibold">{title}</h3>
		<dl class="grid grid-cols-[110px_1fr] gap-x-2.5 gap-y-0.5 text-[8pt] leading-tight">
			<dt class="pt-px font-mono text-[8pt] tracking-wider text-muted-foreground uppercase">
				Empfänger
			</dt>
			<dd class="m-0 font-mono">{issuer.name}</dd>
			<dt class="pt-px font-mono text-[8pt] tracking-wider text-muted-foreground uppercase">
				IBAN
			</dt>
			<dd class="m-0 font-mono">{issuer.iban ?? '—'}</dd>
			<dt class="pt-px font-mono text-[8pt] tracking-wider text-muted-foreground uppercase">BIC</dt>
			<dd class="m-0 font-mono">{issuer.bic ?? '—'}</dd>
			<dt class="pt-px font-mono text-[8pt] tracking-wider text-muted-foreground uppercase">
				Verwendungszweck
			</dt>
			<dd class="m-0 font-mono">{reference}</dd>
			<dt class="pt-px font-mono text-[8pt] tracking-wider text-muted-foreground uppercase">
				Betrag
			</dt>
			<dd class="m-0 font-mono">€ {amount}</dd>
		</dl>
	</div>
	<div
		class="grid size-16 place-items-center border border-border bg-background p-1 text-center text-[7pt] text-muted-foreground"
	>
		QR-Code<br />SEPA<br />(EPC069)
	</div>
</div>
