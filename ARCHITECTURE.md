# Architecture

## Stack
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- Cloudflare Workers via OpenNext adapter (planned)
- Cloudflare D1 (SQLite) for persistence
- Cloudflare Static Assets for static files
- bcryptjs (password hashing), jose (JWT, optional), zod (validation)

## Layers
- `src/app` — routes (public localized pages, dashboards, admin, API)
- `src/components` — UI components (existing preserved)
- `src/lib` — i18n, categories, utils, db, auth, repos, validation
- `src/tools` — tool definitions + registry (existing preserved)
- `migrations` — D1 SQL migrations
- `.github/workflows` — CI/CD

## Data flow
Browser -> Next.js route handler / server component -> repository -> D1 binding.
Tool execution stays client-side (existing) for privacy; analytics records only metadata.

## Auth
- Session token in httpOnly, Secure, SameSite=Lax cookie.
- Token hashed (SHA-256) stored in `user_sessions`.
- Passwords hashed with bcryptjs.
- RBAC via `roles` + `user_roles`.

## Cloudflare bindings
- `DB` (D1)
- `ASSETS` (static assets, managed by adapter)
- Optional: `R2`, `KV` (not required for MVP)

## Security boundaries
- All admin operations enforce server-side authorization.
- Input validation with zod.
- Rate limiting (in-memory best-effort + Cloudflare).
- Security headers + CSP via middleware/next.config.
