"use client";
import { useState } from "react";
import { BatchFileUpload } from "@/components/batch-file-upload";
import { getToolBySlug } from "@/tools/registry";
import type { Locale } from "@/lib/i18n";

export function ToolRunner({ slug, locale, dict }: { slug: string; locale: Locale; dict: any }) {
  const tool = getToolBySlug(slug)!;
  const [values, setValues] = useState<Record<string, any>>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    setLoading(true); setError("");
    try { setResult(await tool.run(values, locale)); }
    catch (e) { setError((e as Error).message || dict.common.error); }
    finally { setLoading(false); }
  };
  const reset = () => { setValues({}); setResult(null); setError(""); };
  const copy = async () => { if (result?.value) await navigator.clipboard.writeText(result.value); };
  const download = () => {
    if (!result?.value) return;
    if (result.kind === "image" || result.kind === "file") {
      const a = document.createElement("a"); a.href = result.value; a.download = result.filename || "result.bin"; a.click();
    } else {
      const blob = new Blob([result.value], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = result.filename || "result.txt"; a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--background)] p-5">
        {tool.inputSchema.map((field) => (
          <div key={field.name} className="space-y-1">
            <label className="text-sm font-medium">{field.label[locale]}</label>
            {field.type === "textarea" && <textarea className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] p-2" rows={6} placeholder={field.placeholder?.[locale]} value={values[field.name] || ""} onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))} />}
            {field.type === "text" && <input className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] p-2" placeholder={field.placeholder?.[locale]} value={values[field.name] || ""} onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))} />}
            {field.type === "number" && <input type="number" min={field.min} max={field.max} step={field.step} className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] p-2" value={values[field.name] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))} />}
            {field.type === "select" && <select className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] p-2" value={values[field.name] || field.options?.[0]?.value} onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}>{field.options?.map((o) => <option key={o.value} value={o.value}>{o.label[locale]}</option>)}</select>}
            {field.type === "checkbox" && <input type="checkbox" checked={!!values[field.name]} onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.checked }))} />}
            {field.type === "color" && <input type="color" className="h-10 w-20 rounded border border-[var(--border)]" value={values[field.name] || "#000000"} onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))} />}
            {field.type === "date" && <input type="date" className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] p-2" value={values[field.name] || ""} onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))} />}
            {field.type === "file" && <BatchFileUpload accept={field.accept} multiple={field.multiple} files={field.multiple ? (Array.isArray(values[field.name]) ? values[field.name] : values[field.name] ? [values[field.name]] : []) : (values[field.name] ? [values[field.name]] : [])} onChange={(fs) => setValues((v) => ({ ...v, [field.name]: field.multiple ? fs : fs[0] }))} />}
            {field.help && <p className="text-xs text-[var(--foreground)]/60">{field.help[locale]}</p>}
          </div>
        ))}
        <div className="flex gap-2 pt-2">
          <button onClick={run} disabled={loading} className="rounded-lg bg-[var(--accent)] px-4 py-2 text-white disabled:opacity-50">{loading ? dict.common.loading : dict.common.run}</button>
          <button onClick={reset} className="rounded-lg border border-[var(--border)] px-4 py-2">{dict.common.reset}</button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
      <div className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--muted)] p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Result</h3>
          <div className="flex gap-2">
            <button onClick={copy} className="rounded-lg border border-[var(--border)] px-3 py-1 text-sm">{dict.common.copy}</button>
            <button onClick={download} className="rounded-lg border border-[var(--border)] px-3 py-1 text-sm">{dict.common.download}</button>
          </div>
        </div>
        {result?.kind === "image" ? <img src={result.value} alt="result" className="max-h-80 rounded-lg" /> : result?.kind === "html" ? <div dangerouslySetInnerHTML={{ __html: result.value }} /> : <pre className="whitespace-pre-wrap break-words text-sm">{result?.value ?? ""}</pre>}
      </div>
    </div>
  );
}
