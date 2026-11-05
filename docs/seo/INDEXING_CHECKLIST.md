# Search Engine Indexing & Crawl Verification Checklist

**Domain:** `https://tools.nasirdigitalhub.com`

---

## Pre-Launch & Verification Checklist

- [x] **Noindex Flag Guard:** Verify `robots` meta tag does NOT contain `noindex` on public routes (`/en/`, `/bn/`, `/tools/*`).
- [x] **Canonical Self-References:** Verify `<link rel="canonical" href="...">` matches the exact rendered URL.
- [x] **Bilingual Hreflang Validation:**
  - Verify every `/en/tools/{slug}` has `<link rel="alternate" hreflang="bn" href="https://tools.nasirdigitalhub.com/bn/tools/{slug}" />`.
  - Verify reciprocal alternate pointing back to `/en/`.
- [x] **Sitemap Accessibility:** `curl -I https://tools.nasirdigitalhub.com/sitemap.xml` returns HTTP 200 with `application/xml`.
- [x] **Robots.txt Accessibility:** Verify clean disallow rules protecting `/admin/` and `/api/admin/`.
- [x] **Trailing Slash Consistency:** Next.js route normalization enforces consistent non-trailing slash URLs.
- [x] **HTTPS Enforcement:** Cloudflare SSL/TLS configured to Automatic HTTPS Rewrites & Full (Strict).
