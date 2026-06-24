import { getContext, setContext } from 'svelte';
import type { Snippet } from 'svelte';

type Getter<T> = () => T;

export type PdfPagerStatus =
	| 'idle'
	| 'collecting'
	| 'rendering'
	| 'measuring'
	| 'splitting'
	| 'verifying'
	| 'ready'
	| 'failed';

export type PdfPageModel = {
	id: string;
	unitIds: string[];
};

export type PdfUnit = {
	id: string;
	render: Snippet;
};

export type PdfPagerStateProps = {
	/**
	 * Getter returning the current registered PDF units.
	 * This supports keeping the actual source of truth outside this state object
	 * while still allowing derived values inside this class.
	 */
	units: Getter<PdfUnit[]>;

	/**
	 * Setter for registered PDF units.
	 */
	setUnits: (units: PdfUnit[]) => void;

	/**
	 * Getter returning the current generated pages.
	 */
	pages: Getter<PdfPageModel[]>;

	/**
	 * Setter for generated pages.
	 */
	setPages: (pages: PdfPageModel[]) => void;

	/**
	 * Optional PDF ready flag name used by Playwright.
	 *
	 * Default:
	 * window.__PDF_READY__
	 */
	readyFlagName?: string;

	/**
	 * Measurement tolerance for tiny Chromium layout differences.
	 */
	overflowTolerancePx?: number;

	/**
	 * Hard stop to prevent infinite pagination loops.
	 */
	maxIterations?: number;
};

export type PdfRegisterAction = {
	destroy: () => void;
};

export type PdfOverflowResult = {
	page: PdfPageModel;
	element: HTMLElement;
};

declare global {
	interface Window {
		__PDF_READY__?: boolean;
		[key: string]: unknown;
	}
}

function createId(prefix: string) {
	if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
		return `${prefix}-${crypto.randomUUID()}`;
	}

	return `${prefix}-${Math.random().toString(36).slice(2)}`;
}

async function nextFrame() {
	await new Promise<void>((resolve) => {
		requestAnimationFrame(() => resolve());
	});
}

async function waitForFonts() {
	if (typeof document !== 'undefined' && 'fonts' in document) {
		await document.fonts.ready;
	}
}

async function waitForImages(root: ParentNode = document) {
	const images = Array.from(root.querySelectorAll('img'));

	await Promise.all(
		images.map((image) => {
			if (image.complete) {
				return Promise.resolve();
			}

			return new Promise<void>((resolve) => {
				image.addEventListener('load', () => resolve(), { once: true });
				image.addEventListener('error', () => resolve(), { once: true });
			});
		})
	);
}

class PdfPagerState {
	readonly props: PdfPagerStateProps;

	units = $derived.by(() => this.props.units());
	pages = $derived.by(() => this.props.pages());

	status = $state<PdfPagerStatus>('idle');
	error = $state<string | null>(null);
	iteration = $state(0);

	readonly readyFlagName: string;
	readonly overflowTolerancePx: number;
	readonly maxIterations: number;

	#contentElements = new Map<string, HTMLElement>();
	#unitElements = new Map<string, HTMLElement>();
	#currentRunId = 0;

	totalPages = $derived.by(() => this.pages.length);

	isIdle = $derived.by(() => this.status === 'idle');
	isReady = $derived.by(() => this.status === 'ready');
	isFailed = $derived.by(() => this.status === 'failed');

	isRunning = $derived.by(() => {
		return this.status !== 'idle' && this.status !== 'ready' && this.status !== 'failed';
	});

	constructor(props: PdfPagerStateProps) {
		this.props = props;

		this.readyFlagName = props.readyFlagName ?? '__PDF_READY__';
		this.overflowTolerancePx = props.overflowTolerancePx ?? 2;
		this.maxIterations = props.maxIterations ?? 250;
	}

	registerUnit = (id: string, render: Snippet): PdfRegisterAction => {
		const existing = this.units.some((unit) => unit.id === id);

		if (existing) {
			this.props.setUnits(
				this.units.map((unit) => {
					if (unit.id !== id) return unit;

					return {
						id,
						render
					};
				})
			);
		} else {
			this.props.setUnits([
				...this.units,
				{
					id,
					render
				}
			]);
		}

		return {
			destroy: () => {
				this.props.setUnits(this.units.filter((unit) => unit.id !== id));
				this.#unitElements.delete(id);
			}
		};
	};

	registerPageContentElement = (element: HTMLElement, pageId: string): PdfRegisterAction => {
		this.#contentElements.set(pageId, element);

		return {
			destroy: () => {
				this.#contentElements.delete(pageId);
			}
		};
	};

	registerUnitElement = (element: HTMLElement, unitId: string): PdfRegisterAction => {
		this.#unitElements.set(unitId, element);

		return {
			destroy: () => {
				this.#unitElements.delete(unitId);
			}
		};
	};

	getUnit = (unitId: string): PdfUnit | null => {
		return this.units.find((unit) => unit.id === unitId) ?? null;
	};

	reset = () => {
		this.#currentRunId += 1;

		this.#setReadyFlag(false);

		this.status = 'idle';
		this.error = null;
		this.iteration = 0;

		this.props.setPages([]);

		this.#contentElements.clear();
		this.#unitElements.clear();
	};

