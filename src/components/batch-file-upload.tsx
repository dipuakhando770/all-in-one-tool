"use client";
import { useState, useRef, useCallback } from "react";
import { Upload, X, File as FileIcon } from "lucide-react";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function BatchFileUpload({
  accept,
  multiple,
  files,
  onChange,
}: {
  accept?: string;
  multiple?: boolean;
  files: File[];
  onChange: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      const arr = Array.from(incoming);
      const valid = accept ? arr.filter((f) => accept.split(",").some((a) => f.type.match(a.trim().replace("*", ".*")) || f.name.endsWith(a.trim().replace("*", "")))) : arr;
      // dedupe by name+size
      const existing = new Set(files.map((f) => `${f.name}-${f.size}`));
      const unique = valid.filter((f) => !existing.has(`${f.name}-${f.size}`));
      onChange(multiple ? [...files, ...unique] : unique.slice(0, 1));
    },
    [accept, files, multiple, onChange]
  );

  const remove = (idx: number) => onChange(files.filter((_, i) => i !== idx));
  const clear = () => onChange([]);

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition ${dragging ? "border-[var(--accent)] bg-[var(--muted)]" : "border-[var(--border)]"}`}
      >
        <Upload className="mx-auto mb-2" size={24} />
        <p className="text-sm">Drag & drop or click to select {multiple ? "files" : "a file"}</p>
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="hidden" onChange={(e) => addFiles(e.target.files)} />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{files.length} file(s)</span>
            <button onClick={clear} className="text-sm text-red-500 hover:underline">Clear all</button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] p-2">
                {f.type.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={URL.createObjectURL(f)} alt={f.name} className="h-12 w-12 rounded object-cover" />
                ) : (
                  <FileIcon size={24} className="text-[var(--muted)]" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium">{f.name}</div>
                  <div className="text-xs text-[var(--foreground)]/60">{formatBytes(f.size)}</div>
                </div>
                <button onClick={() => remove(i)} className="rounded p-1 hover:bg-[var(--muted)]" aria-label="remove">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
