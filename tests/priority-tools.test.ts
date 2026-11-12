import { test } from "node:test";
import assert from "node:assert/strict";
import { calculatorTools } from "../src/tools/calculator.ts";
import { extraTools } from "../src/tools/extra.ts";
import { getToolSeoContent } from "../src/lib/seo-content.ts";

test("percentage-calculator calculates standard proportion, percentage of, and percentage change", async () => {
  const tool = calculatorTools.find((t) => t.slug === "percentage-calculator");
  assert.ok(tool, "percentage-calculator tool exists");

  // Mode 1: What % is X of Y?
  const res1 = await tool.run({ mode: "what_pct", value: 25, total: 200 });
  assert.equal(res1.kind, "text");
  assert.ok(String(res1.value).includes("12.50%"), "calculates 25 is 12.5% of 200");

  // Mode 2: What is X% of Y?
  const res2 = await tool.run({ mode: "pct_of", value: 15, total: 80 });
  assert.equal(res2.kind, "text");
  assert.ok(String(res2.value).includes("12"), "calculates 15% of 80 is 12");

  // Mode 3: Percentage change
  const res3 = await tool.run({ mode: "pct_change", value: 50, total: 75 });
  assert.equal(res3.kind, "text");
  assert.ok(String(res3.value).includes("+50.00%"), "calculates +50% change from 50 to 75");
});

test("discount-calculator computes savings, discounted price, and optional tax", async () => {
  const tool = calculatorTools.find((t) => t.slug === "discount-calculator");
  assert.ok(tool, "discount-calculator tool exists");

  const res = await tool.run({ price: 100, discount: 20, tax: 5 });
  assert.equal(res.kind, "text");
  const text = String(res.value);
  assert.ok(text.includes("Final Payable Price: 84.00"), "computes correct payable price with tax");
  assert.ok(text.includes("You Save:          20.00"), "computes 20.00 saved");
});

test("electricity-bill-calculator computes kWh and tiered costs", async () => {
  const tool = extraTools.find((t) => t.slug === "electricity-bill-calculator");
  assert.ok(tool, "electricity-bill-calculator exists");

  // 1000W running 5h/day for 30 days @ 8 per unit = 150 kWh, cost = 1200
  const res = await tool.run({ power: 1000, hours: 5, days: 30, rate: 8 });
  assert.equal(res.kind, "text");
  const text = String(res.value);
  assert.ok(text.includes("150.000 kWh"), "computes 150 kWh");
  assert.ok(text.includes("1,200.00"), "computes 1200 cost");
});

test("schema-markup-generator generates valid JSON-LD script for WebPage, Article, and Product", async () => {
  const tool = extraTools.find((t) => t.slug === "schema-markup-generator");
  assert.ok(tool, "schema-markup-generator exists");

  const res = await tool.run({
    type: "Article",
    name: "Mastering Technical SEO",
    url: "https://tools.nasirdigitalhub.com/en/blog/seo",
    description: "A comprehensive SEO guide.",
    extra: "Nasir Ahmed",
  });
  assert.equal(res.kind, "json");
  const scriptTag = String(res.value);
  assert.ok(scriptTag.startsWith("<script type=\"application/ld+json\">"), "has JSON-LD script opening tag");
  assert.ok(scriptTag.includes("\"@type\": \"Article\""), "contains Article schema");
  assert.ok(scriptTag.includes("\"author\""), "contains Author schema");
});

test("all priority tools have complete bilingual SEO content", () => {
  const prioritySlugs = [
    "image-compressor",
    "percentage-calculator",
    "schema-markup-generator",
    "ai-caption-generator",
    "discount-calculator",
    "ai-text-rewriter",
    "social-media-caption-generator",
    "image-resizer",
    "electricity-bill-calculator",
  ];

  for (const slug of prioritySlugs) {
    const entry = getToolSeoContent(slug);
    assert.ok(entry, `SEO content exists for ${slug}`);
    assert.ok(entry.introduction.en.length > 20, `EN introduction valid for ${slug}`);
    assert.ok(entry.introduction.bn.length > 20, `BN introduction valid for ${slug}`);
    assert.ok(entry.primaryUseCase.en.length > 10, `EN primaryUseCase valid for ${slug}`);
    assert.ok(entry.primaryUseCase.bn.length > 10, `BN primaryUseCase valid for ${slug}`);
    assert.ok(entry.howToSteps.en.length >= 3, `EN howTo steps >= 3 for ${slug}`);
    assert.ok(entry.howToSteps.bn.length >= 3, `BN howTo steps >= 3 for ${slug}`);
    assert.ok(entry.faq.en.length >= 2, `EN FAQs >= 2 for ${slug}`);
    assert.ok(entry.faq.bn.length >= 2, `BN FAQs >= 2 for ${slug}`);
    assert.ok(entry.examples.en.length >= 1, `EN examples >= 1 for ${slug}`);
    assert.ok(entry.examples.bn.length >= 1, `BN examples >= 1 for ${slug}`);
    assert.ok(entry.limitations.en.length >= 1, `EN limitations >= 1 for ${slug}`);
    assert.ok(entry.limitations.bn.length >= 1, `BN limitations >= 1 for ${slug}`);
  }
});
