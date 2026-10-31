# Nasir Tools — Project Plan

## Goal
A fully functional bilingual (English/Bengali) online tools platform with ~34 existing working tools, secure Cloudflare D1-backed backend, user dashboard, admin dashboard, blog CMS, SEO management, analytics, tests, and GitHub-to-Cloudflare deployment.

## Phases
1. Project audit — DONE (docs created from actual code).
2. Cloudflare compatibility — wrangler.jsonc, D1 bindings, OpenNext adapter notes.
3. Database — D1 migrations + repositories.
4. Authentication — register/login/logout/sessions/password reset/RBAC.
5. User dashboard — overview, favorites, recent, settings.
6. Admin dashboard — management UI + APIs.
7. Blog CMS — posts, translations, scheduling.
8. SEO management — metadata, redirects, sitemaps.
9. Analytics — privacy-conscious tracking.
10. Security — validation, rate limiting, headers, CSRF, CSP.
11. Testing — unit/API/DB/auth/admin/E2E.
12. Deployment — CI/CD + instructions.

## Non-goals / constraints
- Do not recreate frontend or replace working tools.
- Preserve existing routes, SSG, metadata.
- No placeholder production credentials.
- No collection of private tool input/uploaded file contents.

## Current verified status
- Next.js 16 App Router, TypeScript, Tailwind 4
- English/Bengali routing, light/dark themes
- ~34 functional tools, tool registry, SEO metadata, sitemap/robots
- Production build succeeds via `next build --webpack`
