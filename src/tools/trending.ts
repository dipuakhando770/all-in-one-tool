import type { ToolDefinition } from "@/lib/tools/types";
import type { Locale } from "@/lib/i18n";
import { getPdfjs } from "@/lib/pdf/pdfjs";

const L = (en: string, bn: string): Record<Locale, string> => ({ en, bn });
const LI = (en: string[], bn: string[]): Record<Locale, string[]> => ({ en, bn });

function fileToDataUrl(bytes: Uint8Array, mime: string): Promise<string> {
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: mime });
  return new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.readAsDataURL(blob);
  });
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("The image could not be read. It may be corrupted or unsupported."));
    };
    img.src = url;
  });
}

function escapeCsv(value: unknown, delimiter: string): string {
  const text = value === null || value === undefined ? "" : String(value);
  const needsQuotes = text.includes(delimiter) || text.includes('"') || /[\r\n]/.test(text);
  const escaped = text.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

export const trendingTools: ToolDefinition[] = [
  {
    id: "json-to-csv", slug: "json-to-csv", category: "developer", icon: "FileSpreadsheet",
    name: L("JSON to CSV Converter", "JSON থেকে CSV কনভার্টার"),
    description: L(
      "Convert JSON arrays into clean, spreadsheet-ready CSV files.",
      "JSON অ্যারে থেকে পরিষ্কার, স্প্রেডশিট-রেডি CSV ফাইল তৈরি করুন।"
    ),
    inputSchema: [
      {
        name: "json", label: L("JSON data", "JSON ডেটা"), type: "textarea", required: true,
        placeholder: L('[{"name":"Ayesha","city":"Dhaka"}]', '[{"name":"Ayesha","city":"Dhaka"}]'),
      },
      {
        name: "delimiter", label: L("Delimiter", "ডিলিমিটার"), type: "select", options: [
          { value: ",", label: L("Comma (,)", "কমা (,)") },
          { value: ";", label: L("Semicolon (;)", "সেমিকোলন (;)") },
          { value: "\t", label: L("Tab", "ট্যাব") },
        ],
      },
    ],
    run: (input) => {
      const raw = String(input.json || "").trim();
      if (!raw) throw new Error("Please paste JSON data first.");
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        throw new Error("Invalid JSON: " + (e as Error).message);
      }
      const delimiter = input.delimiter === ";" ? ";" : input.delimiter === "\t" ? "\t" : ",";
      const rows = Array.isArray(parsed) ? parsed : [parsed];
      if (rows.length === 0) throw new Error("The JSON array is empty.");

      const headers: string[] = [];
      const seen = new Set<string>();
      for (const row of rows) {
        if (row && typeof row === "object" && !Array.isArray(row)) {
          for (const key of Object.keys(row as Record<string, unknown>)) {
            if (!seen.has(key)) {
              seen.add(key);
              headers.push(key);
            }
          }
        }
      }
      if (headers.length === 0) throw new Error("JSON must contain an array of objects.");

      const lines = [headers.map((h) => escapeCsv(h, delimiter)).join(delimiter)];
      for (const row of rows) {
        const record = (row || {}) as Record<string, unknown>;
        lines.push(
          headers
            .map((h) => {
              const value = record[h];
              if (value !== null && typeof value === "object") {
                return escapeCsv(JSON.stringify(value), delimiter);
              }
              return escapeCsv(value, delimiter);
            })
            .join(delimiter)
        );
      }
      return { kind: "text", value: lines.join("\n"), filename: "data.csv", mime: "text/csv" };
    },
    seoTitle: L("JSON to CSV Converter — Free Online", "JSON থেকে CSV কনভার্টার — ফ্রি"),
    seoDescription: L(
      "Convert JSON arrays to CSV online for free. Flatten nested objects, choose a delimiter and download a spreadsheet-ready file in your browser.",
      "অনলাইনে বিনামূল্যে JSON অ্যারে থেকে CSV তৈরি করুন। ডিলিমিটার বেছে নিন এবং সরাসরি ডাউনলোড করুন।"
    ),
    keywords: ["json to csv", "convert json csv", "json csv converter", "json to excel"],
    instructions: LI(
      [
        "Paste a JSON array of objects (or a single object).",
        "Choose comma, semicolon or tab as the delimiter.",
        "Run the tool, then copy or download data.csv.",
      ],
      [
        "অবজেক্টের JSON অ্যারে (বা একটি অবজেক্ট) পেস্ট করুন।",
        "ডিলিমিটার হিসেবে কমা, সেমিকোলন বা ট্যাব বেছে নিন।",
        "চালিয়ে data.csv কপি বা ডাউনলোড করুন।",
      ]
    ),
    faqs: [
      {
        q: L("Are nested objects supported?", "নেস্টেড অবজেক্ট কি সাপোর্ট করে?"),
        a: L(
          "Yes. Nested values are serialized as JSON inside their CSV cell, so no data is lost.",
          "হ্যাঁ। নেস্টেড মান সেলে JSON হিসেবে রাখা হয়, তাই কোনো ডেটা হারায় না।"
        ),
      },
      {
        q: L("Is my data uploaded?", "আমার ডেটা আপলোড হয় কি?"),
        a: L(
          "No. Conversion runs entirely in your browser.",
          "না। সম্পূর্ণ কনভার্শন আপনার ব্রাউজারেই চলে।"
        ),
      },
    ],
    related: ["csv-to-json", "json-formatter", "json-validator"],
  },
  {
    id: "pdf-to-text", slug: "pdf-to-text", category: "pdf", icon: "FileType",
    name: L("PDF to Text Extractor", "PDF থেকে টেক্সট এক্সট্র্যাক্টর"),
    description: L(
      "Extract selectable text from PDF pages without uploading your file.",
      "ফাইল আপলোড ছাড়াই PDF পেজ থেকে টেক্সট বের করুন।"
    ),
    inputSchema: [
      {
        name: "file", label: L("PDF file", "PDF ফাইল"), type: "file",
        accept: "application/pdf", required: true,
        help: L("Text-based PDFs work best. Scanned images need OCR.", "টেক্সট-ভিত্তিক PDF সবচেয়ে ভালো কাজ করে। স্ক্যান করা ছবির জন্য OCR দরকার।"),
      },
      {
        name: "pages", label: L("Pages (empty = all)", "পেজ (খালি = সব)"), type: "text",
        placeholder: L("e.g. 1-3,5", "যেমন 1-3,5"),
      },
    ],
    run: async (input, _locale, onProgress) => {
      void _locale;
      const file = input.file as File;
      if (!file) throw new Error("Please select a PDF file.");
      if (file.size > 40 * 1024 * 1024) throw new Error("PDF is larger than the 40 MB browser limit.");
      const pdfjs = await getPdfjs();
      const data = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjs.getDocument({ data }).promise;
      const total = pdf.numPages;
      const spec = String(input.pages || "").trim();
      let pageNumbers = Array.from({ length: total }, (_, i) => i + 1);
      if (spec) {
        pageNumbers = [];
        for (const part of spec.split(",")) {
          const chunk = part.trim();
          if (!chunk) continue;
          if (chunk.includes("-")) {
            const [a, b] = chunk.split("-").map((x) => Number(x));
            const start = Math.max(1, Math.min(total, a || 1));
            const end = Math.max(start, Math.min(total, b || total));
            for (let n = start; n <= end; n++) pageNumbers.push(n);
          } else {
            const n = Number(chunk);
            if (n >= 1 && n <= total) pageNumbers.push(n);
          }
        }
        pageNumbers = Array.from(new Set(pageNumbers)).sort((a, b) => a - b);
      }
      if (pageNumbers.length === 0) throw new Error("No valid pages were selected.");

      const chunks: string[] = [];
      for (let i = 0; i < pageNumbers.length; i++) {
        onProgress?.({ fileIndex: i, total: pageNumbers.length, status: "start" });
        const page = await pdf.getPage(pageNumbers[i]);
        const content = await page.getTextContent();
        const text = content.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ")
          .replace(/[ \t]+/g, " ")
          .trim();
        chunks.push(`--- Page ${pageNumbers[i]} ---\n${text || "[No extractable text on this page]"}`);
        onProgress?.({ fileIndex: i, total: pageNumbers.length, status: "complete" });
      }
      const output = chunks.join("\n\n");
      const base = file.name.replace(/\.pdf$/i, "");
      return {
        kind: "text",
        value: output,
        filename: `${base || "document"}.txt`,
        mime: "text/plain",
      };
    },
    seoTitle: L("PDF to Text Extractor — Free Online", "PDF থেকে টেক্সট এক্সট্র্যাক্টর — ফ্রি"),
    seoDescription: L(
      "Extract text from PDF files online for free. Choose page ranges and download a .txt file. Processing happens locally in your browser.",
      "বিনামূল্যে অনলাইনে PDF থেকে টেক্সট বের করুন। পেজ রেঞ্জ বেছে নিন ও .txt ডাউনলোড করুন। প্রসেসিং ব্রাউজারেই হয়।"
    ),
    keywords: ["pdf to text", "extract text from pdf", "pdf text extractor", "pdf to txt"],
    instructions: LI(
      [
        "Select a text-based PDF (not a scanned image).",
        "Optionally enter page ranges such as 1-3,5.",
        "Run the tool and copy or download the extracted text.",
      ],
      [
        "টেক্সট-ভিত্তিক PDF নির্বাচন করুন (স্ক্যান করা ছবি নয়)।",
        "চাইলে 1-3,5 এর মতো পেজ রেঞ্জ দিন।",
        "চালিয়ে টেক্সট কপি বা ডাউনলোড করুন।",
      ]
    ),
    faqs: [
      {
        q: L("Why is the extracted text empty?", "টেক্সট খালি কেন?"),
        a: L(
          "Scanned PDFs store pages as images. Use an OCR tool first, then extract the text.",
          "স্ক্যান করা PDF পেজকে ছবি হিসেবে রাখে। আগে OCR ব্যবহার করুন, তারপর টেক্সট বের করুন।"
        ),
      },
    ],
    related: ["pdf-to-image", "pdf-page-count", "pdf-split-to-zip"],
  },
  {
    id: "pdf-watermark", slug: "pdf-watermark", category: "pdf", icon: "Stamp",
    name: L("PDF Watermark", "PDF ওয়াটারমার্ক"),
    description: L(
      "Add a diagonal or centered text watermark to every page of a PDF.",
      "PDF-এর প্রতিটি পেজে ডায়াগোনাল বা কেন্দ্রীভূত টেক্সট ওয়াটারমার্ক যোগ করুন।"
    ),
    inputSchema: [
      { name: "file", label: L("PDF file", "PDF ফাইল"), type: "file", accept: "application/pdf", required: true },
      {
        name: "text", label: L("Watermark text", "ওয়াটারমার্ক টেক্সট"), type: "text", required: true,
        placeholder: L("CONFIDENTIAL", "গোপনীয়"),
      },
      {
        name: "position", label: L("Position", "অবস্থান"), type: "select", options: [
          { value: "diagonal", label: L("Diagonal (recommended)", "ডায়াগোনাল (প্রস্তাবিত)") },
          { value: "center", label: L("Horizontal center", "অনুভূমিক কেন্দ্র") },
          { value: "footer", label: L("Footer", "ফুটার") },
        ],
      },
      { name: "opacity", label: L("Opacity (0.05–1)", "অস্বচ্ছতা (0.05–1)"), type: "number", min: 0.05, max: 1, step: 0.05 },
      { name: "fontSize", label: L("Font size", "ফন্ট সাইজ"), type: "number", min: 8, max: 120, step: 1 },
    ],
    run: async (input) => {
      const file = input.file as File;
      if (!file) throw new Error("Please select a PDF file.");
      const text = String(input.text || "").trim();
      if (!text) throw new Error("Please enter watermark text.");
      // Standard PDF fonts only support Latin-1 characters.
      if (/[^\u0000-\u00FF]/.test(text)) {
        throw new Error(
          "This watermark tool embeds a standard PDF font, so it supports Latin text only. Please use English characters."
        );
      }
      const { PDFDocument, StandardFonts, rgb, degrees } = await import("pdf-lib");
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);
      const opacity = Math.min(1, Math.max(0.05, Number(input.opacity) || 0.2));
      const size = Math.min(120, Math.max(8, Number(input.fontSize) || 42));

      for (const page of pdf.getPages()) {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, size);
        const position = String(input.position || "diagonal");
        let x = (width - textWidth) / 2;
        let y = height / 2;
        let rotate = degrees(0);
        if (position === "diagonal") {
          rotate = degrees(45);
          x = (width - textWidth * 0.72) / 2;
          y = height * 0.42;
        } else if (position === "footer") {
          x = (width - textWidth) / 2;
          y = 24;
        }
        page.drawText(text, { x, y, size, font, color: rgb(0.35, 0.35, 0.4), opacity, rotate });
      }
      const bytes = await pdf.save();
      const base = file.name.replace(/\.pdf$/i, "");
      return {
        kind: "file",
        value: await fileToDataUrl(bytes, "application/pdf"),
        filename: `${base || "document"}-watermarked.pdf`,
        mime: "application/pdf",
      };
    },
    seoTitle: L("Add Watermark to PDF Online — Free", "PDF-এ ওয়াটারমার্ক যোগ করুন — ফ্রি"),
    seoDescription: L(
      "Watermark PDF pages online for free. Add diagonal, centered or footer text, adjust opacity and download instantly. Files never leave your browser.",
      "বিনামূল্যে PDF পেজে ওয়াটারমার্ক দিন। ডায়াগোনাল, সেন্টার বা ফুটার টেক্সট, অস্বচ্ছতা নিয়ন্ত্রণ ও তাৎক্ষণিক ডাউনলোড।"
    ),
    keywords: ["pdf watermark", "watermark pdf", "add watermark pdf", "pdf stamp"],
    instructions: LI(
      [
        "Upload the PDF you want to watermark.",
        "Enter the watermark text and choose a position.",
        "Adjust opacity and font size, then run and download.",
      ],
      [
        "যে PDF-এ ওয়াটারমার্ক চান সেটি আপলোড করুন।",
        "ওয়াটারমার্ক টেক্সট লিখে অবস্থান বেছে নিন।",
        "অস্বচ্ছতা ও ফন্ট সাইজ ঠিক করে চালিয়ে ডাউনলোড করুন।",
      ]
    ),
    faqs: [
      {
        q: L("Can I use Bengali watermark text?", "বাংলা ওয়াটারমার্ক টেক্সট ব্যবহার করা যাবে?"),
        a: L(
          "Not yet. This tool embeds a standard PDF font that supports Latin characters only. Bengali text is rejected with a clear message instead of producing a broken file.",
          "এখনো নয়। টুলটি স্ট্যান্ডার্ড PDF ফন্ট ব্যবহার করে যা শুধু ল্যাটিন অক্ষর সমর্থন করে। বাংলা টেক্সট দিলে পরিষ্কার বার্তা দেখানো হয়।"
        ),
      },
      {
        q: L("Does it change the original file?", "মূল ফাইল কি পরিবর্তন হয়?"),
        a: L("No. You download a new watermarked copy.", "না। আপনি নতুন ওয়াটারমার্কযুক্ত কপি ডাউনলোড করেন।"),
      },
    ],
    related: ["pdf-merger", "pdf-split-to-zip", "pdf-add-page-numbers"],
  },
  {
    id: "image-watermark", slug: "image-watermark", category: "image", icon: "Stamp",
    name: L("Image Watermark", "ইমেজ ওয়াটারমার্ক"),
    description: L(
      "Stamp text watermarks onto JPG, PNG or WebP images in your browser.",
      "ব্রাউজারেই JPG, PNG বা WebP ছবিতে টেক্সট ওয়াটারমার্ক বসান।"
    ),
    inputSchema: [
      {
        name: "file", label: L("Image", "ছবি"), type: "file",
        accept: "image/png,image/jpeg,image/webp", required: true,
      },
      {
        name: "text", label: L("Watermark text", "ওয়াটারমার্ক টেক্সট"), type: "text", required: true,
        placeholder: L("© Your Name", "© আপনার নাম"),
      },
      {
        name: "position", label: L("Position", "অবস্থান"), type: "select", options: [
          { value: "bottom-right", label: L("Bottom right", "নিচে ডানে") },
          { value: "bottom-left", label: L("Bottom left", "নিচে বামে") },
          { value: "center", label: L("Center", "কেন্দ্রে") },
          { value: "tile", label: L("Repeated tile", "পুনরাবৃত্ত টাইল") },
        ],
      },
      { name: "opacity", label: L("Opacity (0.05–1)", "অস্বচ্ছতা (0.05–1)"), type: "number", min: 0.05, max: 1, step: 0.05 },
      {
        name: "color", label: L("Text color", "টেক্সট রঙ"), type: "color",
      },
      { name: "fontSize", label: L("Font size (px)", "ফন্ট সাইজ (px)"), type: "number", min: 8, max: 200, step: 1 },
    ],
    run: async (input) => {
      const file = input.file as File;
      if (!file) throw new Error("Please select an image.");
      if (file.size > 25 * 1024 * 1024) throw new Error("Image is larger than the 25 MB limit.");
      const text = String(input.text || "").trim();
      if (!text) throw new Error("Please enter watermark text.");
      const img = await loadImage(file);
      if (!img.width || !img.height) throw new Error("The image has invalid dimensions.");

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Your browser could not create a canvas context.");
      ctx.drawImage(img, 0, 0);

      const size = Math.min(200, Math.max(8, Number(input.fontSize) || Math.round(img.width / 22)));
      const opacity = Math.min(1, Math.max(0.05, Number(input.opacity) || 0.5));
      const color = /^#[0-9a-f]{6}$/i.test(String(input.color || "")) ? String(input.color) : "#FFFFFF";
      ctx.font = `600 ${size}px system-ui, -apple-system, "Segoe UI", sans-serif`;
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      ctx.textBaseline = "alphabetic";

      const position = String(input.position || "bottom-right");
      const padding = Math.round(img.width * 0.02);
      const metrics = ctx.measureText(text);
      if (position === "tile") {
        ctx.save();
        ctx.translate(img.width / 2, img.height / 2);
        ctx.rotate((-30 * Math.PI) / 180);
        const stepX = metrics.width + size * 2;
        const stepY = size * 5;
        for (let x = -img.width; x < img.width; x += stepX) {
          for (let y = -img.height; y < img.height; y += stepY) {
            ctx.fillText(text, x, y);
          }
        }
        ctx.restore();
      } else {
        let x = img.width - metrics.width - padding;
        let y = img.height - padding;
        if (position === "bottom-left") x = padding;
        if (position === "center") {
          x = (img.width - metrics.width) / 2;
          y = img.height / 2;
        }
        ctx.fillText(text, Math.max(padding, x), Math.max(size + padding, y));
      }

      const mime = file.type === "image/png" ? "image/png" : file.type === "image/webp" ? "image/webp" : "image/jpeg";
      const dataUrl = canvas.toDataURL(mime, 0.92);
      const ext = mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
      const base = file.name.replace(/\.[^.]+$/, "");
      return { kind: "image", value: dataUrl, filename: `${base || "image"}-watermarked.${ext}`, mime };
    },
    seoTitle: L("Add Watermark to Image Online — Free", "ছবিতে ওয়াটারমার্ক দিন — ফ্রি"),
    seoDescription: L(
      "Watermark images online for free. Add text to JPG, PNG or WebP photos, choose position, colour and opacity, then download the result.",
      "বিনামূল্যে ছবিতে ওয়াটারমার্ক দিন। JPG, PNG বা WebP ছবিতে টেক্সট, অবস্থান, রঙ ও অস্বচ্ছতা ঠিক করে ডাউনলোড করুন।"
    ),
    keywords: ["image watermark", "watermark photo", "add watermark to image", "photo watermark"],
    instructions: LI(
      [
        "Upload a JPG, PNG or WebP image.",
        "Enter the watermark text and pick a position.",
        "Set colour, opacity and size, then run and download.",
      ],
      [
        "JPG, PNG বা WebP ছবি আপলোড করুন।",
        "ওয়াটারমার্ক টেক্সট লিখে অবস্থান বেছে নিন।",
        "রঙ, অস্বচ্ছতা ও সাইজ ঠিক করে ডাউনলোড করুন।",
      ]
    ),
    faqs: [
      {
        q: L("Is the original image modified?", "মূল ছবি কি পরিবর্তিত হয়?"),
        a: L("No, a new watermarked copy is downloaded.", "না, নতুন ওয়াটারমার্কযুক্ত কপি ডাউনলোড হয়।"),
      },
    ],
    related: ["image-compressor", "image-resizer", "image-cropper"],
  },
  {
    id: "favicon-generator", slug: "favicon-generator", category: "image", icon: "Globe",
    name: L("Favicon Generator", "ফ্যাভিকন জেনারেটর"),
    description: L(
      "Turn a square image into a complete favicon and app-icon set as a ZIP.",
      "একটি বর্গাকার ছবি থেকে সম্পূর্ণ ফ্যাভিকন ও অ্যাপ-আইকন সেট ZIP আকারে তৈরি করুন।"
    ),
    inputSchema: [
      {
        name: "file", label: L("Square image", "বর্গাকার ছবি"), type: "file",
        accept: "image/png,image/jpeg,image/webp,image/svg+xml", required: true,
        help: L("At least 512×512 px gives the sharpest result.", "কমপক্ষে 512×512 পিক্সেল হলে সবচেয়ে ভালো ফল দেয়।"),
      },
      {
        name: "background", label: L("Background (for transparency)", "ব্যাকগ্রাউন্ড (ট্রান্সপারেন্সির জন্য)"), type: "color",
      },
    ],
    run: async (input, _locale, onProgress) => {
      void _locale;
      const file = input.file as File;
      if (!file) throw new Error("Please select an image.");
      if (file.size > 15 * 1024 * 1024) throw new Error("Image is larger than the 15 MB limit.");
      const img = await loadImage(file);
      const sizes = [16, 32, 48, 64, 180, 192, 512];
      const background = /^#[0-9a-f]{6}$/i.test(String(input.background || "")) ? String(input.background) : "#ffffff";
      const outputs: { name: string; data: Uint8Array }[] = [];

      for (let i = 0; i < sizes.length; i++) {
        const size = sizes[i];
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Your browser could not create a canvas context.");
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, size, size);
        const scale = Math.min(size / img.width, size / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
        const dataUrl = canvas.toDataURL("image/png");
        const binary = atob(dataUrl.split(",")[1]);
        const bytes = new Uint8Array(binary.length);
        for (let j = 0; j < binary.length; j++) bytes[j] = binary.charCodeAt(j);
        const name =
          size === 180 ? "apple-touch-icon.png" : `favicon-${size}x${size}.png`;
        outputs.push({ name, data: bytes });
        onProgress?.({ fileIndex: i, total: sizes.length, status: "complete" });
      }

      const manifest = JSON.stringify(
        {
          name: "My Website",
          short_name: "Website",
          icons: [
            { src: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
            { src: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
          ],
          theme_color: background,
          background_color: background,
          display: "standalone",
        },
        null,
        2
      );

      const readme = `Favicon package
===============
Generated locally with Nasir Tools.

Files:
${outputs.map((o) => `- ${o.name}`).join("\n")}
- site.webmanifest

Add this inside <head>:
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
`;
      outputs.push({ name: "site.webmanifest", data: new TextEncoder().encode(manifest) });
      outputs.push({ name: "README.txt", data: new TextEncoder().encode(readme) });

      const { createZip } = await import("@/lib/zip");
      const zipUrl = await createZip(outputs.map((o) => ({ name: o.name, data: o.data })));
      return { kind: "file", value: zipUrl, filename: "favicon-package.zip", mime: "application/zip" };
    },
    seoTitle: L("Favicon Generator — Free Icon Package", "ফ্যাভিকন জেনারেটর — ফ্রি আইকন প্যাকেজ"),
    seoDescription: L(
      "Generate favicons and app icons from one image. Download 16–512 px PNG icons, an Apple touch icon and a web manifest as a ZIP.",
      "একটি ছবি থেকে ফ্যাভিকন ও অ্যাপ আইকন তৈরি করুন। ১৬–৫১২ পিক্সেল PNG, Apple touch icon ও web manifest ZIP-এ ডাউনলোড করুন।"
    ),
    keywords: ["favicon generator", "favicon maker", "site icon generator", "apple touch icon"],
    instructions: LI(
      [
        "Upload a square PNG, JPG, WebP or SVG image.",
        "Choose a background colour for transparent areas.",
        "Run and download the ZIP, then copy the files to your site root.",
      ],
      [
        "বর্গাকার PNG, JPG, WebP বা SVG ছবি আপলোড করুন।",
        "ট্রান্সপারেন্ট অংশের জন্য ব্যাকগ্রাউন্ড রঙ বেছে নিন।",
        "চালিয়ে ZIP ডাউনলোড করুন ও ফাইলগুলো সাইট রুটে রাখুন।",
      ]
    ),
    faqs: [
      {
        q: L("Which favicon size should I use?", "কোন সাইজের ফ্যাভিকন ব্যবহার করব?"),
        a: L(
          "Browsers mainly use 16×16 and 32×32; mobile home screens use 180×180 and 192×192; 512×512 is used by some platforms and app manifests.",
          "ব্রাউজার মূলত ১৬×১৬ ও ৩২×৩২ ব্যবহার করে; মোবাইল হোম স্ক্রিনে ১৮০×১৮০ ও ১৯২×১৯২; কিছু প্ল্যাটফর্মে ৫১২×৫১২।"
        ),
      },
    ],
    related: ["image-resizer", "image-format-converter", "image-compressor"],
  },
  {
    id: "password-generator", slug: "password-generator", category: "developer", icon: "KeyRound",
    name: L("Password Generator", "পাসওয়ার্ড জেনারেটর"),
    description: L(
      "Create strong random passwords with a cryptographically secure generator.",
      "ক্রিপ্টোগ্রাফিকভাবে নিরাপদ র‍্যান্ডম পাসওয়ার্ড তৈরি করুন।"
    ),
    inputSchema: [
      { name: "length", label: L("Length", "দৈর্ঘ্য"), type: "number", min: 4, max: 128, step: 1 },
      { name: "count", label: L("How many", "কতটি"), type: "number", min: 1, max: 20, step: 1 },
      { name: "uppercase", label: L("Include uppercase (A–Z)", "বড় হাতের অক্ষর (A–Z)"), type: "checkbox" },
      { name: "lowercase", label: L("Include lowercase (a–z)", "ছোট হাতের অক্ষর (a–z)"), type: "checkbox" },
      { name: "numbers", label: L("Include numbers (0–9)", "সংখ্যা (0–9)"), type: "checkbox" },
      { name: "symbols", label: L("Include symbols (!@#$…)", "চিহ্ন (!@#$…)"), type: "checkbox" },
      { name: "excludeAmbiguous", label: L("Avoid look-alike characters (O0l1I)", "একই রকম দেখতে অক্ষর এড়িয়ে যান (O0l1I)"), type: "checkbox" },
    ],
    run: (input) => {
      const length = Math.min(128, Math.max(4, Number(input.length) || 16));
      const count = Math.min(20, Math.max(1, Number(input.count) || 5));
      const sets: string[] = [];
      if (input.uppercase !== false) sets.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
      if (input.lowercase !== false) sets.push("abcdefghijklmnopqrstuvwxyz");
      if (input.numbers !== false) sets.push("0123456789");
      if (input.symbols) sets.push("!@#$%^&*()-_=+[]{};:,.?/");
      if (sets.length === 0) throw new Error("Select at least one character type.");
      const ambiguous = /[O0l1I|`'"]/;
      const cleaned = sets.map((set) =>
        input.excludeAmbiguous ? set.replace(/[O0l1I|`'"]/g, "") : set
      ).filter(Boolean);
      if (cleaned.length === 0) throw new Error("No characters remain after excluding look-alikes.");
      if (length < cleaned.length) throw new Error("Length is too short for the selected character types.");

      const randomInt = (max: number) => {
        const buffer = new Uint32Array(1);
        const limit = Math.floor(0x100000000 / max) * max;
        let value = 0;
        do {
          crypto.getRandomValues(buffer);
          value = buffer[0];
        } while (value >= limit);
        return value % max;
      };

      const passwords: string[] = [];
      for (let n = 0; n < count; n++) {
        const chars: string[] = cleaned.map((set) => set[randomInt(set.length)]);
        const pool = cleaned.join("");
        while (chars.length < length) chars.push(pool[randomInt(pool.length)]);
        for (let i = chars.length - 1; i > 0; i--) {
          const j = randomInt(i + 1);
          [chars[i], chars[j]] = [chars[j], chars[i]];
        }
        passwords.push(chars.join(""));
      }
      void ambiguous;
      return {
        kind: "text",
        value: passwords.join("\n"),
        filename: "passwords.txt",
        mime: "text/plain",
      };
    },
    seoTitle: L("Strong Password Generator — Free & Secure", "শক্তিশালী পাসওয়ার্ড জেনারেটর — ফ্রি"),
    seoDescription: L(
      "Generate strong random passwords in your browser. Choose length, symbols and how many passwords; nothing is sent to a server.",
      "ব্রাউজারেই শক্তিশালী র‍্যান্ডম পাসওয়ার্ড তৈরি করুন। দৈর্ঘ্য, চিহ্ন ও সংখ্যা বেছে নিন; কিছুই সার্ভারে যায় না।"
    ),
    keywords: ["password generator", "strong password", "random password", "secure password"],
    instructions: LI(
      [
        "Set the password length and how many you need.",
        "Choose which character types to include.",
        "Run and copy the passwords you want to keep.",
      ],
      [
        "পাসওয়ার্ডের দৈর্ঘ্য ও সংখ্যা ঠিক করুন।",
        "কোন ধরনের অক্ষর থাকবে বেছে নিন।",
        "চালিয়ে প্রয়োজনীয় পাসওয়ার্ড কপি করুন।",
      ]
    ),
    faqs: [
      {
        q: L("Are the passwords truly random?", "পাসওয়ার্ড কি সত্যিই র‍্যান্ডম?"),
        a: L(
          "Yes. They are generated with Web Crypto (crypto.getRandomValues), not Math.random.",
          "হ্যাঁ। এগুলো Web Crypto (crypto.getRandomValues) দিয়ে তৈরি, Math.random নয়।"
        ),
      },
      {
        q: L("Are passwords stored anywhere?", "পাসওয়ার্ড কোথাও সংরক্ষিত হয়?"),
        a: L("No. They exist only in this page until you copy them.", "না। কপি করার আগ পর্যন্ত শুধু এই পেজেই থাকে।"),
      },
    ],
    related: ["password-strength-checker", "hash-generator", "uuid-generator"],
  },
  {
    id: "cron-expression-generator", slug: "cron-expression-generator", category: "developer", icon: "CalendarClock",
    name: L("Cron Expression Generator", "ক্রন এক্সপ্রেশন জেনারেটর"),
    description: L(
      "Build and understand five-field cron schedules with a plain-language summary.",
      "পাঁচ-ফিল্ড ক্রন শিডিউল তৈরি করুন ও সহজ ভাষায় ব্যাখ্যা দেখুন।"
    ),
    inputSchema: [
      { name: "minute", label: L("Minute (0–59)", "মিনিট (0–59)"), type: "text", placeholder: L("0 or */5", "0 বা */5") },
      { name: "hour", label: L("Hour (0–23)", "ঘণ্টা (0–23)"), type: "text", placeholder: L("*", "*") },
      { name: "day", label: L("Day of month (1–31)", "মাসের দিন (1–31)"), type: "text", placeholder: L("*", "*") },
      { name: "month", label: L("Month (1–12)", "মাস (1–12)"), type: "text", placeholder: L("*", "*") },
      { name: "weekday", label: L("Day of week (0–6, Sun=0)", "সপ্তাহের দিন (0–6, রবি=0)"), type: "text", placeholder: L("*", "*") },
    ],
    run: (input) => {
      const fields = {
        minute: String(input.minute ?? "0").trim() || "0",
        hour: String(input.hour ?? "*").trim() || "*",
        day: String(input.day ?? "*").trim() || "*",
        month: String(input.month ?? "*").trim() || "*",
        weekday: String(input.weekday ?? "*").trim() || "*",
      };
      const validField = /^(\*|\d+|\*\/\d+|\d+-\d+|\d+(,\d+)*|(\*|\d+-\d+|\d+)(\/(\d+))?)$/;
      for (const [name, value] of Object.entries(fields)) {
        if (!validField.test(value)) {
          throw new Error(
            `Invalid ${name} field "${value}". Use *, numbers, ranges (1-5), lists (1,3,5) or steps (*/5).`
          );
        }
      }

      const describeField = (value: string, kind: "minute" | "hour" | "day" | "month" | "weekday"): string => {
        if (value === "*") {
          return {
            minute: "every minute",
            hour: "every hour",
            day: "every day of the month",
            month: "every month",
            weekday: "every day of the week",
          }[kind];
        }
        if (value.startsWith("*/")) {
          const step = value.slice(2);
          return {
            minute: `every ${step} minutes`,
            hour: `every ${step} hours`,
            day: `every ${step} days`,
            month: `every ${step} months`,
            weekday: `every ${step} days of the week`,
          }[kind];
        }
        if (value.includes("-")) {
          const [a, b] = value.split("-");
          return {
            minute: `at minutes ${a} through ${b}`,
            hour: `during hours ${a} through ${b}`,
            day: `on days ${a} through ${b}`,
            month: `in months ${a} through ${b}`,
            weekday: `on weekdays ${a} through ${b}`,
          }[kind];
        }
        if (value.includes(",")) {
          return {
            minute: `at minutes ${value}`,
            hour: `during hours ${value}`,
            day: `on days ${value}`,
            month: `in months ${value}`,
            weekday: `on weekdays ${value}`,
          }[kind];
        }
        return {
          minute: `at minute ${value}`,
          hour: `during hour ${value}`,
          day: `on day ${value} of the month`,
          month: `in month ${value}`,
          weekday: `on weekday ${value}`,
        }[kind];
      };

      const expression = `${fields.minute} ${fields.hour} ${fields.day} ${fields.month} ${fields.weekday}`;
      const summary = [
        `Runs ${describeField(fields.minute, "minute")}`,
        describeField(fields.hour, "hour"),
        describeField(fields.day, "day"),
        describeField(fields.month, "month"),
        describeField(fields.weekday, "weekday"),
      ].join(", ") + ".";

      return {
        kind: "text",
        value: `Cron expression:\n${expression}\n\nPlain-language summary:\n${summary}\n\nFields: minute hour day-of-month month day-of-week\nNote: this summary is approximate; verify against your scheduler.`,
      };
    },
    seoTitle: L("Cron Expression Generator — Free", "ক্রন এক্সপ্রেশন জেনারেটর — ফ্রি"),
    seoDescription: L(
      "Build five-field cron expressions with a readable explanation. Supports steps, ranges and lists for Linux crontab and schedulers.",
      "পাঁচ-ফিল্ড ক্রন এক্সপ্রেশন তৈরি করুন ও সহজ ব্যাখ্যা পান। স্টেপ, রেঞ্জ ও লিস্ট সমর্থিত।"
    ),
    keywords: ["cron generator", "cron expression", "crontab generator", "cron schedule"],
    instructions: LI(
      [
        "Enter each cron field (minute, hour, day, month, weekday).",
        "Use * for every value, */5 for steps, 1-5 for ranges, 1,3 for lists.",
        "Run to get the expression and an approximate explanation.",
      ],
      [
        "প্রতিটি ক্রন ফিল্ড দিন (মিনিট, ঘণ্টা, দিন, মাস, সপ্তাহের দিন)।",
        "সব মানে *, স্টেপে */5, রেঞ্জে 1-5, লিস্টে 1,3 ব্যবহার করুন।",
        "চালিয়ে এক্সপ্রেশন ও আনুমানিক ব্যাখ্যা নিন।",
      ]
    ),
    faqs: [
      {
        q: L("Which cron format is used?", "কোন ক্রন ফরম্যাট ব্যবহার হয়?"),
        a: L(
          "Standard five-field cron (minute hour day month weekday), as used by most Linux crontab and schedulers.",
          "স্ট্যান্ডার্ড পাঁচ-ফিল্ড ক্রন (মিনিট ঘণ্টা দিন মাস সপ্তাহের দিন), যা বেশিরভাগ Linux crontab-এ ব্যবহৃত হয়।"
        ),
      },
    ],
    related: ["unix-timestamp-converter", "regex-tester", "json-formatter"],
  },
  {
    id: "color-contrast-checker", slug: "color-contrast-checker", category: "developer", icon: "Contrast",
    name: L("Color Contrast Checker", "কালার কনট্রাস্ট চেকার"),
    description: L(
      "Check WCAG contrast ratios between text and background colours.",
      "টেক্সট ও ব্যাকগ্রাউন্ড রঙের মধ্যে WCAG কনট্রাস্ট অনুপাত যাচাই করুন।"
    ),
    inputSchema: [
      { name: "foreground", label: L("Text colour", "টেক্সট রঙ"), type: "color" },
      { name: "background", label: L("Background colour", "ব্যাকগ্রাউন্ড রঙ"), type: "color" },
    ],
    run: (input) => {
      const parse = (value: unknown): [number, number, number] => {
        const hex = String(value || "").trim().replace(/^#/, "");
        if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) {
          throw new Error(`Invalid colour "${value}". Use a hex value such as #1a2b3c.`);
        }
        const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
        return [
          parseInt(full.slice(0, 2), 16),
          parseInt(full.slice(2, 4), 16),
          parseInt(full.slice(4, 6), 16),
        ];
      };
      const luminance = ([r, g, b]: [number, number, number]) => {
        const channel = (v: number) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
      };
      const fg = parse(input.foreground ?? "#111111");
      const bg = parse(input.background ?? "#ffffff");
      const l1 = luminance(fg);
      const l2 = luminance(bg);
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      const rounded = Math.round(ratio * 100) / 100;
      const pass = (threshold: number) => (ratio >= threshold ? "PASS" : "FAIL");

      return {
        kind: "text",
        value: [
          `Contrast ratio: ${rounded}:1`,
          "",
          "WCAG 2.1 results:",
          `  Normal text (AA, 4.5:1):      ${pass(4.5)}`,
          `  Large text (AA, 3:1):         ${pass(3)}`,
          `  Normal text (AAA, 7:1):       ${pass(7)}`,
          `  Large text (AAA, 4.5:1):      ${pass(4.5)}`,
          `  UI components (AA, 3:1):      ${pass(3)}`,
          "",
          "Large text means 18pt (24px) regular or 14pt (18.66px) bold and above.",
          "Ratios below 3:1 should not be used for meaningful text or controls.",
        ].join("\n"),
      };
    },
    seoTitle: L("WCAG Color Contrast Checker — Free", "WCAG কালার কনট্রাস্ট চেকার — ফ্রি"),
    seoDescription: L(
      "Check text and background colour contrast against WCAG AA and AAA thresholds. Get the exact ratio and pass/fail results instantly.",
      "WCAG AA ও AAA মানদণ্ডে টেক্সট ও ব্যাকগ্রাউন্ড রঙের কনট্রাস্ট যাচাই করুন। সঠিক অনুপাত ও ফলাফল তাৎক্ষণিক পান।"
    ),
    keywords: ["color contrast checker", "wcag contrast", "accessibility contrast", "contrast ratio"],
    instructions: LI(
      [
        "Pick the text colour and background colour.",
        "Run the checker.",
        "Aim for at least 4.5:1 for normal text and 3:1 for large text.",
      ],
      [
        "টেক্সট ও ব্যাকগ্রাউন্ডের রঙ বেছে নিন।",
        "চেকার চালান।",
        "সাধারণ টেক্সটে কমপক্ষে ৪.৫:১ এবং বড় টেক্সটে ৩:১ লক্ষ্য রাখুন।",
      ]
    ),
    faqs: [
      {
        q: L("What ratio should I target?", "কত অনুপাত লক্ষ্য করব?"),
        a: L(
          "WCAG AA requires 4.5:1 for normal text, 3:1 for large text and 3:1 for UI components. AAA requires 7:1 for normal text.",
          "WCAG AA-তে সাধারণ টেক্সটে ৪.৫:১, বড় টেক্সটে ৩:১ এবং UI উপাদানে ৩:১ প্রয়োজন। AAA-তে সাধারণ টেক্সটে ৭:১।"
        ),
      },
    ],
    related: ["color-converter", "color-picker", "web-color-tester"],
  },
];
