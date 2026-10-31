import type { ToolDefinition } from "@/lib/tools/types";
import type { Locale } from "@/lib/i18n";
import { PDFDocument } from "pdf-lib";

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
      pdf.getPages().forEach((p) => p.setRotation({ type: "degrees", angle: (p.getRotation().angle + deg) % 360 } as any));
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
];
