import { command, getRequestEvent } from '$app/server';
import {
	ACTIVE_COMPANY_COOKIE,
	activeCompanyCookieOptions,
	loadCompanies
} from '$lib/server/company-context';

export const setActiveCompany = command('unchecked', async (companyId: string) => {
	const event = getRequestEvent();
	const companies = await loadCompanies();
	const activeCompany = companies.find((company) => company.id === companyId);

	if (!activeCompany) {
		return { ok: false };
	}

	event.cookies.set(ACTIVE_COMPANY_COOKIE, activeCompany.id, activeCompanyCookieOptions(event));

	return { ok: true };
});
