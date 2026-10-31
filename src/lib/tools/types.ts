import type { Locale } from "@/lib/i18n";

export type LocalizedText = Record<Locale, string>;
export type LocalizedList = Record<Locale, string[]>;

export type ToolFieldOption = { value: string; label: LocalizedText };

export type ToolField = {
  name: string;
  label: LocalizedText;
  type: "text" | "textarea" | "number" | "select" | "checkbox" | "file" | "color" | "date";
  placeholder?: LocalizedText;
  options?: ToolFieldOption[];
  accept?: string;
  multiple?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  help?: LocalizedText;
};

export type ToolResult = {
  kind: "text" | "html" | "image" | "file" | "json";
  value: string;
  filename?: string;
  mime?: string;
};

export type ToolFaq = { q: LocalizedText; a: LocalizedText };

export type ToolDefinition = {
  id: string;
  slug: string;
  name: LocalizedText;
  category: string;
  icon: string;
  description: LocalizedText;
  inputSchema: ToolField[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  run: (input: Record<string, any>, locale: Locale, onProgress?: (event: { fileIndex: number; total: number; status: "start" | "complete" | "error"; error?: string }) => void) => Promise<ToolResult> | ToolResult;
  seoTitle: LocalizedText;
  seoDescription: LocalizedText;
  keywords: string[];
  instructions: LocalizedList;
  faqs: ToolFaq[];
  related: string[];
  popular?: boolean;
  new?: boolean;
};
