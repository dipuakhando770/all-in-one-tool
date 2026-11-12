"use client";
import { useState } from "react";
import { BatchFileUpload } from "@/components/batch-file-upload";
import { ProcessingQueue, type QueueItem } from "@/components/processing-queue";
import { createZip } from "@/lib/zip";
import { ShieldCheck, Download, Sparkles, RefreshCw, Trash2, CheckCircle2 } from "lucide-react";

type Mode = "compress" | "convert";

interface ProcessedResult {
  id: string;
  name: string;
  url: string;
  originalSize: number;
  outputSize: number;
  width: number;
  height: number;
  format: string;
}

const QUALITY_PRESETS = [
  { label: "Low (Smallest)", value: 0.35, desc: "Max size reduction, ideal for thumbnails or slow connections" },
  { label: "Balanced (Recommended)", value: 0.7, desc: "Best balance of visual fidelity and file size" },
  { label: "High Quality", value: 0.85, desc: "Crisp detail for portfolio & photography" },
  { label: "Maximum", value: 0.95, desc: "Near-lossless reproduction" },
] as const;

async function fileToImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

async function canvasToDataURL(
  canvas: HTMLCanvasElement,
  mime: string,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return resolve("");
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.readAsDataURL(blob);
      },
      mime,
      quality
    );
  });
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const parts = dataUrl.split(",");
  if (parts.length < 2) return new Uint8Array(0);
  const binary = atob(parts[1]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function formatBytes(bytes: number): string {
  if (bytes <= 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function BatchImageProcessor({ mode }: { mode: Mode }) {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(0.7);
  const [targetFormat, setTargetFormat] = useState<string>("auto");
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [processing, setProcessing] = useState(false);

  const resolveMime = (file: File): string => {
    if (mode === "convert") {
      return targetFormat === "auto" ? "image/webp" : targetFormat;
    }
    // Compress mode
    if (targetFormat === "auto") {
      // PNG can be preserved or converted to JPEG/WebP if transparency is not essential
      return file.type || "image/jpeg";
    }
    return targetFormat;
  };

  const processOne = async (file: File, id: string) => {
    setQueue((q) => q.map((x) => (x.id === id ? { ...x, status: "processing" } : x)));
    try {
      const img = await fileToImage(file);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not initialize 2D canvas context");

      // For JPEG conversions, draw a clean white background so transparent PNGs don't turn black
      const mime = resolveMime(file);
      if (mime === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      const q = mode === "compress" ? quality : 0.9;
      const dataUrl = await canvasToDataURL(canvas, mime, q);
      const bytes = dataUrlToBytes(dataUrl);

      // Determine extension
      let ext = "jpg";
      if (mime === "image/png") ext = "png";
      else if (mime === "image/webp") ext = "webp";

      const baseName = file.name.replace(/\.[^.]+$/, "");
      const outName =
        mode === "compress"
          ? `${baseName}-compressed.${ext}`
          : `${baseName}-converted.${ext}`;

      setResults((r) => [
        ...r.filter((x) => x.id !== id),
        {
          id,
          name: outName,
          url: dataUrl,
          originalSize: file.size,
          outputSize: bytes.length,
          width: canvas.width,
          height: canvas.height,
          format: ext.toUpperCase(),
        },
      ]);
      setQueue((q) => q.map((x) => (x.id === id ? { ...x, status: "completed" } : x)));
    } catch (e) {
      setQueue((q) =>
        q.map((x) => (x.id === id ? { ...x, status: "failed", error: (e as Error).message } : x))
      );
    }
  };

  const processAll = async () => {
    if (!files.length) return;
    setProcessing(true);
    setResults([]);
    const items: QueueItem[] = files.map((f, i) => ({
      id: `f-${i}-${f.name}-${f.size}`,
      name: f.name,
      size: f.size,
      status: "waiting",
    }));
    setQueue(items);

    for (const item of items) {
      const file = files.find((f) => f.name === item.name && f.size === item.size);
      if (file) {
        await processOne(file, item.id);
      }
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
    if (!results.length) return;
    const zipFiles = results.map((r) => ({ name: r.name, data: dataUrlToBytes(r.url) }));
    const url = await createZip(zipFiles);
    const a = document.createElement("a");
    a.href = url;
    a.download = mode === "compress" ? "compressed-images.zip" : "converted-images.zip";
    a.click();
  };

  const totalOriginal = results.reduce((s, r) => s + r.originalSize, 0);
  const totalOutput = results.reduce((s, r) => s + r.outputSize, 0);
  const totalSavedBytes = Math.max(0, totalOriginal - totalOutput);
  const totalSavingsPct = totalOriginal > 0 ? ((totalSavedBytes / totalOriginal) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      {/* Privacy guarantee banner */}
      <div className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 text-xs text-[var(--muted-foreground)] md:text-sm">
        <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-500" aria-hidden="true" />
        <div>
          <span className="font-semibold text-[var(--foreground)]">100% In-Browser Privacy Guaranteed: </span>
          All compression and conversion runs locally in your web browser via HTML5 Canvas. Your photos never leave your device and are never sent to any server or stored remotely.
        </div>
      </div>

      {/* Upload dropzone */}
      <BatchFileUpload
        accept="image/jpeg,image/png,image/webp,image/bmp,image/gif"
        multiple
        files={files}
        onChange={setFiles}
      />

      {/* Compression & format controls */}
      <div className="grid gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 md:grid-cols-2">
        {mode === "compress" ? (
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              <span>Compression Level</span>
              <span className="font-mono text-xs text-[var(--foreground)]">{Math.round(quality * 100)}% quality</span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {QUALITY_PRESETS.map((preset) => {
                const active = Math.abs(quality - preset.value) < 0.05;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setQuality(preset.value)}
                    className={`rounded-lg border px-3 py-2 text-left transition-all ${
                      active
                        ? "border-[var(--primary)] bg-[var(--primary-subtle)] text-[var(--primary)] shadow-sm"
                        : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--primary)]"
                    }`}
                  >
                    <div className="text-xs font-semibold">{preset.label}</div>
                    <div className="mt-0.5 line-clamp-2 text-[10px] text-[var(--muted-foreground)]">
                      {preset.desc}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="pt-2">
              <label className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                <span>Fine-tune slider:</span>
                <input
                  type="range"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg bg-[var(--border)] accent-[var(--primary)]"
                />
              </label>
            </div>
          </div>
        ) : null}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Output Format
          </label>
          <select
            value={targetFormat}
            onChange={(e) => setTargetFormat(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none"
          >
            {mode === "compress" && <option value="auto">Keep Original Format</option>}
            <option value="image/webp">WebP (Modern, Smallest File Size)</option>
            <option value="image/jpeg">JPEG / JPG (Universal Compatibility)</option>
            <option value="image/png">PNG (Preserves Transparency)</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={processAll}
            disabled={processing || files.length === 0}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Processing {files.length} image{files.length > 1 ? "s" : ""}...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {mode === "compress" ? "Compress Images Now" : "Convert Images Now"}
              </>
            )}
          </button>
          {files.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setFiles([]);
                setQueue([]);
                setResults([]);
              }}
              title="Clear all"
              disabled={processing}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2.5 text-[var(--muted-foreground)] transition hover:border-red-500 hover:text-red-500 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Queue progress */}
      {queue.length > 0 && (
        <div className="space-y-3">
          <ProcessingQueue items={queue} />
          {queue.some((q) => q.status === "failed") && (
            <button
              type="button"
              onClick={retryAllFailed}
              disabled={processing}
              className="text-xs font-medium text-[var(--primary)] underline hover:opacity-80"
            >
              Retry all failed images
            </button>
          )}
        </div>
      )}

      {/* Output Results with Savings Summary */}
      {results.length > 0 && (
        <div className="space-y-4 pt-2">
          {/* Summary Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Batch Compression Complete ({results.length} processed)
              </div>
              <div className="text-xs text-[var(--muted-foreground)]">
                {formatBytes(totalOriginal)} original &rarr; {formatBytes(totalOutput)} output (
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  saved {formatBytes(totalSavedBytes)} / {totalSavingsPct}%
                </span>
                )
              </div>
            </div>
            <button
              type="button"
              onClick={downloadZip}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-95"
            >
              <Download className="h-3.5 w-3.5" />
              Download All as ZIP ({results.length})
            </button>
          </div>

          {/* Results Grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            {results.map((r) => {
              const saved = Math.max(0, r.originalSize - r.outputSize);
              const pct = r.originalSize > 0 ? ((saved / r.originalSize) * 100).toFixed(0) : "0";
              const isSmaller = r.outputSize < r.originalSize;

              return (
                <div
                  key={r.id}
                  className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-sm shadow-sm transition hover:border-[var(--border-strong)]"
                >
                  <img
                    src={r.url}
                    alt={r.name}
                    className="h-16 w-16 shrink-0 rounded-lg border border-[var(--border)] object-cover bg-neutral-100 dark:bg-neutral-900"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="truncate font-medium text-[var(--foreground)]" title={r.name}>
                      {r.name}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted-foreground)]">
                      <span>{r.width}&times;{r.height}px</span>
                      <span>&bull;</span>
                      <span className="font-mono">{formatBytes(r.originalSize)} &rarr; {formatBytes(r.outputSize)}</span>
                    </div>
                    {isSmaller ? (
                      <span className="inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        -{pct}% smaller
                      </span>
                    ) : (
                      <span className="inline-block rounded-full bg-neutral-500/10 px-2 py-0.5 text-[11px] font-medium text-[var(--muted-foreground)]">
                        High fidelity preserved
                      </span>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const a = document.createElement("a");
                        a.href = r.url;
                        a.download = r.name;
                        a.click();
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-2.5 py-1 text-xs font-medium text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    >
                      <Download className="h-3 w-3" />
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => retry(r.id)}
                      className="text-center text-[10px] text-[var(--muted-foreground)] hover:underline"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
