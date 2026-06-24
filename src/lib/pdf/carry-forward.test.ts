import { describe, it, expect } from 'vitest';
import { createMoneyCarryForwardPages } from './carry-forward.js';
import { createMoney } from './format.js';
import type { Money } from '$lib/components/pdf/types.js';

const money = (cents: number): Money => createMoney(cents, 'EUR');

describe('createMoneyCarryForwardPages', () => {
	it('returns no pages for an empty page list', () => {
		expect(createMoneyCarryForwardPages([], () => money(0))).toEqual([]);
	});

	it('handles a single page: carryIn is zero, carryOut equals the subtotal', () => {
		const pages = createMoneyCarryForwardPages([[1, 2, 3]], (n) => money(n * 100));
		expect(pages).toHaveLength(1);
		const [page] = pages;
		expect(page.carryIn.amount).toBe(0);
		expect(page.pageSubtotal.amount).toBe(600);
		expect(page.carryOut.amount).toBe(600);
		expect(page.isFirstPage).toBe(true);
		expect(page.isLastPage).toBe(true);
		expect(page.pageNumber).toBe(1);
		expect(page.totalPages).toBe(1);
	});

	it('threads the running total across multiple pages', () => {
		const pages = createMoneyCarryForwardPages([[1, 1], [2, 2], [3]], (n) => money(n * 100));
		expect(pages).toHaveLength(3);
		// page 1: in 0, sub 200, out 200
		expect(pages[0].carryIn.amount).toBe(0);
		expect(pages[0].pageSubtotal.amount).toBe(200);
		expect(pages[0].carryOut.amount).toBe(200);
		// page 2: in 200, sub 400, out 600
		expect(pages[1].carryIn.amount).toBe(200);
		expect(pages[1].pageSubtotal.amount).toBe(400);
		expect(pages[1].carryOut.amount).toBe(600);
		// page 3: in 600, sub 300, out 900 (final grand total)
		expect(pages[2].carryIn.amount).toBe(600);
		expect(pages[2].pageSubtotal.amount).toBe(300);
		expect(pages[2].carryOut.amount).toBe(900);
	});

	it('the last page carryOut equals the grand total of all items', () => {
		const all = [10, 20, 30, 40, 50];
		const paged = [[10, 20], [30, 40], [50]] as number[][];
		const pages = createMoneyCarryForwardPages(paged, (n) => money(n * 100));
		const grandTotal = all.reduce((s, n) => s + n * 100, 0);
		expect(pages[pages.length - 1].carryOut.amount).toBe(grandTotal);
	});

	it('defaults the currency to EUR', () => {
		const [page] = createMoneyCarryForwardPages([[1]], (n) => money(n * 100));
		expect(page.carryIn.currency).toBe('EUR');
		expect(page.carryOut.currency).toBe('EUR');
		expect(page.pageSubtotal.currency).toBe('EUR');
	});

	it('reports isFirstPage/isLastPage correctly at the boundaries', () => {
		const pages = createMoneyCarryForwardPages([[1], [2], [3]], (n) => money(n * 100));
		expect(pages.map((p) => p.isFirstPage)).toEqual([true, false, false]);
		expect(pages.map((p) => p.isLastPage)).toEqual([false, false, true]);
		expect(pages.map((p) => p.pageNumber)).toEqual([1, 2, 3]);
	});
});
