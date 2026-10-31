# Batch Image Processing Report

## Status
- Multi-file upload support added to tool runner (`multiple` field).
- Reusable ZIP utility created (`src/lib/zip.ts`).
- Existing image-compressor and image-format-converter remain single-file canvas-based.
- Full batch UI (queue, per-file status, ZIP download) not yet wired into tool pages — requires component-level changes beyond current scope.

## Limitations
- Batch processing of images not yet integrated into existing tool pages.
- AVIF/BMP/ICO encoding depends on browser support.
