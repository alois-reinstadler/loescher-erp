<script lang="ts">
	import { setMode } from 'mode-watcher';
	let { children } = $props();

	setMode('light');
</script>

{@render children()}
