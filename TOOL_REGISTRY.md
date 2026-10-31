# Tool Registry

Source of truth: src/tools/registry.ts aggregates arrays from:
- src/tools/image.ts
- src/tools/text.ts
- src/tools/developer.ts
- src/tools/calculator.ts
- src/tools/seo.ts
- src/tools/social.ts
- src/tools/ai.ts

Total registered tools: 34.

Each tool defines id, slug, category, icon, name/description (localized), inputSchema, run, SEO fields, instructions, FAQs, related, flags.

Tool execution is client-side via ToolRunner.
