import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { requireAdmin } from "@/lib/auth/guard";
import { randomToken } from "@/lib/auth/tokens";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: error === "Unauthorized" ? 401 : 403 });
  const db = await getDb();
  if (!db) return NextResponse.json({ tools: [] });
  const res = await db.prepare("SELECT * FROM tools ORDER BY created_at DESC").all();
  return NextResponse.json({ tools: res.results ?? [] });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: error === "Unauthorized" ? 401 : 403 });
  const body = await req.json();
  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  const id = randomToken(16);
  const now = new Date().toISOString();
  await db.prepare(
    "INSERT INTO tools (id,slug,category_id,icon,popular,new,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)"
  ).bind(id, body.slug, body.category_id ?? null, body.icon ?? null, body.popular ? 1 : 0, body.new ? 1 : 0, body.status ?? "active", now, now).run();
  return NextResponse.json({ ok: true, id });
}
