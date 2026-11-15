# Official multi-platform Node 24.22.1 bookworm-slim digest, verified 2026-11-16.
FROM node:24.22.1-bookworm-slim@sha256:be8204d4bd327363357f532187b752ff62759c31bedf98e9e18fc08c9cbd605c AS verify
WORKDIR /app
ENV ASTRO_TELEMETRY_DISABLED=1 NOTES_DOCKER_BUILD=1
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY astro.config.mjs tsconfig.json ./
COPY src ./src
COPY scripts ./scripts
COPY content/posts ./content/posts
COPY public/notes ./public/notes
COPY output/ci/source.json ./output/ci/source.json
ARG RENDERER=astro
RUN node scripts/ci/verify.mjs --renderer "$RENDERER"

FROM node:24.22.1-bookworm-slim@sha256:be8204d4bd327363357f532187b752ff62759c31bedf98e9e18fc08c9cbd605c AS preview
WORKDIR /app
ENV HOST=0.0.0.0 PORT=8798
COPY --from=verify /app/dist/notes ./dist/notes
COPY --from=verify /app/output/ci/release.json ./release.json
COPY scripts/ci/serve.mjs ./serve.mjs
USER node
EXPOSE 8798
CMD ["node", "serve.mjs"]
