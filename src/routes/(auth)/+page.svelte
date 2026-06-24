<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Icon } from '$lib/components/ui/icon';
	import { onMount } from 'svelte';
	import IconCloud from '@tabler/icons-svelte/icons/cloud';
	import IconLock from '@tabler/icons-svelte/icons/lock';
	import IconLogin from '@tabler/icons-svelte/icons/login';
	import IconMapPin from '@tabler/icons-svelte/icons/map-pin';
	import IconWifi from '@tabler/icons-svelte/icons/wifi';

	type WeatherState = {
		temperature: number;
		unit: 'F' | 'C';
		code: number;
	};

	type LocationState = {
		label: string;
		status: 'idle' | 'loading' | 'ready' | 'error';
	};

	const weatherLabels: Record<number, string> = {
		0: 'Clear',
		1: 'Mostly clear',
		2: 'Partly cloudy',
		3: 'Cloudy',
		45: 'Fog',
		48: 'Freezing fog',
		51: 'Light drizzle',
		53: 'Drizzle',
		55: 'Heavy drizzle',
		61: 'Light rain',
		63: 'Rain',
		65: 'Heavy rain',
		71: 'Light snow',
		73: 'Snow',
		75: 'Heavy snow',
		80: 'Light showers',
		81: 'Showers',
		82: 'Heavy showers',
		95: 'Thunderstorm'
	};

	const defaultLocation = {
		label: 'Innsbruck, Austria',
		latitude: 47.2692,
		longitude: 11.4041
	};

	let now = $state(new Date());
	let location = $state<LocationState>({ label: 'Finding your location', status: 'idle' });
	let weather = $state<WeatherState | null>(null);

	const timeText = $derived(
		new Intl.DateTimeFormat(undefined, {
			hour: 'numeric',
			minute: '2-digit'
		}).format(now)
	);

	const dateText = $derived(
		new Intl.DateTimeFormat(undefined, {
			weekday: 'long',
			month: 'long',
			day: 'numeric'
		}).format(now)
	);

	const weatherText = $derived(
		weather
			? `${Math.round(weather.temperature)}°${weather.unit} · ${weatherLabels[weather.code] ?? 'Weather'}`
			: null
	);

	function prefersFahrenheit() {
		const locale = navigator.language || '';
		return /-(US|BS|BZ|KY|PW|FM|MH|LR)$/i.test(locale);
	}

	function getPosition() {
		return new Promise<GeolocationPosition>((resolvePosition, rejectPosition) => {
			navigator.geolocation.getCurrentPosition(resolvePosition, rejectPosition, {
				enableHighAccuracy: false,
				timeout: 8000,
				maximumAge: 10 * 60 * 1000
			});
		});
	}

	async function loadWeatherContext(
		latitude: number,
		longitude: number,
		fallbackLabel = 'Current location',
		resolvePlace = true
	) {
		const unit = prefersFahrenheit() ? 'F' : 'C';
		const temperatureUnit = unit === 'F' ? 'fahrenheit' : 'celsius';

		const placeRequest = resolvePlace
			? fetch(
					`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`
				)
			: null;

		const [placeResponse, weatherResponse] = await Promise.all([
			placeRequest,
			fetch(
				`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=${temperatureUnit}`
			)
		]);

		const placeData = placeResponse ? await placeResponse.json() : null;
		const weatherData = await weatherResponse.json();
		const place = placeData?.results?.[0];

		location = {
			label: [place?.name, place?.admin1].filter(Boolean).join(', ') || fallbackLabel,
			status: 'ready'
		};

		weather = {
			temperature: weatherData.current.temperature_2m,
			unit,
			code: weatherData.current.weather_code
		};
	}

	async function loadDefaultWeatherContext() {
		location = { label: defaultLocation.label, status: 'loading' };

		try {
			await loadWeatherContext(
				defaultLocation.latitude,
				defaultLocation.longitude,
				defaultLocation.label,
				false
			);
		} catch {
			location = { label: defaultLocation.label, status: 'error' };
			weather = null;
		}
	}

	async function loadLocalContext() {
		if (!navigator.geolocation) {
			await loadDefaultWeatherContext();
			return;
		}

		location = { label: 'Finding your location', status: 'loading' };

		try {
			const position = await getPosition();
			const { latitude, longitude } = position.coords;

			await loadWeatherContext(latitude, longitude);
		} catch {
			await loadDefaultWeatherContext();
		}
	}

	function goToLogin() {
		void goto(resolve('/login'));
	}

	function onGlobalKeydown(e: KeyboardEvent) {
		const target = e.target as HTMLElement | null;
		if (
			target &&
			(target.tagName === 'INPUT' ||
				target.tagName === 'TEXTAREA' ||
				target.tagName === 'SELECT' ||
				target.isContentEditable)
		) {
			return;
		}

		if (e.key === 'Enter' && !e.repeat) {
			e.preventDefault();
			goToLogin();
		}
	}

	onMount(() => {
		const interval = window.setInterval(() => {
			now = new Date();
		}, 1000);

		void loadLocalContext();

		return () => {
			window.clearInterval(interval);
		};
	});
