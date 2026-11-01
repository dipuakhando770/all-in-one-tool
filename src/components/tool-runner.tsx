"use client";
import { useState, useRef } from "react";
import { BatchFileUpload } from "@/components/batch-file-upload";
import { ProcessingQueue, type QueueItem, type QueueStatus } from "@/components/processing-queue";
import { getToolBySlug } from "@/tools/registry";
import type { Locale } from "@/lib/i18n";
import { Play, RotateCcw, Copy, Download, Check, AlertCircle, Loader2 } from "lucide-react";

export function ToolRunner({
  slug,
  locale,
  dict,
}: {
  slug: string;
  locale: Locale;
  dict: any;
}) {
  const tool = getToolBySlug(slug)!;
  const [values, setValues] = useState<Record<string, any>>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const run = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    // Build queue for batch file fields
    const fileFields = tool.inputSchema.filter((f) => f.type === "file");
    const qItems: QueueItem[] = [];
    for (const f of fileFields) {
      const v = values[f.name];
      const files = Array.isArray(v) ? v : v ? [v] : [];
      if (f.multiple) {
        files.forEach((file: File, i: number) => {
          qItems.push({
            id: `${f.name}-${i}-${file.name}`,
            name: file.name,
            size: file.size,
            status: "waiting",
          });
        });
      }
    }
    setQueue(qItems);

    const onProgress = (event: {
      fileIndex: number;
      total: number;
      status: "start" | "complete" | "error";
      error?: string;
    }) => {
      setQueue((prev) =>
        prev.map((item, idx) => {
          if (idx !== event.fileIndex) return item;
          const status: QueueStatus =
            event.status === "start"
              ? "processing"
              : event.status === "complete"
              ? "completed"
              : "failed";
          return { ...item, status, error: event.error };
        })
      );
    };

    try {
      const res = await tool.run(values, locale, onProgress);
      setResult(res);
      // Scroll to result
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
    } catch (e) {
      setError((e as Error).message || dict.common.error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setValues({});
    setResult(null);
    setError("");
    setQueue([]);
  };

  const copy = async () => {
    if (!result?.value) return;
    try {
      await navigator.clipboard.writeText(result.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const download = () => {
    if (!result?.value) return;
    if (result.kind === "image" || result.kind === "file") {
      const a = document.createElement("a");
      a.href = result.value;
      a.download = result.filename || "result.bin";
      a.click();
    } else {
      const blob = new Blob([result.value], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename || "result.txt";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none transition-all focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_var(--primary-subtle)] placeholder:text-[var(--subtle-foreground)]";

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* INPUT PANEL */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
              style={{ background: "var(--primary-subtle)", color: "var(--primary)" }}
            >
              1
            </span>
            <h3 className="text-sm font-semibold">Input</h3>
          </div>

          {tool.inputSchema.map((field) => (
            <div key={field.name} className="space-y-1.5">
              <label
                htmlFor={`field-${field.name}`}
                className="text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                {field.label[locale]}
                {field.required && (
                  <span className="ml-1 text-xs" style={{ color: "var(--error)" }}>*</span>
                )}
              </label>

              {field.type === "textarea" && (
                <textarea
                  id={`field-${field.name}`}
                  className={inputClass}
                  rows={6}
                  placeholder={field.placeholder?.[locale]}
                  value={values[field.name] || ""}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [field.name]: e.target.value }))
                  }
                />
              )}

              {field.type === "text" && (
                <input
                  id={`field-${field.name}`}
                  className={inputClass}
                  placeholder={field.placeholder?.[locale]}
                  value={values[field.name] || ""}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [field.name]: e.target.value }))
                  }
                />
              )}

              {field.type === "number" && (
                <input
                  id={`field-${field.name}`}
                  type="number"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  className={inputClass}
                  placeholder={field.placeholder?.[locale]}
                  value={values[field.name] ?? ""}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [field.name]: e.target.value }))
                  }
                />
              )}

              {field.type === "select" && (
                <select
                  id={`field-${field.name}`}
                  className={inputClass}
                  value={values[field.name] || field.options?.[0]?.value}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [field.name]: e.target.value }))
                  }
                >
                  {field.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label[locale]}
                    </option>
                  ))}
                </select>
              )}

              {field.type === "checkbox" && (
                <div className="flex items-center gap-2">
                  <input
                    id={`field-${field.name}`}
                    type="checkbox"
                    className="h-4 w-4 rounded border-[var(--border)] accent-[var(--primary)]"
                    checked={!!values[field.name]}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [field.name]: e.target.checked }))
                    }
                  />
                  <label htmlFor={`field-${field.name}`} className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                    {field.label[locale]}
                  </label>
                </div>
              )}

              {field.type === "color" && (
                <div className="flex items-center gap-3">
                  <input
                    id={`field-${field.name}`}
                    type="color"
                    className="h-9 w-16 cursor-pointer rounded-lg border border-[var(--border)] p-0.5"
                    value={values[field.name] || "#635BDB"}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [field.name]: e.target.value }))
                    }
                  />
                  <span className="text-sm font-mono" style={{ color: "var(--muted-foreground)" }}>
                    {values[field.name] || "#635BDB"}
                  </span>
                </div>
              )}

              {field.type === "date" && (
                <input
                  id={`field-${field.name}`}
                  type="date"
                  className={inputClass}
                  value={values[field.name] || ""}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [field.name]: e.target.value }))
                  }
                />
              )}

              {field.type === "file" && (
                <BatchFileUpload
                  accept={field.accept}
                  multiple={field.multiple}
                  files={
                    field.multiple
                      ? Array.isArray(values[field.name])
                        ? values[field.name]
                        : values[field.name]
                        ? [values[field.name]]
                        : []
                      : values[field.name]
                      ? [values[field.name]]
                      : []
                  }
                  onChange={(fs) =>
                    setValues((v) => ({
                      ...v,
                      [field.name]: field.multiple ? fs : fs[0],
                    }))
                  }
                />
              )}

              {field.help && (
                <p className="text-xs" style={{ color: "var(--subtle-foreground)" }}>
                  {field.help[locale]}
                </p>
              )}
            </div>
          ))}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={run}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-50 hover:opacity-90 active:scale-95"
              style={{ background: "var(--primary)" }}
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  {dict.common.loading}
                </>
              ) : (
                <>
                  <Play size={15} />
                  {dict.common.run}
                </>
              )}
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium transition-all hover:bg-[var(--surface-2)]"
              style={{ color: "var(--muted-foreground)" }}
            >
              <RotateCcw size={14} />
              {dict.common.reset}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-start gap-2 rounded-lg border p-3 text-sm"
              style={{
                background: "var(--error-subtle)",
                borderColor: "var(--error)",
                color: "var(--error)",
              }}
            >
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* OUTPUT PANEL */}
        <div ref={outputRef} className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                style={{ background: result ? "var(--success-subtle)" : "var(--surface-2)", color: result ? "var(--success)" : "var(--muted-foreground)" }}
              >
                2
              </span>
              <h3 className="text-sm font-semibold">Result</h3>
              {result && (
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{ background: "var(--success-subtle)", color: "var(--success)" }}
                >
                  Ready
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {result?.kind !== "image" && result?.kind !== "file" && (
                <button
                  onClick={copy}
                  className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium transition-all hover:bg-[var(--surface-2)] disabled:opacity-40"
                  style={{ color: "var(--muted-foreground)" }}
                  disabled={!result}
                >
                  {copied ? (
                    <>
                      <Check size={12} style={{ color: "var(--success)" }} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      {dict.common.copy}
                    </>
                  )}
                </button>
              )}
              <button
                onClick={download}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium transition-all hover:bg-[var(--surface-2)] disabled:opacity-40"
                style={{ color: "var(--muted-foreground)" }}
                disabled={!result}
              >
                <Download size={12} />
                {dict.common.download}
              </button>
            </div>
          </div>

          {/* Output display */}
          <div
            className="min-h-[200px] rounded-xl border border-[var(--border)] p-4"
            style={{ background: "var(--surface-2)" }}
          >
            {loading && (
              <div className="flex h-full flex-col items-center justify-center gap-3 py-16">
                <Loader2 size={28} className="animate-spin" style={{ color: "var(--primary)" }} />
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                  {dict.common.loading}
                </p>
              </div>
            )}

            {!loading && !result && !error && (
              <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                <div
                  className="mb-3 h-12 w-12 rounded-full"
                  style={{ background: "var(--border)" }}
                />
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                  Your result will appear here
                </p>
              </div>
            )}

            {!loading && result && (
              <div className="animate-fade-in">
                {result.kind === "image" ? (
                  <img
                    src={result.value}
                    alt="Tool result"
                    className="max-h-80 w-auto rounded-lg"
                  />
                ) : result.kind === "html" ? (
                  <div
                    className="prose text-sm"
                    dangerouslySetInnerHTML={{ __html: result.value }}
                  />
                ) : result.kind === "json" ? (
                  <pre
                    className="overflow-auto whitespace-pre-wrap break-words rounded-lg p-3 text-xs font-mono"
                    style={{ background: "var(--surface)", color: "var(--foreground)" }}
                  >
                    {typeof result.value === "string"
                      ? result.value
                      : JSON.stringify(result.value, null, 2)}
                  </pre>
                ) : (
                  <pre
                    className="whitespace-pre-wrap break-words text-sm"
                    style={{ color: "var(--foreground)" }}
                  >
                    {result.value}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Batch processing queue */}
      {queue.length > 0 && (
        <div className="mt-2">
          <ProcessingQueue items={queue} />
        </div>
      )}
    </div>
  );
}
