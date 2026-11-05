# Technical SEO & Edge Infrastructure Guidelines

**Target Domain:** `tools.nasirdigitalhub.com`  
**Infrastructure:** Next.js 16 App Router + Cloudflare OpenNext Edge Deployment

---

## 1. Edge Caching & Response Headers
- **Static Assets (`/_next/static/*`):** `Cache-Control: public, max-age=31536000, immutable`.
- **SSR Tool HTML Pages:** `Cache-Control: public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800`.
- **Security Headers:**
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN` (Except sandboxed execution iframes)
  - `Referrer-Policy: strict-origin-when-cross-origin`

---

## 2. Dynamic XML Sitemap & Robots.txt Specification
- `robots.txt`:
  ```txt
  User-agent: *
  Allow: /
  Disallow: /admin/
  Disallow: /api/admin/
  
  Sitemap: https://tools.nasirdigitalhub.com/sitemap.xml
  ```
- `sitemap.xml`: Dynamically generated using Next.js route handler, enumerating all 161 tools across `/en/tools/[slug]` and `/bn/tools/[slug]` with exact last-modified timestamps and hreflang alternate links.
