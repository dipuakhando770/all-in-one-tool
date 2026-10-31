"use client";
import { useState } from "react";
import { BatchFileUpload } from "@/components/batch-file-upload";
import { ProcessingQueue, type QueueItem } from "@/components/processing-queue";
import { createZip } from "@/lib/zip";

type Mode = "compress" | "convert";

async function fileToImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = reject;
    img.src = url;
  });
}

async function canvasToDataURL(canvas: HTMLCanvasElement, mime: string, quality = 0.8): Promise<string> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return resolve("");
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.readAsDataURL(blob);
    }, mime, quality);
  });
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function BatchImageProcessor({ mode }: { mode: Mode }) {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(0.7);
  const [format, setFormat] = useState("image/jpeg");
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [results, setResults] = useState<{ id: string; name: string; url: string; originalSize: number; outputSize: number }[]>([]);
  const [processing, setProcessing] = useState(false);

  const processOne = async (file: File, id: string) => {
    setQueue((q) => q.map((x) => (x.id === id ? { ...x, status: "processing" } : x)));
    try {
      const img = await fileToImage(file);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const mime = mode === "compress" ? (file.type || "image/jpeg") : format;
      const q = mode === "compress" ? quality : 0.9;
      const dataUrl = await canvasToDataURL(canvas, mime, q);
      const bytes = dataUrlToBytes(dataUrl);
      const ext = mime.split("/")[1];
      const baseName = file.name.replace(/\.[^.]+$/, "");
      const outName = mode === "compress" ? `compressed-${file.name}` : `${baseName}.${ext}`;
      setResults((r) => [...r, { id, name: outName, url: dataUrl, originalSize: file.size, outputSize: bytes.length }]);
      setQueue((q) => q.map((x) => (x.id === id ? { ...x, status: "completed" } : x)));
    } catch (e) {
      setQueue((q) => q.map((x) => (x.id === id ? { ...x, status: "failed", error: (e as Error).message } : x)));
    }
  };

  const processAll = async () => {
    if (!files.length) return;
    setProcessing(true);
    setResults([]);
    const items: QueueItem[] = files.map((f, i) => ({ id: `f-${i}-${f.name}`, name: f.name, size: f.size, status: "waiting" }));
    setQueue(items);
    for (const item of items) {
      const file = files.find((f) => f.name === item.name && f.size === item.size);
      if (file) await processOne(file, item.id);
    }
    setProcessing(false);
  };

  const retry = async (id: string) => {
    const item = queue.find((q) => q.id === id);
    if (!item) return;
    const file = files.find((f) => f.name === item.name && f.size === item.size);
    if (file) {
      setResults((r) => r.filter((x) => x.id !== id));
      setQueue((q) => q.map((x) => (x.id === id ? { ...x, status: "waiting", error: undefined } : x)));
      await processOne(file, id);
    }
  };

  const retryAllFailed = async () => {
    const failed = queue.filter((q) => q.status === "failed");
    for (const item of failed) {
      const file = files.find((f) => f.name === item.name && f.size === item.size);
      if (file) {
        setResults((r) => r.filter((x) => x.id !== item.id));
        setQueue((q) => q.map((x) => (x.id === item.id ? { ...x, status: "waiting", error: undefined } : x)));
        await processOne(file, item.id);
      }
    }
  };

  const downloadZip = async () => {
    const zipFiles = results.map((r) => ({ name: r.name, data: dataUrlToBytes(r.url) }));
    const url = await createZip(zipFiles);
    const a = document.createElement("a");
    a.href = url;
    a.download = mode === "compress" ? "compressed.zip" : "converted.zip";
    a.click();
  };

  const totalOriginal = results.reduce((s, r) => s + r.originalSize, 0);
  const totalOutput = results.reduce((s, r) => s + r.outputSize, 0);

  return (
    <div className="space-y-4">
      <BatchFileUpload accept="image/*" multiple files={files} onChange={setFiles} />
      {mode === "compress" && (
        <div className="flex gap-4">
          <label className="text-sm">Quality: <input type="range" min={0.1} max={1} step={0.1} value={quality} onChange={(e) => setQuality(Number(e.target.value))} /></label>
        </div>
      )}
      {mode === "convert" && (
        <div>
          <label className="text-sm">Format:
            <select value={format} onChange={(e) => setFormat(e.target.value)} className="ml-2 rounded border p-1">
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPG</option>
              <option value="image/webp">WebP</option>
            </select>
          </label>
        </div>
      )}
      <div className="flex gap-2">
        <button onClick={processAll} disabled={processing || !files.length} className="rounded-lg bg-[var(--accent)] px-4 py-2 text-white disabled:opacity-50">{processing ? "Processing..." : "Process"}</button>
        <button onClick={retryAllFailed} disabled={processing} className="rounded-lg border px-4 py-2">Retry Failed</button>
        <button onClick={() => { setFiles([]); setQueue([]); setResults([]); }} className="rounded-lg border px-4 py-2">Clear All</button>
      </div>
      {queue.length > 0 && <ProcessingQueue items={queue} />}
      {results.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm">Original: {(totalOriginal / 1024).toFixed(1)}KB → Output: {(totalOutput / 1024).toFixed(1)}KB (saved {totalOriginal ? ((1 - totalOutput / totalOriginal) * 100).toFixed(1) : 0}%)</div>
          <div className="flex gap-2">
            <button onClick={downloadZip} className="rounded-lg bg-[var(--accent)] px-4 py-2 text-white">Download All (ZIP)</button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {results.map((r) => (
              <div key={r.id} className="flex items-center gap-2 rounded-lg border p-2 text-sm">
                <img src={r.url} alt={r.name} className="h-10 w-10 rounded object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate">{r.name}</div>
                  <div className="text-xs">{(r.originalSize / 1024).toFixed(1)}KB → {(r.outputSize / 1024).toFixed(1)}KB</div>
                </div>
                <button onClick={() => { const a = document.createElement("a"); a.href = r.url; a.download = r.name; a.click(); }} className="rounded border px-2 py-1 text-xs">Download</button>
                <button onClick={() => retry(r.id)} className="rounded border px-2 py-1 text-xs">Retry</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
