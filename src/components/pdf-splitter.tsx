"use client";
import { useState } from "react";
import { BatchFileUpload } from "@/components/batch-file-upload";
import { PDFDocument } from "pdf-lib";

async function fileToBytes(file: File): Promise<Uint8Array> {
  return new Uint8Array(await file.arrayBuffer());
}

async function pdfToDataUrl(bytes: Uint8Array): Promise<string> {
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
  return new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.readAsDataURL(blob);
  });
}

type Extracted = { name: string; url: string };

export function PdfSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [range, setRange] = useState("all");
  const [processing, setProcessing] = useState(false);
  const [extracted, setExtracted] = useState<Extracted[]>([]);
  const [error, setError] = useState("");

  const loadPdf = async (f: File) => {
    setFile(f);
    setExtracted([]);
    setError("");
    try {
      const pdf = await PDFDocument.load(await fileToBytes(f));
      setPageCount(pdf.getPageCount());
    } catch (e) {
      setError((e as Error).message);
      setPageCount(0);
    }
  };

  const parseRange = (): number[] => {
    const spec = range.trim().toLowerCase();
    if (spec === "all" || spec === "") return Array.from({ length: pageCount }, (_, i) => i + 1);
    if (spec.includes("-")) {
      const [a, b] = spec.split("-").map((x) => Number(x));
      const s = Math.max(1, a || 1);
      const e = Math.min(pageCount, b || pageCount);
      return Array.from({ length: Math.max(0, e - s + 1) }, (_, i) => s + i);
    }
    return spec.split(",").map((x) => Number(x.trim())).filter((n) => n >= 1 && n <= pageCount);
  };

  const split = async () => {
    if (!file || !pageCount) return;
    const pages = parseRange();
    if (!pages.length) { setError("No valid pages"); return; }
    setProcessing(true);
    setError("");
    setExtracted([]);
    try {
      const src = await PDFDocument.load(await fileToBytes(file));
      const results: Extracted[] = [];
      for (const n of pages) {
        const out = await PDFDocument.create();
        const [p] = await out.copyPages(src, [n - 1]);
        out.addPage(p);
        const bytes = await out.save();
        results.push({ name: `page-${n}.pdf`, url: await pdfToDataUrl(bytes) });
      }
      setExtracted(results);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  const downloadZip = async () => {
    const { createZip } = await import("@/lib/zip");
    const outputs = extracted.map((e) => {
      const base64 = e.url.split(",")[1];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return { name: e.name, data: bytes };
    });
    const url = await createZip(outputs);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pages.zip";
    a.click();
  };

  return (
    <div className="space-y-4">
      <BatchFileUpload accept="application/pdf" multiple={false} files={file ? [file] : []} onChange={(fs) => fs[0] && loadPdf(fs[0])} />
      {pageCount > 0 && (
        <>
          <div className="text-sm">Total pages: {pageCount}</div>
          <div className="flex gap-2 items-center">
            <input type="text" value={range} onChange={(e) => setRange(e.target.value)} placeholder="all or 1-3" className="rounded border p-1 text-sm" />
            <button onClick={split} disabled={processing} className="rounded-lg bg-[var(--accent)] px-4 py-2 text-white disabled:opacity-50">{processing ? "Splitting..." : "Split"}</button>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {extracted.length > 0 && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <button onClick={downloadZip} className="rounded-lg bg-[var(--accent)] px-4 py-2 text-white">Download All (ZIP)</button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {extracted.map((e) => (
                  <div key={e.name} className="flex items-center gap-2 rounded-lg border p-2 text-sm">
                    <span className="truncate flex-1">{e.name}</span>
                    <a href={e.url} download={e.name} className="rounded border px-2 py-1 text-xs">Download</a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
