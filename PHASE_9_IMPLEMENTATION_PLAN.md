# PHASE 9 — AI Document Studio Implementation

## Implementation Plan

### 1. Document Studio Landing Page (`/[locale]/document-studio`)
- Create premium SaaS interface
- Responsive mobile/tablet/desktop
- Light/dark mode
- Searchable document tools
- Tool categories with unique SVG thumbnails
- Recent and popular tools sections
- Upload and processing instructions

### 2. PDF Tools (Preserve + Improve)
- Keep existing: pdf-page-count, pdf-metadata-viewer, pdf-rotator, pdf-merger, pdf-splitter, pdf-to-image
- Improve pdf-compressor with genuine compression (show before/after sizes, report when no reduction)
- Add: pdf-page-extractor, pdf-page-deleter, pdf-page-reorder, pdf-metadata-viewer (already exists), pdf-page-counter (already exists), pdf-password-status-checker, pdf-preview

### 2. OCR Studio
- Use Tesseract.js for OCR
- Image to Text OCR
- PDF OCR (render PDF pages, run Tesseract)
- Scanned Document OCR
- Screenshot to Text
- Multi-page OCR
- Language selection (Bangla + English only if language data available)
- Page selection for PDF OCR
- OCR progress
- Editable extracted text
- Copy and TXT download
- Handle low-quality images gracefully

### 3. Document Conversion
- PDF to TXT (using pdf-lib + text extraction)
- TXT to PDF
- DOCX to TXT (basic - text extraction only)
- TXT to DOCX (basic)
- Markdown to PDF
- Image to PDF (already have pdf-to-image, add image-to-pdf)

### 4. AI Document Tools
- Document Summarizer (uses AI if API key available)
- Key Points Extractor
- Question Answering from Document
- Document Translator
- Action Items Extractor
- Document Rewriter
- Architecture: API key server-side via env vars, rate limiting, input validation
- If AI_API_KEY missing: show clear configuration message
- Never show fabricated AI output

### 5. Reusable Document Components
- DocumentDropzone
- DocumentPreview
- PDFPageViewer
- PDFPageSelector
- OCRLanguageSelector
- ProcessingProgress
- DocumentExportPanel
- BeforeAfterFileSize

### 6. Privacy + Performance
- Browser-side document processing preferred
- No upload without user consent
- Clean up object URLs
- Handle large files gracefully
- Clear privacy notices

### 7. SEO
- Unique titles/descriptions
- Canonical URLs
- Open Graph metadata
- Breadcrumbs
- SoftwareApplication structured data
- Internal links

### 8. Quality Checks
- TypeScript checks
- Existing unit tests
- PDF/OCR/conversion tests
- ESLint on changed files
- Cloudflare build
- Wrangler dry-run

### 9. Reports
- `PHASE_9_AI_DOCUMENT_STUDIO_REPORT.md`

### 10. Safety
- No commits/pushes/deploys

Now let me implement the document studio landing page and tools.