import { describe, it, expect } from 'vitest';
import { paginateBlocks, type PdfBlock } from './paginate.js';

const block = (id: string, height: number): PdfBlock<{ id: string }> => ({
	id,
	data: { id },
	height
});

const ids = (pages: PdfBlock<{ id: string }>[][]): string[] =>
	pages.flatMap((p) => p.map((b) => b.id));

describe('paginateBlocks', () => {
	it('returns no pages for an empty input', () => {
		expect(paginateBlocks([], 1000)).toEqual([]);
	});

	it('puts a single block that fits onto one page', () => {
		const pages = paginateBlocks([block('a', 100)], 1000);
		expect(pages).toHaveLength(1);
		expect(pages[0]).toHaveLength(1);
	});

	it('keeps blocks with undefined height (treated as 0) on a single page', () => {
		const blocks: PdfBlock<number>[] = [
			{ id: 'a', data: 1 },
			{ id: 'b', data: 2 },
			{ id: 'c', data: 3 }
		];
		expect(paginateBlocks(blocks, 10)).toEqual([blocks]);
	});

	it('does not lose or duplicate any block when splitting', () => {
		const blocks = Array.from({ length: 10 }, (_, i) => block(`b${i}`, 60));
		const pages = paginateBlocks(blocks, 100);
		// every original id appears exactly once, in order
		expect(ids(pages)).toEqual(blocks.map((b) => b.id));
	});

	it('starts a new page exactly when the running height would exceed the limit', () => {
		// 50 + 50 == 100 (fits, gap 0), third block 50 would make 150 -> new page.
		const blocks = [block('a', 50), block('b', 50), block('c', 50)];
		const pages = paginateBlocks(blocks, 100, 0);
		expect(pages).toHaveLength(2);
		expect(ids(pages)).toEqual(['a', 'b', 'c']);
	});

	it('accounts for the gap between blocks', () => {
		// gap 10: 50 + 10 + 50 == 110 > 100 -> 'b' starts a new page.
		const blocks = [block('a', 50), block('b', 50)];
		expect(paginateBlocks(blocks, 100, 0)).toHaveLength(1);
		expect(paginateBlocks(blocks, 100, 10)).toHaveLength(2);
	});

	it('places an oversized block alone on its own page rather than dropping it', () => {
		const blocks = [block('huge', 500)];
		const pages = paginateBlocks(blocks, 100);
		expect(pages).toHaveLength(1);
		expect(pages[0]).toHaveLength(1);
		expect(pages[0][0].id).toBe('huge');
	});

	it('forces an oversized block onto a fresh page when it follows a fitting block', () => {
		const blocks = [block('small', 50), block('huge', 500), block('small2', 50)];
		const pages = paginateBlocks(blocks, 100);
		expect(ids(pages)).toEqual(['small', 'huge', 'small2']);
		expect(pages).toHaveLength(3);
	});
});
