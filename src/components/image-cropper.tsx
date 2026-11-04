"use client";

import { useRef, useState } from "react";
import { Upload, Download, RotateCcw } from "lucide-react";

type Aspect = "free" | "1:1" | "4:3" | "16:9" | "3:2" | "9:16";

const RATIOS: Record<Aspect, number | null> = {
  free: null,
  "1:1": 1,
  "4:3": 4 / 3,
  "16:9": 16 / 9,
  "3:2": 3 / 2,
  "9:16": 9 / 16,
};

export default function InteractiveImageCropper() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 100, h: 100 });
  const [aspect, setAspect] = useState<Aspect>("free");
  const [format, setFormat] = useState<"image/png" | "image/jpeg" | "image/webp">("image/png");
  const [drag, setDrag] = useState<{ mode: string; startX: number; startY: number; crop: { x: number; y: number; w: number; h: number } } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const maxPreview = 560;
      const s = Math.min(1, maxPreview / Math.max(img.width, img.height));
      setScale(s);
      setImage(img);
      const w = Math.round(img.width * 0.8);
      const h = Math.round(img.height * 0.8);
      setCrop({ x: Math.round((img.width - w) / 2), y: Math.round((img.height - h) / 2), w, h });
    };
    img.src = url;
  };

  const onPointerDown = (e: React.PointerEvent, mode: string) => {
    if (!image) return;
    e.preventDefault();
    (e.target as Element).setPointerCapture(e.pointerId);
    setDrag({ mode, startX: e.clientX, startY: e.clientY, crop: { ...crop } });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag || !image) return;
    const dx = (e.clientX - drag.startX) / scale;
    const dy = (e.clientY - drag.startY) / scale;
    let { x, y, w, h } = drag.crop;
    const ratio = RATIOS[aspect];
    if (drag.mode === "move") {
      x = Math.max(0, Math.min(image.width - w, x + dx));
      y = Math.max(0, Math.min(image.height - h, y + dy));
    } else {
      if (drag.mode.includes("e")) w = Math.max(10, w + dx);
      if (drag.mode.includes("s")) h = Math.max(10, h + dy);
      if (drag.mode.includes("w")) { x = x + dx; w = Math.max(10, w - dx); }
      if (drag.mode.includes("n")) { y = y + dy; h = Math.max(10, h - dy); }
      if (ratio) {
        if (drag.mode === "e" || drag.mode === "w") h = w / ratio;
        else if (drag.mode === "n" || drag.mode === "s") w = h * ratio;
        else h = w / ratio;
      }
      if (x < 0) { w += x; x = 0; }
      if (y < 0) { h += y; y = 0; }
      if (x + w > image.width) w = image.width - x;
      if (y + h > image.height) h = image.height - y;
    }
    setCrop({ x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) });
  };

  const onPointerUp = () => setDrag(null);

  const reset = () => {
    if (!image) return;
    const w = Math.round(image.width * 0.8);
    const h = Math.round(image.height * 0.8);
    setCrop({ x: Math.round((image.width - w) / 2), y: Math.round((image.height - h) / 2), w, h });
  };

  const centerCrop = () => {
    if (!image) return;
    const ratio = RATIOS[aspect] || image.width / image.height;
    let w = image.width;
    let h = w / ratio;
    if (h > image.height) { h = image.height; w = h * ratio; }
    setCrop({ x: Math.round((image.width - w) / 2), y: Math.round((image.height - h) / 2), w: Math.round(w), h: Math.round(h) });
  };

  const exportCrop = () => {
    if (!image) return;
    const canvas = document.createElement("canvas");
    canvas.width = crop.w;
    canvas.height = crop.h;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cropped.${format.split("/")[1]}`;
      a.click();
      URL.revokeObjectURL(url);
    }, format, 0.92);
  };
  const handleWidthChange = (v: number) => {
    const ratio = RATIOS[aspect];
    setCrop((c) => {
      const w = Math.max(1, Math.min(image ? image.width - c.x : v, v));
      const h = ratio ? Math.round(w / ratio) : c.h;
      return { ...c, w, h };
    });
  };
  const handleHeightChange = (v: number) => {
    const ratio = RATIOS[aspect];
    setCrop((c) => {
      const h = Math.max(1, Math.min(image ? image.height - c.y : v, v));
      const w = ratio ? Math.round(h * ratio) : c.w;
      return { ...c, w, h };
    });
  };

  if (!image) {
    return (
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
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select value={aspect} onChange={(e) => setAspect(e.target.value as Aspect)} className="rounded-lg border px-3 py-2 text-sm" style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--foreground)" }}>
          {Object.keys(RATIOS).map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <label className="text-xs" style={{ color: "var(--muted-foreground)" }}>W</label>
        <input type="number" value={crop.w} onChange={(e) => handleWidthChange(Number(e.target.value))} className="w-20 rounded-lg border px-2 py-1 text-sm" style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--foreground)" }} />
        <label className="text-xs" style={{ color: "var(--muted-foreground)" }}>H</label>
        <input type="number" value={crop.h} onChange={(e) => handleHeightChange(Number(e.target.value))} className="w-20 rounded-lg border px-2 py-1 text-sm" style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--foreground)" }} />
        <select value={format} onChange={(e) => setFormat(e.target.value as "image/png" | "image/jpeg" | "image/webp")} className="rounded-lg border px-3 py-2 text-sm" style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--foreground)" }}>
          <option value="image/png">PNG</option>
          <option value="image/jpeg">JPEG</option>
          <option value="image/webp">WebP</option>
        </select>
        <button onClick={reset} className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
          <RotateCcw size={14} /> Reset
        </button>
        <button onClick={centerCrop} className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
          Center
        </button>
        <button onClick={exportCrop} className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
          <Download size={14} /> Crop Image
        </button>
        <button onClick={() => setImage(null)} className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
          New image
        </button>
      </div>

      <div className="relative inline-block select-none" style={{ touchAction: "none" }} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>
        <img src={image.src} alt="source" style={{ width: image.width * scale, height: image.height * scale, display: "block" }} draggable={false} />
        <div
          className="absolute border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]"
          style={{ left: crop.x * scale, top: crop.y * scale, width: crop.w * scale, height: crop.h * scale, cursor: "move" }}
          onPointerDown={(e) => onPointerDown(e, "move")}
        >
          {["nw","n","ne","e","se","s","sw","w"].map((h) => (
            <div
              key={h}
              onPointerDown={(e) => onPointerDown(e, h)}
              className="absolute h-3 w-3 rounded-full bg-white border border-gray-400"
              style={{
                left: h.includes("w") ? -6 : h.includes("e") ? "calc(100% - 6px)" : "calc(50% - 6px)",
                top: h.includes("n") ? -6 : h.includes("s") ? "calc(100% - 6px)" : "calc(50% - 6px)",
                cursor: `${h}-resize`,
              }}
            />
          ))}
        </div>
      </div>
      <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
        Crop: x={crop.x}, y={crop.y}, {crop.w}x{crop.h}
      </p>
    </div>
  );
}

