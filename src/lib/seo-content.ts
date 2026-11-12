import type { Locale } from "@/lib/i18n";

export interface SeoHowToStep {
  title: string;
  description: string;
}

export interface SeoExample {
  title: string;
  input: string;
  output: string;
  explanation?: string;
}

export interface SeoFaq {
  q: string;
  a: string;
}

export interface SeoGuideLink {
  title: string;
  href: string;
  snippet: string;
}

export interface ToolSeoContent {
  slug: string;
  lastUpdated: string;
  introduction: Record<Locale, string>;
  primaryUseCase: Record<Locale, string>;
  features: Record<Locale, string[]>;
  howToSteps: Record<Locale, SeoHowToStep[]>;
  examples: Record<Locale, SeoExample[]>;
  limitations: Record<Locale, string[]>;
  faq: Record<Locale, SeoFaq[]>;
  relatedTools: string[];
  relatedGuides?: Record<Locale, SeoGuideLink[]>;
}

export const priorityToolSeoContent: Record<string, ToolSeoContent> = {
  "image-compressor": {
    slug: "image-compressor",
    lastUpdated: "2026-11-12",
    introduction: {
      en: "Compress JPEG, PNG, and WebP images online directly in your browser without sacrificing visual quality. Whether you need to reduce picture file size for job portals, government applications, email attachments, or website speed optimization, Nasir Tools compresses your files 100% locally on your device with zero server uploads.",
      bn: "আপনার ব্রাউজারেই সরাসরি ছবির সাইজ কমান কোনো কোয়ালিটি না হারিয়ে। চাকরির আবেদন, সরকারি ফর্ম পূরণ, ইমেইল পাঠানো কিংবা ওয়েবসাইটের স্পিড বাড়ানোর জন্য জেপিজি (JPG), পিএনজি (PNG) বা ওয়েবপি (WebP) ছবির সাইজ কমাতে এটি সম্পূর্ণ নিরাপদ ও দ্রুত কাজ করে। আপনার কোনো ছবি সার্ভারে আপলোড হয় না—সবকিছু ডিভাইসের ভেতরেই প্রসেস হয়।",
    },
    primaryUseCase: {
      en: "Instantly reduce image file size from megabytes to kilobytes (e.g. 5MB to under 200KB) for document portals, web performance, and social sharing.",
      bn: "সরকারি পোর্টাল, চাকরির পরীক্ষা, পাসপোর্ট ফর্ম বা ওয়েবসাইটের জন্য ৫ মেগাবাইট বা তার চেয়ে বড় ছবি নিমেষেই ২০০ কেবি বা তার কমে কমিয়ে আনুন।",
    },
    features: {
      en: [
        "100% Client-Side Privacy: Images are processed via HTML5 Canvas in your browser; never sent to a remote server.",
        "Multi-Format Support: Seamlessly compresses JPEG, JPG, PNG, and WebP formats.",
        "Interactive Quality Control: Adjustable compression slider from 0.1 to 1.0 with live preview.",
        "Batch Compression: Upload and optimize multiple images simultaneously and download all as a ZIP package.",
        "Before & After Metrics: Shows exact original file size, compressed size, and percentage saved.",
      ],
      bn: [
        "শতভাগ নিরাপদ ও প্রাইভেট: ছবি কোনো দূরবর্তী সার্ভারে আপলোড হয় না, ব্রাউজারের ক্যানভাসেই প্রসেস হয়।",
        "জেপিজি, পিএনজি ও ওয়েবপি সাপোর্ট: যেকোনো ফরম্যাটের ছবির সাইজ দ্রুত অপ্টিমাইজ করা যায়।",
        "লাইভ কোয়ালিটি কন্ট্রোল: নিজের ইচ্ছেমতো ছবির মান বা কোয়ালিটি স্লাইডার দিয়ে নির্ধারণের সুবিধা।",
        "একসাথে একাধিক ছবি কম্প্রেস: একসাথে বহু ছবি নির্বাচন করে এক ক্লিকে জিপ (ZIP) ফাইলে ডাউনলোডের সুবিধা।",
        "আসল ও অপ্টিমাইজড সাইজ প্রদর্শন: ছবি কত কেবি ছিল এবং কত শতাংশ সাইজ কমল তা তাৎক্ষণিক দেখতে পাওয়া যায়।",
      ],
    },
    howToSteps: {
      en: [
        {
          title: "Select or Drop Images",
          description: "Click the upload box or drag-and-drop one or multiple photos (JPG, PNG, or WebP) from your device.",
        },
        {
          title: "Adjust Compression Quality",
          description: "Move the quality slider (recommended 0.7 to 0.8 for the best balance of file size reduction and crystal-clear clarity).",
        },
        {
          title: "Click Process & Download",
          description: "Hit 'Process All'. Review the savings percentage, preview your compressed photos, and download individually or as a single ZIP archive.",
        },
      ],
      bn: [
        {
          title: "ছবি নির্বাচন বা ড্রপ করুন",
          description: "আপনার ফোন বা কম্পিউটার থেকে এক বা একাধিক ছবি (JPG, PNG বা WebP) সিলেক্ট করুন অথবা ড্র্যাগ করে আনুন।",
        },
        {
          title: "কোয়ালিটি বা মান নির্ধারণ করুন",
          description: "স্লাইডারটি ০.৭ বা ০.৮ এ রাখুন, যাতে সাইজ অনেক কমে কিন্তু ছবির স্পষ্টতা অক্ষুণ্ণ থাকে।",
        },
        {
          title: "প্রসেস ও ডাউনলোড করুন",
          description: "'Process' বাটনে চাপ দিন। ছবির সাইজ কত কেবি কমল তা দেখে সরাসরি ডাউনলোড বা জিপ ফাইলে সেভ করুন।",
        },
      ],
    },
    examples: {
      en: [
        {
          title: "Digital Camera / Smartphone Photo",
          input: "4.8 MB JPEG photo (4000x3000px)",
          output: "420 KB optimized JPEG (-91% reduction)",
          explanation: "Drastically reduces heavy smartphone camera photos to a web-ready size without noticeable blur.",
        },
        {
          title: "Scanned Document / Job Application ID",
          input: "1.2 MB scanned certificate (PNG/JPG)",
          output: "185 KB JPEG (-84% reduction)",
          explanation: "Perfect for government application portals that strictly require files under 200 KB or 300 KB.",
        },
      ],
      bn: [
        {
          title: "স্মার্টফোনে তোলা ছবি",
          input: "৪.৮ মেগাবাইট (MB) ডিএসএলআর বা মোবাইলের ছবি",
          output: "৪২০ কিলোবাইট (KB) অপ্টিমাইজড ছবি (৯১% সাইজ সাশ্রয়)",
          explanation: "ছবি সোশ্যাল মিডিয়ায় বা বন্ধুদের পাঠানোর জন্য একদম হালকা ও স্পষ্ট হয়।",
        },
        {
          title: "চাকরির আবেদন বা পরীক্ষার ফর্মের ছবি",
          input: "১.৫ মেগাবাইট স্ক্যান করা পাসপোর্ট ছবি বা স্বাক্ষর",
          output: "৮৫ কিলোবাইট ফাইল (সরকারি পোর্টালে আপলোডের উপযোগী)",
          explanation: "বিসিএস, সরকারি চাকরি বা বিশ্ববিদ্যালয়ের ভর্তির পোর্টালে নির্ধারিত ২০০ বা ৩০০ কেবির সীমার মধ্যে ছবি নামিয়ে আনে।",
        },
      ],
    },
    limitations: {
      en: [
        "Compression is processed by your browser's RAM and CPU; batching 50+ massive 20MB RAW files at once may slow low-end mobile devices.",
        "PNG files containing transparent alpha channels will lose transparency if exported as JPEG.",
      ],
      bn: [
        "কম্প্রেস ব্রাউজারের নিজস্ব মেমোরি দিয়ে হয়; খুব দুর্বল ফোনে একসাথে ৫০টির বেশি বড় ফাইল দিলে কিছুটা ধীর হতে পারে।",
        "স্বচ্ছ বা ট্রান্সপারেন্ট পিএনজি ছবি জেপিজিতে রূপান্তর করলে ব্যাকগ্রাউন্ড সাদা হতে পারে।",
      ],
    },
    faq: {
      en: [
        {
          q: "Is it safe to compress private or scanned ID documents here?",
          a: "Yes, completely safe. Nasir Tools processes your images client-side using JavaScript and the HTML5 Canvas API in your browser. Your images are never transmitted across the network or stored on our servers.",
        },
        {
          q: "What is the best quality setting for web upload?",
          a: "A quality setting of 0.75 (75%) provides the ideal sweet spot—yielding 70% to 90% file size reduction with virtually no discernible loss in visual quality.",
        },
        {
          q: "Can I compress scanned pictures and PDF images?",
          a: "Yes, any standard image format (JPG, PNG, WebP) can be compressed. For PDF documents, use our dedicated PDF Compressor tool.",
        },
        {
          q: "Is there a limit on how many images I can compress?",
          a: "No artificial limits. You can process batches of photos freely without watermarks or registration.",
        },
      ],
      bn: [
        {
          q: "ব্যক্তিগত ছবি বা জাতীয় পরিচয়পত্র এখানে সাইজ কমানো কি নিরাপদ?",
          a: "হ্যাঁ, শতভাগ নিরাপদ। নাসির টুলস আপনার ছবি কোনো সার্ভারে পাঠায় না; আপনার ব্রাউজারের ভেতরেই লোকাল মেমোরি ব্যবহার করে ছবি প্রসেস হয়।",
        },
        {
          q: "অনলাইন ফরম পূরণের জন্য সেরা কোয়ালিটি সেটিং কোনটি?",
          a: "কোয়ালিটি স্লাইডার ০.৭ বা ০.৭৫ এ রাখলে ছবির পরিচ্ছন্নতা ঠিক রেখে ফাইল সাইজ ৮০-৯০% কমে যায়।",
        },
        {
          q: "এখানে কি কোনো ওয়াটারমার্ক যোগ করা হয়?",
          a: "না, নাসির টুলস সম্পূর্ণ ফ্রি এবং এতে কোনো ওয়াটারমার্ক বা বিজ্ঞাপনযুক্ত দাগ যুক্ত হয় না।",
        },
        {
          q: "একসাথে কয়টি ছবি কম্প্রেস করা যায়?",
          a: "আপনি একসাথে একাধিক ছবি আপলোড করে সবকটি একসাথে কম্প্রেস করতে পারবেন এবং জিপ ফাইলে নামিয়ে নিতে পারবেন।",
        },
      ],
    },
    relatedTools: ["image-resizer", "image-format-converter", "image-cropper", "pdf-compressor"],
    relatedGuides: {
      en: [
        {
          title: "Image Resizer Tool",
          href: "/en/tools/image-resizer",
          snippet: "Need specific pixel width and height? Resize your dimensions accurately.",
        },
        {
          title: "Image Format Converter",
          href: "/en/tools/image-format-converter",
          snippet: "Convert between PNG, JPG, and WebP formats in seconds.",
        },
      ],
      bn: [
        {
          title: "ইমেজ রিসাইজার টুল",
          href: "/bn/tools/image-resizer",
          snippet: "পাসপোর্ট ছবির নির্দিষ্ট পিক্সেল সাইজ (যেমন ৩০০x৩০০) করতে রিসাইজার ব্যবহার করুন।",
        },
        {
          title: "ইমেজ ফরম্যাট কনভার্টার",
          href: "/bn/tools/image-format-converter",
          snippet: "পিএনজি থেকে জেপিজি বা ওয়েবপিতে নিমেষেই রূপান্তর করুন।",
        },
      ],
    },
  },

  "percentage-calculator": {
    slug: "percentage-calculator",
    lastUpdated: "2026-11-12",
    introduction: {
      en: "Calculate percentages accurately with our instant percentage calculator. Perfect for exam scores, discounts, business profit margins, tax percentages, and investment growth rates. Enter your numbers to see the exact percentage, decimal equivalent, and step-by-step mathematical breakdown.",
      bn: "সহজে ও নির্ভুলভাবে শতকরা বা পার্সেন্টেজ হিসাব করুন। পরীক্ষার নম্বর শতকরায় রূপান্তর, কেনাকাটায় ছাড় বা ডিসকাউন্ট, ব্যবসায়িক লাভ-ক্ষতি, ব্যাংকের সুদের হার ও ভ্যাট-ট্যাক্স গণনার জন্য নাসির টুলসের শতকরা ক্যালকুলেটর অত্যন্ত কার্যকরী। ভ্যালু ও মোট সংখ্যা দিলেই মুহূর্তেই সঠিক ফলাফল চলে আসে।",
    },
    primaryUseCase: {
      en: "Determine what percentage one number is of another, calculate percentage increase/decrease, or find the value of a percentage share.",
      bn: "একটি সংখ্যা অপর সংখ্যার কত শতাংশ, মোট নম্বর থেকে শতকরা কত পেলেন, কিংবা শতকরা বৃদ্ধি বা হ্রাসের সঠিক হিসাব বের করতে ব্যবহার করুন।",
    },
    features: {
      en: [
        "Instant Calculation: Results compute automatically as you enter numbers.",
        "Clear Mathematical Formula Display: Shows how the formula (Value ÷ Total × 100) was applied.",
        "Division by Zero Protection: Clean validation preventing mathematical errors.",
        "Precision Formatting: Displays results rounded to two decimal places for financial accuracy.",
        "Bilingual Interface: Fully localized for both English and Bengali number workflows.",
      ],
      bn: [
        "তাৎক্ষণিক ফলাফল: সংখ্যা ইনপুট করলেই সেকেন্ডের মধ্যে শতকরা মান চলে আসে।",
        "সহজ সূত্র ও ব্যাখ্যা: (প্রাপ্ত মান ÷ মোট মান × ১০০) সূত্রটি কীভাবে কাজ করল তা পরিষ্কারভাবে প্রদর্শিত হয়।",
        "ভুল ইনপুট প্রতিরোধ: মোট মান শূন্য দিলে সতর্কবার্তা প্রদর্শন করে।",
        "দুই দশমিক স্থান পর্যন্ত সঠিকতা: হিসাব নিখুঁত রাখতে দশমিকের পর দুই ঘর পর্যন্ত হিসাব দেখায়।",
        "বাংলা ও ইংরেজি ইন্টারফেস: সহজে বোঝার জন্য বাংলায় পরিষ্কার নির্দেশনা।",
      ],
    },
    howToSteps: {
      en: [
        {
          title: "Enter the Value (Part)",
          description: "Type the specific portion or number you want to evaluate (e.g., your exam score of 450).",
        },
        {
          title: "Enter the Total (Whole)",
          description: "Type the total maximum amount (e.g., total marks of 500).",
        },
        {
          title: "View Instant Results",
          description: "Read your calculated percentage along with the formula breakdown. Click 'Copy' to use the result anywhere.",
        },
      ],
      bn: [
        {
          title: "প্রাপ্ত মান বা অংশ লিখুন",
          description: "যে সংখ্যাটির শতকরা বের করতে চান তা প্রথম ঘরে লিখুন (যেমন: পরীক্ষায় প্রাপ্ত নম্বর ৪৫0)।",
        },
        {
          title: "মোট মান লিখুন",
          description: "দ্বিতীয় ঘরে মোট সংখ্যাটি লিখুন (যেমন: সর্বমোট পরীক্ষা ৫০০ নম্বরের)।",
        },
        {
          title: "ফলাফল দেখুন ও কপি করুন",
          description: "'Run' বাটনে ক্লিক করলেই শতকরা ফলাফল দেখতে পাবেন এবং এক ক্লিকে কপি করতে পারবেন।",
        },
      ],
    },
    examples: {
      en: [
        {
          title: "Exam Marks Percentage",
          input: "Score: 425, Total: 500",
          output: "425 is 85.00% of 500",
          explanation: "Formula: (425 ÷ 500) × 100 = 85%",
        },
        {
          title: "Business Profit / Commission Share",
          input: "Commission: $750, Total Revenue: $5,000",
          output: "750 is 15.00% of 5000",
          explanation: "Formula: (750 ÷ 5000) × 100 = 15%",
        },
      ],
      bn: [
        {
          title: "পরীক্ষার নম্বর শতকরা করা",
          input: "প্রাপ্ত নম্বর: ৪২৫, মোট নম্বর: ৫০০",
          output: "৪২৫ হলো ৫০০ এর ৮৫.০০%",
          explanation: "সূত্র: (৪২৫ ÷ ৫০০) × ১০০ = ৮৫%",
        },
        {
          title: "বিক্রির কমিশন বা মুনাফা",
          input: "কমিশন: ৭৫০ টাকা, মোট বিক্রয়: ৫,০০০ টাকা",
          output: "৭৫০ হলো ৫০০০ এর ১৫.০০%",
          explanation: "সূত্র: (৭৫০ ÷ ৫০০০) × ১০০ = ১৫%",
        },
      ],
    },
    limitations: {
      en: [
        "The total amount cannot be zero (division by zero is undefined).",
        "Calculations assume standard decimal numbers.",
      ],
      bn: [
        "মোট সংখ্যা শূন্য (০) হতে পারবে না, কারণ গণিতে শূন্য দিয়ে ভাগ করা যায় না।",
        "শুধুমাত্র বাস্তব সংখ্যার ক্ষেত্রে প্রযোজ্য।",
      ],
    },
    faq: {
      en: [
        {
          q: "How do you calculate percentage manually?",
          a: "Divide the value by the total amount, then multiply the result by 100. Formula: Percentage = (Value / Total) * 100.",
        },
        {
          q: "How do I calculate what percentage I scored in exams?",
          a: "Take your obtained marks, divide by the maximum possible total marks, and multiply by 100. For instance, (450 / 500) * 100 = 90%.",
        },
        {
          q: "Can the percentage exceed 100%?",
          a: "Yes! If the value is larger than the total (e.g. 150 out of 100), the result will be 150%, representing a 50% surplus or growth.",
        },
      ],
      bn: [
        {
          q: "শতকরা হিসাব করার সহজ নিয়ম কী?",
          a: "প্রাপ্ত মানকে মোট মান দিয়ে ভাগ করে ১০০ দিয়ে গুণ করলেই শতকরা বের হয়ে যায়। সূত্র: শতকরা = (মান ÷ মোট) × ১০০।",
        },
        {
          q: "পরীক্ষায় শতকরা কত পেলাম কীভাবে বের করব?",
          a: "আপনার মোট প্রাপ্ত নম্বরকে সর্বমোট নম্বর দিয়ে ভাগ করে ১০০ দিয়ে গুণ করুন। যেমন: ৫০০ এর মধ্যে ৪০০ পেলে: (৪০০ ÷ ৫০০) × ১০০ = ৮০%।",
        },
        {
          q: "শতকরা কি ১০০ এর বেশি হতে পারে?",
          a: "হ্যাঁ, যদি প্রাপ্ত মান মূল পরিমাণের চেয়ে বড় হয় (যেমন ১০০ টাকার জিনিস ১৫০ টাকায় বিক্রি), তবে তা ১৫০% হবে।",
        },
      ],
    },
    relatedTools: ["discount-calculator", "vat-calculator", "loan-emi-calculator", "electricity-bill-calculator"],
    relatedGuides: {
      en: [
        {
          title: "Discount Calculator",
          href: "/en/tools/discount-calculator",
          snippet: "Calculate final prices after store sales, seasonal discounts, and coupons.",
        },
      ],
      bn: [
        {
          title: "ডিসকাউন্ট ক্যালকুলেটর",
          href: "/bn/tools/discount-calculator",
          snippet: "যেকোনো পণ্যে কত শতাংশ ছাড় পেলে দাম কত হবে তা মুহূর্তেই বের করুন।",
        },
      ],
    },
  },

  "schema-markup-generator": {
    slug: "schema-markup-generator",
    lastUpdated: "2026-11-12",
    introduction: {
      en: "Generate clean, validated Schema.org JSON-LD structured data for your website. Search engines like Google use structured data to understand your content, power rich snippets (rich results), and improve search visibility. Choose from multiple schema types including WebPage, Organization, Article, LocalBusiness, Product, and FAQPage.",
      bn: "গুগল ও অন্যান্য সার্চ ইঞ্জিনের জন্য সঠিক ও ভ্যালিড Schema.org JSON-LD স্ট্রাকচার্ড ডাটা তৈরি করুন। এর ফলে গুগল আপনার ওয়েবপেজের তথ্য সহজে বুঝতে পারে এবং সার্চে রিচ রেজাল্ট (Rich Results) প্রদর্শন করে। ওয়েবপেজ, অর্গানাইজেশন, আর্টিকেল, লোকাল বিজনেস, প্রোডাক্ট ও এফএকিউ স্কিমা নিমেষেই তৈরি করুন।",
    },
    primaryUseCase: {
      en: "Quickly create error-free JSON-LD code snippets ready to copy directly into your website's `<head>` section.",
      bn: "ওয়েবসাইটের এসইও (SEO) র্যাঙ্কিং ও গুগলের রিচ স্নিপেট পাওয়ার জন্য নির্ভুল JSON-LD কোড তৈরি করুন।",
    },
    features: {
      en: [
        "Multi-Schema Support: WebPage, Organization, Article, Product, LocalBusiness, and FAQPage.",
        "Compliant JSON-LD: Adheres strictly to the latest Schema.org and Google Search guidelines.",
        "Instant Syntax Highlighting: Formatted code output ready for copy-paste or download.",
        "Zero External Dependencies: Runs 100% locally in your browser for instant privacy and speed.",
      ],
      bn: [
        "বহুমুখী স্কিমা সাপোর্ট: ওয়েবপেজ, প্রতিষ্ঠান, আর্টিকেল, পণ্য, স্থানীয় ব্যবসা ও এফএকিউ স্কিমা।",
        "গুগলের অফিসিয়াল মানসম্মত: Schema.org এর আধুনিক স্ট্যান্ডার্ড অনুযায়ী নির্ভুল কোড তৈরি করে।",
        "এক ক্লিকে কপি সুবিধা: সরাসরি কোড কপি করে আপনার ওয়েবসাইটের `<head>` ট্যাগে বসাতে পারবেন।",
        "১০০% নিরাপদ ও লোকাল: ব্রাউজারের মধ্যেই কোড তৈরি হয়, কোনো ডাটা জমা রাখা হয় না।",
      ],
    },
    howToSteps: {
      en: [
        {
          title: "Choose Schema Type & Enter Details",
          description: "Select your schema type and fill in the required fields such as Page Name, URL, Description, and Author.",
        },
        {
          title: "Generate Structured Data",
          description: "Click 'Run' to generate the validated JSON-LD code block instantly.",
        },
        {
          title: "Copy & Embed into Website",
          description: "Copy the generated `<script type='application/ld+json'>` block and paste it inside your HTML `<head>` tag.",
        },
      ],
      bn: [
        {
          title: "স্কিমার ধরন ও তথ্য প্রদান করুন",
          description: "আপনার পেজের নাম, ইউআরএল (URL) এবং সংক্ষিপ্ত বিবরণ প্রদান করুন।",
        },
        {
          title: "কোড জেনারেট করুন",
          description: "'Run' বাটনে ক্লিক করলেই মুহূর্তের মধ্যে JSON-LD কোড তৈরি হয়ে যাবে।",
        },
        {
          title: "কপি করে ওয়েবসাইটে বসান",
          description: "তৈরি হওয়া কোডটি কপি করে আপনার ওয়েবপেজের `<head>` সেকশনে পেস্ট করুন।",
        },
      ],
    },
    examples: {
      en: [
        {
          title: "WebPage Schema",
          input: "Name: Nasir Tools, URL: https://tools.nasirdigitalhub.com, Description: 169+ Free Online Tools",
          output: '{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "name": "Nasir Tools",\n  "url": "https://tools.nasirdigitalhub.com"\n}',
          explanation: "Identifies the core web page entity and properties for search engine crawlers.",
        },
      ],
      bn: [
        {
          title: "ওয়েবপেজ স্কিমা উদাহরণ",
          input: "নাম: নাসির টুলস, ইউআরএল: https://tools.nasirdigitalhub.com, বিবরণ: ১৬৯+ ফ্রি অনলাইন টুলস",
          output: '{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "name": "Nasir Tools"\n}',
          explanation: "সার্চ ইঞ্জিন ক্রলারদের কাছে ওয়েবপেজটির মূল পরিচয় ও উদ্দেশ্য তুলে ধরে।",
        },
      ],
    },
    limitations: {
      en: [
        "Structured data makes your page eligible for rich results, but Google does not guarantee rich snippets will appear for every search.",
        "Ensure the information in the schema strictly matches the visible on-page content.",
      ],
      bn: [
        "স্কিমা যোগ করলে পেজটি গুগলের রিচ স্নিপেটের যোগ্য হয়, তবে গুগল সব সার্চে রিচ রেজাল্ট দেখানোর গ্যারান্টি দেয় না।",
        "স্কিমায় দেওয়া তথ্য ওয়েবপেজে দৃশ্যমান তথ্যের সাথে অবশ্যই মিল থাকতে হবে।",
      ],
    },
    faq: {
      en: [
        {
          q: "What is JSON-LD schema markup?",
          a: "JSON-LD (JavaScript Object Notation for Linked Data) is Google's recommended format for providing structured metadata about a page's content.",
        },
        {
          q: "Where should I paste the generated schema code?",
          a: "Paste the `<script type='application/ld+json'>` block inside the `<head>` section of your HTML, or into your CMS header injection area.",
        },
        {
          q: "How can I test my generated schema?",
          a: "You can validate your generated markup using Google's official Rich Results Test or the Schema.org Validator.",
        },
      ],
      bn: [
        {
          q: "স্কিমা মার্কাপ কী এবং কেন দরকার?",
          a: "স্কিমা হলো সার্চ ইঞ্জিনকে আপনার ওয়েবসাইটের বিষয়বস্তু সঠিকভাবে বোঝানোর জন্য একটি আন্তর্জাতিক কোডিং স্ট্যান্ডার্ড। এর ফলে সার্চ রেজাল্টে স্টার রেটিং, এফএকিউ ইত্যাদি সুন্দরভাবে দেখা যায়।",
        },
        {
          q: "জেনারেট করা কোড কোথায় বসাতে হবে?",
          a: "আপনার ওয়েবপেজের HTML এর `<head>` ট্যাগের ভেতরে কোডটি বসাতে হবে। ওয়ার্ডপ্রেস বা অন্য সিএমএসে হেডার স্ক্রিপ্ট প্লাগইন ব্যবহার করা যায়।",
        },
      ],
    },
    relatedTools: ["meta-tag-analyzer", "open-graph-generator", "sitemap-generator", "robots-txt-generator"],
    relatedGuides: {
      en: [
        {
          title: "Meta Tag Analyzer",
          href: "/en/tools/meta-tag-analyzer",
          snippet: "Check your website title, description, and canonical tags for SEO issues.",
        },
      ],
      bn: [
        {
          title: "মেটা ট্যাগ অ্যানালাইজার",
          href: "/bn/tools/meta-tag-analyzer",
          snippet: "আপনার ওয়েবপেজের মেটা টাইটেল ও ডেসক্রিপশন এসইও বান্ধব কি না পরীক্ষা করুন।",
        },
      ],
    },
  },

  "ai-caption-generator": {
    slug: "ai-caption-generator",
    lastUpdated: "2026-11-12",
    introduction: {
      en: "Craft engaging, viral social media captions for Instagram, Facebook, TikTok, and LinkedIn in seconds. Enter your photo theme, product name, or topic to generate ready-to-publish captions with catchy hooks, hashtags, and call-to-actions.",
      bn: "ফেসবুক, ইনস্টাগ্রাম ও টিকটকের জন্য আকর্ষণীয় ও ভাইরাল ক্যাপশন তৈরি করুন নিমেষেই। যেকোনো ছবি, পোস্টের বিষয় বা পণ্যের নাম লিখলেই চমৎকার ক্যাপশন, মানানসই ইমোজি ও ট্রেন্ডিং হ্যাশট্যাগ সহ পোস্টের ক্যাপশন পেয়ে যাবেন।",
    },
    primaryUseCase: {
      en: "Overcome writer's block and generate scroll-stopping social media captions complete with emojis and relevant hashtags.",
      bn: "ফেসবুক বা ইনস্টাগ্রামে ছবি পোস্ট করার সময় ক্যাপশন খুঁজে না পেলে মুহূর্তের মধ্যে সেরা ক্যাপশন আইডিয়া পেতে এটি ব্যবহার করুন।",
    },
    features: {
      en: [
        "Topic & Mood Adaptability: Generates creative, professional, or casual captions based on your input.",
        "Automatic Hashtag Suggestions: Appends relevant, niche hashtags to boost discoverability.",
        "Call-to-Action (CTA) Hooks: Includes engaging questions to stimulate comments and likes.",
        "Instant Offline Fallbacks: Built-in creative templates ensure you get great captions even without API keys.",
      ],
      bn: [
        "বিষয়ভিত্তিক ক্যাপশন: যেকোনো ছবি, ভ্রমণ, বন্ধুত্ব, খাবার বা ব্যবসার জন্য উপযুক্ত ক্যাপশন।",
        "ট্রেন্ডিং হ্যাশট্যাগ ও ইমোজি: ক্যাপশনের সাথে মানানসই ইমোজি ও হ্যাশট্যাগ যুক্ত থাকে।",
        "এনগেজমেন্ট বাড়ানোর হুক: কমেন্ট ও লাইক বাড়াতে প্রশ্নভিত্তিক সুন্দর সমাপ্তি।",
        "তাৎক্ষণিক ফলাফল: এক ক্লিকেই কপি করার জন্য রেডিমেড ক্যাপশন।",
      ],
    },
    howToSteps: {
      en: [
        {
          title: "Enter Your Topic or Photo Subject",
          description: "Type what your post is about (e.g., 'Sunset at Cox's Bazar beach with friends').",
        },
        {
          title: "Click Generate",
          description: "Click 'Run' to generate high-performing caption variants.",
        },
        {
          title: "Copy & Post",
          description: "Choose your favorite caption, click 'Copy', and paste directly to Instagram, Facebook, or LinkedIn.",
        },
      ],
      bn: [
        {
          title: "পোস্টের বিষয় লিখুন",
          description: "আপনার ছবির বা পোস্টের মূল বিষয় লিখুন (যেমন: 'বন্ধুদের সাথে কক্সবাজার ভ্রমণের স্মৃতি')।",
        },
        {
          title: "'Run' এ ক্লিক করুন",
          description: "বাটনে চাপ দিলেই আকর্ষণীয় ক্যাপশন তৈরি হয়ে যাবে।",
        },
        {
          title: "কপি করে পোস্ট করুন",
          description: "'Copy' বাটনে চাপ দিয়ে ক্যাপশনটি নিয়ে ফেসবুকে বা ইনস্টাগ্রামে পোস্ট করুন।",
        },
      ],
    },
    examples: {
      en: [
        {
          title: "Travel / Nature Photo",
          input: "Sunset over the mountain peaks",
          output: "Chasing golden hours where the sky kisses the peaks. 🌄✨ Nature's daily reminder that endings can be beautiful too. Where is your favorite sunset spot? 👇 #MountainViews #SunsetChaser #Wanderlust",
          explanation: "Combines an emotional hook, evocative imagery, an engaging question, and trending tags.",
        },
      ],
      bn: [
        {
          title: "ভ্রমণ বা সুন্দর মুহূর্তের ক্যাপশন",
          input: "পাহাড়ে সূর্যাস্তের সুন্দর মুহূর্ত",
          output: "পাহাড়ের কোল ঘেঁষে যখন সূর্য অস্ত যায়, চারপাশ তখন অদ্ভুত এক মায়ায় জড়িয়ে পড়ে। 🌄✨ দিন শেষের এই সৌন্দর্যে মন জুড়িয়ে যায়। আপনার সবচেয়ে প্রিয় ভ্রমণের জায়গা কোনটি? কমেন্টে জানান! 👇 #TravelDiaries #SunsetLove #NatureBeauty",
          explanation: "বাংলায় আবেগঘন ভাষার সাথে লাইক ও কমেন্ট পাওয়ার উপযোগী সুন্দর উপস্থাপনা।",
        },
      ],
    },
    limitations: {
      en: [
        "Captions are starting inspirations; feel free to tweak specific names, locations, and personal anecdotes before posting.",
      ],
      bn: [
        "ক্যাপশনগুলো অনুপ্রেরণামূলক; পোস্ট করার আগে নিজের নাম বা বিশেষ স্মৃতি যোগ করে নিতে পারেন।",
      ],
    },
    faq: {
      en: [
        {
          q: "Can I use these captions for business accounts?",
          a: "Yes! The generated captions are completely royalty-free and suitable for personal creators, influencers, and corporate brands.",
        },
        {
          q: "Does this include relevant hashtags?",
          a: "Yes, generated captions include curated hashtags to help your posts reach wider explore feeds.",
        },
      ],
      bn: [
        {
          q: "এই ক্যাপশনগুলো কি ফেসবুক পেজ বা বিজনেসে ব্যবহার করা যাবে?",
          a: "অবশ্যই! পার্সোনাল প্রোফাইল, ফেসবুক পেজ বা যেকোনো ব্র্যান্ডের সোশ্যাল মিডিয়ায় নির্দ্বিধায় ব্যবহার করতে পারবেন।",
        },
        {
          q: "ক্যাপশনে কি হ্যাশট্যাগ থাকবে?",
          a: "হ্যাঁ, পোস্টের রিচ বাড়ানোর জন্য প্রাসঙ্গিক হ্যাশট্যাগ স্বয়ংক্রিয়ভাবে যুক্ত থাকে।",
        },
      ],
    },
    relatedTools: ["social-media-caption-generator", "ai-text-rewriter", "hashtag-generator", "social-media-character-counter"],
    relatedGuides: {
      en: [
        {
          title: "Social Media Caption Generator",
          href: "/en/tools/social-media-caption-generator",
          snippet: "Generate targeted post copy optimized for Twitter, Instagram, and LinkedIn character limits.",
        },
      ],
      bn: [
        {
          title: "সোশ্যাল মিডিয়া ক্যাপশন জেনারেটর",
          href: "/bn/tools/social-media-caption-generator",
          snippet: "বিভিন্ন প্ল্যাটফর্মের ক্যারেক্টার লিমিট মাথায় রেখে ক্যাপশন তৈরি করুন।",
        },
      ],
    },
  },

  "discount-calculator": {
    slug: "discount-calculator",
    lastUpdated: "2026-11-12",
    introduction: {
      en: "Calculate store sale prices, percentage discounts, and total savings in real time. Perfect for seasonal sales (Black Friday, Eid, New Year), online shopping comparisons, and retail pricing. Enter the original price and discount percentage to instantly know what you pay and what you save.",
      bn: "কেনাকাটায় ডিসকাউন্ট বা ছাড়ের সঠিক হিসাব সহজে বের করুন। ঈদ সেল, বৈশাখী মেলা, ব্ল্যাক ফ্রাইডে কিংবা অনলাইন শপিংয়ে যেকোনো পণ্যের মূল দাম এবং ডিসকাউন্টের শতকরা হার দিলেই আপনি কত টাকা ছাড় পাচ্ছেন এবং ফাইনাল দাম কত হবে তা মুহূর্তেই জানতে পারবেন।",
    },
    primaryUseCase: {
      en: "Quickly determine the net payable price and total monetary savings on any percentage-off promotion.",
      bn: "পণ্যের গায়ের দাম থেকে ডিসকাউন্টের টাকা বাদ দিয়ে প্রকৃত পরিশোধযোগ্য মূল্য ও জমানো টাকার পরিমাণ হিসাব করুন।",
    },
    features: {
      en: [
        "Two-Way Breakdown: Displays both final discounted price and exact amount saved.",
        "Formula Transparency: Shows calculation formula (Original Price - [Original Price × Discount % ÷ 100]).",
        "Instant Interactive Evaluation: Runs in milliseconds directly in your browser without page refreshes.",
      ],
      bn: [
        "দ্বিমুখী হিসাব: ডিসকাউন্টের পর পণ্যের দাম কত হবে এবং কত টাকা সাশ্রয় হলো—উভয় তথ্যই পরিষ্কারভাবে প্রদর্শন করে।",
        "স্বচ্ছ সূত্র: মূল দাম থেকে ডিসকাউন্ট বাদ দেওয়ার গাণিতিক নিয়ম দেখতে পাবেন।",
        "ঝামেলামুক্ত ও দ্রুত: কোনো বিজ্ঞাপন বা বিলম্ব ছাড়াই তাৎক্ষণিক ফলাফল।",
      ],
    },
    howToSteps: {
      en: [
        {
          title: "Enter Original Price",
          description: "Type the full price before discount (e.g. $120 or 1,500 BDT).",
        },
        {
          title: "Enter Discount Percentage",
          description: "Type the percentage discount being offered (e.g. 25%).",
        },
        {
          title: "View Discounted Price",
          description: "See your final price to pay and the total money saved.",
        },
      ],
      bn: [
        {
          title: "মূল দাম লিখুন",
          description: "পণ্যের গায়ে লেখা মূল দাম প্রথম ঘরে লিখুন (যেমন: ২,৫০০ টাকা)।",
        },
        {
          title: "ডিসকাউন্টের শতকরা হার লিখুন",
          description: "কত শতাংশ ছাড় দেওয়া হচ্ছে তা দ্বিতীয় ঘরে লিখুন (যেমন: ২০%)।",
        },
        {
          title: "ফলাফল দেখুন",
          description: "'Run' বাটনে ক্লিক করলেই আপনার সাশ্রয় এবং পরিশোধযোগ্য দাম দেখতে পাবেন।",
        },
      ],
    },
    examples: {
      en: [
        {
          title: "Clothing Store Sale (20% Off)",
          input: "Original Price: $80, Discount: 20%",
          output: "Discounted price: $64.00 | You save: $16.00",
          explanation: "Formula: $80 - ($80 × 0.20) = $64.00",
        },
      ],
      bn: [
        {
          title: "পোশাকের শপিংয়ে ২৫% ছাড়",
          input: "মূল দাম: ২,০০০ টাকা, ডিসকাউন্ট: ২৫%",
          output: "পরিশোধযোগ্য দাম: ১,৫০০.০০ টাকা | সাশ্রয়: ৫০০.০০ টাকা",
          explanation: "হিসাব: ২,০০০ - (২,০০০ × ২৫ ÷ ১০০) = ১,৫০০ টাকা",
        },
      ],
    },
    limitations: {
      en: [
        "Does not include local sales tax or shipping charges unless added to the original base price.",
      ],
      bn: [
        "ভ্যাট বা ডেলিভারি চার্জ থাকলে তা আলাদাভাবে যোগ করতে হবে।",
      ],
    },
    faq: {
      en: [
        {
          q: "How do I calculate a 30% discount manually?",
          a: "Multiply the original price by 0.30 to find the savings, then subtract that savings from the original price.",
        },
        {
          q: "What does 'You save' mean?",
          a: "It indicates the exact amount of money deducted from the original price during the sale.",
        },
      ],
      bn: [
        {
          q: "২০% ডিসকাউন্ট হিসাব করার নিয়ম কী?",
          a: "মূল দামকে ০.২০ দিয়ে গুণ করলে ছাড়ের টাকা বের হয়। এরপর মূল দাম থেকে সেই ছাড়ের টাকা বাদ দিন।",
        },
        {
          q: "ডিসকাউন্ট ক্যালকুলেটরের সাশ্রয় (You save) বলতে কী বোঝায়?",
          a: "এটি পণ্যের মূল দাম থেকে ঠিক কত টাকা বা ডলার আপনার পকেট বাঁচল তা নির্দেশ করে।",
        },
      ],
    },
    relatedTools: ["percentage-calculator", "vat-calculator", "salary-calculator"],
  },

  "ai-text-rewriter": {
    slug: "ai-text-rewriter",
    lastUpdated: "2026-11-12",
    introduction: {
      en: "Rewrite, rephrase, and polish paragraphs for better clarity, tone, and flow. Transform rough notes into professional emails, essays, articles, or social copy without losing original meaning.",
      bn: "আপনার লেখা বাক্য বা অনুচ্ছেদকে আরও সুন্দর, প্রাঞ্জল ও প্রফেশনাল রূপ দিন। ইমেইল, অ্যাসাইনমেন্ট, সোশ্যাল মিডিয়া পোস্ট কিংবা ব্লগের লেখাকে সহজবোধ্য ও নির্ভুল করতে নাসির টুলসের টেক্সট রিরাইটার ব্যবহার করুন।",
    },
    primaryUseCase: {
      en: "Paraphrase sentences and enhance writing vocabulary while eliminating grammatical awkwardness.",
      bn: "লেখার মূল ভাব ঠিক রেখে বাক্য পুনর্গঠন ও শব্দের মান উন্নত করতে এটি কাজ করে।",
    },
    features: {
      en: [
        "Vocabulary Enhancement: Replaces repetitive words with engaging synonyms.",
        "Clarity & Conciseness: Trims unnecessary fluff while preserving core context.",
        "Smart Fallback Engine: Provides structured rewrites locally even when API keys are absent.",
      ],
      bn: [
        "শব্দভাণ্ডার সমৃদ্ধকরণ: লেখার মান উন্নত করে বিকল্প প্রাঞ্জল শব্দ সাজায়।",
        "স্পষ্ট ও সংক্ষেপণ: অপ্রয়োজনীয় জটিলতা দূর করে লেখা সাবলীল করে।",
        "সহজ ও দ্রুত: ব্রাউজার থেকেই সহজে লেখা রিরাইট করা যায়।",
      ],
    },
    howToSteps: {
      en: [
        { title: "Paste Your Text", description: "Enter the sentences or paragraphs you wish to rewrite." },
        { title: "Click Run", description: "Generate the rephrased version instantly." },
        { title: "Review & Copy", description: "Compare the output, make adjustments, and copy to clipboard." },
      ],
      bn: [
        { title: "টেক্সট পেস্ট করুন", description: "যে বাক্যটি পরিবর্তন বা সুন্দর করতে চান তা লিখুন।" },
        { title: "'Run' এ ক্লিক করুন", description: "পুনর্লিখিত নতুন রূপটি দেখতে বাটনে চাপ দিন।" },
        { title: "কপি করুন", description: "নতুন লেখাটি পড়ে পছন্দমতো ব্যবহার করতে কপি করুন।" },
      ],
    },
    examples: {
      en: [
        {
          title: "Professional Email Polishing",
          input: "I want to ask if the project is done yet because boss is asking.",
          output: "Could you please provide a quick status update on the project deliverables? Management has requested an overview of our current progress.",
          explanation: "Elevates informal phrasing to executive-level communication.",
        },
      ],
      bn: [
        {
          title: "ইমেইল বা ফর্মাল লেখার উদাহরণ",
          input: "কাজটা কি শেষ হইছে জানাবেন তাড়াতাড়ি দরকার।",
          output: "প্রজেক্টের কাজের বর্তমান অগ্রগতি সম্পর্কে অনুগ্রহ করে একটি আপডেট জানালে উপকৃত হব।",
          explanation: "অনানুষ্ঠানিক বাক্যকে মার্জিত ও পেশাদার রূপ দেয়।",
        },
      ],
    },
    limitations: {
      en: [
        "Always review the output to verify specific facts, names, dates, or technical jargon.",
      ],
      bn: [
        "বিশেষ কোনো নাম, তারিখ বা তথ্য ঠিক আছে কি না ব্যবহারের আগে একবার চোখ বুলিয়ে নিন।",
      ],
    },
    faq: {
      en: [
        {
          q: "Does rewriting change the meaning of my text?",
          a: "No, the objective is to keep your core idea intact while optimizing sentence flow, grammar, and tone.",
        },
        {
          q: "Can I choose different rewriting styles?",
          a: "Yes, you can toggle between professional, friendly casual, and concise bullet-point modes.",
        },
      ],
      bn: [
        {
          q: "রিরাইট করলে কি লেখার মূল অর্থ বদলে যায়?",
          a: "না, মূল বক্তব্য অপরিবর্তিত রেখেই বাক্যকে আরও মার্জিত ও স্পষ্ট করা হয়।",
        },
        {
          q: "আমি কি লেখার টোন বা ধরণ বেছে নিতে পারি?",
          a: "হ্যাঁ, আপনি প্রফেশনাল, বন্ধুত্বপূর্ণ বা বুলেট-পয়েন্ট মোড নির্বাচন করতে পারেন।",
        },
      ],
    },
    relatedTools: ["ai-caption-generator", "word-counter", "case-converter"],
  },

  "social-media-caption-generator": {
    slug: "social-media-caption-generator",
    lastUpdated: "2026-11-12",
    introduction: {
      en: "Generate custom, ready-to-publish social media captions complete with emojis, calls-to-action, and relevant hashtags tailored for Facebook, Instagram, Twitter/X, and LinkedIn.",
      bn: "সোশ্যাল মিডিয়ায় পোস্টের জন্য আকর্ষণীয় ক্যাপশন জেনারেট করুন। ফেসবুক, ইনস্টাগ্রাম, টুইটার বা লিঙ্কডইনের জন্য মানানসই ইমোজি, হুক ও ট্রেন্ডিং হ্যাশট্যাগ সহ প্রস্তুত ক্যাপশন পাবেন মুহূর্তের মধ্যেই।",
    },
    primaryUseCase: {
      en: "Instantly create high-engagement social media copy for personal profiles or brand marketing.",
      bn: "সোশ্যাল প্ল্যাটফর্মে পোস্টের রিচ এবং এনগেজমেন্ট বাড়ানোর জন্য সুন্দর ক্যাপশন তৈরি।",
    },
    features: {
      en: [
        "Multi-Platform Ready: Copy formatted to fit Instagram, Facebook, and Twitter feeds.",
        "Interactive Hooks: Questions and call-to-actions designed to boost comment rates.",
        "Hashtag Integration: Naturally appends topically relevant tags.",
      ],
      bn: [
        "সব প্ল্যাটফর্মে মানানসই: ফেসবুক, ইনস্টাগ্রাম ও টুইটারের উপযোগী টেক্সট ফরম্যাট।",
        "এনগেজমেন্ট বৃদ্ধিকারী হুক: ফলোয়ারদের মতামত জানার প্রশ্নসম্বলিত সমাপ্তি।",
        "হ্যাশট্যাগ সহ: সার্চে পোস্ট সহজে খুঁজে পাওয়ার জন্য প্রাসঙ্গিক হ্যাশট্যাগ।",
      ],
    },
    howToSteps: {
      en: [
        { title: "Input Post Subject", description: "Type what your post or photo represents." },
        { title: "Run Generator", description: "Click Run to produce formatted caption copy." },
        { title: "Copy & Share", description: "Copy and publish straight to your favorite social network." },
      ],
      bn: [
        { title: "বিষয় লিখুন", description: "আপনার পোস্টের মূল কথাটি সংক্ষেপে লিখুন।" },
        { title: "বাটনে ক্লিক করুন", description: "'Run' এ ক্লিক করে ক্যাপশন তৈরি করুন।" },
        { title: "কপি করে শেয়ার করুন", description: "পছন্দের ক্যাপশনটি কপি করে সোশ্যাল মিডিয়ায় পোস্ট করুন।" },
      ],
    },
    examples: {
      en: [
        {
          title: "Product Launch / Feature Highlight",
          input: "New coffee blend release",
          output: "Wake up your senses with our freshest roast yet. ☕🌿 Crafted for slow mornings and big dreams. Have you had your daily cup? Drop a ☕ if you need one! #CoffeeLovers #MorningBrew #CoffeeTime",
          explanation: "Combines excitement, visual emojis, engagement prompt, and viral hashtags.",
        },
      ],
      bn: [
        {
          title: "নতুন অর্জন বা সুন্দর মুহূর্ত",
          input: "নতুন প্রজেক্ট সফলভাবে শেষ করলাম",
          output: "কঠোর পরিশ্রম আর নিষ্ঠা কখনোই বৃথা যায় না। আলহামদুলিল্লাহ, নতুন প্রজেক্টটি সফলভাবে সম্পন্ন হলো! 🚀✨ আপনাদের সবার দোয়ায় আরও এগিয়ে যেতে চাই। কেমন লাগলো জানাবেন কিন্তু! #NewMilestone #Achievement #HardWorkPaysOff",
          explanation: "বাংলায় ইতিবাচক ও অনুপ্রেরণাদায়ী বাক্যশৈলী।",
        },
      ],
    },
    limitations: {
      en: ["Platform character limits vary (Twitter 280 chars vs Instagram 2,200 chars)."],
      bn: ["বিভিন্ন সোশ্যাল মিডিয়ার ক্যারেক্টার লিমিট ভিন্ন হয়, যেমন টুইটারে ২৮০ ক্যারেক্টার।"],
    },
    faq: {
      en: [
        {
          q: "Can I edit the generated caption before publishing?",
          a: "Yes, you can freely edit, add personal mentions (@), or tailor hashtags before posting.",
        },
        {
          q: "Which social platforms are supported?",
          a: "The tool generates formats tailored for Instagram, Facebook, LinkedIn, Twitter/X, and Threads.",
        },
      ],
      bn: [
        {
          q: "আমি কি ক্যাপশনে নিজের কিছু অংশ যোগ করতে পারব?",
          a: "হ্যাঁ, কপি করার পর আপনার পছন্দমতো বাক্য বা বন্ধুদের মেনশন (@) যোগ করে নিতে পারেন।",
        },
        {
          q: "কোন কোন প্ল্যাটফর্মের জন্য ক্যাপশন পাওয়া যায়?",
          a: "ফেসবুক, ইনস্টাগ্রাম, লিঙ্কডইন, টুইটার/এক্স এবং থ্রেডসের জন্য উপযোগী ক্যাপশন তৈরি হয়।",
        },
      ],
    },
    relatedTools: ["ai-caption-generator", "hashtag-generator", "social-media-character-counter"],
  },

  "image-resizer": {
    slug: "image-resizer",
    lastUpdated: "2026-11-12",
    introduction: {
      en: "Resize image dimensions (width and height in pixels) directly in your browser. Whether you need exact 300x300 passport photo dimensions, social media banner sizing, or website asset scaling, Nasir Tools resizes photos accurately without uploading files to remote servers.",
      bn: "আপনার ছবির নির্দিষ্ট মাপ (প্রস্থ ও উচ্চতা পিক্সেল হিসেবে) পরিবর্তন বা রিসাইজ করুন ব্রাউজারেই। চাকরির জন্য ৩০০x৩০০ পাসপোর্ট সাইজ ছবি, ফেসবুক কভার, ইউটিউব থাম্বনেইল বা ওয়েবসাইটের ব্যানার সাইজ করতে এটি নিখুঁত কাজ করে। আপনার কোনো ছবি সার্ভারে আপলোড হয় না।",
    },
    primaryUseCase: {
      en: "Change pixel dimensions of photos to meet strict application portal requirements or social media graphics guidelines.",
      bn: "চাকরি, ভর্তি পরীক্ষা বা সোশ্যাল মিডিয়ার নির্ধারিত পিক্সেল সাইজে ছবি নিখুঁতভাবে রিসাইজ করুন।",
    },
    features: {
      en: [
        "Precise Pixel Dimensions: Set exact custom width and height.",
        "Zero Server Upload: Processed locally inside your browser via Canvas.",
        "Lossless Scale Rendering: Crisp output rendering for clean text and portraits.",
        "Instant Download: Save your resized picture immediately as a clean PNG/JPG.",
      ],
      bn: [
        "নিখুঁত পিক্সেল সাইজ: নিজের প্রয়োজনমতো প্রস্থ (Width) ও উচ্চতা (Height) নির্ধারণ করুন।",
        "সার্ভারহীন নিরাপত্তা: ছবি ডিভাইসের মেমোরিতেই রিসাইজ হয়, বাইরে কোথাও যায় না।",
        "স্পষ্ট ও নিখুঁত কোয়ালিটি: ক্যানভাস রেন্ডারিংয়ের মাধ্যমে ছবি স্পষ্ট থাকে।",
        "এক ক্লিকে ডাউনলোড: সাথে সাথেই রিসাইজ করা ছবি সেভ করে নিন।",
      ],
    },
    howToSteps: {
      en: [
        { title: "Upload Image", description: "Select your image from your computer or phone." },
        { title: "Specify Dimensions", description: "Enter your target width and height in pixels (e.g. 300 x 300)." },
        { title: "Process & Save", description: "Click Run and download your resized photo." },
      ],
      bn: [
        { title: "ছবি আপলোড করুন", description: "যে ছবিটি রিসাইজ করতে চান তা সিলেক্ট করুন।" },
        { title: "প্রস্থ ও উচ্চতা লিখুন", description: "পিক্সেলে মাপ দিন (যেমন: ৩০০ প্রস্থ, ৩০০ উচ্চতা)।" },
        { title: "রিসাইজ ও ডাউনলোড", description: "'Run' এ ক্লিক করে রিসাইজ করা ছবি ডাউনলোড করুন।" },
      ],
    },
    examples: {
      en: [
        {
          title: "Passport / Job Portal Photo (300x300)",
          input: "Original: 1920x1080px photo -> Width: 300, Height: 300",
          output: "Resized 300x300px PNG image",
          explanation: "Conforms perfectly to standard government exam and passport photo specs.",
        },
      ],
      bn: [
        {
          title: "সরকারি চাকরির পাসপোর্ট ছবি (৩০০x৩০০)",
          input: "আসল ছবি: ১২৮০x৭২০ পিক্সেল -> প্রস্থ: ৩০০, উচ্চতা: ৩০০",
          output: "নিখুঁত ৩০০x৩০০ পিক্সেল ছবি",
          explanation: "বিসিএস ও অন্যান্য অনলাইন আবেদন পোর্টালে আপলোডের উপযোগী।",
        },
      ],
    },
    limitations: {
      en: [
        "Resizing a small image to much larger dimensions (upscaling) may result in pixelation or soft details.",
      ],
      bn: [
        "খুব ছোট ছবি অতিরিক্ত বড় করলে ছবি কিছুটা ঘোলা হতে পারে।",
      ],
    },
    faq: {
      en: [
        {
          q: "What is the standard passport size in pixels?",
          a: "For most online government and recruitment portals, 300x300 pixels (photo) and 300x80 pixels (signature) are standard.",
        },
        {
          q: "Will resizing my image reduce its quality?",
          a: "Downscaling preserves sharpness; upscaling a low-resolution image to very large dimensions may soften details.",
        },
      ],
      bn: [
        {
          q: "চাকরির আবেদনের জন্য স্ট্যান্ডার্ড ছবির মাপ কত?",
          a: "বেশিরভাগ ক্ষেত্রে ছবির জন্য ৩০০x৩০০ পিক্সেল এবং স্বাক্ষরের জন্য ৩০০x৮০ পিক্সেল চাওয়া হয়।",
        },
        {
          q: "ছবি রিসাইজ করলে কোয়ালিটি কি নষ্ট হয়?",
          a: "ছোট করার ক্ষেত্রে কোয়ালিটি চমৎকার স্পষ্ট থাকে। তবে অতি ক্ষুদ্র ছবিকে খুব বেশি বড় করলে কিছুটা ঘোলা হতে পারে।",
        },
      ],
    },
    relatedTools: ["image-compressor", "image-format-converter", "image-cropper"],
  },

  "electricity-bill-calculator": {
    slug: "electricity-bill-calculator",
    lastUpdated: "2026-11-12",
    introduction: {
      en: "Estimate electricity consumption in kilowatt-hours (kWh) and calculate total energy costs for any appliance. Useful for calculating home appliance costs (AC, refrigerator, water heater, computer) and budgeting monthly utility bills accurately.",
      bn: "আপনার বাসাবাড়ি বা অফিসের যেকোনো বৈদ্যুতিক যন্ত্রের বিদ্যুৎ খরচ ও বিল সহজে হিসাব করুন। এসি, ফ্রিজ, ফ্যান, কম্পিউটার বা ওয়াটার হিটার কত ইউনিট (kWh) বিদ্যুৎ খরচ করে এবং মাসে কত টাকা বিল আসে তা নিমেষেই জেনে নিন।",
    },
    primaryUseCase: {
      en: "Calculate daily, monthly, and annual electrical power consumption and monetary expenditure based on wattage and hours used.",
      bn: "যন্ত্রের ওয়াট (Watt) ও ব্যবহারের সময় দিয়ে প্রতি মাসের বিদ্যুৎ বিল ও ইউনিট খরচ হিসাব করুন।",
    },
    features: {
      en: [
        "kWh Energy Breakdown: Automatically converts device wattage (W) to standard kilowatt-hours (Units).",
        "Time Flexible: Calculates across daily operating hours and total days in billing cycle.",
        "Cost Projection: Multiplies consumed units by your utility rate per kWh for clear budget planning.",
      ],
      bn: [
        "ইউনিট (kWh) হিসাব: ওয়াট থেকে সরাসরি বিদ্যুৎ মিটারের ইউনিটে রূপান্তর করে।",
        "সময়ভিত্তিক হিসাব: দিনে কত ঘণ্টা এবং মাসে কত দিন চলে তার সঠিক গণনা।",
        "টাকায় বিলের পরিমাণ: প্রতি ইউনিটের দাম অনুযায়ী মোট খরচের হিসাব প্রদর্শন।",
      ],
    },
    howToSteps: {
      en: [
        { title: "Enter Power (Wattage)", description: "Check your appliance label and enter its rated power in Watts (e.g. 1500W for an AC)." },
        { title: "Enter Daily Hours & Days", description: "Input how many hours it runs per day (e.g. 8) and how many days in the month (e.g. 30)." },
        { title: "Enter Tariff Rate per kWh", description: "Type your electricity company rate per unit (e.g. $0.15 or 8.5 BDT)." },
      ],
      bn: [
        { title: "যন্ত্রের ওয়াট (Power in W) লিখুন", description: "যন্ত্রের গায়ে লেখা ওয়াট লিখুন (যেমন: ১.৫ টন এসির জন্য ১৫০০ ওয়াট)।" },
        { title: "দৈনিক ঘণ্টা ও দিন লিখুন", description: "দিনে কত ঘণ্টা চলে (যেমন: ৮ ঘণ্টা) এবং মাসে কত দিন (যেমন: ৩০ দিন)।" },
        { title: "প্রতি ইউনিটের বিদ্যুৎ মূল্য দিন", description: "আপনার বিদ্যুৎ বিলের প্রতি ইউনিটের গড় দাম লিখুন (যেমন: ৮.৫০ টাকা)।" },
      ],
    },
    examples: {
      en: [
        {
          title: "1.5 Ton Inverter AC (Monthly Running Cost)",
          input: "Power: 1200W, Hours: 8, Days: 30, Rate: $0.15/kWh",
          output: "Energy: 288.00 kWh (Units) | Cost: $43.20",
          explanation: "Formula: (1200W × 8h × 30d) / 1000 = 288 kWh. 288 × $0.15 = $43.20",
        },
      ],
      bn: [
        {
          title: "দেড় টন এসির মাসিক বিদ্যুৎ বিল হিসাব",
          input: "পাওয়ার: ১২০০ ওয়াট, দৈনিক ব্যবহার: ৮ ঘণ্টা, দিন: ৩০, ইউনিট রেট: ৮.৫০ টাকা",
          output: "বিদ্যুৎ খরচ: ২৮৮.০০ ইউনিট (kWh) | মোট বিল: ২,৪৪৮.০০ টাকা",
          explanation: "হিসাব: (১২০০ × ৮ × ৩০) ÷ ১০০০ = ২৮৮ ইউনিট। ২৮৮ × ৮.৫০ = ২,৪৪৮ টাকা।",
        },
      ],
    },
    limitations: {
      en: [
        "Does not account for tiered slab pricing or government meter rent/demand charges automatically; use average unit cost for best accuracy.",
      ],
      bn: [
        "বিদ্যুৎ বোর্ডের বিভিন্ন ধাপ বা স্ল্যাব রেট ও মিটার চার্জ গড় ইউনিট রেট দিয়ে সমন্বয় করে নেওয়া ভালো।",
      ],
    },
    faq: {
      en: [
        {
          q: "How many Watts make 1 unit of electricity?",
          a: "1 Unit of electricity equals 1 Kilowatt-hour (kWh), which is 1,000 Watts consumed continuously for 1 hour.",
        },
        {
          q: "How is the monthly electricity bill estimated?",
          a: "Multiply your appliance wattage by daily hours, divide by 1,000 to get daily kWh, multiply by 30 days and your tariff rate per kWh.",
        },
      ],
      bn: [
        {
          q: "বিদ্যুতের ১ ইউনিট মানে কত ওয়াট?",
          a: "১ ইউনিট বিদ্যুৎ মানে ১ কিলোওয়াট-ঘণ্টা (kWh), অর্থাৎ ১০০০ ওয়াটের একটি যন্ত্র টানা ১ ঘণ্টা চললে ১ ইউনিট বিদ্যুৎ খরচ হয়।",
        },
        {
          q: "মাসিক বিদ্যুৎ বিল কীভাবে হিসাব করা হয়?",
          a: "যন্ত্রের ওয়াটকে দৈনিক ব্যবহারের ঘণ্টা দিয়ে গুণ করে ১০০০ দিয়ে ভাগ করলে দৈনিক kWh পাওয়া যায়। এরপর ৩০ দিন ও প্রতি ইউনিটের মূল্য দিয়ে গুণ করলেই মোট খরচ বের হয়।",
        },
      ],
    },
    relatedTools: ["percentage-calculator", "discount-calculator", "unit-converter"],
  },
};

/** Helper to retrieve typed SEO content for a given slug if available. */
export function getToolSeoContent(slug: string): ToolSeoContent | undefined {
  return priorityToolSeoContent[slug];
}

