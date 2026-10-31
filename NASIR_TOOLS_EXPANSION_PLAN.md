# Nasir Tools Expansion Plan

## Existing tools (34)
See TOOL_REGISTRY.md. Categories: ai, calculator, developer, image, seo, social, text.

## Missing / planned tools (phased)
- Image: cropper, to WebP/PNG/JPG, rotator, flipper, watermark, metadata viewer, favicon generator, SVG optimizer, dimensions checker, blur, pixelate, border, background color changer, social media resizer.
- PDF: merger, splitter, compressor, rotator, page extractor/reorder, pdf-to-image, image-to-pdf, text extractor, metadata viewer, watermark, page counter, viewer, info checker.
- Developer: JSON minifier, XML/HTML/CSS/JS formatters & minifiers, SQL formatter, markdown editor/preview, UUID/hash generators, JWT decoder, regex tester, timestamp converter, color converter, QR generator/reader, password generator, lorem ipsum, user agent parser, HTTP status reference.
- SEO: meta analyzer, schema markup, OG generator, SERP preview, keyword density, canonical checker, hreflang generator, redirect checker, SEO text analyzer, heading checker, alt text checker, website word counter, structured data validator.
- Text: sentence/paragraph counter, case converters, text cleaner, duplicate remover/finder, sorter, reverser, diff, find/replace, remove extra spaces, line break remover, text to slug, readability.
- Calculators: date difference, profit/margin, EMI, compound/simple interest, salary, time, converters, electricity bill.
- Social: YouTube helpers, caption generator, Instagram bio, Facebook formatter, character counter, thumbnail guide, UTM, aspect ratio.
- AI: text rewriter, caption/product/blog/email/title/hashtag assistants (require provider config).

## Incomplete tools
None identified as broken; all 34 are implemented but not individually tested.

## UI/UX improvements
- Premium header/search, tool cards, breadcrumbs, skeleton/empty/error states, toast notifications.
- Preserve existing design system and themes.

## Architecture improvements
- Reusable typed Tool Engine already exists via ToolDefinition.
- Add new modules following existing pattern.
- Client-side processing preferred; server only for auth/admin.

## Testing strategy
- Unit tests per tool run function.
- Integration tests for DB/API.
- E2E for homepage/search/tool pages/auth/dashboard.
- Lighthouse after deploy.
