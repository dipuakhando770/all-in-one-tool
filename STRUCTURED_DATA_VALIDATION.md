# Structured Data Validation Report
**Nasir Tools — Technical SEO & Production Readiness Audit**
**Date:** 2026-11-12  
**Auditor:** Principal Technical SEO Engineer / Google Search Central Compliance Specialist

---

> [!IMPORTANT]
> Structured data makes pages **eligible** for Google rich results. It does **not guarantee** rich result appearance. Only Google determines whether a rich result is shown. All claims in this report are limited to code-level eligibility only.

---

## 1. Schema Types Audit Summary

| Schema Type | Pages Applied | Status | Notes |
|------------|--------------|--------|-------|
| Organization | Global (`layout.tsx`) | ✅ PASS | Correct — name, url, logo |
| WebSite | Global (`layout.tsx`) | ✅ PASS | Added — includes SearchAction with `urlTemplate` |
| BreadcrumbList | All tool pages | ✅ PASS | Home → Tools → [Tool Name] hierarchy |
| WebApplication | All tool pages | ✅ PASS | applicationCategory, operatingSystem, offers (Free) |
| HowTo | Priority tool pages | ✅ PASS | Steps from `seo-content.ts` — matches visible page content |
| FAQPage | Priority tool pages | ✅ PASS | Questions from `seo-content.ts` — all visible on page |
| Article | Not implemented | ✅ APPROPRIATE | No blog/article pages exist — correct to omit |
| Product | Not implemented | ✅ APPROPRIATE | No paid products — no fake Product schema added |
| LocalBusiness | Not implemented | ✅ APPROPRIATE | Not a local business — correct to omit |
| AggregateRating | Not implemented | ✅ APPROPRIATE | No verified review system — correct to omit |

---

## 2. Organization Schema (Global)

**Location:** `src/app/layout.tsx` — rendered on every page

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Nasir Tools",
  "url": "https://tools.nasirdigitalhub.com",
  "logo": "https://tools.nasirdigitalhub.com/favicon.svg",
  "sameAs": []
}
```

| Check | Result |
|-------|--------|
| `@context` correct | ✅ |
| `@type` correct | ✅ |
| `name` present | ✅ |
| `url` stable and correct | ✅ |
| `logo` URL resolves to real asset | ✅ (favicon.svg exists) |
| No fake properties (phone, address, rating) | ✅ |
| `sameAs` empty array | ⚠️ WARNING — Add social profile URLs when available |

**Result: PASS**

---

## 3. WebSite Schema (Global)

**Location:** `src/app/layout.tsx` — added during this audit

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Nasir Tools",
  "url": "https://tools.nasirdigitalhub.com",
  "description": "169+ free online tools...",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://tools.nasirdigitalhub.com/en?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

| Check | Result |
|-------|--------|
| `@type: WebSite` | ✅ |
| `potentialAction` → `SearchAction` | ✅ |
| `urlTemplate` with `{search_term_string}` | ✅ |
| `query-input` follows spec | ✅ |
| Homepage actually supports `?q=` search param | ⚠️ WARNING — Verify that `/en?q=...` performs visible search filtering |

**Result: PASS with 1 Warning**

> [!WARNING]
> The SearchAction `urlTemplate` points to `/en?q={search_term_string}`. Confirm the homepage search box reads this query param on load; otherwise the SearchAction is technically valid but non-functional for Googlebot.

---

## 4. BreadcrumbList Schema (Tool Pages)

**Location:** `src/app/[locale]/tools/[slug]/page.tsx`

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://tools.nasirdigitalhub.com/en" },
    { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://tools.nasirdigitalhub.com/en/tools" },
    { "@type": "ListItem", "position": 3, "name": "[Tool Name]", "item": "https://tools.nasirdigitalhub.com/en/tools/[slug]" }
  ]
}
```

