# Tool Regression & Boundary Test Report

**Platform:** NASIR TOOLS (`https://tools.nasirdigitalhub.com`)  
**Scope:** Automated & Manual Regression Verification  
**Auditor:** QA Engineering Team

---

## 1. Regression Test Vectors

### A. SSR Hydration & Browser Global Guards
- **Hazard:** Accessing `localStorage`, `window.navigator`, or `document` during server-side prerender throws `ReferenceError: window is not defined` under Next.js 16 App Router.
- **Verification:** Audited all client components (`code-editor-ui.tsx`, `image-studio.tsx`, `pdf-page-selector.tsx`, `tool-runner.tsx`). All calls are safely placed inside `useEffect` or behind `typeof window !== 'undefined'` checks.
- **Result:** **PASS (0 Hydration Errors)**

### B. Memory Management & Blob URL Cleanup
- **Hazard:** Creating unbounded `URL.createObjectURL()` on batch image/PDF conversions without `URL.revokeObjectURL()` causes memory leaks on mobile devices.
- **Verification:** Audited blob URL lifecycle in image and PDF utility hooks. Revocation callbacks attached on component unmount and new file ingest.
- **Result:** **PASS (No Memory Leak)**

### C. File Ingestion & Security Boundary Handling
- **Test:** Uploading corrupt PNG/JPEG headers or malformed PDF payloads.
- **Observed Behavior:** Caught via try-catch boundaries, displays non-crashing localized user alerts ("Invalid file structure", "অকার্যকর ফাইল ফরম্যাট").
- **Result:** **PASS (Safe Error Handling)**
