<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import UploadIcon from '@tabler/icons-svelte/icons/upload';
	import DownloadIcon from '@tabler/icons-svelte/icons/download';
	import SparklesIcon from '@tabler/icons-svelte/icons/sparkles';
	import XIcon from '@tabler/icons-svelte/icons/x';
	import AlertIcon from '@tabler/icons-svelte/icons/alert-triangle';

	type UploadedImage = {
		id: string;
		file: File;
		preview: string;
		name: string;
	};

	type GeneratedImage = {
		id: string;
		src: string;
		sourceName: string;
	};

	type GenerationStyle = {
		id: string;
		name: string;
		description: string;
	};

	let uploadedImages = $state<UploadedImage[]>([]);
	let selectedStyle = $state('white-bg');
	let isGenerating = $state(false);
	let generatedImages = $state<GeneratedImage[]>([]);
	let dragOver = $state(false);
	let errorMessage = $state('');

	const styles: GenerationStyle[] = [
		{ id: 'white-bg', name: 'White Background', description: 'Clean white studio background' },
		{ id: 'lifestyle', name: 'Lifestyle', description: 'In-context room setting' },
		{ id: 'gradient', name: 'Gradient', description: 'Soft color gradient backdrop' },
		{ id: 'transparent', name: 'Transparent', description: 'PNG with transparent background' }
	];

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		const files = e.dataTransfer?.files;
		if (files) addFiles(files);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragOver = true;
	}

	function handleDragLeave() {
		dragOver = false;
	}

	function handleFileInput(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files) addFiles(input.files);
		input.value = '';
	}

	function addFiles(files: FileList) {
		for (const file of Array.from(files)) {
			if (!file.type.startsWith('image/')) continue;
			const id = crypto.randomUUID();
			uploadedImages.push({
				id,
				file,
				preview: URL.createObjectURL(file),
				name: file.name
			});
		}
	}

	function removeImage(id: string) {
		const idx = uploadedImages.findIndex((img) => img.id === id);
		if (idx !== -1) {
			URL.revokeObjectURL(uploadedImages[idx].preview);
			uploadedImages.splice(idx, 1);
		}
	}

	async function generateImages() {
		if (uploadedImages.length === 0) return;
		isGenerating = true;
		errorMessage = '';
		generatedImages = [];

		try {
			const formData = new FormData();
			for (const img of uploadedImages) {
				formData.append('images', img.file);
			}
			formData.append('style', selectedStyle);

			const response = await fetch('/product-images', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (!response.ok) {
				errorMessage = result.message || `Generation failed (${response.status})`;
				return;
			}

			generatedImages = result.images.map((img: { b64?: string; url?: string }, i: number) => ({
				id: crypto.randomUUID(),
				src: img.b64 ? `data:image/png;base64,${img.b64}` : img.url || '',
				sourceName: uploadedImages[i]?.name || 'image'
			}));
		} catch (e) {
			errorMessage = e instanceof Error ? e.message : 'Network error. Please try again.';
		} finally {
			isGenerating = false;
		}
	}

	function downloadImage(img: GeneratedImage) {
		const a = document.createElement('a');
		a.href = img.src;
		a.download = `ai-product-${img.sourceName}`;
		a.click();
	}
</script>

<svelte:head>
	<title>Product Images - Loescher ERP</title>
</svelte:head>

<div class="flex flex-col gap-6 py-4 md:py-6">
	<header class="px-4 lg:px-6">
		<p class="text-muted-foreground text-sm font-medium">Tools</p>
		<h1 class="text-foreground mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
			AI Product Images
		</h1>
		<p class="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed md:text-base">
			Upload reference product photos and generate clean, professional images for catalogs and
			e-commerce listings.
		</p>
	</header>

	<div class="grid gap-6 px-4 lg:grid-cols-3 lg:px-6">
		<div class="lg:col-span-2">
			<Card.Root class="h-full">
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<UploadIcon class="size-5" aria-hidden="true" />
						Reference Images
					</Card.Title>
					<Card.Description>
						Drop product photos or click to upload. Multiple images supported.
					</Card.Description>
				</Card.Header>
				<Card.Content class="flex flex-col gap-4">
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="border-muted-foreground/25 hover:border-muted-foreground/50 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors {dragOver
							? 'border-primary bg-primary/5'
							: ''}"
						ondrop={handleDrop}
						ondragover={handleDragOver}
						ondragleave={handleDragLeave}
						onclick={() => document.getElementById('file-input')?.click()}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ')
								document.getElementById('file-input')?.click();
						}}
					>
						<UploadIcon class="text-muted-foreground size-10" aria-hidden="true" />
						<div class="text-center">
							<p class="text-foreground text-sm font-medium">Drop images here or click to browse</p>
							<p class="text-muted-foreground mt-1 text-xs">PNG, JPG, WEBP up to 10MB each</p>
						</div>
					</div>
					<input
						id="file-input"
						type="file"
						accept="image/*"
						multiple
						class="hidden"
						onchange={handleFileInput}
					/>

					{#if uploadedImages.length > 0}
						<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
							{#each uploadedImages as img (img.id)}
								<div class="group relative overflow-hidden rounded-lg border">
									<img src={img.preview} alt={img.name} class="aspect-square w-full object-cover" />
									<button
										onclick={() => removeImage(img.id)}
										class="bg-destructive/80 hover:bg-destructive absolute top-1 right-1 rounded-full p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
									>
										<XIcon class="size-3" />
									</button>
									<p
										class="text-muted-foreground truncate bg-white/80 px-2 py-1 text-xs backdrop-blur-sm"
									>
										{img.name}
									</p>
								</div>
							{/each}
						</div>
					{/if}
				</Card.Content>
			</Card.Root>
		</div>

		<div class="flex flex-col gap-6">
			<Card.Root>
				<Card.Header>
					<Card.Title>Output Style</Card.Title>
					<Card.Description>Choose the background style for generated images.</Card.Description>
				</Card.Header>
				<Card.Content class="flex flex-col gap-2">
					{#each styles as style (style.id)}
						<button
							class="border-input hover:bg-muted/50 flex flex-col gap-0.5 rounded-lg border px-3 py-2.5 text-left transition-colors {selectedStyle ===
							style.id
								? 'border-primary bg-primary/5'
								: ''}"
							onclick={() => (selectedStyle = style.id)}
						>
							<span class="text-foreground text-sm font-medium">{style.name}</span>
							<span class="text-muted-foreground text-xs">{style.description}</span>
						</button>
					{/each}
				</Card.Content>
			</Card.Root>

			<Button
				onclick={generateImages}
				disabled={uploadedImages.length === 0 || isGenerating}
				class="w-full"
				size="lg"
			>
				{#if isGenerating}
					<span class="mr-2 animate-spin">⏳</span>
					Generating...
				{:else}
					<SparklesIcon class="mr-2 size-4" />
					Generate Images
				{/if}
			</Button>
		</div>
	</div>

	{#if errorMessage}
		<div class="px-4 lg:px-6">
			<div
				class="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/5 p-3"
			>
				<AlertIcon class="text-destructive size-4 shrink-0" />
				<p class="text-destructive text-sm">{errorMessage}</p>
			</div>
		</div>
	{/if}

	{#if generatedImages.length > 0}
		<div class="px-4 lg:px-6">
			<Separator class="my-2" />
			<div class="mt-4 flex items-center justify-between">
				<div>
					<h2 class="text-foreground text-lg font-semibold">Generated Results</h2>
					<p class="text-muted-foreground text-sm">
						{generatedImages.length} image{generatedImages.length !== 1 ? 's' : ''} generated with
						{styles.find((s) => s.id === selectedStyle)?.name} style.
					</p>
				</div>
			</div>
			<div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each generatedImages as img (img.id)}
					<Card.Root>
						<Card.Content class="p-0">
							<div class="relative">
								<div
									class="bg-muted/30 flex aspect-square items-center justify-center rounded-t-lg overflow-hidden"
								>
									<img
										src={img.src}
										alt="AI generated from {img.sourceName}"
										class="h-full w-full object-contain"
									/>
								</div>
								<Badge
									variant="secondary"
									class="absolute top-2 right-2 bg-white/90 backdrop-blur-sm"
								>
									<SparklesIcon class="mr-1 size-3" />
									AI Enhanced
								</Badge>
							</div>
						</Card.Content>
						<Card.Footer class="flex gap-2 p-3">
							<Button onclick={() => downloadImage(img)} variant="outline" size="sm" class="flex-1">
								<DownloadIcon class="mr-1 size-3" />
								Download
							</Button>
						</Card.Footer>
					</Card.Root>
				{/each}
			</div>
		</div>
	{/if}
</div>
