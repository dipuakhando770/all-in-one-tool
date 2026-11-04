import Link from "next/link";
import { Search, Grid, Loader2, FolderDown, CheckCircle2 } from "lucide-react";

const DOCUMENT_TOOLS = [
  { id: "pdf-merger", name: "PDF Merger", category: "PDF", thumbnail: "📄", route: "/tools/pdf-merger" },
  { id: "pdf-split-to-zip", name: "PDF Split to ZIP", category: "PDF", thumbnail: "🗜️", route: "/tools/pdf-split-to-zip" },
  { id: "pdf-page-count", name: "PDF Page Count", category: "PDF", thumbnail: "📄", route: "/tools/pdf-page-count" },
  { id: "pdf-to-image", name: "PDF to Image", category: "PDF", thumbnail: "🖼️", route: "/tools/pdf-to-image" },
  { id: "image-to-pdf", name: "Image to PDF", category: "PDF", thumbnail: "📄", route: "/tools/image-to-pdf" },
  { id: "pdf-metadata-viewer", name: "PDF Metadata Viewer", category: "PDF", thumbnail: "ℹ️", route: "/tools/pdf-metadata-viewer" },
  { id: "pdf-rotator", name: "PDF Rotator", category: "PDF", thumbnail: "🔄", route: "/tools/pdf-rotator" },
  { id: "pdf-page-deleter", name: "PDF Page Deleter", category: "PDF", thumbnail: "🗑️", route: "/tools/pdf-page-deleter" },
];

export default function DocumentStudioPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Document Studio
        </h1>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          AI-powered document processing — keep files private in your browser
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {DOCUMENT_TOOLS.map((tool) => (
          <div
            key={tool.id}
            className="group rounded-xl border border-[var(--border)] p-5 hover:shadow-md transition-shadow"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <div className="h-12 w-12 rounded-lg bg-[var(--primary-subtle)] flex items-center justify-center group-hover:bg-[var(--primary)] transition-colors mb-4">
              {tool.thumbnail}
            </div>
            <h3 className="text-lg font-medium mb-1">{tool.name}</h3>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              {tool.name}
            </p>
            <Link
              href={tool.route}
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium transition-colors"
              style={{
                color: "var(--foreground)",
                borderColor: "var(--border)",
                background: "var(--surface-2)",
              }}
            >
              Go to tool
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}