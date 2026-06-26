# Auth & Company Foundation — Design

**Date:** 2026-06-26
**Status:** Approved
**Scope:** First foundation sub-project — turn the prototype into a real system, starting with auth + tenancy/company stabilization. Later sub-projects (master-data CRUD, sourcing workflow, DB-backed PDFs, logistics) are out of scope.

## Context

The app has 67 schema tables, broad routes, PDF/test scaffolding, but mostly **static route data**. Auth is configured but unfinished:

- `auth.ts` — better-auth (minimal) + drizzle adapter + sveltekit cookies, email/password enabled.
- `auth.schema.ts` — **unrun stub** (no `user`/`session`/`account`/`verification` tables generated yet).
- `hooks.server.ts` — already populates `event.locals.session` / `event.locals.user`.
- `(app)/+layout.ts` — **no guard**, loads static shell data from `$lib/app/data`.
- Login/register pages exist but are **not wired** to better-auth.
- `tests/e2e/auth.setup.ts` — explicit **no-op stub** with a TODO describing the target.
- DB: libsql, `DATABASE_URL` env. No seed script exists.

## Business model (decided)

One operator business manages **three companies**: Löscher, Rideau, Aziza. Shared staff; **shared master data** (suppliers/products/customers); **per-company transactions** (orders/invoices/POs). Company is chosen via a dropdown replacing the "Loescher ERP" brand label in the sidebar header. **All staff can act for all three companies.** No public self-service registration.

## Chosen architecture (Option A)

Companies are a **new dimension under a single operator tenant** — NOT three tenants.

- `tenants` / `tenant_memberships` stay as-is, representing **one** operator org ("Löscher Group"). Seed exactly one tenant.
- New `companies` table (3 rows) holds legal/billing identity — the future DB source for PDF issuers (today `src/lib/pdf/brands.ts`).
- Master-data tables stay `tenantId`-scoped → shared across all 3 companies automatically.
- Transaction tables get a nullable `companyId` → each document belongs to one company.
- Active company is session state (cookie), surfaced by the sidebar switcher.

Rejected: Option B (3 tenants — duplicates master data); Option C (UI-only company, no DB table — can't record company on transactions).

## Components

### 1. Schema additions

- **Run `pnpm auth:schema`** to generate better-auth tables into `auth.schema.ts`; export them from the db barrel (`src/lib/server/db/index.ts` schema object) so the drizzle adapter resolves them.
- **New `companies` table** (`sqliteTable`), `tenantId`-scoped:
  `id (uuid pk), tenantId (fk→tenants, cascade), name, slug, legalName, addressLines (text/json), countryCode, vatId, iban, bic, email, phone, branding (json, nullable), active (bool, default true), createdAt, updatedAt`.
  Unique `(tenantId, slug)`; index on `tenantId`.
- **`companyId` on transaction tables**: nullable `text('company_id').references(() => companies.id)`. Add only to clearly transactional tables (purchase orders, customer orders, invoices, and analogous document tables). Exact list to be confirmed against `schema.ts` during implementation; master-data tables are left `tenantId`-only. Nullable so existing rows / seed don't break — backfilled per workflow as it goes live.
- Generate migration with `pnpm db:generate`.

### 2. Auth wiring

- Create `src/lib/auth-client.ts` (better-auth svelte client).
- Wire `login-form.svelte` email+password to `authClient.signIn.email`; show errors; redirect to `/dashboard` on success.
- Apple/Google buttons: **leave visible but disabled** (no providers configured). [User confirmed "all ok" — keep disabled, revisit later.]
- **Remove public registration**: `(auth)/register` route redirects to `/login`. Users created by seed; admin invite is out of scope.

### 3. Route guard

- Add `src/routes/(app)/+layout.server.ts`:
  - If `!event.locals.user` → `redirect(302, '/login')`.
  - Resolve active company; return `{ user, companies, activeCompany }`.
- `(app)/+layout.ts` keeps loading shell data (guard lives server-side where `locals` is available).

### 4. Active company (session state)

- Cookie `active_company` = company id. Default = first company.
- Server helper `resolveActiveCompany(event)` validates cookie against the company list (all 3) and falls back to default.
- A **remote function** `setActiveCompany` sets the cookie and triggers reload. (Project convention: new forms use remote functions, not superforms.)

### 5. Company switcher UI

- Replace the static "Loescher ERP" brand block in `app-sidebar.svelte` header with a company dropdown (shadcn-svelte `DropdownMenu` inside `Sidebar.MenuButton`) listing Löscher / Rideau / Aziza, showing the active one, calling `setActiveCompany` on select.
- Login form keeps the static "Loescher ERP" wordmark.

### 6. Seed / bootstrap

- New `scripts/seed.ts` + `db:seed` package script. **Idempotent.** Creates:
  - one tenant ("Löscher Group"),
  - the 3 companies,
  - one admin user via better-auth's **server API** (correct password hash),
  - the tenant membership (role owner/admin).
- Credentials from env `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` with dev defaults.

### 7. E2E auth

- Replace `auth.setup.ts` no-op: POST `/api/auth/sign-in/email` with seeded creds, save `storageState` to `tests/e2e/.auth/user.json`.
- Add a `setup` project + `chromium-authed` project (`use.storageState`) in `playwright.config.ts`; move guarded-page tests onto it.

## Data flow

1. Request → `hooks.server.ts` sets `locals.user/session` from better-auth.
2. `(app)/+layout.server.ts` guards (redirect if no user), loads companies, resolves active company from cookie.
3. UI renders switcher with active company; selecting one calls `setActiveCompany` remote fn → sets cookie → reload.
4. Future transactional writes stamp `companyId` = active company.

## Testing

- **Unit:** `resolveActiveCompany` (valid / invalid / missing cookie); seed idempotency (running twice = no duplicates).
- **E2E:** unauthenticated `/dashboard` → redirect `/login`; authenticated reaches dashboard; switcher changes active company.

## Out of scope (later sub-projects)

DB-backed PDF issuers, admin invite UI, per-user company restrictions, master-data CRUD, sourcing workflow, logistics.
