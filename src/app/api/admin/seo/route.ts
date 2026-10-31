import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { requireAdmin } from "@/lib/auth/guard";
import { randomToken } from "@/lib/auth/tokens";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: error === "Unauthorized" ? 401 : 403 });
  const db = await getDb();
  if (!db) return NextResponse.json({ items: [] });
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const q = type ? "SELECT * FROM seo_metadata WHERE entity_type=?" : "SELECT * FROM seo_metadata ORDER BY updated_at DESC LIMIT 200";
  const res = type ? await db.prepare(q).bind(type).all() : await db.prepare(q).all();
  return NextResponse.json({ items: res.results ?? [] });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: error === "Unauthorized" ? 401 : 403 });
  const body = await req.json();
  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  const id = randomToken(16);
  await db.prepare(
    "INSERT INTO seo_metadata (id,entity_type,entity_id,locale,title,description,canonical,robots,structured_data,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?) ON CONFLICT(entity_type,entity_id,locale) DO UPDATE SET title=excluded.title,description=excluded.description,canonical=excluded.canonical,robots=excluded.robots,structured_data=excluded.structured_data,updated_at=excluded.updated_at"
  ).bind(id, body.entity_type, body.entity_id, body.locale, body.title ?? null, body.description ?? null, body.canonical ?? null, body.robots ?? null, body.structured_data ?? null, new Date().toISOString()).run();
  return NextResponse.json({ ok: true });
}
