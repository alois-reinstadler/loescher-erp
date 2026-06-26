import { loadCompanyIssuer } from '$lib/pdf/company-issuer.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => ({
	issuer: await loadCompanyIssuer(url.searchParams.get('company'))
});
