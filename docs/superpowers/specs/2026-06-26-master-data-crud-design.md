# Master-Data CRUD — Design

**Date:** 2026-06-26
**Status:** Approved (user said "no more questions, start building")
**Branch:** `feat/master-data-crud`
**Depends on:** auth/company foundation (`feat/auth-company-foundation`, merged into this branch's base).

## Goal
Replace static route data with real, operational CRUD for the core master-data entities, so later workflows (sourcing → procurement) have real records to reference. "Keep UI boring and operational: searchable tables, detail pages, create/edit forms." German UI labels; English code identifiers.

## Scope (in)
- **Lieferanten** (suppliers)
- **Kunden** (customers) + **Standorte** (customer locations, nested under a customer)
- **Kollektionen** (collections)
- **Produkte** (products) + **Varianten** (product variants, nested under a product)
- Idempotent **sample seed data** for the above (so tables render populated)

## Scope (out / deferred)
- **Files/images** (files + file_links) — deferred to a follow-up; product images overlap with the existing `/product-images` route. Note as next.
- Anything in `src/lib/pdf/**`, `src/routes/pdf/**`, `scripts/generate-pdf.ts` — owned by the parallel "DB-backed PDF issuers" task; **do not touch**.

## Existing schema (already present, tenant-scoped, soft-delete via `deletedAt`, `active` flag)
- `suppliers`: name, code (uniq/tenant), countryCode, defaultCurrency, defaultIncoterm, defaultPaymentTerms, email, phone, active.
- `customers`: name, code (uniq/tenant), countryCode, defaultCurrency, defaultPaymentTerms, email, phone, active.
- `customerLocations`: customerId, name, code (uniq/customer), type (default 'branch'), countryCode, addressLine1/2, postalCode, city, email, phone, active.
- `collections`: name, slug (uniq/tenant), description, active.
- `products`: collectionId (opt), name, slug (uniq/tenant), category, description, active.
- `productVariants`: productId, sku (uniq/tenant), ean, supplierArticleNo, colorName/Hex, sizeLabel, width/length/height Mm, netWeightG, materialSummary, customsTariffCode, status (default 'development'), active.

No schema migration expected (tables already exist). If a column is genuinely missing for a required field, add it minimally + `pnpm db:generate`.

## Shared infrastructure (build FIRST)
1. **`src/lib/server/tenant-context.ts`** — `requireTenant(event)`: resolves the active tenant id for `event.locals.user` from `tenant_memberships` (status active). Single operator tenant today → the user's membership tenant. Throws `error(403)` if none. All master-data queries scope by this `tenantId` AND `isNull(deletedAt)`.
2. **Remote-function pattern** — per entity a co-located `*.remote.ts` using `query` / `form` / `command` from `$app/server` (project convention: remote functions, not superforms). Forms use `'unchecked'` + explicit server-side validation returning structured field errors (no new deps like zod). Every handler calls `requireTenant` and scopes writes/reads to that tenant; never trust a client-supplied tenantId.
3. **Code/slug helpers** — `src/lib/server/codes.ts`: `nextCode(tenantId, prefix)` (e.g. `LF-0001`, `KD-0001`) by scanning existing max; `slugify(name)` + uniqueness suffix for collections/products. Manual override allowed where a code/slug field is user-editable, with uniqueness validation.
4. **Navigation** — add a **"Stammdaten"** group to the sidebar. Extend `AppIconName` in `src/lib/app/data.ts` + the icon map with any new icons; add nav entries: Lieferanten `/lieferanten`, Kunden `/kunden`, Kollektionen `/kollektionen`, Produkte `/produkte`. Reuse existing icons where sensible.
5. **Reusable list UI** — use the existing `src/lib/components/ui/data-table` (tanstack) with a client-side search box (data volumes are small). Detail/edit/create forms use existing shadcn `Field`/`Input`/`Select` components and match the look of `login-form.svelte`.

## Per-entity UX (consistent pattern)
For each entity (routes under `(app)/`):
- **List** `/<entity>`: searchable table of key columns + `active` badge; row → detail; "Neu" button. Excludes soft-deleted.
- **Detail** `/<entity>/[id]`: read view of all fields; **Bearbeiten** and **Archivieren** (soft delete: set `deletedAt`) actions; **active** toggle.
- **Create** `/<entity>/neu` and **Edit** `/<entity>/[id]/bearbeiten`: validated form; unique code/slug/sku check with a friendly German error.
- **Kunden detail** also renders a **Standorte** sub-list with add/edit/archive (inline rows or `/kunden/[id]/standorte/...`).
- **Produkte detail** also renders a **Varianten** sub-list with add/edit/archive.

## Seed
Extend `scripts/seed.ts` to idempotently insert sample data under the operator tenant: ~3 suppliers, ~3 customers (each with 1–2 locations), 2 collections, ~4 products (each with 1–2 variants). Idempotent by `code`/`slug`/`sku`. Keep the existing auth/company seed intact.

## Testing
- Unit: `nextCode` / `slugify` uniqueness; `requireTenant` (membership present / absent); at least one remote `query` + one create `command`/`form` round-trip using the in-memory DB pattern (`tests/db/in-memory.ts`). Seed idempotency for master data.
- Verify: `pnpm check` (0 errors) + `pnpm test:unit` green. Do not run build/e2e browsers.

## Build order
shared infra (1–5) → Lieferanten → Kunden + Standorte → Kollektionen → Produkte + Varianten → seed sample data → tests. Commit per entity (atomic), running `pnpm check` between.

## Out-of-scope guardrail
Do not modify PDF files (`src/lib/pdf/**`, `src/routes/pdf/**`, `scripts/generate-pdf.ts`) — a parallel task owns them.