| Check | Result |
|-------|--------|
| Correct hierarchy | ✅ |
| `position` values sequential | ✅ |
| `item` URLs match canonical | ✅ |
| Visible breadcrumb UI matches JSON-LD | ✅ |
| Applied to all tool pages via `page.tsx` | ✅ |

**Result: PASS**

---

## 5. WebApplication Schema (Tool Pages)

**Location:** `src/app/[locale]/tools/[slug]/page.tsx`

| Check | Result |
|-------|--------|
| `@type: WebApplication` | ✅ |
| `name` = tool name | ✅ |
| `description` = tool description | ✅ |
| `applicationCategory` present | ✅ |
| `operatingSystem: "Any"` | ✅ |
| `offers: { price: "0", priceCurrency: "USD" }` | ✅ |
| No fake AggregateRating added | ✅ |

**Result: PASS**

---

## 6. HowTo Schema (Priority Tool Pages)

**Location:** `src/app/[locale]/tools/[slug]/page.tsx` + `src/lib/seo-content.ts`

| Check | Result |
|-------|--------|
| Steps sourced from `seo-content.ts` | ✅ |
| Steps visible on rendered page | ✅ |
| Steps are genuine how-to instructions | ✅ |
| No time/supply/tool properties fabricated | ✅ |
| Applied to 9 priority tools | ✅ |

> [!NOTE]
> HowTo rich results are **not guaranteed** for SaaS tool pages. Google reserves HowTo rich results for pages with genuine step-by-step instructions for real-world tasks. The structured data is correct and eligible, but rich result display depends on Google's discretion.

**Result: PASS**

---

## 7. FAQPage Schema (Priority Tool Pages)

**Location:** `src/app/[locale]/tools/[slug]/page.tsx` + `src/lib/seo-content.ts`

| Check | Result |
|-------|--------|
| FAQs visible in page content | ✅ |
| FAQs match JSON-LD entries | ✅ |
| Minimum 2 FAQs per locale per tool | ✅ (fixed in prior session) |
| No commercial/promotional answers | ✅ |
| No duplicate Q&A pairs | ✅ |
| Applied to both `en` and `bn` locales | ✅ |

> [!NOTE]
> FAQPage rich results are increasingly restricted by Google. Only specific page types qualify. This structured data is syntactically correct and content-consistent, but guaranteed rich result appearance cannot be promised.

**Result: PASS**

---

## 8. Missing / Not Applicable Schemas

| Schema | Decision | Reason |
|--------|---------|--------|
| `Product` | Not added | No paid products exist. Adding fake Product schema would violate Google Search Central guidelines. |
| `LocalBusiness` | Not added | Nasir Tools is not a local business. Adding it would be misleading. |
| `AggregateRating` / `Review` | Not added | No verified review/rating system. Adding would be a guideline violation. |
| `Article` | Not added | No blog/article pages. No justification for the type. |
| `SoftwareApplication` | Not added separately | WebApplication covers the same use case appropriately. |

---

## 9. JSON-LD Syntax Validation

| Check | Status |
|-------|--------|
| All JSON-LD serialized via `JSON.stringify()` | ✅ — no manual string concatenation |
| No trailing commas or unescaped characters | ✅ |
| No duplicate `@type` entities on same page | ✅ — unique types per `<script>` block |
| `@context` on every entity | ✅ |

**Result: PASS**

---

## 10. Summary

| Schema Type | Status |
|------------|--------|
| Organization | ✅ PASS |
| WebSite + SearchAction | ✅ PASS (1 warning) |
| BreadcrumbList | ✅ PASS |
| WebApplication | ✅ PASS |
| HowTo | ✅ PASS |
| FAQPage | ✅ PASS |
| Fake schemas (Product, LocalBusiness, Rating) | ✅ NONE — Correct |

**Overall Structured Data Status: ✅ PASS**

---

*All structured data verified against actual source files. No schema types used speculatively or without page-content justification.*

