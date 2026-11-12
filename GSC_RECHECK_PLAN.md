# Google Search Console (GSC) 30 / 60 / 90 Day Recheck Protocol

**Target Domain:** `https://tools.nasirdigitalhub.com`  
**Baseline Date:** November 12, 2026  
**Next Evaluation Milestone (30 Days):** December 12, 2026  
**Quarterly Milestone (90 Days):** February 12, 2027  

---

## 1. Tracking Protocol & Targets

### Target KPIs

| KPI | Baseline (Nov 12, 2026) | 30-Day Target (Dec 2026) | 60-Day Target (Jan 2027) | 90-Day Target (Feb 2027) |
| :--- | :---: | :---: | :---: | :---: |
| **Total Clicks (30-day window)** | ~50 (extrapolated) | **150+** | **350+** | **750+** |
| **Total Impressions** | ~1,500 (extrapolated) | **5,000+** | **12,000+** | **25,000+** |
| **Average CTR** | 3.34% | **4.5%+** | **5.5%+** | **6.5%+** |
| **Image Compressor Position** | 67.86 | **< 35** | **< 20** | **Page 1 (< 10)** |
| **Image Compressor CTR** | 0.58% | **> 2.5%** | **> 4.0%** | **> 6.0%** |
| **Percentage Calculator (BN) Position** | 25.30 | **< 15** | **< 10** | **Top 5 (< 5)** |
| **Schema Markup Generator Position** | 55.16 | **< 30** | **< 15** | **< 10** |
| **AI Caption Generator (BN/EN) Clicks** | 0 | **25+** | **75+** | **150+** |

---

## 2. Structured Verification Checklist for Recheck Days

### Day 30 Verification (December 12, 2026)
1. **Google Search Console Indexing Inspection:**
   - Verify that all 9 priority landing pages report "URL is on Google".
   - Check the "Enhancements" tab for valid **FAQPage**, **HowTo**, and **Breadcrumbs** rich results.
2. **Impression & CTR Velocity:**
   - Compare `image-compressor` impressions: has query diversity expanded into long-tail queries (`compress scanned image`, `reduce picture file size`, `compress jpeg to 100kb`)?
   - Compare average CTR on `ai-caption-generator` now that FAQ rich snippets are active.
3. **Bangla Search Penetration:**
   - Review query log for Bangla keywords (`শতকরা হিসাব`, `ক্যাপশন জেনারেটর`, `বিদ্যুৎ বিল হিসাব`).

### Day 60 Verification (January 12, 2027)
1. **Ranking Trajectory:**
   - Evaluate whether `image-compressor` has reached Page 2 / Page 3.
   - Evaluate whether `discount-calculator` has broken onto Page 1 (Position < 10).
2. **Cannibalization Audit:**
   - Check if English and Bengali URLs are properly separated via `hreflang` without competing against each other for the same search queries.

### Day 90 Verification (February 12, 2027)
1. **Sustained Traffic Review:**
   - Measure MoM organic traffic growth.
   - Expand the typed `seo-content.ts` template to Tier 2 tools based on high-impression query discovery.

---

## 3. Corrective Action Triggers

- **Trigger 1: Impressions increase but CTR remains < 1.0%**
  - *Action:* Iterate title tag and meta description to include stronger bracketed hooks (e.g., `[100% Free]`, `[No Uploads]`, `[Instant ZIP]`).
- **Trigger 2: High bounce rate on mobile devices**
  - *Action:* Optimize mobile workspace viewport and button touch targets in `batch-image-processor.tsx`.
- **Trigger 3: Schema warning in Search Console**
  - *Action:* Run Google Rich Results Test validator on the specific URL and inspect output JSON-LD.

