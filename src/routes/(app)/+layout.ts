import { getAppShellData } from '$lib/app/data';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ data }) => {
	return {
		...data,
		shell: {
			data: getAppShellData()
		}
	};
};
