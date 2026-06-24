import { describe, it, expect } from 'vitest';
import {
	addMoney,
	createMoney,
	formatDate,
	formatMoney,
	formatNumber,
	parseLocalizedMoney
} from './format.js';
import type { Money } from '$lib/components/pdf/types.js';

const norm = (s: string) => s.replace(/[\u00A0\u202F]/g, ' ');

describe('createMoney', () => {
	it('defaults to EUR', () => {
		expect(createMoney(1234)).toEqual<Money>({ amount: 1234, currency: 'EUR' });
	});

	it('preserves the requested currency', () => {
		expect(createMoney(500, 'USD').currency).toBe('USD');
	});

	it('does not round or scale the input — cents are stored as-is', () => {
		expect(createMoney(0).amount).toBe(0);
		expect(createMoney(1).amount).toBe(1);
	});
});

describe('addMoney', () => {
	it('returns zero cents for an empty list', () => {
		expect(addMoney([])).toEqual<Money>({ amount: 0, currency: 'EUR' });
	});

	it('sums the cent amounts without floating point math', () => {
		const a = createMoney(1_99); // 1,99 €
		const b = createMoney(2_50); // 2,50 €
		expect(addMoney([a, b]).amount).toBe(449); // 4,49 €
	});

	it('uses the explicit currency and ignores per-item currency mismatches', () => {
		// The helper is permissive: callers are responsible for currency consistency.
		const sum = addMoney([createMoney(100, 'USD'), createMoney(200, 'EUR')], 'CHF');
		expect(sum).toEqual<Money>({ amount: 300, currency: 'CHF' });
	});
});

describe('formatMoney', () => {
	it('formats cents as a major-unit currency string', () => {
		expect(norm(formatMoney(createMoney(123456)))).toMatch(/1\.234,56/);
	});

	it('renders zero as the currency symbol with two fraction digits', () => {
		const out = norm(formatMoney(createMoney(0)));
		expect(out).toContain('0,00');
		expect(out).toContain('€');
	});

	it('round-trips through parseLocalizedMoney for non-negative values', () => {
		for (const cents of [0, 1, 99, 100, 19999, 123456]) {
			const formatted = formatMoney(createMoney(cents));
			expect(parseLocalizedMoney(formatted).amount).toBe(cents);
		}
	});

	it('honours an explicit locale and currency', () => {
		const out = norm(formatMoney(createMoney(1234, 'USD'), 'en-US'));
		expect(out).toContain('12.34');
	});
});

describe('formatNumber', () => {
	it('formats with exactly two fraction digits in de-AT', () => {
		// The thousands grouping char (dot vs narrow space) varies by ICU version;
		// assert only on the grouping digits and the fixed fraction part.
		expect(norm(formatNumber(1234.5))).toMatch(/234,50$/);
		expect(norm(formatNumber(0))).toMatch(/0,00$/);
	});
});

describe('formatDate', () => {
	it('formats an unambiguous date as dd.MM.yyyy in de-AT', () => {
		expect(formatDate(new Date('2025-01-05'))).toBe('05.01.2025');
	});

	it('pads single-digit day and month', () => {
		expect(formatDate(new Date('2025-12-09'))).toBe('09.12.2025');
	});
});

describe('parseLocalizedMoney', () => {
	it('parses European-formatted strings back to cents', () => {
		expect(parseLocalizedMoney('1.234,56 €').amount).toBe(123456);
		expect(parseLocalizedMoney('€ 50,00').amount).toBe(5000);
		expect(parseLocalizedMoney('99,99').amount).toBe(9999);
	});

	it('returns zero for empty or non-numeric input', () => {
		expect(parseLocalizedMoney('').amount).toBe(0);
		expect(parseLocalizedMoney('€').amount).toBe(0);
		expect(parseLocalizedMoney('   ').amount).toBe(0);
	});

	it('handles negative amounts', () => {
		expect(parseLocalizedMoney('-12,34 €').amount).toBe(-1234);
	});

	it('treats dots as thousands separators and comma as decimal (European convention)', () => {
		expect(parseLocalizedMoney('1.000,00').amount).toBe(100000);
		expect(parseLocalizedMoney('1.234,56').amount).toBe(123456);
	});

	it('defaults the currency to EUR and lets callers override it', () => {
		expect(parseLocalizedMoney('1,00').currency).toBe('EUR');
		expect(parseLocalizedMoney('1,00', 'USD').currency).toBe('USD');
	});
});
