<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import authWallpaper from '$lib/assets/auth-wallpaper.jpg';
	import { Icon } from '$lib/components/ui/icon';

	let { children } = $props();

	const showCornerBrand = $derived(page.url.pathname !== '/login');
</script>

<div class="relative min-h-dvh overflow-hidden bg-zinc-950 text-white">
	<img
		src={authWallpaper}
		alt=""
		class="absolute inset-0 size-full object-cover"
		aria-hidden="true"
	/>
	<div
		class="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,16,23,0.68),rgba(12,16,23,0.18)_52%,rgba(12,16,23,0.7))]"
	></div>
	<div
		class="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(9,12,18,0.44))]"
	></div>

	<div class="relative flex min-h-dvh flex-col items-center justify-center gap-6 p-6 md:p-10">
		{#if showCornerBrand}
			<a
				href={resolve('/')}
				class="absolute top-6 left-6 flex items-center gap-2 text-sm font-semibold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] transition hover:text-white/90 md:top-8 md:left-8"
			>
				<Icon icon="Brand" class="size-6 shrink-0" />
				Loescher ERP
			</a>
		{/if}

		<div class="flex w-full max-w-sm flex-col gap-6">
			{@render children()}
		</div>
	</div>
</div>
