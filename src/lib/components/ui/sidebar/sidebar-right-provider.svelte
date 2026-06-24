<script lang="ts">
	import type { Snippet } from 'svelte';
	import { SIDEBAR_COOKIE_MAX_AGE, SIDEBAR_RIGHT_COOKIE_NAME } from './constants.js';
	import { setSidebarRight } from './context.svelte.js';

	let {
		open = $bindable(false),
		onOpenChange = () => {},
		children
	}: {
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		children?: Snippet;
	} = $props();

	setSidebarRight({
		open: () => open,
		setOpen: (value: boolean) => {
			open = value;
			onOpenChange(value);
			document.cookie = `${SIDEBAR_RIGHT_COOKIE_NAME}=${open}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
		}
	});
</script>

{@render children?.()}
