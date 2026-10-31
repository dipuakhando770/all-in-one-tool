import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { requireAdmin } from "@/lib/auth/guard";
import { randomToken } from "@/lib/auth/tokens";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: error === "Unauthorized" ? 401 : 403 });
  const db = await getDb();
  if (!db) return NextResponse.json({ posts: [] });
  const res = await db.prepare("SELECT * FROM blog_posts ORDER BY created_at DESC").all();
  return NextResponse.json({ posts: res.results ?? [] });
}

export async function POST(req: NextRequest) {
  const { user, error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: error === "Unauthorized" ? 401 : 403 });
  const body = await req.json();
  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  const id = randomToken(16);
  const now = new Date().toISOString();
  await db.prepare(
    "INSERT INTO blog_posts (id,slug,author_id,category,status,featured_image,published_at,scheduled_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)"
  ).bind(id, body.slug, user?.id ?? null, body.category ?? null, body.status ?? "draft", body.featured_image ?? null, body.published_at ?? null, body.scheduled_at ?? null, now, now).run();
  // translations
  for (const t of body.translations ?? []) {
    await db.prepare(
      "INSERT INTO blog_translations (post_id,locale,title,content,seo_title,seo_description) VALUES (?,?,?,?,?,?)"
    ).bind(id, t.locale, t.title, t.content ?? null, t.seo_title ?? null, t.seo_description ?? null).run();
  }
  return NextResponse.json({ ok: true, id });
}
