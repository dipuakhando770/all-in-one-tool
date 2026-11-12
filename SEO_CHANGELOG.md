# Nasir Tools — Technical SEO & SaaS Upgrade Changelog

**Release Date:** November 12, 2026  
**Auditor & Architect:** Technical SEO & Principal Product Engineering Team  
**Scope:** Priority Tool SEO Architecture, Specialized Batch Processor, Structured Data & GSC Performance Optimization  
**Deployment Target:** Cloudflare OpenNext / Workers  

---

## 1. Structured Data & Rich Snippet Upgrades
- **BreadcrumbList JSON-LD:** Verified on all tool pages with 4-level hierarchic trail (`Home` &rarr; `All Tools` &rarr; `Category` &rarr; `Tool Name`).
- **WebApplication JSON-LD:** Enriched with detailed operational categories, free price offer (`price: "0"`), and clear browser requirements.
- **HowTo JSON-LD:** Connected to typed step-by-step instructions (`HowToStep`) with position, step title, and full instructional text for all priority tools.
- **FAQPage JSON-LD:** Injected structured question-answer entities across all priority tool landing pages in English and Bengali.

---

## 2. Priority Tool Upgrades (Phase 2 & Phase 3)

### Priority A Tools
1. **Image Compressor (`/tools/image-compressor`):**
   - **Engine Upgrade:** Visual before/after file size display with real-time percentage reduction badge (e.g. `-72% smaller`).
   - **Quality Presets:** Low (0.35), Balanced (0.70 - Recommended), High Quality (0.85), Maximum (0.95), plus fine-tuning slider.
   - **Format Output:** Original preservation, WebP conversion, JPEG conversion (with clean white background fallback), and PNG.
   - **Zero Server Uploads Guarantee:** Added prominent privacy notice highlighting 100% in-browser HTML5 Canvas processing.
   - **Download Capabilities:** Single file instant save and batch multi-image ZIP bundle download (`createZip`).

2. **Bengali & English Percentage Calculator (`/tools/percentage-calculator`):**
   - **Modes Added:** "What % is X of Y?", "What is X% of Y?", and "Percentage Change from X to Y".
   - **Step-by-Step Breakdown:** Displays formula, fraction representation, decimal multiplier, and remaining proportion.

3. **Schema Markup Generator (`/tools/schema-markup-generator`):**
   - **Schema Support Expanded:** Upgraded from plain WebPage to `WebPage`, `Article`, `Organization`, `Product`, `LocalBusiness`, and `FAQPage`.
   - **Automated Validation:** Generates valid, copy-ready `<script type="application/ld+json">` code compliant with Google Rich Snippet guidelines.

4. **Bengali & English AI Caption Generator (`/tools/ai-caption-generator`):**
   - **Platform-Targeted Generation:** Instagram (emojis + hashtags), LinkedIn (thought leadership), Facebook (community).
   - **Graceful Deterministic Fallback:** Built-in template generator ensures users never receive 501/503 errors even when `AI_API_KEY` is unconfigured.

### Priority B Tools
5. **Discount Calculator (`/tools/discount-calculator`):**
   - Computes original price, discount amount, discounted sale price, optional sales tax/VAT, and effective savings percentage.

6. **AI Text Rewriter (`/tools/ai-text-rewriter`):**
   - Added tone presets (Professional & Crisp, Casual & Friendly, Concise Bullet Points).
   - Added robust offline rewriter engine eliminating server 501/503 error states.

7. **Social Media Caption Generator (`/tools/social-media-caption-generator`):**
   - Multi-platform support for Instagram, Facebook, LinkedIn, Twitter/X, and Threads with contextual hashtags.

8. **Image Resizer (`/tools/image-resizer`):**
   - Added precise width and height pixel scaling with WebP, JPG, and PNG output formats.
   - 100% client-side canvas rendering.

9. **Electricity Bill Calculator (`/tools/electricity-bill-calculator`):**
   - Calculates daily kWh consumption, billing period kWh, monthly projection (30 days), and yearly projection (365 days).

---

## 3. UI/UX & Content Engine
- **`src/lib/seo-content.ts`:** Created typed content matrix with comprehensive natural English and Bengali write-ups (introduction, primary use cases, feature checklists, step-by-step how-to, practical examples, limitations, and FAQs).
- **`src/app/[locale]/tools/[slug]/page.tsx`:** Dynamically renders rich overview cards, feature grids, example comparisons, limitation alerts, and interactive FAQ accordions.

---

## 4. Verification & QA
- **Unit Tests:** `tests/priority-tools.test.ts` added and passing (13/13 total tests green).
- **TypeScript:** `tsc --noEmit` passing with 0 errors.
- **Safety Guarantee:** Preserved all 169 registered tools, database migrations, and Cloudflare OpenNext bindings.

