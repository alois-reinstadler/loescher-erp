# AGENTS.md

Guidance for AI coding agents (and humans) working on Loescher ERP. Read this
before making changes. The goal is that **no work is considered done until the
verify pipeline passes** — tests are how the agent catches its own mistakes.

## Stack

- **SvelteKit 5 (runes, async components)** with `@sveltejs/adapter-node` → standalone Node server in `build/`.
- **Drizzle ORM + libsql/SQLite**. Schema in `src/lib/server/db/schema.ts`. Migrations in `drizzle/` (generated via `pnpm db:generate`, applied via `pnpm db:migrate`).
- **better-auth** (email/password, drizzle adapter). Auth schema not yet generated — see "Known gaps".
- **shadcn-svelte** UI, **Paraglide** i18n, **Tailwind v4**.
- Deployed on a **Hetzner VPS (EU)** via **Coolify** using the repo `Dockerfile`.

## The verify pipeline (run before declaring a task done)

There are three tiers. **Pick the smallest one that covers what you changed.**
Running the full e2e suite for a one-line logic tweak wastes minutes and
browsers — don't.

| Command             | Runs                             | Use when                                                                                                                                                                                   |
| ------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm verify:quick` | lint + check + unit              | Iterating on pure logic, server code, tests, or non-rendering changes. No build, no e2e.                                                                                                   |
| `pnpm verify`       | lint + check + unit + build      | **Default for most tasks.** Catches SSR/import/adapter errors that unit tests miss, without spinning up browsers.                                                                          |
| `pnpm verify:full`  | verify + e2e + visual regression | You changed **rendered UI**: a `.svelte` route/component, layout, styling, PDF fixture, or anything in `src/routes/**` or `src/lib/components/**` that affects what pixels land on screen. |

Rules:

- If you touched only `src/lib/pdf/*.ts`, `src/lib/server/**`, `src/lib/app/data.ts`, tests, config, or docs → `pnpm verify:quick` is enough.
- If you touched build config (`vite.config.ts`, `Dockerfile`, adapter setup) or anything that could break the production bundle → `pnpm verify`.
- If you touched anything a user or PDF renderer would **see** → `pnpm verify:full`. A visual baseline diff is the strongest self-check that you didn't regress the UI.
- When in doubt, run `pnpm verify`. Only escalate to `verify:full` when rendering is in play.

If any step fails, **fix it before reporting completion**. Do not disable tests
to make them pass; if a test is genuinely wrong, explain why and update it.

## Test layout

| Suite               | Runner            | Command                                        | What it catches                                              |
| ------------------- | ----------------- | ---------------------------------------------- | ------------------------------------------------------------ |
| Unit (logic/server) | Vitest, node env  | `pnpm test:unit`                               | Money math, pagination, carry-forward, DB schema/constraints |
| Component (future)  | Vitest, jsdom env | `pnpm test` (co-located `*.component.test.ts`) | Component render/interaction                                 |
| E2E + visual        | Playwright        | `pnpm test:e2e`                                | Route rendering, and pixel-level UI regressions              |

- Vitest config: `vitest.config.ts`. Two projects: `node` (logic/server) and `browser` (component, jsdom). Component tests use the `// @vitest-environment jsdom` pragma automatically via the `*.component.test.ts` glob — add new component tests with that suffix.
- `$lib` resolves to `src/lib` in tests. SvelteKit's `$app/env/private` is stubbed by `tests/stubs/app-env-private.ts` (deterministic test values, never real secrets).
- In-memory DB helper: `tests/db/in-memory.ts` (`createTestDb()` applies migrations to `:memory:` SQLite). Use it for any server/DB test.

## Visual regression — the strongest AI self-check for UI work

Baselines live in `tests/e2e/visual.spec.ts-snapshots/` and are committed.

- **If a visual test fails**, Playwright shows a diff. Look at it:
  - If the change is **intentional** (you redesigned the page), update the baseline:
    ```sh
    pnpm test:e2e:update-snapshots
    ```
    and commit the new PNGs. Mention the baseline update in your summary.
  - If the change is **unintentional**, you just caught a regression — fix your code.
- When adding a new page worth protecting, add a `test('…', …)` block to
  `tests/e2e/visual.spec.ts` and run `--update-snapshots` once to seed the baseline.
- Screenshots are pinned to light mode + `de-AT` locale + `Europe/Vienna` tz
  (see `playwright.config.ts`). Self-hosted fonts keep them stable across machines.

## Database migrations

- Change the schema in `src/lib/server/db/schema.ts`, then **always**:
  ```sh
  pnpm db:generate   # create a new SQL migration in drizzle/
  ```
- Commit the generated `drizzle/*.sql` and `drizzle/meta/*` files. They are
  required by tests (the in-memory helper applies them) and by production
  deploys (Coolify runs `pnpm db:migrate` as a pre-deploy command).
- Never edit a migration that is already on `main` — generate a new one.

## Known gaps (do not silently "fix" without checking)

1. **Auth UI is not wired.** `login-form.svelte` / `register-form.svelte` are
   decorative; they don't call better-auth. The `(app)` routes have **no auth
   guard** — the dashboard is reachable unauthenticated. E2E relies on this for
   now (see `tests/e2e/auth.setup.ts` stub). When you wire real auth:
   - Generate the auth schema (`pnpm auth:schema`), re-export it from
     `schema.ts`, regenerate migrations, and add a server-side guard in
     `src/routes/(app)/+layout.ts`.
   - Replace `tests/e2e/auth.setup.ts` with a real sign-up/sign-in flow that
     saves `storageState`, add an authed Playwright project, and move the
     dashboard visual test onto it.
2. **`local.db` / `e2e.db`** are throwaway. Production DB is configured via
   Coolify env (`DATABASE_URL`).

## Code style

- Tabs, single quotes, no trailing commas, print width 100 (see `.prettierrc`).
- Runes mode is forced project-wide (see `vite.config.ts`).
- Do not add comments unless explaining a non-obvious decision.
- Never commit secrets or real `.env` values.

## Don't

- Don't commit `node_modules`, `build/`, `coverage/`, `playwright-report/`, `test-results/`, or `*.db`.
- Don't push or create PRs unless explicitly asked.
- Don't mark a task complete if `pnpm verify` is red — or, if you changed UI,
  `pnpm verify:full`.
