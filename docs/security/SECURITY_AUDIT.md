# NASIR TOOLS — Security & Privacy Architecture Audit

**Target Architecture:** Next.js 16 + Cloudflare OpenNext Edge Deployment  
**Auditor:** Autonomous Cybersecurity & Security Engineer

---

## 1. Attack Surface Assessment

### A. Cross-Site Scripting (XSS) & Code Execution Isolation
- **Code Editor Sandbox (`/tools/online-code-editor`):** User-authored HTML/JS runs inside an isolated `<iframe>` with strict sandbox attributes:
  ```html
  sandbox="allow-scripts allow-modals"
  ```
  Notably, `allow-same-origin` is **omitted**, preventing user scripts from accessing host session cookies, local storage of `nasirdigitalhub.com`, or executing cross-origin API calls.
- **Client-Side Processing (Zero Data Leak):** File manipulations (PDF merging, image compression, format conversion) are executed entirely in-browser memory using Blob URLs. User documents never touch the server filesystem.

### B. Input Validation & Schema Enforcement
- All form inputs, user profile endpoints, and admin mutations are validated using strict Zod schemas (`zod`).
- Malformed payloads, SQL injection tokens, or path-traversal strings are rejected at the boundary prior to execution.

### C. Authentication & Authorization Security
- Admin routes (`/admin/*` and `/api/admin/*`) require valid JWT session tokens encrypted with `jose` using HS256 algorithm.
- Password hashing is enforced via `bcryptjs` with salt rounds >= 10.
- RBAC validation ensures regular authenticated users cannot mutate redirects, tools, or SEO configurations.

---

## 2. Privacy Policy Compliance
- Zero logging of uploaded file contents.
- No analytics trackers tracking personally identifiable information (PII).
- Local storage used strictly for client preference persistence (theme, language, draft code).
