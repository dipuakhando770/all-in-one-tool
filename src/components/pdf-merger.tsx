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

type PdfFile = { id: string; file: File; pages: number };

export function PdfMerger() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleFiles = async (incoming: File[]) => {
    const pdfFiles: PdfFile[] = [];
    for (const f of incoming) {
      try {
        const pdf = await PDFDocument.load(await fileToBytes(f));
        pdfFiles.push({ id: `${f.name}-${f.size}-${Math.random()}`, file: f, pages: pdf.getPageCount() });
      } catch {
        // skip invalid
      }
    }
    setFiles((prev) => [...prev, ...pdfFiles]);
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    setFiles((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  };

  const moveDown = (idx: number) => {
    setFiles((prev) => {
      if (idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  };

  const remove = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));
  const clear = () => { setFiles([]); setResult(null); };

  const merge = async () => {
    if (!files.length) return;
    setProcessing(true);
    setResult(null);
    try {
      const out = await PDFDocument.create();
      for (const pf of files) {
        const src = await PDFDocument.load(await fileToBytes(pf.file));
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((p) => out.addPage(p));
      }
      const bytes = await out.save();
      setResult(await pdfToDataUrl(bytes));
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <BatchFileUpload accept="application/pdf" multiple files={files.map((f) => f.file)} onChange={handleFiles} />
      {files.length > 0 && (
        <>
          <div className="space-y-2">
            {files.map((pf, idx) => (
              <div key={pf.id} className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{pf.file.name}</div>
                  <div className="text-xs text-[var(--foreground)]/60">{(pf.file.size / 1024).toFixed(1)} KB · {pf.pages} pages</div>
                </div>
                <button onClick={() => moveUp(idx)} className="rounded border px-2 py-1 text-xs" disabled={idx === 0}>↑</button>
                <button onClick={() => moveDown(idx)} className="rounded border px-2 py-1 text-xs" disabled={idx === files.length - 1}>↓</button>
                <button onClick={() => remove(idx)} className="rounded border px-2 py-1 text-xs text-red-500">Remove</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={merge} disabled={processing} className="rounded-lg bg-[var(--accent)] px-4 py-2 text-white disabled:opacity-50">{processing ? "Merging..." : "Merge PDFs"}</button>
            <button onClick={clear} className="rounded-lg border px-4 py-2">Clear All</button>
          </div>
          {result && (
            <a href={result} download="merged.pdf" className="inline-block rounded-lg bg-[var(--accent)] px-4 py-2 text-white">Download Merged PDF</a>
          )}
        </>
      )}
    </div>
  );
}
