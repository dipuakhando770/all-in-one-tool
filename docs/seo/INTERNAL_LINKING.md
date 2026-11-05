# Internal Linking Architecture & Cluster Strategy

**Domain:** `tools.nasirdigitalhub.com`

---

## 1. Hub & Spoke Cluster Modeling

### A. Developer Tools Cluster
- **Hub:** `/en/categories/developer`
- **Spokes:**
  - `online-code-editor` <---> `json-formatter`
  - `json-formatter` <---> `base64-encode-decode`
  - `base64-encode-decode` <---> `url-encode-decode`
  - `regex-tester` <---> `online-code-editor`

### B. Media & Image Studio Cluster
- **Hub:** `/en/categories/image`
- **Spokes:**
  - `image-compressor` <---> `image-format-converter`
  - `image-format-converter` <---> `background-remover`
  - `background-remover` <---> `image-cropper`

### C. PDF & Document Cluster
- **Hub:** `/en/categories/pdf`
- **Spokes:**
  - `pdf-merger` <---> `pdf-splitter`
  - `pdf-splitter` <---> `pdf-to-image`
  - `pdf-to-image` <---> `pdf-page-organizer`

---

## 2. Anchor Text Rules
1. Never use generic anchors like "click here" or "learn more".
2. Use contextual, descriptive action phrases: "Compress PNG images", "Format JSON payload", "Run HTML code live".
3. Provide related tools at the bottom of every tool runner view.