	run = async () => {
		const runId = ++this.#currentRunId;

		try {
			this.#setReadyFlag(false);

			this.error = null;
			this.iteration = 0;
			this.status = 'collecting';

			await this.#waitForStableLayout();

			if (!this.#isCurrentRun(runId)) return;

			if (this.units.length === 0) {
				throw new Error('Cannot paginate PDF because no PdfUnit components were registered.');
			}

			this.props.setPages([
				{
					id: createId('page'),
					unitIds: this.units.map((unit) => unit.id)
				}
			]);

			while (this.iteration < this.maxIterations) {
				this.iteration += 1;

				this.status = 'rendering';
				await this.#waitForStableLayout();

				if (!this.#isCurrentRun(runId)) return;

				this.status = 'measuring';

				const overflowingPage = this.#findFirstOverflowingPage();

				if (!overflowingPage) {
					this.status = 'verifying';

					await this.#waitForStableLayout();

					if (!this.#isCurrentRun(runId)) return;

					const stillOverflowingPage = this.#findFirstOverflowingPage();

					if (!stillOverflowingPage) {
						this.status = 'ready';
						this.#setReadyFlag(true);
						return;
					}

					this.status = 'splitting';
					this.#splitOverflowingPage(stillOverflowingPage);
					continue;
				}

				this.status = 'splitting';
				this.#splitOverflowingPage(overflowingPage);
			}

			throw new Error(`PDF pagination did not stabilize after ${this.maxIterations} iterations.`);
		} catch (error) {
			if (!this.#isCurrentRun(runId)) return;

			this.#setReadyFlag(false);

			this.status = 'failed';
			this.error = error instanceof Error ? error.message : 'Unknown PDF pagination error.';
		}
	};

	#isCurrentRun(runId: number) {
		return runId === this.#currentRunId;
	}

	#setReadyFlag(value: boolean) {
		if (typeof window === 'undefined') return;

		window[this.readyFlagName] = value;
	}

	async #waitForStableLayout() {
		if (typeof document === 'undefined') return;

		await Promise.resolve();
		await waitForFonts();

		for (const element of this.#contentElements.values()) {
			await waitForImages(element);
		}

		await nextFrame();
		await nextFrame();
	}

	#findFirstOverflowingPage(): PdfOverflowResult | null {
		for (const page of this.pages) {
			const element = this.#contentElements.get(page.id);

			if (!element) continue;

			if (this.#isOverflowing(element)) {
				return {
					page,
					element
				};
			}
		}

		return null;
	}

	#isOverflowing(element: HTMLElement) {
		const overflow = element.scrollHeight - element.clientHeight;
		return overflow > this.overflowTolerancePx;
	}

	#splitOverflowingPage(result: PdfOverflowResult) {
		const splitIndex = this.#findSplitIndex(result.element);

		if (splitIndex <= 0) {
			const firstUnitId = result.page.unitIds[0];

			throw new Error(
				`PDF unit "${firstUnitId}" is taller than the available page content area. ` +
					'Split that content into smaller PdfUnit components.'
			);
		}

		this.#splitPageAt(result.page, splitIndex);
	}

	#findSplitIndex(contentElement: HTMLElement) {
		const contentRect = contentElement.getBoundingClientRect();

		const innerWrapper =
			contentElement.firstElementChild instanceof HTMLElement
				? contentElement.firstElementChild
				: contentElement;

		const children = Array.from(innerWrapper.children).filter(
			(child): child is HTMLElement => child instanceof HTMLElement
		);

		for (let index = 0; index < children.length; index += 1) {
			const childRect = children[index].getBoundingClientRect();

			if (childRect.bottom > contentRect.bottom + this.overflowTolerancePx) {
				return index;
			}
		}

		return -1;
	}

	#splitPageAt(pageToSplit: PdfPageModel, splitIndex: number) {
		const pageIndex = this.pages.findIndex((page) => page.id === pageToSplit.id);

		if (pageIndex === -1) {
			throw new Error('Could not split page because the page was not found.');
		}

		const leftUnitIds = pageToSplit.unitIds.slice(0, splitIndex);
		const rightUnitIds = pageToSplit.unitIds.slice(splitIndex);

		if (leftUnitIds.length === 0 || rightUnitIds.length === 0) {
			throw new Error(
				`Invalid PDF split at index ${splitIndex}. The split would create an empty page.`
			);
		}

		const updatedPage: PdfPageModel = {
			...pageToSplit,
			unitIds: leftUnitIds
		};

		const insertedPage: PdfPageModel = {
			id: createId('page'),
			unitIds: rightUnitIds
		};

		this.props.setPages([
			...this.pages.slice(0, pageIndex),
			updatedPage,
			insertedPage,
			...this.pages.slice(pageIndex + 1)
		]);
	}
}

const SYMBOL_KEY = 'pdf-pager';

export function setPdfPager(props: PdfPagerStateProps): PdfPagerState {
	return setContext(Symbol.for(SYMBOL_KEY), new PdfPagerState(props));
}

export function usePdfPager(): PdfPagerState {
	return getContext(Symbol.for(SYMBOL_KEY));
}
