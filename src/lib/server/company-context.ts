import { sql } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { companies } from '$lib/server/db/schema';

export const ACTIVE_COMPANY_COOKIE = 'active_company';

export type Company = typeof companies.$inferSelect;

type CompanyEvent = Pick<RequestEvent, 'cookies'> & Partial<Pick<RequestEvent, 'url'>>;

export async function loadCompanies(database: typeof db = db): Promise<Company[]> {
	return database
		.select()
		.from(companies)
		.where(sql`${companies.active} = true`)
		.orderBy(
			sql`case ${companies.slug} when 'loescher' then 0 when 'rideau' then 1 when 'aziza' then 2 else 99 end`,
			companies.createdAt
		);
}

export async function resolveActiveCompany(event: CompanyEvent, database: typeof db = db) {
	const companyList = await loadCompanies(database);
	const cookieCompanyId = event.cookies.get(ACTIVE_COMPANY_COOKIE);
	const activeCompany =
		companyList.find((company) => company.id === cookieCompanyId) ?? companyList[0] ?? null;

	return {
		companies: companyList,
		activeCompany
	};
}

export function activeCompanyCookieOptions(event: Partial<Pick<RequestEvent, 'url'>> = {}) {
	return {
		path: '/',
		httpOnly: true,
		sameSite: 'lax' as const,
		secure: event.url?.protocol === 'https:'
	};
}
