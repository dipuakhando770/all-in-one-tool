# Google Search Console (GSC) Performance Baseline

**Website Target:** `https://tools.nasirdigitalhub.com`  
**Parent Entity:** Nasir Digital Hub (`https://nasirdigitalhub.com`)  
**Data Export Timestamp:** November 12, 2026  
**Audited Date Window:** October 30 – November 10, 2026 (12 Days)  
**Audit Status:** Baseline Recorded & Verified

---

## 1. Aggregate Performance Metrics

| Metric | Baseline Value | Context / Significance |
| :--- | :--- | :--- |
| **Total Impressions** | **598** | Overall search surface exposure across all indexed pages |
| **Total Clicks** | **20** | Actual organic visits from Google Search |
| **Average CTR** | **3.34%** | Baseline click-through rate |
| **Dominant Geo** | **Bangladesh (BD)** | 202 impressions, 20 clicks (100% of recorded clicks) |
| **Dominant Device** | **Desktop** | 520 impressions (87%), 16 clicks (80%) |
| **Mobile Exposure** | **Mobile** | 77 impressions (13%), 4 clicks (20%) |

> **Data Limitation Disclosure:**  
> The export metadata displays "Last 3 months", but `Chart.csv` contains observations for only 12 discrete dates (Oct 30 - Nov 10, 2026). Aggregate sums in `Chart.csv`, `Pages.csv`, and `Queries.csv` differ slightly due to Google Search Console sampling and privacy thresholds.

---

## 2. Priority Pages Baseline

| Landing Page | Language | Clicks | Impressions | Baseline CTR | Avg Position | Optimization Tier |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `/` (Homepage) | - | 13 | 36 | 36.11% | 3.83 | Brand Anchor |
| `/en/tools/image-compressor` | EN | 1 | 173 | 0.58% | 67.86 | **Priority A** |
| `/bn/tools/percentage-calculator` | BN | 0 | 54 | 0.00% | 25.30 | **Priority A** |
| `/en/tools/schema-markup-generator` | EN | 0 | 32 | 0.00% | 55.16 | **Priority A** |
| `/bn/tools/ai-caption-generator` | BN | 0 | 25 | 0.00% | 8.04 | **Priority A** |
| `/en/tools/ai-caption-generator` | EN | 0 | 20 | 0.00% | 9.95 | **Priority A** |
| `/en/tools/discount-calculator` | EN | 0 | 22 | 0.00% | 19.64 | **Priority B** |
| `/en/tools/ai-text-rewriter` | EN | 0 | 22 | 0.00% | 27.55 | **Priority B** |
| `/en/tools/social-media-caption-generator`| EN | 0 | 22 | 0.00% | 26.73 | **Priority B** |
| `/en/tools/image-resizer` | EN | 0 | 9 | 0.00% | 63.78 | **Priority B** |
| `/en/tools/electricity-bill-calculator` | EN | 0 | 5 | 0.00% | 34.20 | **Priority B** |

---

## 3. Top High-Intent Search Queries

| Search Query | Impressions | Avg Position | Matched Tool Page | Target Intent |
| :--- | :---: | :---: | :--- | :--- |
| `image compressor` | 15 | 67.13 | `/en/tools/image-compressor` | Online image size reduction |
| `schema markup generator` | 12 | 65.00 | `/en/tools/schema-markup-generator` | JSON-LD code generation |
| `schema generator` | 10 | 41.10 | `/en/tools/schema-markup-generator` | Rich snippets creation |
| `reduce image file size` | 10 | 59.50 | `/en/tools/image-compressor` | Image optimization |
| `image resizer` | 9 | 63.78 | `/en/tools/image-resizer` | Pixel dimension scaling |
| `reduce picture file size` | 8 | 40.62 | `/en/tools/image-compressor` | Photo file size reduction |
| `discount calculator` | 7 | 12.57 | `/en/tools/discount-calculator` | Price & sale savings math |
| `compress scanned image` | 6 | 28.17 | `/en/tools/image-compressor` | PDF/Scan image compression |

---

## 4. Key Diagnostic Takeaways

1. **Massive Impression vs CTR Gap:** `image-compressor` generated 173 impressions (29% of total website impressions) but only 1 click (0.58% CTR) due to low ranking position (67.86).
2. **Page 1 Positions Lacking Rich Snippets:** `ai-caption-generator` ranks on Page 1 (Position 8.04 in Bengali, Position 9.95 in English) but generated 0 clicks. Missing `FAQPage` and `HowTo` rich snippets left search results inconspicuous.
3. **High-Converting Calculator Intent:** `discount-calculator` (Position 12.57) and `percentage-calculator` (Position 25.30 in Bengali) are close to page 1 threshold. Enhancing structured answers, formula explanations, and real-world examples directly addresses the transactional search intent.
