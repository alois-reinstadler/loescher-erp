# Loescher ERP

SvelteKit ERP prototype with authenticated app routes and PDF document previews/generation.

## Development

Install dependencies and start the dev server:

```sh
pnpm install
pnpm dev
```

Run type and Svelte diagnostics:

```sh
pnpm check
```

Build the production app:

```sh
pnpm build
```

## PDF Generation

Start the app, then generate PDF snapshots through Playwright:

```sh
pnpm dev
pnpm pdf
```

Useful variants:

```sh
pnpm pdf:invoice
pnpm pdf:brand -- alrein
```

The PDF script writes to `generated/` by default. Override the app URL or output folder with `PDF_BASE_URL` and `PDF_OUTPUT_DIR`.

## Database

```sh
pnpm db:push
pnpm db:generate
pnpm db:migrate
```