</script>

<svelte:window onkeydown={onGlobalKeydown} />

<svelte:head>
	<title>Hubris — Sign in</title>
</svelte:head>

<!-- Windows-style lock screen, centered -->
<section
	class="fixed inset-0 flex min-h-dvh flex-col p-6 font-(--font-lock) text-white select-none md:p-10"
	aria-label="Lock screen"
	style="--font-lock: 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif"
>
	<div class="absolute top-6 right-6 z-10 flex gap-2 md:top-10 md:right-10">
		<div
			class="flex h-10 items-center gap-2 rounded-sm px-3 text-sm text-white/90 backdrop-blur-sm transition-colors hover:bg-white/10"
			title="Network status"
		>
			<IconWifi class="size-4 opacity-90" aria-hidden="true" />
			<span class="hidden sm:inline">Connected</span>
		</div>
		<div
			class="flex h-10 items-center gap-2 rounded-sm px-3 text-sm text-white/90 backdrop-blur-sm transition-colors hover:bg-white/10"
			title="Device locked"
		>
			<IconLock class="size-4 opacity-90" aria-hidden="true" />
			<span class="hidden sm:inline">Locked</span>
		</div>
	</div>

	<div
		class="flex min-h-0 flex-1 flex-col items-center justify-center px-2 pb-12 text-center md:pb-16"
	>
		<div class="flex max-w-xl flex-col items-center drop-shadow-[0_12px_48px_rgba(0,0,0,0.45)]">
			<div
				class="mb-10 flex items-center justify-center gap-2.5 text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] md:mb-12"
			>
				<Icon icon="Brand" class="size-9 shrink-0 md:size-10" aria-hidden="true" />
				<span class="text-2xl font-semibold tracking-tight md:text-3xl">Hubris</span>
			</div>
			<p
				class="text-[clamp(3.25rem,11vw,7.5rem)] leading-[0.95] font-light tabular-nums tracking-tight"
			>
				{timeText}
			</p>
			<p class="mt-1 text-[clamp(1rem,2.4vw,1.5rem)] font-normal text-white/95">
				{dateText}
			</p>

			<div
				class="mt-6 flex max-w-md flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-white/80 md:text-base"
			>
				<span class="inline-flex max-w-full items-center justify-center gap-2">
					<IconMapPin class="size-4 shrink-0 opacity-85" aria-hidden="true" />
					<span class="truncate">{location.label}</span>
				</span>
				<span class="hidden h-4 w-px bg-white/25 sm:block" aria-hidden="true"></span>
				<span class="inline-flex items-center gap-2">
					<IconCloud class="size-4 shrink-0 opacity-85" aria-hidden="true" />
					<span>{weatherText ?? 'Weather pending'}</span>
				</span>
			</div>
		</div>

		<div class="mt-12 flex max-w-sm flex-col items-center gap-3">
			<button
				type="button"
				class="group flex min-h-11 w-full max-w-[min(100%,18rem)] items-center justify-center gap-3 rounded-full border border-white/25 bg-white/12 py-2 pr-6 pl-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_16px_48px_-24px_rgba(0,0,0,0.75)] backdrop-blur-md transition hover:bg-white/18 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 active:translate-y-px"
				onclick={goToLogin}
			>
				<span
					class="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/95 text-zinc-900 shadow-sm transition group-hover:bg-white"
					aria-hidden="true"
				>
					<IconLogin class="size-4" />
				</span>
				<span class="text-base font-semibold tracking-tight">Sign in</span>
			</button>
			<p class="text-xs text-white/65 md:text-sm">
				Press
				<kbd
					class="rounded border border-white/25 bg-white/15 px-1.5 py-0.5 font-mono text-[0.7rem] text-white/90"
				>
					Enter
				</kbd>
				to sign in
			</p>
			<a
				href={resolve('/register')}
				class="text-xs text-white/60 underline-offset-2 hover:text-white/90 hover:underline md:text-sm"
			>
				Create an account
			</a>
		</div>
	</div>
</section>
