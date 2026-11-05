# NASIR TOOLS — UI/UX Design System Audit

**Design Direction:** Clean, modern developer-first SaaS aesthetic inspired by Linear, Vercel, and Stripe, tailored specifically for NASIR TOOLS.

---

## 1. Design Token Architecture & Consistency

- **Color Tokens:**
  - `var(--background)`: Deep dark slate / Crisp white in light mode.
  - `var(--surface)` & `var(--surface-2)`: Subtle layered cards with precise borders (`var(--border)`).
  - `var(--primary)`: Vibrant, high-contrast brand accent.
  - `var(--muted-foreground)`: High legibility secondary text passing contrast guidelines.
- **Typography:**
  - Clear sans-serif font family hierarchy with tight headings (`tracking-tight`) and comfortable reading line heights (`leading-relaxed`).
  - Monospace font family for code blocks, inputs, and hashes.
- **Radii & Elevation:**
  - Modern rounded cards (`rounded-xl` and `rounded-2xl`).
  - Subtle borders instead of heavy box-shadows for a contemporary flat-depth appearance.

---

## 2. Interactive States & Feedback Loops
- **Button Interactions:** Tactile feedback on active click (`active:scale-95`), smooth transition transitions (`transition-all duration-150`).
- **Loading Indicators:** Tailored spinner states and progress indicators during asynchronous file transformations.
- **Empty States:** Meaningful empty state illustrations and clear actionable instructions when inputs are clear.
- **Toast Notifications:** Non-intrusive bottom/top toasts for copy confirmation, error alerts, and download completion.
