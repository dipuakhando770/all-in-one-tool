import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { requireAdmin } from "@/lib/auth/guard";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: error === "Unauthorized" ? 401 : 403 });
  const db = await getDb();
  if (!db) return NextResponse.json({ logs: [] });
  const res = await db.prepare("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 200").all();
  return NextResponse.json({ logs: res.results ?? [] });
}
