import type { Issuer } from '$lib/components/pdf/types.js';

export type Brand = {
	id: string;
	label: string;
	issuer: Issuer;
};

const alreinIssuer: Issuer = {
	name: 'alrein',
	brand_initial: 'a',
	tagline: 'Software · Automation · Systems',
	address_line1: 'Wasserstatt 11',
	address_line2: '6423 Mötz, Austria',
	email: 'office@alrein.dev',
	phone: '—',
	web: 'alrein.dev',
	uid: '—',
	fn: '—',
	sitz: 'Mötz',
	bank: '—',
	iban: '—',
	bic: '—'
};

const mahlerLogo = `<svg viewBox="0 0 120 32" xmlns="http://www.w3.org/2000/svg">
	<rect x="0" y="6" width="20" height="20" rx="3" fill="#1d4ed8"/>
	<rect x="6" y="0" width="8" height="32" fill="#fff"/>
	<rect x="0" y="14" width="20" height="4" fill="#fff"/>
	<text x="28" y="14" font-family="ui-sans-serif,system-ui" font-size="13" font-weight="700" fill="#0f172a" letter-spacing="-0.3">Mahler Bau</text>
	<text x="28" y="26" font-family="ui-sans-serif,system-ui" font-size="7.5" font-weight="500" fill="#475569" letter-spacing="2">G M B H · 1958</text>
</svg>`;

const mahlerBauIssuer: Issuer = {
	name: 'Mahler Bau GmbH',
	brand_initial: 'M',
	tagline: 'Hochbau · Sanierung · Schlüsselfertig seit 1958',
	address_line1: 'Triester Straße 142',
	address_line2: '1230 Wien, Austria',
	email: 'office@mahler-bau.at',
	phone: '+43 1 802 14 00',
	web: 'mahler-bau.at',
	uid: 'ATU 12 345 678',
	fn: 'FN 218 442 v',
	sitz: 'Wien',
	bank: 'Erste Bank AG',
	iban: 'AT26 2011 1822 1234 5600',
	bic: 'GIBAATWWXXX',
	logo_svg: mahlerLogo,
	logo_width: '120px',
	theme: {
		primary: '#1d4ed8',
		primaryForeground: '#ffffff',
		accent: '#1e3a8a',
		accentForeground: '#ffffff'
	}
};

const nordlichtLogo = `<svg viewBox="0 0 130 32" xmlns="http://www.w3.org/2000/svg">
	<circle cx="14" cy="16" r="11" fill="none" stroke="#0f766e" stroke-width="2.4"/>
	<circle cx="14" cy="16" r="4.5" fill="#0f766e"/>
	<path d="M14 5 L14 27 M3 16 L25 16" stroke="#0f766e" stroke-width="1.2"/>
	<text x="34" y="14" font-family="ui-serif,Georgia" font-size="13" font-style="italic" font-weight="600" fill="#0f172a">Nordlicht</text>
	<text x="34" y="25" font-family="ui-sans-serif,system-ui" font-size="7" font-weight="500" fill="#0f766e" letter-spacing="3">D E S I G N  S T U D I O</text>
</svg>`;

const nordlichtIssuer: Issuer = {
	name: 'Nordlicht Studios e.U.',
	brand_initial: 'N',
	tagline: 'Brand · Editorial · Identity',
	address_line1: 'Lange Reihe 47',
	address_line2: '20099 Hamburg, Germany',
	email: 'hallo@nordlicht.studio',
	phone: '+49 40 18 14 902',
	web: 'nordlicht.studio',
	uid: 'DE 314 729 005',
	fn: 'HRB 152 994',
	sitz: 'Hamburg',
	bank: 'Hamburger Sparkasse',
	iban: 'DE12 2005 0550 1234 5678 90',
	bic: 'HASPDEHHXXX',
	logo_svg: nordlichtLogo,
	logo_width: '130px',
	theme: {
		primary: '#0f766e',
		primaryForeground: '#ecfeff',
		accent: '#0d3b3a',
		accentForeground: '#ecfeff'
	}
};

export const brands: Record<string, Brand> = {
	alrein: { id: 'alrein', label: 'alrein', issuer: alreinIssuer },
	'mahler-bau': { id: 'mahler-bau', label: 'Mahler Bau GmbH', issuer: mahlerBauIssuer },
	nordlicht: { id: 'nordlicht', label: 'Nordlicht Studios', issuer: nordlichtIssuer }
};

export const defaultBrandId = 'alrein';

export function getBrand(id: string | null | undefined): Brand {
	if (id && brands[id]) return brands[id];
	return brands[defaultBrandId];
}

export const brandList: Brand[] = Object.values(brands);
