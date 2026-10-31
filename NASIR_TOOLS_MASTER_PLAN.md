# Nasir Tools Master Plan

## Audit summary (current state)
- Framework: Next.js 16 App Router, TypeScript, Tailwind CSS v4, OpenNext Cloudflare adapter.
- Registered tools: 37 (all implemented with processing functions; none verified via browser E2E yet).
- Categories: image(6), text(5 incl. extra), developer(7), calculator(7), seo(5), social(4), ai(2).
- Auth + admin dashboard + D1 integration architecture implemented; D1 runtime verified locally.
- Build: `next build --webpack` passes; `npm run cf:build` passes; `wrangler deploy --dry-run` passes.
- CSS/PostCSS fixed for Tailwind v4 webpack builds.
- Tests: 5 unit tests pass; TypeScript passes.

## Tool inventory (37)
image: image-compressor, image-resizer, image-format-converter, image-to-base64, base64-to-image, color-picker
text: word-counter, character-counter, case-converter, text-cleaner, duplicate-line-remover
developer: json-formatter, json-validator, base64-encode-decode, url-encode-decode, html-formatter, css-minifier, js-minifier
calculator: age-calculator, percentage-calculator, discount-calculator, vat-calculator, loan-calculator, unit-converter, tip-calculator
seo: meta-tag-generator, robots-txt-generator, url-slug-generator, utm-builder, canonical-url-generator
social: hashtag-generator, bio-generator, social-post-preview, thumbnail-dimension-guide
ai: text-summarizer, ai-text-assistant

## Missing target catalogue (toward 100-120)
Image: cropper, rotator, flipper, watermark, metadata-viewer, favicon-generator, svg-optimizer, dimensions-checker, blur-tool, pixelate-tool, border-tool, background-color-changer, social-image-resizer
PDF: merger, splitter, compressor, rotator, page-extractor, page-reorder, pdf-to-image, image-to-pdf, text-extractor, metadata-viewer, watermark, page-counter, viewer, info-checker (needs pdf-lib — evaluate)
Developer: xml-formatter, xml-minifier, sql-formatter, markdown-editor, markdown-preview, hash-generator, jwt-decoder, color-converter, unix-timestamp-converter(already), lorem-ipsum-generator, user-agent-parser, http-status-reference, qr-code-generator(needs lib)
SEO: meta-tag-analyzer, schema-markup-generator, open-graph-generator, serp-preview, keyword-density-checker, hreflang-generator, redirect-checker, heading-structure-checker, image-alt-text-checker, structured-data-validator
Text: sentence-counter, paragraph-counter, text-sorter, text-reverser, text-diff-checker, find-and-replace, remove-extra-spaces, readability-checker, lorem-ipsum-generator
Calculator: date-difference-calculator, profit-calculator, margin-calculator, compound-interest-calculator, simple-interest-calculator, salary-calculator, time-calculator, electricity-bill-calculator
Social: youtube-title-generator, youtube-description-helper, youtube-hashtag-generator, social-caption-generator, instagram-bio-generator, facebook-post-formatter, social-character-counter, video-aspect-ratio-calculator
AI: text-rewriter, caption-generator, product-description-generator, blog-outline-generator, email-draft-generator, title-generator, hashtag-assistant, summary-generator, grammar-assistant, content-ideas-generator (require provider config)

## Notes
- No external crawler: SEO tools analyze local input only.
- AI tools must show config message when no provider key; never expose keys client-side.
- PDF tools need pdf-lib (not installed) — evaluate before adding.
- Implementation approach: append new tools to src/tools/extra.ts in batches; update registry; verify tsc + build after each batch.
