import type { ToolDefinition } from "@/lib/tools/types";
import type { Locale } from "@/lib/i18n";
import { createZip } from "@/lib/zip";

const L = (en: string, bn: string): Record<Locale, string> => ({ en, bn });
const LI = (en: string[], bn: string[]): Record<Locale, string[]> => ({ en, bn });

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

export const imageTools: ToolDefinition[] = [
  {
    id: "image-compressor", slug: "image-compressor", category: "image", icon: "Minimize2",
    name: L("Image Compressor", "ইমেজ কম্প্রেসর"),
    description: L("Compress images to reduce file size.", "ফাইল সাইজ কমাতে ছবি কম্প্রেস।"),
    inputSchema: [
      { name: "file", label: L("Image(s)", "ছবি"), type: "file", accept: "image/*", required: true, multiple: true },
      { name: "quality", label: L("Quality (0.1-1)", "কোয়ালিটি (0.1-1)"), type: "number", min: 0.1, max: 1, step: 0.1 },
    ],
    run: async (input, _locale, onProgress) => {
      const files = (Array.isArray(input.file) ? input.file : [input.file]).filter(Boolean) as File[];
      if (!files.length) return { kind: "text", value: "No file" };
      const q = Number(input.quality) || 0.7;
      if (files.length === 1) {
        const file = files[0];
        const img = await fileToImage(file);
        const canvas = document.createElement("canvas");
        canvas.width = img.width; canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        const dataUrl = await canvasToDataURL(canvas, file.type || "image/jpeg", q);
        return { kind: "image", value: dataUrl, filename: "compressed.jpg" };
      }
      const outputs: { name: string; data: Uint8Array }[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        onProgress?.({ fileIndex: i, total: files.length, status: "start" });
        try {
          const img = await fileToImage(file);
          const canvas = document.createElement("canvas");
          canvas.width = img.width; canvas.height = img.height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0);
          const dataUrl = await canvasToDataURL(canvas, file.type || "image/jpeg", q);
          const base64 = dataUrl.split(",")[1];
          const binary = atob(base64);
          const bytes = new Uint8Array(binary.length);
          for (let j = 0; j < binary.length; j++) bytes[j] = binary.charCodeAt(j);
          outputs.push({ name: `compressed-${file.name}`, data: bytes });
          onProgress?.({ fileIndex: i, total: files.length, status: "complete" });
        } catch (e) {
          onProgress?.({ fileIndex: i, total: files.length, status: "error", error: (e as Error).message });
        }
      }
      if (!outputs.length) return { kind: "text", value: "All files failed" };
      const url = await createZip(outputs.map((o) => ({ name: o.name, data: o.data })));
      return { kind: "file", value: url, filename: "compressed.zip", mime: "application/zip" };
    },
    seoTitle: L("Image Compressor", "ইমেজ কম্প্রেসর"),
    seoDescription: L("Compress images online.", "অনলাইনে ছবি কম্প্রেস।"),
    keywords: ["image compressor"],
    instructions: LI(["Upload image, set quality, run."], ["ছবি আপলোড, কোয়ালিটি সেট, চালান।"]),
    faqs: [],
    related: ["image-resizer"],
  },
  {
    id: "image-resizer", slug: "image-resizer", category: "image", icon: "Maximize2",
    name: L("Image Resizer", "ইমেজ রিসাইজার"),
    description: L("Resize images to custom dimensions.", "কাস্টম মাপে ছবি রিসাইজ।"),
    inputSchema: [
      { name: "file", label: L("Image", "ছবি"), type: "file", accept: "image/*", required: true },
      { name: "width", label: L("Width", "প্রস্থ"), type: "number", required: true },
      { name: "height", label: L("Height", "উচ্চতা"), type: "number", required: true },
    ],
    run: async (input) => {
      const file = input.file as File;
      if (!file) return { kind: "text", value: "No file" };
      const img = await fileToImage(file);
      const canvas = document.createElement("canvas");
      canvas.width = Number(input.width); canvas.height = Number(input.height);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = await canvasToDataURL(canvas, file.type || "image/png", 0.9);
      return { kind: "image", value: dataUrl, filename: "resized.png" };
    },
    seoTitle: L("Image Resizer", "ইমেজ রিসাইজার"),
    seoDescription: L("Resize images online.", "অনলাইনে ছবি রিসাইজ।"),
    keywords: ["image resizer"],
    instructions: LI(["Upload image, set dimensions, run."], ["ছবি আপলোড, মাপ দিন, চালান।"]),
    faqs: [],
    related: ["image-compressor"],
  },
  {
    id: "image-format-converter", slug: "image-format-converter", category: "image", icon: "RefreshCw",
    name: L("Image Format Converter", "ইমেজ ফরম্যাট কনভার্টার"),
    description: L("Convert image between PNG, JPG, WebP.", "PNG, JPG, WebP এর মধ্যে রূপান্তর।"),
    inputSchema: [
      { name: "file", label: L("Image(s)", "ছবি"), type: "file", accept: "image/*", required: true, multiple: true },
      { name: "format", label: L("Format", "ফরম্যাট"), type: "select", options: [
        { value: "image/png", label: L("PNG", "PNG") },
        { value: "image/jpeg", label: L("JPG", "JPG") },
        { value: "image/webp", label: L("WebP", "WebP") },
      ] },
    ],
    run: async (input, _locale, onProgress) => {
      const files = (Array.isArray(input.file) ? input.file : [input.file]).filter(Boolean) as File[];
      if (!files.length) return { kind: "text", value: "No file" };
      const mime = String(input.format || "image/png");
      const ext = mime.split("/")[1];
      if (files.length === 1) {
        const file = files[0];
        const img = await fileToImage(file);
        const canvas = document.createElement("canvas");
        canvas.width = img.width; canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        const dataUrl = await canvasToDataURL(canvas, mime, 0.9);
        return { kind: "image", value: dataUrl, filename: `converted.${ext}` };
      }
      const outputs: { name: string; data: Uint8Array }[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        onProgress?.({ fileIndex: i, total: files.length, status: "start" });
        try {
          const img = await fileToImage(file);
          const canvas = document.createElement("canvas");
          canvas.width = img.width; canvas.height = img.height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0);
          const dataUrl = await canvasToDataURL(canvas, mime, 0.9);
          const base64 = dataUrl.split(",")[1];
          const binary = atob(base64);
          const bytes = new Uint8Array(binary.length);
          for (let j = 0; j < binary.length; j++) bytes[j] = binary.charCodeAt(j);
          const baseName = file.name.replace(/\.[^.]+$/, "");
          outputs.push({ name: `${baseName}.${ext}`, data: bytes });
          onProgress?.({ fileIndex: i, total: files.length, status: "complete" });
        } catch (e) {
          onProgress?.({ fileIndex: i, total: files.length, status: "error", error: (e as Error).message });
        }
      }
      if (!outputs.length) return { kind: "text", value: "All files failed" };
      const url = await createZip(outputs.map((o) => ({ name: o.name, data: o.data })));
      return { kind: "file", value: url, filename: "converted.zip", mime: "application/zip" };
    },
    seoTitle: L("Image Format Converter", "ইমেজ ফরম্যাট কনভার্টার"),
    seoDescription: L("Convert image formats.", "ছবি ফরম্যাট রূপান্তর।"),
    keywords: ["image converter"],
    instructions: LI(["Upload image, choose format."], ["ছবি আপলোড, ফরম্যাট বেছে নিন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "image-to-base64", slug: "image-to-base64", category: "image", icon: "Code",
    name: L("Image to Base64", "ইমেজ টু Base64"),
    description: L("Convert image to Base64 string.", "ছবিকে Base64 স্ট্রিং এ রূপান্তর।"),
    inputSchema: [{ name: "file", label: L("Image", "ছবি"), type: "file", accept: "image/*", required: true }],
    run: async (input) => {
      const file = input.file as File;
      if (!file) return { kind: "text", value: "No file" };
      return new Promise((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve({ kind: "text", value: String(r.result) });
        r.readAsDataURL(file);
      });
    },
    seoTitle: L("Image to Base64", "ইমেজ টু Base64"),
    seoDescription: L("Convert image to Base64.", "ছবি Base64 রূপান্তর।"),
    keywords: ["image to base64"],
    instructions: LI(["Upload image."], ["ছবি আপলোড করুন।"]),
    faqs: [],
    related: ["base64-to-image"],
  },
  {
    id: "base64-to-image", slug: "base64-to-image", category: "image", icon: "Image",
    name: L("Base64 to Image", "Base64 টু ইমেজ"),
    description: L("Convert Base64 string to image.", "Base64 স্ট্রিং থেকে ছবি।"),
    inputSchema: [{ name: "text", label: L("Base64", "Base64"), type: "textarea", required: true }],
    run: (input) => ({ kind: "image", value: String(input.text || "") }),
    seoTitle: L("Base64 to Image", "Base64 টু ইমেজ"),
    seoDescription: L("Convert Base64 to image.", "Base64 থেকে ছবি।"),
    keywords: ["base64 to image"],
    instructions: LI(["Paste Base64 data URL."], ["Base64 ডেটা URL পেস্ট করুন।"]),
    faqs: [],
    related: ["image-to-base64"],
  },
  {
    id: "color-picker", slug: "color-picker", category: "image", icon: "Pipette",
    name: L("Color Picker", "কালার পিকার"),
    description: L("Pick a color and get HEX/RGB.", "কালার পিক করে HEX/RGB পান।"),
    inputSchema: [{ name: "color", label: L("Color", "কালার"), type: "color", required: true }],
    run: (input) => {
      const hex = String(input.color || "#000000");
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { kind: "text", value: `HEX: ${hex}\nRGB: rgb(${r}, ${g}, ${b})` };
    },
    seoTitle: L("Color Picker", "কালার পিকার"),
    seoDescription: L("Pick colors.", "কালার পিক।"),
    keywords: ["color picker"],
    instructions: LI(["Choose color."], ["কালার বেছে নিন।"]),
    faqs: [],
    related: ["color-converter"],
  },
];
