import type { ToolDefinition } from "@/lib/tools/types";
import type { Locale } from "@/lib/i18n";

const L = (en: string, bn: string): Record<Locale, string> => ({ en, bn });
const LI = (en: string[], bn: string[]): Record<Locale, string[]> => ({ en, bn });

// Online Code Editor - Browser-based IDE with Monaco Editor
// This tool uses a custom component: src/components/code-editor-ui.tsx
export const codeEditorTools: ToolDefinition[] = [
  {
    id: "online-code-editor",
    slug: "online-code-editor",
    category: "developer",
    icon: "Code2",
    name: L("Online Code Editor", "অনলাইন কোড এডিটর"),
    description: L(
      "Browser-based IDE with Monaco Editor. Edit HTML, CSS, JavaScript with live preview.",
      "মনাকো এডিটর সহ ব্রাউজার-ভিত্তিক IDE। HTML, CSS, JavaScript লাইভ প্রিভিউ সহ এডিট করুন।"
    ),
    // This tool uses a custom UI component, not inputSchema
    inputSchema: [],
    run: () => {
      return {
        kind: "text",
        value: "This tool uses an interactive code editor interface.",
      };
    },
    seoTitle: L(
      "Online Code Editor - Browser IDE | NASIR TOOLS",
      "অনলাইন কোড এডিটর - ব্রাউজার IDE | নাসির টুলস"
    ),
    seoDescription: L(
      "Free browser-based code editor with Monaco Editor. Write HTML, CSS, JavaScript with live preview. VS Code-like experience.",
      "মনাকো এডিটর সহ ফ্রি ব্রাউজার-ভিত্তিক কোড এডিটর। লাইভ প্রিভিউ সহ HTML, CSS, JavaScript লিখুন। VS Code-এর মতো অভিজ্ঞতা।"
    ),
    keywords: [
      "online code editor",
      "monaco editor",
      "browser ide",
      "html editor",
      "css editor",
      "javascript editor",
      "live preview",
      "code playground",
    ],
    instructions: LI(
      [
        "Create HTML, CSS, and JavaScript files.",
        "Use the file explorer to manage multiple files.",
        "Click tabs to switch between open files.",
        "Preview your code in real-time.",
        "Export your project as a ZIP file.",
      ],
      [
        "HTML, CSS এবং JavaScript ফাইল তৈরি করুন।",
        "একাধিক ফাইল পরিচালনা করতে ফাইল এক্সপ্লোরার ব্যবহার করুন।",
        "খোলা ফাইলগুলোর মধ্যে স্যুইচ করতে ট্যাবে ক্লিক করুন।",
        "আপনার কোড রিয়েল-টাইমে প্রিভিউ করুন।",
        "আপনার প্রজেক্ট ZIP ফাইল হিসাবে এক্সপোর্ট করুন।",
      ]
    ),
    faqs: [
      {
        q: L("What is Monaco Editor?", "মনাকো এডিটর কি?"),
        a: L(
          "Monaco Editor is the code editor that powers VS Code. It provides syntax highlighting, IntelliSense, and advanced editing features.",
          "মনাকো এডিটর হলো VS Code-এর কোড এডিটর। এটি সিনট্যাক্স হাইলাইটিং, ইন্টেলিসেন্স এবং উন্নত এডিটিং বৈশিষ্ট্য প্রদান করে।"
        ),
      },
      {
        q: L("Can I save my work?", "আমি কি আমার কাজ সেভ করতে পারি?"),
        a: L(
          "Your code is automatically saved in your browser's local storage. You can also export your project as a ZIP file.",
          "আপনার কোড স্বয়ংক্রিয়ভাবে আপনার ব্রাউজারের লোকাল স্টোরেজে সেভ হয়। আপনি আপনার প্রজেক্ট ZIP ফাইল হিসাবে এক্সপোর্ট করতে পারেন।"
        ),
      },
      {
        q: L("Does it work offline?", "এটি কি অফলাইনে কাজ করে?"),
        a: L(
          "Yes, once loaded, the editor works offline. Your code is stored locally in your browser.",
          "হ্যাঁ, একবার লোড হলে, এডিটর অফলাইনে কাজ করে। আপনার কোড আপনার ব্রাউজারে স্থানীয়ভাবে সংরক্ষিত থাকে।"
        ),
      },
    ],
    related: ["json-formatter", "html-formatter", "css-minifier"],
    popular: true,
    new: true,
  },
];
