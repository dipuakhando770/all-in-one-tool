"use client";
import { File as FileIcon, CheckCircle, XCircle, Loader2 } from "lucide-react";

export type QueueStatus = "waiting" | "processing" | "completed" | "failed";

export type QueueItem = {
  id: string;
  name: string;
  size: number;
  status: QueueStatus;
  error?: string;
};

export function ProcessingQueue({ items }: { items: QueueItem[] }) {
  const done = items.filter((i) => i.status === "completed").length;
  const failed = items.filter((i) => i.status === "failed").length;
  const processing = items.filter((i) => i.status === "processing").length;
  return (
    <div className="space-y-2">
      <div className="flex gap-4 text-sm">
        <span>Total: {items.length}</span>
        <span className="text-green-600">Done: {done}</span>
        <span className="text-red-500">Failed: {failed}</span>
        <span className="text-blue-500">Processing: {processing}</span>
      </div>
      <div className="space-y-1">
        {items.map((it) => (
          <div key={it.id} className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] p-2 text-sm">
            {it.status === "processing" && <Loader2 size={14} className="animate-spin" />}
            {it.status === "completed" && <CheckCircle size={14} className="text-green-600" />}
            {it.status === "failed" && <XCircle size={14} className="text-red-500" />}
            {it.status === "waiting" && <FileIcon size={14} />}
            <span className="min-w-0 flex-1 truncate">{it.name}</span>
            <span className="text-xs text-[var(--foreground)]/60">{(it.size / 1024).toFixed(1)} KB</span>
            {it.error && <span className="text-xs text-red-500">{it.error}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
