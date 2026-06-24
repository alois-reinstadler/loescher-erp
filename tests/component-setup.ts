// Import this at the top of any `*.component.test.ts` file (after the
// `// @vitest-environment jsdom` pragma) to get DOM matchers, a raf polyfill
// (jsdom lacks it; Svelte's tick needs it), and automatic component cleanup.
//
//   // @vitest-environment jsdom
//   import './tests/component-setup';
//   import { test, expect } from 'vitest';
//   import { render } from '@testing-library/svelte';
//   import MyComponent from './my-component.svelte';

import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/svelte';

if (typeof globalThis.requestAnimationFrame !== 'function') {
	globalThis.requestAnimationFrame = (cb: FrameRequestCallback) =>
		setTimeout(() => cb(performance.now()), 16) as unknown as number;
	globalThis.cancelAnimationFrame = (id: number) => clearTimeout(id);
}

afterEach(() => {
	cleanup();
});
