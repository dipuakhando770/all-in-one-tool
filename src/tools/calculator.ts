import type { ToolDefinition } from "@/lib/tools/types";
import type { Locale } from "@/lib/i18n";

const L = (en: string, bn: string): Record<Locale, string> => ({ en, bn });
const LI = (en: string[], bn: string[]): Record<Locale, string[]> => ({ en, bn });

export const calculatorTools: ToolDefinition[] = [
  {
    id: "age-calculator", slug: "age-calculator", category: "calculator", icon: "Calendar",
    name: L("Age Calculator", "বয়স ক্যালকুলেটর"),
    description: L("Calculate age from date of birth.", "জন্মতারিখ থেকে বয়স হিসাব।"),
    inputSchema: [{ name: "dob", label: L("Date of Birth", "জন্মতারিখ"), type: "text", placeholder: L("YYYY-MM-DD", "YYYY-MM-DD"), required: true }],
    run: (input) => {
      const dob = new Date(String(input.dob));
      if (isNaN(dob.getTime())) return { kind: "text", value: "Invalid date" };
      const now = new Date();
      let y = now.getFullYear() - dob.getFullYear();
      let m = now.getMonth() - dob.getMonth();
      let d = now.getDate() - dob.getDate();
      if (d < 0) { m -= 1; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
      if (m < 0) { y -= 1; m += 12; }
      return { kind: "text", value: `${y} years, ${m} months, ${d} days` };
    },
    seoTitle: L("Age Calculator", "বয়স ক্যালকুলেটর"),
    seoDescription: L("Calculate your age.", "আপনার বয়স হিসাব করুন।"),
    keywords: ["age calculator"],
    instructions: LI(["Enter date of birth (YYYY-MM-DD)."], ["জন্মতারিখ লিখুন (YYYY-MM-DD)।"]),
    faqs: [],
    related: ["date-calculator"],
  },
  {
    id: "percentage-calculator", slug: "percentage-calculator", category: "calculator", icon: "Percent",
    name: L("Percentage Calculator", "শতকরা ক্যালকুলেটর"),
    description: L("Calculate percentages easily.", "সহজে শতকরা হিসাব।"),
    inputSchema: [
      { name: "value", label: L("Value", "ভ্যালু"), type: "number", required: true },
      { name: "total", label: L("Total", "মোট"), type: "number", required: true },
    ],
    run: (input) => {
      const v = Number(input.value), t = Number(input.total);
      if (t === 0) return { kind: "text", value: "Total cannot be 0" };
      const pct = (v / t) * 100;
      return { kind: "text", value: `${v} is ${pct.toFixed(2)}% of ${t}` };
    },
    seoTitle: L("Percentage Calculator", "শতকরা ক্যালকুলেটর"),
    seoDescription: L("Calculate percentage.", "শতকরা হিসাব।"),
    keywords: ["percentage calculator"],
    instructions: LI(["Enter value and total."], ["ভ্যালু ও মোট দিন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "discount-calculator", slug: "discount-calculator", category: "calculator", icon: "Tag",
    name: L("Discount Calculator", "ডিসকাউন্ট ক্যালকুলেটর"),
    description: L("Calculate discounted price.", "ডিসকাউন্টেড দাম হিসাব।"),
    inputSchema: [
      { name: "price", label: L("Original Price", "মূল দাম"), type: "number", required: true },
      { name: "discount", label: L("Discount %", "ডিসকাউন্ট %"), type: "number", required: true },
    ],
    run: (input) => {
      const p = Number(input.price), d = Number(input.discount);
      const final = p - (p * d) / 100;
      return { kind: "text", value: `Discounted price: ${final.toFixed(2)}\nYou save: ${(p - final).toFixed(2)}` };
    },
    seoTitle: L("Discount Calculator", "ডিসকাউন্ট ক্যালকুলেটর"),
    seoDescription: L("Calculate discount.", "ডিসকাউন্ট হিসাব।"),
    keywords: ["discount calculator"],
    instructions: LI(["Enter price and discount."], ["দাম ও ডিসকাউন্ট দিন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "vat-calculator", slug: "vat-calculator", category: "calculator", icon: "Receipt",
    name: L("VAT Calculator", "VAT ক্যালকুলেটর"),
    description: L("Add or remove VAT.", "VAT যোগ/বিয়োগ।"),
    inputSchema: [
      { name: "amount", label: L("Amount", "পরিমাণ"), type: "number", required: true },
      { name: "rate", label: L("VAT %", "VAT %"), type: "number", required: true },
      { name: "mode", label: L("Mode", "মোড"), type: "select", options: [
        { value: "add", label: L("Add VAT", "VAT যোগ") },
        { value: "remove", label: L("Remove VAT", "VAT বিয়োগ") },
      ] },
    ],
    run: (input) => {
      const a = Number(input.amount), r = Number(input.rate);
      if (input.mode === "remove") {
        const net = a / (1 + r / 100);
        return { kind: "text", value: "Net: " + net.toFixed(2) + "\nVAT: " + (a - net).toFixed(2) };
      }
      const vat = a * (r / 100);
      return { kind: "text", value: "VAT: " + vat.toFixed(2) + "\nTotal: " + (a + vat).toFixed(2) };
    },
    seoTitle: L("VAT Calculator", "VAT ক্যালকুলেটর"),
    seoDescription: L("Calculate VAT.", "VAT হিসাব।"),
    keywords: ["vat calculator"],
    instructions: LI(["Enter amount and rate."], ["পরিমাণ ও রেট দিন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "loan-calculator", slug: "loan-calculator", category: "calculator", icon: "Landmark",
    name: L("Loan Calculator", "লোন ক্যালকুলেটর"),
    description: L("Calculate monthly loan payment.", "মাসিক লোন পেমেন্ট হিসাব।"),
    inputSchema: [
      { name: "principal", label: L("Principal", "মূলধন"), type: "number", required: true },
      { name: "rate", label: L("Annual Rate %", "বার্ষিক রেট %"), type: "number", required: true },
      { name: "months", label: L("Months", "মাস"), type: "number", required: true },
    ],
    run: (input) => {
      const P = Number(input.principal), annual = Number(input.rate), n = Number(input.months);
      const r = annual / 100 / 12;
      const m = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      return { kind: "text", value: "Monthly payment: " + m.toFixed(2) + "\nTotal payment: " + (m * n).toFixed(2) + "\nTotal interest: " + (m * n - P).toFixed(2) };
    },
    seoTitle: L("Loan Calculator", "লোন ক্যালকুলেটর"),
    seoDescription: L("Calculate loan payments.", "লোন পেমেন্ট হিসাব।"),
    keywords: ["loan calculator"],
    instructions: LI(["Enter principal, rate, months."], ["মূলধন, রেট, মাস দিন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "unit-converter", slug: "unit-converter", category: "calculator", icon: "Ruler",
    name: L("Unit Converter", "ইউনিট কনভার্টার"),
    description: L("Convert length, weight and temperature.", "দৈর্ঘ্য, ওজন ও তাপমাত্রা রূপান্তর।"),
    inputSchema: [
      { name: "value", label: L("Value", "ভ্যালু"), type: "number", required: true },
      { name: "type", label: L("Type", "ধরন"), type: "select", options: [
        { value: "km-mi", label: L("km → miles", "km → miles") },
        { value: "mi-km", label: L("miles → km", "miles → km") },
        { value: "kg-lb", label: L("kg → lb", "kg → lb") },
        { value: "lb-kg", label: L("lb → kg", "lb → kg") },
        { value: "c-f", label: L("°C → °F", "°C → °F") },
        { value: "f-c", label: L("°F → °C", "°F → °C") },
      ] },
    ],
    run: (input) => {
      const v = Number(input.value);
      const factors: Record<string, number> = { "km-mi": 0.621371, "mi-km": 1.60934, "kg-lb": 2.20462, "lb-kg": 0.453592 };
      if (input.type === "c-f") return { kind: "text", value: String(v * 9 / 5 + 32) };
      if (input.type === "f-c") return { kind: "text", value: String((v - 32) * 5 / 9) };
      const f = factors[input.type];
      return { kind: "text", value: String(v * f) };
    },
    seoTitle: L("Unit Converter", "ইউনিট কনভার্টার"),
    seoDescription: L("Convert units.", "ইউনিট রূপান্তর।"),
    keywords: ["unit converter"],
    instructions: LI(["Enter value and type."], ["ভ্যালু ও ধরন দিন।"]),
    faqs: [],
    related: [],
  },
  {
    id: "tip-calculator", slug: "tip-calculator", category: "calculator", icon: "DollarSign",
    name: L("Tip Calculator", "টিপ ক্যালকুলেটর"),
    description: L("Calculate tip and total.", "টিপ ও মোট হিসাব।"),
    inputSchema: [
      { name: "bill", label: L("Bill", "বিল"), type: "number", required: true },
      { name: "tip", label: L("Tip %", "টিপ %"), type: "number", required: true },
      { name: "people", label: L("People", "জন"), type: "number", required: true },
    ],
    run: (input) => {
      const b = Number(input.bill), t = Number(input.tip), p = Math.max(1, Number(input.people));
      const tip = b * t / 100;
      const total = b + tip;
      return { kind: "text", value: "Tip: " + tip.toFixed(2) + "\nTotal: " + total.toFixed(2) + "\nPer person: " + (total / p).toFixed(2) };
    },
    seoTitle: L("Tip Calculator", "টিপ ক্যালকুলেটর"),
    seoDescription: L("Calculate tip.", "টিপ হিসাব।"),
    keywords: ["tip calculator"],
    instructions: LI(["Enter bill, tip, people."], ["বিল, টিপ, জন দিন।"]),
    faqs: [],
    related: [],
  },
];
