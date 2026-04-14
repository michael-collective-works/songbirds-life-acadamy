# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager: **pnpm** (a `pnpm-lock.yaml` is present, though minimal). `npm`/`yarn` will also work.

- `pnpm dev` — run Next.js dev server (`next dev`)
- `pnpm build` — production build (`next build`)
- `pnpm start` — run the built app
- `pnpm lint` — ESLint over the repo (`eslint .`)

There is no test runner configured; do not claim tests pass — there are none to run.

## Architecture

Next.js 15 App Router app (React 19, TypeScript, Tailwind v4, shadcn/ui + Radix) for **Songbirds Life Academy** — a public marketing site plus a Google-SSO-protected `/admin` CMS.

### Data layer (`lib/db.ts`) — dual-backend with memory fallback

`lib/db.ts` is the single source of truth for events, team, store items, and applications. Every CRUD helper branches on `hasNeon()` (i.e., `process.env.DATABASE_URL` set):

- **Neon branch**: uses `@neondatabase/serverless` with tagged-template SQL.
- **Memory branch**: mutates module-level arrays seeded by `seedMemoryIfEmpty()` at import time.

Implication: without `DATABASE_URL`, the app is fully functional but state is per-process and resets on reload. When changing a CRUD shape, update **both** branches and the matching Zod schema in `lib/schemas.ts`. `dbStatus()` surfaces the current driver to `/api/health` and the admin dashboard.

A parallel Supabase admin client exists in `lib/supabase.ts` (used for uploads/service-role ops) — it is independent of the Neon/memory code path. SQL migrations live in `scripts/sql/` with `10x_supabase_*` and `20x_neon_*` tracks kept in parallel; keep them in sync when schemas change.

### Auth & authorization

- `auth.ts` configures NextAuth v5 with Google provider, JWT sessions, `trustHost: true`.
- Role is derived in the `jwt` callback: email in `ADMIN_EMAILS` (comma-separated env var) → `owner`, otherwise `editor`. There is no DB-backed admin table despite what `docs/plan.md` describes.
- `lib/authz.ts#requireAdmin()` is the single guard for admin API routes — it returns `{ ok: false, status: 401 }` on failure; callers should convert to an HTTP response.

### Routing layout

- `app/(public)` — `/`, `/about`, `/events`, `/store`, `/join`
- `app/admin/*` — CMS UI (guarded by session check in the layout)
- `app/api/*` — public read endpoints, `POST /api/join-us`, and `app/api/admin/*` mutations behind `requireAdmin()`
- `app/api/uploads/*` — image uploads (Vercel Blob when configured, memory fallback via `lib/uploads-memory.ts`)

### Other library modules

- `lib/schemas.ts` — Zod schemas for all entities; `db.ts` uses `.omit`/`.pick` on these for validation. Keep entity shapes here, not inline in routes.
- `lib/rate-limit.ts`, `lib/security.ts` — used by public POST endpoints (join-us).
- `lib/log.ts` — server-side logger.

## Conventions specific to this repo

- Path alias `@/*` → repo root (see `tsconfig.json`). Imports like `@/lib/db`, `@/components/ui/button`.
- shadcn/ui components live in `components/ui/` and are treated as source (edit in place); `components.json` configures the generator.
- Dates are stored as `YYYY-MM-DD` strings end-to-end; `toISODate()` in `lib/db.ts` normalizes `Date` objects returned by Neon.
- The project's `package.json` name is `my-v0-project` (v0-generated scaffold). Do not rename unless asked.
- `docs/plan.md` is the product spec; treat sections marked "(planned)" as aspirational, not as implemented fact.
- `MULTI_FILE_EDIT` at the repo root is a scratch file — ignore unless asked.
