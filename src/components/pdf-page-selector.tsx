"use client";
import { useState } from "react";
import { BatchFileUpload } from "@/components/batch-file-upload";
// pdfjs loaded dynamically

async function getPdfjs() {
  const mod = await import("pdfjs-dist");
  if (typeof window !== "undefined") {
    mod.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${mod.version}/pdf.worker.min.mjs`;
  }
  return mod;
}

export function PdfPageSelector() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [scale, setScale] = useState(1.5);
  const [pagesSpec, setPagesSpec] = useState("all");
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [thumbBatch, setThumbBatch] = useState(12);

  const loadMoreThumbs = async () => {
    if (!file) return;
    const buf = await file.arrayBuffer();
    const pdfjsLib = await getPdfjs();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    const start = thumbnails.length + 1;
    const end = Math.min(pdf.numPages, start + 11);
    const newThumbs = [...thumbnails];
    for (let i = start; i <= end; i++) {
      const page = await pdf.getPage(i);
      const vp = page.getViewport({ scale: 0.4 });
      const canvas = document.createElement("canvas");
      canvas.width = vp.width;
      canvas.height = vp.height;
      const ctx = canvas.getContext("2d")!;
      await page.render({ canvasContext: ctx, viewport: vp, canvas }).promise;
      newThumbs.push(canvas.toDataURL("image/png"));
    }
    setThumbnails(newThumbs);
    setThumbBatch(end);
  };
  const [result, setResult] = useState<string | null>(null);
  const [resultName, setResultName] = useState("");

  const loadPdf = async (f: File) => {
    setFile(f);
    setResult(null);
    setThumbnails([]);
    setSelected(new Set());
    const buf = await f.arrayBuffer();
    const pdfjsLib = await getPdfjs();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    setPageCount(pdf.numPages);
    const thumbs: string[] = [];
    const limit = Math.min(pdf.numPages, 12);
    for (let i = 1; i <= limit; i++) {
      const page = await pdf.getPage(i);
      const vp = page.getViewport({ scale: 0.4 });
      const canvas = document.createElement("canvas");
      canvas.width = vp.width;
      canvas.height = vp.height;
      const ctx = canvas.getContext("2d")!;
      await page.render({ canvasContext: ctx, viewport: vp, canvas }).promise;
      thumbs.push(canvas.toDataURL("image/png"));
    }
    setThumbnails(thumbs);
  };

  const togglePage = (n: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n); else next.add(n);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(Array.from({ length: pageCount }, (_, i) => i + 1)));
  const deselectAll = () => setSelected(new Set());

  const parsePages = (): number[] => {
    const spec = pagesSpec.trim().toLowerCase();
    if (spec === "all" || spec === "") return Array.from({ length: pageCount }, (_, i) => i + 1);
    if (spec.includes("-")) {
      const [a, b] = spec.split("-").map((x) => Number(x));
      const s = Math.max(1, a || 1);
      const e = Math.min(pageCount, b || pageCount);
      return Array.from({ length: e - s + 1 }, (_, i) => s + i);
    }
    return spec.split(",").map((x) => Number(x.trim())).filter((n) => n >= 1 && n <= pageCount);
  };

  const effectivePages = selected.size > 0 ? Array.from(selected).sort((a, b) => a - b) : parsePages();

  return (
    <div className="space-y-4">
      <BatchFileUpload accept="application/pdf" multiple={false} files={file ? [file] : []} onChange={(fs) => fs[0] && loadPdf(fs[0])} />
      {pageCount > 0 && (
        <>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm">Pages: {pageCount} | Selected: {effectivePages.length}</span>
            <button onClick={selectAll} className="rounded border px-2 py-1 text-xs">Select All</button>
            <button onClick={deselectAll} className="rounded border px-2 py-1 text-xs">Deselect All</button>
            <label className="text-sm">Scale: <input type="number" min={1} max={4} step={0.5} value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-16 rounded border p-1" /></label>
            <input type="text" value={pagesSpec} onChange={(e) => setPagesSpec(e.target.value)} placeholder="all or 1-3" className="rounded border p-1 text-sm" />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {Array.from({ length: thumbnails.length }, (_, i) => i + 1).map((n) => (
              <div key={n} onClick={() => togglePage(n)} className={`cursor-pointer rounded border p-1 ${selected.has(n) ? "border-[var(--accent)]" : "border-[var(--border)]"}`}>
                <img src={thumbnails[n - 1]} alt={`Page ${n}`} className="w-full" />
                <div className="text-center text-xs">Page {n}</div>
              </div>
            ))}
          </div>
          {pageCount > thumbnails.length && (
            <button onClick={loadMoreThumbs} className="rounded border px-2 py-1 text-xs">Load more pages</button>
          )}
          <button onClick={async () => {
            if (!file || !effectivePages.length) return;
            setLoading(true);
            try {
              const buf = await file.arrayBuffer();
              const pdfjsLib = await getPdfjs();
              const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
              if (effectivePages.length === 1) {
                const page = await pdf.getPage(effectivePages[0]);
                const vp = page.getViewport({ scale });
                const canvas = document.createElement("canvas");
                canvas.width = vp.width;
                canvas.height = vp.height;
                const ctx = canvas.getContext("2d")!;
                await page.render({ canvasContext: ctx, viewport: vp, canvas }).promise;
                setResult(canvas.toDataURL("image/png"));
                setResultName(`page-${effectivePages[0]}.png`);
              } else {
                const { createZip } = await import("@/lib/zip");
                const outputs: { name: string; data: Uint8Array }[] = [];
                for (const n of effectivePages) {
                  const page = await pdf.getPage(n);
                  const vp = page.getViewport({ scale });
                  const canvas = document.createElement("canvas");
                  canvas.width = vp.width;
                  canvas.height = vp.height;
                  const ctx = canvas.getContext("2d")!;
                  await page.render({ canvasContext: ctx, viewport: vp, canvas }).promise;
                  const dataUrl = canvas.toDataURL("image/png");
                  const base64 = dataUrl.split(",")[1];
                  const binary = atob(base64);
                  const bytes = new Uint8Array(binary.length);
                  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
                  outputs.push({ name: `page-${n}.png`, data: bytes });
                }
                const url = await createZip(outputs.map((o) => ({ name: o.name, data: o.data })));
                setResult(url);
                setResultName("pages.zip");
              }
            } catch (e) {
              alert((e as Error).message);
            } finally {
              setLoading(false);
            }
          }} disabled={loading} className="rounded-lg bg-[var(--accent)] px-4 py-2 text-white disabled:opacity-50">
            {loading ? "Exporting..." : `Export ${effectivePages.length} page(s)`}
          </button>
          {result && (
            <div className="mt-2">
              {resultName.endsWith(".zip") ? (
                <a href={result} download={resultName} className="text-[var(--accent)] underline">Download {resultName}</a>
              ) : (
                <img src={result} alt="result" className="max-h-60 rounded" />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
