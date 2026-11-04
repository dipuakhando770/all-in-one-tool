import type { ToolDefinition } from "@/lib/tools/types";
import type { Locale } from "@/lib/i18n";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
// pdfjs loaded dynamically inside run() to avoid build-time issues

async function getPdfjs() {
  const mod = await import("pdfjs-dist");
  if (typeof window !== "undefined") {
    mod.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${mod.version}/pdf.worker.min.mjs`;
  }
  return mod;
}

const L = (en: string, bn: string): Record<Locale, string> => ({ en, bn });
const LI = (en: string[], bn: string[]): Record<Locale, string[]> => ({ en, bn });

async function fileToBytes(file: File): Promise<Uint8Array> {
  return new Uint8Array(await file.arrayBuffer());
}

async function pdfToDataUrl(bytes: Uint8Array): Promise<string> {
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
  return new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.readAsDataURL(blob);
  });
}

export const pdfTools: ToolDefinition[] = [
  {
    id: "pdf-page-count", slug: "pdf-page-count", category: "pdf", icon: "FileText",
    name: L("PDF Page Counter", "PDF পেজ কাউন্টার"),
    description: L("Count pages in a PDF.", "PDF এর পেজ সংখ্যা গণনা।"),
    inputSchema: [{ name: "file", label: L("PDF", "PDF"), type: "file", accept: "application/pdf", required: true }],
    run: async (input) => {
      const file = input.file as File;
      if (!file) return { kind: "text", value: "No file" };
      const pdf = await PDFDocument.load(await fileToBytes(file));
      return { kind: "text", value: `Pages: ${pdf.getPageCount()}` };
    },
    seoTitle: L("PDF Page Counter", "PDF পেজ কাউন্টার"),
    seoDescription: L("Count PDF pages.", "PDF পেজ গণনা।"),
    keywords: ["pdf page count"],
    instructions: LI(["Upload PDF."], ["PDF আপলোড করুন।"]),
    faqs: [], related: [],
  },
  {
    id: "pdf-metadata-viewer", slug: "pdf-metadata-viewer", category: "pdf", icon: "Info",
    name: L("PDF Metadata Viewer", "PDF মেটাডেটা ভিউয়ার"),
    description: L("View PDF metadata.", "PDF মেটাডেটা দেখুন।"),
    inputSchema: [{ name: "file", label: L("PDF", "PDF"), type: "file", accept: "application/pdf", required: true }],
    run: async (input) => {
      const file = input.file as File;
      if (!file) return { kind: "text", value: "No file" };
      const pdf = await PDFDocument.load(await fileToBytes(file));
      return { kind: "text", value: `Title: ${pdf.getTitle() || "-"}\nAuthor: ${pdf.getAuthor() || "-"}\nSubject: ${pdf.getSubject() || "-"}\nPages: ${pdf.getPageCount()}\nCreator: ${pdf.getCreator() || "-"}` };
    },
    seoTitle: L("PDF Metadata Viewer", "PDF মেটাডেটা ভিউয়ার"),
    seoDescription: L("View PDF metadata.", "PDF মেটাডেটা দেখুন।"),
    keywords: ["pdf metadata"],
    instructions: LI(["Upload PDF."], ["PDF আপলোড করুন।"]),
    faqs: [], related: [],
  },
  {
    id: "pdf-rotator", slug: "pdf-rotator", category: "pdf", icon: "RotateCw",
    name: L("PDF Rotator", "PDF রোটেটর"),
    description: L("Rotate all pages of a PDF.", "PDF এর সব পেজ রোটেট।"),
    inputSchema: [
      { name: "file", label: L("PDF", "PDF"), type: "file", accept: "application/pdf", required: true },
      { name: "degrees", label: L("Degrees", "ডিগ্রি"), type: "select", options: [
        { value: "90", label: L("90", "90") }, { value: "180", label: L("180", "180") }, { value: "270", label: L("270", "270") },
      ] },
    ],
    run: async (input) => {
      const file = input.file as File;
      if (!file) return { kind: "text", value: "No file" };
      const pdf = await PDFDocument.load(await fileToBytes(file));
      const deg = Number(input.degrees) || 90;
      pdf.getPages().forEach((p) => p.setRotation({ type: "degrees", angle: (p.getRotation().angle + deg) % 360 } as any)); // eslint-disable-line @typescript-eslint/no-explicit-any
      const out = await pdf.save();
      return { kind: "file", value: await pdfToDataUrl(out), filename: "rotated.pdf", mime: "application/pdf" };
    },
    seoTitle: L("PDF Rotator", "PDF রোটেটর"),
    seoDescription: L("Rotate PDF.", "PDF রোটেট।"),
    keywords: ["pdf rotator"],
    instructions: LI(["Upload PDF and choose degrees."], ["PDF আপলোড ও ডিগ্রি বেছে নিন।"]),
    faqs: [], related: [],
  },
  {
    id: "pdf-page-extractor", slug: "pdf-page-extractor", category: "pdf", icon: "Scissors",
    name: L("PDF Page Extractor", "PDF পেজ এক্সট্র্যাক্টর"),
    description: L("Extract a page range from a PDF.", "PDF থেকে পেজ রেঞ্জ এক্সট্র্যাক্ট।"),
    inputSchema: [
      { name: "file", label: L("PDF", "PDF"), type: "file", accept: "application/pdf", required: true },
      { name: "start", label: L("Start Page", "শুরু পেজ"), type: "number", required: true, min: 1 },
      { name: "end", label: L("End Page", "শেষ পেজ"), type: "number", required: true, min: 1 },
    ],
    run: async (input) => {
      const file = input.file as File;
      if (!file) return { kind: "text", value: "No file" };
      const src = await PDFDocument.load(await fileToBytes(file));
      const total = src.getPageCount();
      const s = Math.max(1, Number(input.start));
      const e = Math.min(total, Number(input.end));
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, Array.from({ length: e - s + 1 }, (_, i) => s - 1 + i));
      pages.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      return { kind: "file", value: await pdfToDataUrl(bytes), filename: "extracted.pdf", mime: "application/pdf" };
    },
    seoTitle: L("PDF Page Extractor", "PDF পেজ এক্সট্র্যাক্টর"),
    seoDescription: L("Extract PDF pages.", "PDF পেজ এক্সট্র্যাক্ট।"),
    keywords: ["pdf page extractor"],
    instructions: LI(["Upload PDF and set page range."], ["PDF আপলোড ও পেজ রেঞ্জ সেট করুন।"]),
    faqs: [], related: [],
  },
  {
    id: "pdf-page-deleter", slug: "pdf-page-deleter", category: "pdf", icon: "Trash2",
    name: L("PDF Page Deleter", "PDF পেজ ডিলিটার"),
    description: L("Delete a page from a PDF.", "PDF থেকে একটি পেজ ডিলিট।"),
    inputSchema: [
      { name: "file", label: L("PDF", "PDF"), type: "file", accept: "application/pdf", required: true },
      { name: "page", label: L("Page Number", "পেজ নাম্বার"), type: "number", required: true, min: 1 },
    ],
    run: async (input) => {
      const file = input.file as File;
      if (!file) return { kind: "text", value: "No file" };
      const pdf = await PDFDocument.load(await fileToBytes(file));
      const idx = Number(input.page) - 1;
      if (idx < 0 || idx >= pdf.getPageCount()) return { kind: "text", value: "Invalid page" };
      pdf.removePage(idx);
      const bytes = await pdf.save();
      return { kind: "file", value: await pdfToDataUrl(bytes), filename: "deleted.pdf", mime: "application/pdf" };
    },
    seoTitle: L("PDF Page Deleter", "PDF পেজ ডিলিটার"),
    seoDescription: L("Delete PDF page.", "PDF পেজ ডিলিট।"),
    keywords: ["pdf page deleter"],
    instructions: LI(["Upload PDF and set page number."], ["PDF আপলোড ও পেজ নাম্বার সেট করুন।"]),
    faqs: [], related: [],
  },
  {
    id: "image-to-pdf", slug: "image-to-pdf", category: "pdf", icon: "FileImage",
    name: L("Image to PDF", "ইমেজ টু PDF"),
    description: L("Convert an image to PDF.", "ছবিকে PDF এ রূপান্তর।"),
    inputSchema: [{ name: "file", label: L("Image", "ছবি"), type: "file", accept: "image/*", required: true }],
    run: async (input) => {
      const file = input.file as File;
      if (!file) return { kind: "text", value: "No file" };
      const pdf = await PDFDocument.create();
      const bytes = await fileToBytes(file);
      let img;
      if (file.type === "image/png") img = await pdf.embedPng(bytes);
      else img = await pdf.embedJpg(bytes);
      const page = pdf.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      const out = await pdf.save();
      return { kind: "file", value: await pdfToDataUrl(out), filename: "image.pdf", mime: "application/pdf" };
    },
    seoTitle: L("Image to PDF", "ইমেজ টু PDF"),
    seoDescription: L("Convert image to PDF.", "ছবিকে PDF এ রূপান্তর।"),
    keywords: ["image to pdf"],
    instructions: LI(["Upload image."], ["ছবি আপলোড করুন।"]),
    faqs: [], related: [],
  },
  {
    id: "pdf-add-page-numbers", slug: "pdf-add-page-numbers", category: "pdf", icon: "Hash",
    name: L("PDF Add Page Numbers", "PDF পেজ নাম্বার যোগ"),
    description: L("Add page numbers to a PDF.", "PDF এ পেজ নাম্বার যোগ করুন।"),
    inputSchema: [{ name: "file", label: L("PDF", "PDF"), type: "file", accept: "application/pdf", required: true }],
    run: async (input) => {
      const file = input.file as File;
      if (!file) return { kind: "text", value: "No file" };
      const pdf = await PDFDocument.load(await fileToBytes(file));
      const pages = pdf.getPages();
      pages.forEach((p, i) => {
        p.drawText(String(i + 1), { x: p.getWidth() / 2 - 5, y: 20, size: 10 });
      });
      const bytes = await pdf.save();
      return { kind: "file", value: await pdfToDataUrl(bytes), filename: "numbered.pdf", mime: "application/pdf" };
    },
    seoTitle: L("PDF Add Page Numbers", "PDF পেজ নাম্বার যোগ"),
    seoDescription: L("Add page numbers to PDF.", "PDF এ পেজ নাম্বার যোগ।"),
    keywords: ["pdf page numbers"],
    instructions: LI(["Upload PDF."], ["PDF আপলোড করুন।"]),
    faqs: [], related: [],
  },
  {
    id: "pdf-merger", slug: "pdf-merger", category: "pdf", icon: "Combine",
    name: L("PDF Merger", "PDF মার্জার"),
    description: L("Merge multiple PDFs into one.", "একাধিক PDF একত্রিত করুন।"),
    inputSchema: [{ name: "files", label: L("PDFs", "PDFs"), type: "file", accept: "application/pdf", required: true, multiple: true }],
    run: async (input) => {
      const files = (input.files as File[]) || [];
      if (!files.length) return { kind: "text", value: "No files" };
      const out = await PDFDocument.create();
      for (const f of files) {
        const src = await PDFDocument.load(await fileToBytes(f));
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((p) => out.addPage(p));
      }
      const bytes = await out.save();
      return { kind: "file", value: await pdfToDataUrl(bytes), filename: "merged.pdf", mime: "application/pdf" };
    },
    seoTitle: L("PDF Merger", "PDF মার্জার"),
    seoDescription: L("Merge PDFs.", "PDF মার্জ।"),
    keywords: ["pdf merger"],
    instructions: LI(["Select multiple PDFs."], ["একাধিক PDF নির্বাচন করুন।"]),
    faqs: [], related: [],
  },
  {
    id: "pdf-split-to-zip", slug: "pdf-split-to-zip", category: "pdf", icon: "Archive",
    name: L("PDF Split to ZIP", "PDF স্প্লিট টু ZIP"),
    description: L("Split PDF pages into separate PDFs in a ZIP.", "PDF পেজগুলোকে আলাদা PDF হিসেবে ZIP এ স্প্লিট।"),
    inputSchema: [{ name: "file", label: L("PDF", "PDF"), type: "file", accept: "application/pdf", required: true }],
    run: async (input) => {
      const file = input.file as File;
      if (!file) return { kind: "text", value: "No file" };
      const src = await PDFDocument.load(await fileToBytes(file));
      const zip = new JSZip();
      for (let i = 0; i < src.getPageCount(); i++) {
        const out = await PDFDocument.create();
        const [p] = await out.copyPages(src, [i]);
        out.addPage(p);
        const bytes = await out.save();
        zip.file(`page-${i + 1}.pdf`, bytes);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = await new Promise<string>((resolve) => { const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.readAsDataURL(blob); });
      return { kind: "file", value: url, filename: "pages.zip", mime: "application/zip" };
    },
    seoTitle: L("PDF Split to ZIP", "PDF স্প্লিট টু ZIP"),
    seoDescription: L("Split PDF to ZIP.", "PDF স্প্লিট টু ZIP।"),
    keywords: ["pdf split zip"],
    instructions: LI(["Upload PDF."], ["PDF আপলোড করুন।"]),
    faqs: [], related: [],
  },
  {
    id: "pdf-to-image", slug: "pdf-to-image", category: "pdf", icon: "Image",
    name: L("PDF to Image", "PDF টু ইমেজ"),
    description: L("Render a PDF page to an image.", "PDF পেজকে ছবিতে রেন্ডার।"),
    inputSchema: [
      { name: "file", label: L("PDF", "PDF"), type: "file", accept: "application/pdf", required: true },
      { name: "pages", label: L("Pages (e.g. 1-3 or all)", "পেজ (যেমন 1-3 বা all)"), type: "text", placeholder: L("all", "all") },
      { name: "scale", label: L("Scale", "স্কেল"), type: "number", min: 1, max: 4, step: 0.5 },
    ],
    run: async (input, _locale, onProgress) => {
      void _locale;
      void onProgress;
      const file = input.file as File;
      if (!file) return { kind: "text", value: "No file" };
      const pdfjsLib = await getPdfjs();
      const buf = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      const total = pdf.numPages;
      const pagesSpec = String(input.pages || "all").trim().toLowerCase();
      let pageNums: number[] = [];
      if (pagesSpec === "all" || pagesSpec === "") {
        pageNums = Array.from({ length: total }, (_, i) => i + 1);
      } else if (pagesSpec.includes("-")) {
        const [a, b] = pagesSpec.split("-").map((x) => Number(x));
        const s = Math.max(1, a || 1);
        const e = Math.min(total, b || total);
        pageNums = Array.from({ length: e - s + 1 }, (_, i) => s + i);
      } else {
        pageNums = pagesSpec.split(",").map((x) => Number(x.trim())).filter((n) => n >= 1 && n <= total);
      }
      if (!pageNums.length) return { kind: "text", value: "No valid pages" };
      const scale = Number(input.scale) || 2;
      if (pageNums.length === 1) {
        const page = await pdf.getPage(pageNums[0]);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        return { kind: "image", value: canvas.toDataURL("image/png"), filename: `page-${pageNums[0]}.png` };
      }
      const { createZip } = await import("@/lib/zip");
      const outputs: { name: string; data: Uint8Array }[] = [];
      for (const n of pageNums) {
        const page = await pdf.getPage(n);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        const dataUrl = canvas.toDataURL("image/png");
        const base64 = dataUrl.split(",")[1];
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        outputs.push({ name: `page-${n}.png`, data: bytes });
      }
      const url = await createZip(outputs.map((o) => ({ name: o.name, data: o.data })));
      return { kind: "file", value: url, filename: "pages.zip", mime: "application/zip" };
    },
    seoTitle: L("PDF to Image", "PDF টু ইমেজ"),
    seoDescription: L("Render PDF page to image.", "PDF পেজকে ছবিতে রেন্ডার।"),
    keywords: ["pdf to image"],
    instructions: LI(["Upload PDF, set page and scale."], ["PDF আপলোড, পেজ ও স্কেল সেট করুন।"]),
    faqs: [], related: [],
  },
];
