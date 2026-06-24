import { getDashboardData } from '$lib/app/data';

export function load() {
	return {
		dashboard: {
			data: getDashboardData()
		}
	};
}
