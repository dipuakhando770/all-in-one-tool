"use client";

import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";
import { removeBackground } from "@/lib/image/background-removal";

export default function BackgroundRemoverUI() {
  const [original, setOriginal] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const handleFile = async (file: File) => {
    setError("");
    setResult(null);
    const url = URL.createObjectURL(file);
    setOriginal(url);
    setProcessing(true);
    setProgress(0);
    try {
      const dataUrl = await removeBackground(file, (f) => setProgress(f));
      setResult(dataUrl);
    } catch (e) {
      setError((e as Error).message || "Processing failed");
    } finally {
      setProcessing(false);
    }
  };

  const download = () => {
    if (!result) return;
    if (bgColor === "transparent") {
      const a = document.createElement("a");
      a.href = result;
      a.download = "background-removed.png";
      a.click();
      return;
    }
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "background-removed.png";
        a.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    };
    img.src = result;
  };

  const [bgColor, setBgColor] = useState("transparent");
  const fileInput = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-4">
      {!original && (
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-12 text-center"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
        >
          <Upload size={28} style={{ color: "var(--muted-foreground)" }} />
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Drag and drop an image, or</p>
          <button onClick={() => fileInput.current?.click()} className="rounded-lg px-4 py-2 text-sm font-medium" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
            Browse
          </button>
          <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      )}

      {original && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm" style={{ color: "var(--muted-foreground)" }}>Background:</label>
            <select value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="rounded-lg border px-3 py-2 text-sm" style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--foreground)" }}>
              <option value="transparent">Transparent</option>
              <option value="#ffffff">White</option>
              <option value="#000000">Black</option>
              <option value="#ff0000">Red</option>
              <option value="#00ff00">Green</option>
              <option value="#0000ff">Blue</option>
            </select>
            <input type="color" value={bgColor.startsWith("#") ? bgColor : "#ffffff"} onChange={(e) => setBgColor(e.target.value)} className="h-9 w-9 rounded border" style={{ borderColor: "var(--border)" }} />
            {result && (
              <button onClick={download} className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
                <Download size={14} /> Download
              </button>
            )}
            <button onClick={() => { setOriginal(null); setResult(null); setError(""); }} className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
              New image
            </button>
          </div>

          {processing && (
            <div className="flex items-center gap-3">
              <div className="h-2 flex-1 rounded-full" style={{ background: "var(--border)" }}>
                <div className="h-2 rounded-full" style={{ width: `${Math.round(progress * 100)}%`, background: "var(--primary)" }} />
              </div>
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{Math.round(progress * 100)}%</span>
            </div>
          )}

          {error && <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium">Original</p>
              <img src={original} alt="original" className="max-h-96 rounded-lg border" style={{ borderColor: "var(--border)" }} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Result</p>
              {result ? (
                <div
                  className="inline-block rounded-lg border"
                  style={{
                    borderColor: "var(--border)",
                    background: bgColor === "transparent" ? "repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 16px 16px" : bgColor,
                  }}
                >
                  <img src={result} alt="result" className="max-h-96 rounded-lg" />
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center rounded-lg border" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                  <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>{processing ? "Processing..." : "No result yet"}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

