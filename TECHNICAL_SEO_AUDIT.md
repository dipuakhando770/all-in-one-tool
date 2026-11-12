# Nasir Tools — Technical SEO & Architecture Audit

**Audit Date:** November 12, 2026  
**Website:** `https://tools.nasirdigitalhub.com`  
**Framework:** Next.js 16 (App Router)  
**Host & Runtime:** Cloudflare Workers via OpenNext + Static Asset Serving  
**Primary Locales:** `en` (English), `bn` (Bengali)  

---

## 1. Indexing & Crawling Foundation

### 1.1 Robots Directives (`src/app/robots.ts`)
```ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/*/dashboard/",
        ],
      },
    ],
    sitemap: "https://tools.nasirdigitalhub.com/sitemap.xml",
  };
}
```
* **Status:** **PASS**
* **Assessment:** Search engines are allowed full crawl access to public landing pages, category hubs, and all 169 tool routes. Private routes (`/admin/`, `/api/`, `/*/dashboard/`) are explicitly protected from crawling, preventing duplicate thin pages and security leakage.

### 1.2 XML Sitemap Architecture (`src/app/sitemap.ts`)
* **Status:** **PASS**
* **Assessment:** Dynamic route generator produces a valid XML sitemap containing:
  - Homepage routes: `https://tools.nasirdigitalhub.com/en` and `/bn` (Priority 1.0)
  - Core directory hubs: `/tools`, `/popular`, `/categories`, `/directory`, `/pricing`, `/blog` (Priority 0.7–0.9)
  - 11 Category landing hubs for both locales (Priority 0.8)
  - All 169 registered tool detail routes for both locales (Priority 0.7–0.9 based on popularity)
* **Total Indexed URLs:** >370 unique localized URLs.

---

## 2. URL Canonicalization & Hreflang Alignment

### 2.1 Canonical Tags
* **Domain Anchor:** Strictly enforced on `https://tools.nasirdigitalhub.com`.
* **Path Integrity:** Every page canonical points directly to its own self-referential canonical URL.
* **Trailing Slash Consistency:** Strict non-trailing slash normalization applied throughout router and sitemap entries.

### 2.2 Hreflang Alternates (`src/lib/seo.ts`)
* Every localized page exports compliant bidirectional alternate links:
  - `en` → `https://tools.nasirdigitalhub.com/en/...`
  - `bn` → `https://tools.nasirdigitalhub.com/bn/...`
  - `x-default` → `https://tools.nasirdigitalhub.com/en/...`
* **Assessment:** Prevents regional duplicate content penalties between Bengali and English versions of calculation tools.

---

## 3. Structured Data (JSON-LD) Audit

| Schema Type | Location | Compliance & Quality Check |
| :--- | :--- | :--- |
| `Organization` | `src/app/layout.tsx` | Validates brand entity, logo URL, and parent domain relationship. |
| `WebSite` | `src/app/[locale]/layout.tsx` | Includes `SearchAction` deep linking with `query-input` parameter for Google sitelinks searchbox. |
| `BreadcrumbList` | Tool & Category pages | Full hierarchy: Home → Tools → Category → Tool. Validated against Schema.org specs. |
| `WebApplication` | Tool Detail Pages | Categorized under `UtilityApplication`, specifies browser requirements, zero cost ($0 USD), and language. |
| `HowTo` | Tool Detail Pages | Step-by-step instructions marked up with position and instruction text. |
| `FAQPage` | Tool Detail Pages | Only emitted when real, user-facing FAQs are rendered on the page. Complies with Google's updated August 2023 FAQ rich results guidelines. |

---

## 4. On-Page & Semantic Architecture

* **Heading Hierarchy:** One distinct, keyword-focused `<h1>` per page. Supporting sections structured hierarchically with `<h2>` (How-to, Features, Examples, FAQ, Related Tools) and `<h3>`.
* **Image Optimization:** All decorative icons include `aria-hidden="true"`. Product previews provide descriptive Bengali and English `alt` text.
* **Theme Flash Prevention:** Root layout includes an inline blocking script reading `localStorage.theme` prior to render, eliminating layout shifts and light/dark theme flash on load.
* **Accessibility:** All form controls include associated `<label>` tags with `htmlFor` identifiers. Interactive elements feature distinct `:focus-visible` focus rings.

---

## 5. Performance & Core Web Vitals Targets

| Metric | Target | Current Architectural Status | Optimization Levers Applied |
| :--- | :---: | :---: | :--- |
| **LCP (Largest Contentful Paint)** | $\le 2.5\text{ s}$ | Excellent on Edge | System font stack with zero external font blocking; lightweight SVG icons via `lucide-react`. |
| **INP (Interaction to Next Paint)** | $\le 200\text{ ms}$ | Excellent on Client | Canvas image operations offload using asynchronous blob conversions; zero heavy third-party tracking scripts. |
| **CLS (Cumulative Layout Shift)** | $\le 0.1$ | Zero layout shift | Fixed dimension icon containers; no layout shifts from dynamic ad injection; inline theme script. |

---

## 6. Technical Recommendations & Action Plan

1. **Deploy Dedicated SEO Content Module (`src/lib/seo-content.ts`):** Centralize rich, high-intent bilingual educational copy, real inputs/outputs, and limitations for high-priority GSC pages.
2. **Upgrade Image Compressor UI & State:** Implement explicit before/after file size diffs, percentage saved metrics, and quality presets (Balanced, High, Maximum) directly inside `src/components/batch-image-processor.tsx`.
3. **Enhance Bengali Content Authenticity:** Provide authentic Bengali terminologies (e.g., "শতকরা হিসাবের সূত্র", "ছবির সাইজ কমানোর নিয়ম", "বিদ্যুৎ বিল হিসাব") instead of transliterated or mechanical translations.
4. **Enrich Schema Markup Generator:** Support WebPage, Article, LocalBusiness, FAQPage, and Organization schema types with validated JSON output and copy controls.

