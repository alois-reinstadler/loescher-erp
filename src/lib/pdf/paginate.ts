export type PdfBlock<T> = {
	id: string;
	data: T;
	height?: number;
};

export function paginateBlocks<T>(
	blocks: PdfBlock<T>[],
	maxPageHeight: number,
	gap = 0
): PdfBlock<T>[][] {
	const pages: PdfBlock<T>[][] = [];
	let currentPage: PdfBlock<T>[] = [];
	let currentHeight = 0;

	for (const block of blocks) {
		const blockHeight = block.height ?? 0;
		const nextHeight = currentPage.length === 0 ? blockHeight : currentHeight + gap + blockHeight;

		if (nextHeight > maxPageHeight && currentPage.length > 0) {
			pages.push(currentPage);
			currentPage = [block];
			currentHeight = blockHeight;
		} else {
			currentPage.push(block);
			currentHeight = nextHeight;
		}
	}

	if (currentPage.length > 0) {
		pages.push(currentPage);
	}

	return pages;
}
