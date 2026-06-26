import { and, eq, or } from 'drizzle-orm';
import type { Issuer, IssuerTheme } from '$lib/components/pdf/types.js';

export type CompanyIssuerSource = {
	id?: string;
	name: string | null;
	slug?: string | null;
	legalName: string | null;
	addressLines: unknown;
	countryCode?: string | null;
	vatId?: string | null;
	iban?: string | null;
	bic?: string | null;
	email?: string | null;
	phone?: string | null;
	branding?: unknown;
};

type CompanyBranding = {
	tagline?: string;
	web?: string;
	fn?: string;
	sitz?: string;
	bank?: string;
	logo_svg?: string;
	logo_width?: string;
	theme?: IssuerTheme;
};

const missing = '—';

function clean(value: unknown): string | undefined {
	if (typeof value !== 'string') return undefined;

	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : undefined;
}

function parseJson(value: string): unknown {
	try {
		return JSON.parse(value);
	} catch {
		return value;
	}
}

function parseAddressLines(value: unknown): string[] {
	const source = typeof value === 'string' ? parseJson(value) : value;

	if (Array.isArray(source)) {
		return source.flatMap((line) => {
			const text = clean(line);
			return text ? [text] : [];
		});
	}

	const text = clean(source);
	return text
		? text
				.split(/\r?\n/)
				.map((line) => line.trim())
				.filter(Boolean)
		: [];
}

function parseBranding(value: unknown): CompanyBranding {
	const source = typeof value === 'string' ? parseJson(value) : value;
	if (!source || typeof source !== 'object' || Array.isArray(source)) return {};

	const record = source as Record<string, unknown>;
	const theme = record.theme;

	return {
		tagline: clean(record.tagline),
		web: clean(record.web),
		fn: clean(record.fn),
		sitz: clean(record.sitz),
		bank: clean(record.bank),
		logo_svg: clean(record.logo_svg),
		logo_width: clean(record.logo_width),
		theme:
			theme && typeof theme === 'object' && !Array.isArray(theme)
				? (theme as IssuerTheme)
				: undefined
	};
}

function deriveInitial(name: string): string {
	return Array.from(name.trim())[0]?.toLocaleUpperCase('de-AT') ?? missing;
}

function deriveSitz(addressLine: string | undefined): string | undefined {
	const line = clean(addressLine);
	if (!line) return undefined;

	const withoutCountry = line.split(',')[0]?.trim() ?? line;
	const withoutPostalCode = withoutCountry.replace(/^\d{4,6}\s+/, '').trim();
	return clean(withoutPostalCode);
}

export function companyToIssuer(company: CompanyIssuerSource): Issuer {
	const addressLines = parseAddressLines(company.addressLines);
	const branding = parseBranding(company.branding);
	const name = clean(company.legalName) ?? clean(company.name) ?? missing;

	return {
		name,
		brand_initial: deriveInitial(name),
		tagline: branding.tagline ?? missing,
		address_line1: addressLines[0] ?? missing,
		address_line2: addressLines.slice(1).join(', ') || missing,
		email: clean(company.email) ?? missing,
		phone: clean(company.phone) ?? missing,
		web: branding.web ?? missing,
		uid: clean(company.vatId) ?? missing,
		fn: branding.fn ?? missing,
		sitz: branding.sitz ?? deriveSitz(addressLines.at(-1)) ?? missing,
		bank: branding.bank ?? missing,
		iban: clean(company.iban) ?? missing,
		bic: clean(company.bic) ?? missing,
		logo_svg: branding.logo_svg,
		logo_width: branding.logo_width,
		theme: branding.theme
	};
}

export async function loadCompanyIssuer(
	slugOrId: string | null | undefined
): Promise<Issuer | null> {
	const key = clean(slugOrId);
	if (!key) return null;

	const [{ db }, { companies }] = await Promise.all([
		import('$lib/server/db'),
		import('$lib/server/db/schema')
	]);

	const [company] = await db
		.select()
		.from(companies)
		.where(and(eq(companies.active, true), or(eq(companies.slug, key), eq(companies.id, key))))
		.limit(1);

	return company ? companyToIssuer(company) : null;
}
