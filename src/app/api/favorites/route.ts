import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { getCurrentUser } from "@/lib/auth/guard";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getDb();
  if (!db) return NextResponse.json({ favorites: [] });
  const res = await db.prepare("SELECT tool_slug, created_at FROM favorites WHERE user_id=? ORDER BY created_at DESC").bind(user.id).all();
  return NextResponse.json({ favorites: res.results ?? [] });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const slug = String(body.slug || "");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  await db.prepare("INSERT OR IGNORE INTO favorites (user_id, tool_slug, created_at) VALUES (?,?,?)").bind(user.id, slug, new Date().toISOString()).run();
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const slug = String(body.slug || "");
  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  await db.prepare("DELETE FROM favorites WHERE user_id=? AND tool_slug=?").bind(user.id, slug).run();
  return NextResponse.json({ ok: true });
}
