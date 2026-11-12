/**
 * Shared PDF.js loader.
 *
 * The worker is served from /public so it works under the production CSP
 * (`script-src 'self'`), which blocks the previous cdnjs worker URL.
 * Keep public/pdf.worker.min.mjs in sync with the installed pdfjs-dist
 * version (see docs/AUTONOMOUS_EXECUTION_PROGRESS.md).
 */
export async function getPdfjs() {
  const mod = await import("pdfjs-dist");
  if (typeof window !== "undefined" && !mod.GlobalWorkerOptions.workerSrc) {
    mod.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  }
  return mod;
}
