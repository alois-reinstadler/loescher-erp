import { describe, expect, it } from 'vitest';
import { companyToIssuer } from '../src/lib/pdf/company-issuer.js';

describe('companyToIssuer', () => {
	it('maps a company row into a PDF issuer', () => {
		const issuer = companyToIssuer({
			id: 'company-1',
			name: 'Loescher',
			slug: 'loescher',
			legalName: 'Löscher GmbH',
			addressLines: ['Löscherstraße 1', '1010 Wien'],
			countryCode: 'AT',
			vatId: 'ATU00000001',
			iban: 'AT000000000000000001',
			bic: 'LOESATWW',
			email: 'office@loescher.local',
			phone: '+43 1 0000001',
			branding: {
				tagline: 'ERP · Handel · Logistik',
				web: 'loescher.local',
				fn: 'FN 100001 x',
				bank: 'Löscher Bank',
				theme: {
					primary: '#14532d',
					primaryForeground: '#ffffff'
				}
			}
		});

		expect(issuer).toEqual({
			name: 'Löscher GmbH',
			brand_initial: 'L',
			tagline: 'ERP · Handel · Logistik',
			address_line1: 'Löscherstraße 1',
			address_line2: '1010 Wien',
			email: 'office@loescher.local',
			phone: '+43 1 0000001',
			web: 'loescher.local',
			uid: 'ATU00000001',
			fn: 'FN 100001 x',
			sitz: 'Wien',
			bank: 'Löscher Bank',
			iban: 'AT000000000000000001',
			bic: 'LOESATWW',
			logo_svg: undefined,
			logo_width: undefined,
			theme: {
				primary: '#14532d',
				primaryForeground: '#ffffff'
			}
		});
	});

	it('falls back to placeholders and parses JSON text columns', () => {
		const issuer = companyToIssuer({
			name: 'Rideau',
			legalName: '',
			addressLines: '["Rideauweg 2","1010 Wien","Austria"]',
			vatId: null,
			iban: null,
			bic: null,
			email: null,
			phone: null,
			branding: '{"sitz":"Wien Innere Stadt"}'
		});

		expect(issuer).toMatchObject({
			name: 'Rideau',
			brand_initial: 'R',
			tagline: '—',
			address_line1: 'Rideauweg 2',
			address_line2: '1010 Wien, Austria',
			email: '—',
			phone: '—',
			web: '—',
			uid: '—',
			fn: '—',
			sitz: 'Wien Innere Stadt',
			bank: '—',
			iban: '—',
			bic: '—'
		});
	});
});
