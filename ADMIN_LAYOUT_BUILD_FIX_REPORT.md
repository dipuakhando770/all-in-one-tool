# Admin Layout Build Fix Report

## Root cause
`src/app/admin/layout.tsx` began with a `"use client"` directive but also imported server-only APIs (`next/headers`, `next/navigation` redirect, `@/lib/auth/session`, `@/lib/auth/rbac`) and defined an async Server Component default export. This mixed a Client Component module with server-only dependencies, causing the Cloudflare/OpenNext build error: importing a module that depends on `next/headers` into a React Client Component module.

## Files changed
- `src/app/admin/layout.tsx` — converted to a pure Server Component. Removed `"use client"` and all client UI. Retained cookie reading, `getSessionUser`, `isAdmin`, redirect to `/en/login`, and rendering of the client shell.
- `src/app/admin/admin-shell.tsx` — new Client Component (`"use client"`). Contains the admin sidebar, responsive navigation, header, theme/CSS-variable based UI, and children rendering previously inlined in the layout.

## Server/client architecture after fix
- Server Component (`layout.tsx`): auth guard only; uses `cookies()` from `next/headers`, `redirect` from `next/navigation`, `getSessionUser`, `isAdmin`. No client hooks.
- Client Component (`admin-shell.tsx`): all interactive UI (`useState`, `usePathname`, `Link`, lucide icons). No imports of `next/headers`, server auth modules, or secrets.

## Authentication behavior preserved
- Session cookie `nasir_session` read server-side.
- `getSessionUser()` awaited (async) and null-checked.
- `isAdmin(user.roles)` enforced before rendering.
- Unauthorized users redirect to `/en/login`.
- No client-side role trust; no secrets exposed.

## TypeScript result
`npm run typecheck` passed (no errors).

## Unit test result
`npm test` passed: 5 tests, 0 failures.

## Cloudflare build result
`npm run cf:build` completed successfully. OpenNext build complete; Worker saved in `.open-next/worker.js`.

## Wrangler dry-run result
`npx wrangler deploy --dry-run` succeeded. Total Upload 13130.53 KiB; bindings DB, ASSETS, NODE_ENV present. Exited without deploying.

## Remaining errors
None.
