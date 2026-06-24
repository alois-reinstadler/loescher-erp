<script lang="ts" module>
	import * as icons from './icons';
	import { type HugeiconsProps } from '@hugeicons/svelte';

	export type IconName = keyof typeof icons;

	export type IconProps = HugeiconsProps & {
		icon: IconName;
		role?: 'status' | 'presentation';
		'aria-label'?: string;
	};
</script>

<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';

	let { icon: name, role, ariaLabel, ...restProps }: IconProps = $props();
	let icon = $derived(icons[name]);
</script>

<HugeiconsIcon {icon} {role} aria-label={ariaLabel} {...restProps} />
