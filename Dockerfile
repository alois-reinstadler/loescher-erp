# syntax=docker/dockerfile:1.7

# SvelteKit (adapter-node) image for Coolify on a Hetzner VPS.
# Build output is a standalone Node server in ./build (see vite.config.ts).
#
# Runtime env (set in Coolify, never baked in):
#   ORIGIN              public base URL, e.g. https://erp.example.com
#   DATABASE_URL        libsql/sqlite connection string
#   BETTER_AUTH_SECRET  32+ char secret
#   PORT                defaults to 3000 (adapter-node)
#
# Run migrations as a Coolify "pre-deploy command":  pnpm db:migrate

# ---- build stage ----
FROM node:22-slim AS build
RUN corepack enable
WORKDIR /app

# Install deps first for layer caching.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Build the app. SvelteKit sync + vite build produce ./build.
COPY . .
RUN pnpm build

# Prune to production deps for the runtime image.
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm prune --prod

# ---- runtime stage ----
FROM node:22-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    # adapter-node serves from /app/build
    ORIGIN=http://localhost:3000

# Copy the standalone server, production deps, migrations, and manifest.
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/package.json ./package.json

# libsql native bindings need ca-certificates for TLS to remote libsql.
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && \
    rm -rf /var/lib/apt/lists/*

EXPOSE 3000
CMD ["node", "build/index.js"]
