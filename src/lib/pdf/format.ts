import { DateFormatter } from '@internationalized/date';
import { NumberFormatter } from '@internationalized/number';
import type { CurrencyCode, Money } from '$lib/components/pdf/types.js';

const moneyFormatters = new Map<string, NumberFormatter>();
const dateFormatters = new Map<string, DateFormatter>();

export function createMoney(amount: number, currency: CurrencyCode = 'EUR'): Money {
	return { amount, currency };
}

export function addMoney(values: Money[], currency: CurrencyCode = 'EUR'): Money {
	return {
		amount: values.reduce((total, value) => total + value.amount, 0),
		currency
	};
}

export function formatMoney(value: Money, locale = 'de-AT'): string {
	const key = `${locale}:${value.currency}`;
	let formatter = moneyFormatters.get(key);

	if (!formatter) {
		formatter = new NumberFormatter(locale, {
			style: 'currency',
			currency: value.currency,
			currencyDisplay: 'symbol'
		});
		moneyFormatters.set(key, formatter);
	}

	return formatter.format(value.amount / 100);
}

export function formatNumber(value: number, locale = 'de-AT'): string {
	const key = `${locale}:decimal`;
	let formatter = moneyFormatters.get(key);

	if (!formatter) {
		formatter = new NumberFormatter(locale, {
			style: 'decimal',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		});
		moneyFormatters.set(key, formatter);
	}

	return formatter.format(value);
}

export function formatDate(value: Date, locale = 'de-AT'): string {
	const key = `${locale}:date`;
	let formatter = dateFormatters.get(key);

	if (!formatter) {
		formatter = new DateFormatter(locale, {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
		dateFormatters.set(key, formatter);
	}

	return formatter.format(value);
}

export function parseLocalizedMoney(value: string, currency: CurrencyCode = 'EUR'): Money {
	const normalized = value
		.replace(/[^\d,.-]/g, '')
		.replace(/\./g, '')
		.replace(',', '.');
	const amount = Math.round(Number(normalized || '0') * 100);

	return createMoney(amount, currency);
}
