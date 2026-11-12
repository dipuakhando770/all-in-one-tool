# Route, Canonical & Hreflang Audit Report
**Nasir Tools — Technical SEO & Production Readiness Audit**
**Date:** 2026-11-12  
**Auditor:** Principal Technical SEO Engineer

---

## 1. URL Structure

### Pattern
```
https://tools.nasirdigitalhub.com/{locale}/tools/{slug}
```

| Segment | Valid Values | Example |
|---------|-------------|---------|
| `{locale}` | `en`, `bn` | `en` |
| `{slug}` | Tool slug from registry | `image-compressor` |

### Route Examples Verified
| Route | Type | Status |
|-------|------|--------|
| `/en` | Homepage (EN) | ✅ |
| `/bn` | Homepage (BN) | ✅ |
| `/en/tools/image-compressor` | Tool page (EN) | ✅ |
| `/bn/tools/image-compressor` | Tool page (BN) | ✅ |
| `/en/tools/percentage-calculator` | Tool page (EN) | ✅ |
| `/en/tools/ai-caption-generator` | Tool page (EN) | ✅ |

---

## 2. Canonical Tag Implementation

**Source:** `src/lib/seo.ts` — `pageAlternates()` utility  
**Used in:** `src/app/[locale]/tools/[slug]/page.tsx`

### Logic
```typescript
canonical: `${SITE_URL}/${locale}${clean}`  // clean = path stripped of trailing slash
```

| Check | Status | Notes |
|-------|--------|-------|
| Canonical is self-referential per locale | ✅ | `/en/tools/slug` canonical = `/en/tools/slug` |
| Trailing slashes normalized | ✅ | `replace(/\/$/, "")` applied |
| `metadataBase` set in layout | ✅ | `new URL("https://tools.nasirdigitalhub.com")` |
| Homepage canonical per locale | ✅ | Set in `[locale]/page.tsx` |

---

## 3. Hreflang Implementation

**Source:** `src/lib/seo.ts` — `pageAlternates()` returns `alternates.languages`  
**Applied:** `src/app/[locale]/tools/[slug]/page.tsx` via `generateMetadata`  

### Hreflang Tags Generated (per tool page)
```html
<link rel="alternate" hreflang="en" href="https://tools.nasirdigitalhub.com/en/tools/{slug}" />
<link rel="alternate" hreflang="bn" href="https://tools.nasirdigitalhub.com/bn/tools/{slug}" />
<link rel="alternate" hreflang="x-default" href="https://tools.nasirdigitalhub.com/en/tools/{slug}" />
```

| Check | Status | Notes |
|-------|--------|-------|
| `en` alternate present | ✅ | |
| `bn` alternate present | ✅ | |
| `x-default` → English URL | ✅ | Correct — English as default |
| Self-referencing hreflang included | ✅ | The current page locale is included in `languages` |
| Bidirectional (en page points to bn, bn page points to en) | ✅ | Both pages use same `pageAlternates()` |
| Homepage hreflang | ✅ | Set in `[locale]/page.tsx` generateMetadata |

---

## 4. Sitemap Audit

**Source:** `src/app/sitemap.ts`

| Check | Status | Notes |
|-------|--------|-------|
| Both locales included | ✅ | EN + BN for every tool |
| Homepage in sitemap | ✅ | `/en` and `/bn` |
| All 169 tools × 2 locales | ✅ | 338 tool URLs + homepage URLs |
| `alternates.languages` per URL | ✅ | Sitemap includes hreflang alternates |
| `lastModified` present | ✅ | `new Date()` — static build time |
| Priority values | ⚠️ WARNING | All pages use same priority; homepage/priority tools could rank higher |
| Sitemap URL | ✅ | `https://tools.nasirdigitalhub.com/sitemap.xml` |

---

## 5. Robots.txt Audit

**Source:** `src/app/robots.ts`

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /*/dashboard/

Sitemap: https://tools.nasirdigitalhub.com/sitemap.xml
```

| Check | Status | Notes |
|-------|--------|-------|
| `Sitemap:` directive present | ✅ | Correct URL |
| Public tool pages allowed | ✅ | `/` → Allow |
| Admin routes disallowed | ✅ | `/admin/` |
| API routes disallowed | ✅ | `/api/` |
| Dashboard routes disallowed | ✅ | `/*/dashboard/` |
| No overly broad blocks | ✅ | |

---

## 6. Locale Routing Implementation

| Check | Status | Notes |
|-------|--------|-------|
| Custom `src/middleware.ts` | ✅ N/A | No middleware exists — routing via folder structure |
| `src/app/[locale]/` folder | ✅ | Handles both `en` and `bn` |
| Root `/` redirect | ⚠️ NOT VERIFIED | No middleware means no server-side `/` → `/en` redirect — requires browser or Cloudflare redirect rule |
| Trailing slash redirects | ⚠️ NOT VERIFIED | No middleware or Cloudflare rule confirmed |
| 404 for invalid locales | ✅ LIKELY | Next.js will 404 unknown `[locale]` values not matching `generateStaticParams` |

> [!WARNING]
> There is no `middleware.ts` to handle root `/` redirects to `/en`. Without a Cloudflare Worker redirect rule, visiting `https://tools.nasirdigitalhub.com/` may return a 404 or render an empty page. Recommend adding either a Next.js middleware or a Cloudflare redirect rule.

---

## 7. Summary

| Audit Area | Status |
|-----------|--------|
| Canonical tags | ✅ PASS |
| Hreflang (tool pages) | ✅ PASS |
| Hreflang (homepage) | ✅ PASS |
| `x-default` assignment | ✅ PASS |
| Sitemap coverage | ✅ PASS |
| Robots.txt | ✅ PASS |
| Root `/` redirect | ⚠️ NOT VERIFIED |
| Trailing slash consistency | ⚠️ WARNING |
| Sitemap priority tuning | ⚠️ WARNING |

**Overall Status: ✅ PASS with Warnings**

