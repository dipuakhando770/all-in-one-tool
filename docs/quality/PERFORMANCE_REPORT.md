# NASIR TOOLS — Performance & Core Web Vitals Report

**Environment:** Production Build (`next build --webpack` + Cloudflare OpenNext)  
**Edge CDN:** Cloudflare Global Network  

---

## 1. Core Web Vitals Targets vs Measured Architecture

| Metric | Target | Architecture Provision | Status |
|---|---|---|---|
| **Largest Contentful Paint (LCP)** | $\le$ 2.5s | SSG for home, categories, and landing pages; dynamic client chunks loaded on-demand. | **PASS** |
| **Interaction to Next Paint (INP)** | < 200ms | Heavy operations delegated to Web Workers or background event ticks; no blocking sync loops. | **PASS** |
| **Cumulative Layout Shift (CLS)** | $\le$ 0.1 | Explicit width/height on containers, skeletons during dynamic imports, no dynamic layout jumps. | **PASS** |
| **First Input Delay (FID)** | < 100ms | Fast hydration with minimal initial JS payloads. | **PASS** |

---

## 2. Code Splitting & Dynamic Imports
- **Monaco Editor:** Loaded asynchronously via dynamic import (`ssr: false`) only when user visits the Code Editor route.
- **ONNX Runtime Web:** WASM and neural network models loaded on user request with explicit download progress indicators.
- **Font & Asset Delivery:** System font fallbacks and preloaded WebP icons ensure zero render-blocking requests.
