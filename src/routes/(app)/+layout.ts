import { getAppShellData } from '$lib/app/data';

export function load() {
	return {
		shell: {
			data: getAppShellData()
		}
	};
}
