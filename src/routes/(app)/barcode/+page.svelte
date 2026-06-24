<script lang="ts">
	import { generateSvgString, isValidEan13, calculateCheckDigit } from '$lib/barcode/ean13';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import BarcodeIcon from '@tabler/icons-svelte/icons/barcode';
	import CopyIcon from '@tabler/icons-svelte/icons/copy';
	import DownloadIcon from '@tabler/icons-svelte/icons/download';
	import RefreshIcon from '@tabler/icons-svelte/icons/refresh';
	import CheckIcon from '@tabler/icons-svelte/icons/check';

	let code = $state('');
	let svgOutput = $state('');
	let error = $state('');
	let copied = $state(false);

	function setSvgHtml(node: HTMLElement, html: string) {
		node.innerHTML = html;
		return {
			update(newHtml: string) {
				node.innerHTML = newHtml;
			}
		};
	}

	function generate() {
		error = '';
		svgOutput = '';

		const clean = code.replace(/\s/g, '');

		if (!/^\d+$/.test(clean)) {
			error = 'Code must contain only digits.';
			return;
		}

		if (clean.length === 12) {
			const check = calculateCheckDigit(clean.split('').map(Number));
			code = clean + check;
		} else if (clean.length !== 13) {
			error = 'Enter 12 digits (check digit will be calculated) or 13 digits.';
			return;
		}

		if (!isValidEan13(code)) {
			error = 'Invalid EAN-13 code.';
			return;
		}

		svgOutput = generateSvgString(code, { height: 100, showText: true });
	}

	function randomCode() {
		let digits = '';
		for (let i = 0; i < 12; i++) {
			digits += Math.floor(Math.random() * 10);
		}
		code = digits;
		generate();
	}

	function copySvg() {
		if (!svgOutput) return;
		navigator.clipboard.writeText(svgOutput).then(() => {
			copied = true;
			setTimeout(() => (copied = false), 2000);
		});
	}

	function downloadSvg() {
		if (!svgOutput) return;
		const blob = new Blob([svgOutput], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `ean13-${code}.svg`;
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<svelte:head>
	<title>Barcode Generator - Loescher ERP</title>
</svelte:head>

<div class="flex flex-col gap-6 py-4 md:py-6">
	<header class="px-4 lg:px-6">
		<p class="text-muted-foreground text-sm font-medium">Tools</p>
		<h1 class="text-foreground mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
			EAN-13 Barcode Generator
		</h1>
		<p class="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed md:text-base">
			Generate EAN-13 barcodes for product labeling. Enter 12 digits and the check digit is
			calculated automatically, or enter all 13 digits.
		</p>
	</header>

	<div class="grid gap-6 px-4 lg:grid-cols-2 lg:px-6">
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center gap-2">
					<BarcodeIcon class="size-5" aria-hidden="true" />
					Input
				</Card.Title>
				<Card.Description>Enter a 12 or 13 digit numeric code.</Card.Description>
			</Card.Header>
			<Card.Content class="flex flex-col gap-4">
				<div class="flex flex-col gap-2">
					<Label for="barcode-input">Code</Label>
					<Input
						id="barcode-input"
						bind:value={code}
						placeholder="e.g. 4006381333931"
						maxlength={13}
						class="font-mono"
						onkeydown={(e) => {
							if (e.key === 'Enter') generate();
						}}
					/>
					{#if error}
						<p class="text-destructive text-sm">{error}</p>
					{/if}
				</div>
				<div class="flex gap-2">
					<Button onclick={generate} class="flex-1">Generate</Button>
					<Button onclick={randomCode} variant="outline" size="icon">
						<RefreshIcon class="size-4" />
						<span class="sr-only">Random code</span>
					</Button>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Preview</Card.Title>
				<Card.Description>SVG barcode output ready for download or copy.</Card.Description>
			</Card.Header>
			<Card.Content class="flex flex-col gap-4">
				{#if svgOutput}
					<div class="flex items-center justify-center rounded-lg border bg-white p-6">
						<div use:setSvgHtml={svgOutput}></div>
					</div>
					<div class="flex gap-2">
						<Button onclick={copySvg} variant="outline" class="flex-1">
							{#if copied}
								<CheckIcon class="mr-2 size-4" />
								Copied!
							{:else}
								<CopyIcon class="mr-2 size-4" />
								Copy SVG
							{/if}
						</Button>
						<Button onclick={downloadSvg} variant="outline" class="flex-1">
							<DownloadIcon class="mr-2 size-4" />
							Download SVG
						</Button>
					</div>
				{:else}
					<div
						class="bg-muted/50 flex items-center justify-center rounded-lg border border-dashed p-12"
					>
						<p class="text-muted-foreground text-sm">Enter a code and click Generate.</p>
					</div>
				{/if}
			</Card.Content>
		</Card.Root>
	</div>

	<div class="px-4 lg:px-6">
		<Card.Root>
			<Card.Header>
				<Card.Title>How EAN-13 Works</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="grid gap-4 md:grid-cols-3">
					<div class="flex flex-col gap-1">
						<p class="text-foreground text-sm font-medium">Structure</p>
						<p class="text-muted-foreground text-sm">
							13 digits: first digit encodes the country prefix, next 5 are manufacturer code, next
							6 are product code, last is a check digit.
						</p>
					</div>
					<div class="flex flex-col gap-1">
						<p class="text-foreground text-sm font-medium">Check Digit</p>
						<p class="text-muted-foreground text-sm">
							Calculated using alternating weights of 1 and 3. The sum modulo 10 determines the
							final digit for validation.
						</p>
					</div>
					<div class="flex flex-col gap-1">
						<p class="text-foreground text-sm font-medium">Encoding</p>
						<p class="text-muted-foreground text-sm">
							Each digit maps to a specific bar pattern. Left half uses L/G patterns based on the
							first digit, right half always uses R patterns.
						</p>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
