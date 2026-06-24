import { getOperationsData } from '$lib/app/data';

export function load() {
	return {
		operations: {
			data: getOperationsData()
		}
	};
}
