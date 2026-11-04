import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const TOOLS_DIR = path.resolve(import.meta.dirname, "..", "src", "tools");

function readAllToolDefs(): { file: string; id: string; slug: string }[] {
  const entries: { file: string; id: string; slug: string }[] = [];
  for (const file of fs.readdirSync(TOOLS_DIR)) {
    if (!file.endsWith(".ts") || file === "registry.ts") continue;
    const full = path.join(TOOLS_DIR, file);
    const text = fs.readFileSync(full, "utf8");
    const re = /id:\s*"([^"]+)",\s*slug:\s*"([^"]+)"/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      entries.push({ file, id: m[1], slug: m[2] });
    }
  }
  return entries;
}

test("tool files contain no duplicate slugs", () => {
  const entries = readAllToolDefs();
  const slugs = entries.map((e) => e.slug);
  const unique = new Set(slugs);
  assert.equal(
    unique.size,
    slugs.length,
    `Duplicate slugs detected: ${slugs.length} total, ${unique.size} unique`
  );
});

test("every tool id matches its slug", () => {
  const entries = readAllToolDefs();
  for (const e of entries) {
    assert.ok(
      e.id === e.slug,
      `id/slug mismatch in ${e.file}: id=${e.id}, slug=${e.slug}`
    );
  }
});

test("document-studio routes reference registered tools", () => {
  const entries = readAllToolDefs();
  const slugs = new Set(entries.map((e) => e.slug));
  const docStudio = path.resolve(import.meta.dirname, "..", "src", "app", "document-studio", "page.tsx");
  const docText = fs.readFileSync(docStudio, "utf8");
  const routeRe = /route:\s*"\/tools\/([^"]+)"/g;
  let m: RegExpExecArray | null;
  const missing: string[] = [];
  while ((m = routeRe.exec(docText)) !== null) {
    const slug = m[1];
    if (!slugs.has(slug)) missing.push(slug);
  }
  assert.equal(missing.length, 0, `Missing slugs in document-studio: ${missing.join(", ")}`);
});
