import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { requireAdmin } from "@/lib/auth/guard";
import { randomToken } from "@/lib/auth/tokens";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: error === "Unauthorized" ? 401 : 403 });
  const db = await getDb();
  if (!db) return NextResponse.json({ redirects: [] });
  const res = await db.prepare("SELECT * FROM redirects ORDER BY created_at DESC").all();
  return NextResponse.json({ redirects: res.results ?? [] });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: error === "Unauthorized" ? 401 : 403 });
  const body = await req.json();
  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  const id = randomToken(16);
  await db.prepare(
    "INSERT INTO redirects (id,source,destination,status_code,active,created_at) VALUES (?,?,?,?,?,?)"
  ).bind(id, body.source, body.destination, body.status_code ?? 301, body.active ? 1 : 1, new Date().toISOString()).run();
  return NextResponse.json({ ok: true, id });
}
