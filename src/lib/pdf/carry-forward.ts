import { addMoney, createMoney } from './format.js';
import type { CurrencyCode, Money } from '$lib/components/pdf/types.js';

export type CarryForwardPage<T> = {
	items: T[];
	pageSubtotal: Money;
	carryIn: Money;
	carryOut: Money;
	pageIndex: number;
	pageNumber: number;
	totalPages: number;
	isFirstPage: boolean;
	isLastPage: boolean;
};

export function createMoneyCarryForwardPages<T>(
	pages: T[][],
	getAmount: (item: T) => Money,
	currency: CurrencyCode = 'EUR'
): CarryForwardPage<T>[] {
	let runningAmount = createMoney(0, currency);
	const totalPages = pages.length;

	return pages.map((items, pageIndex) => {
		const carryIn = runningAmount;
		const pageSubtotal = addMoney(
			items.map((item) => getAmount(item)),
			currency
		);

		runningAmount = createMoney(carryIn.amount + pageSubtotal.amount, currency);

		return {
			items,
			pageSubtotal,
			carryIn,
			carryOut: runningAmount,
			pageIndex,
			pageNumber: pageIndex + 1,
			totalPages,
			isFirstPage: pageIndex === 0,
			isLastPage: pageIndex === totalPages - 1
		};
	});
}
