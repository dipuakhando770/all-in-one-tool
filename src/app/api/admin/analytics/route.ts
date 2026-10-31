import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { requireAdmin } from "@/lib/auth/guard";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: error === "Unauthorized" ? 401 : 403 });
  const db = await getDb();
  if (!db) return NextResponse.json({ popular: [], searches: [], views: 0 });
  const popular = await db.prepare("SELECT tool_slug, COUNT(*) as count FROM tool_usage GROUP BY tool_slug ORDER BY count DESC LIMIT 20").all();
  const searches = await db.prepare("SELECT query, COUNT(*) as count FROM search_analytics GROUP BY query ORDER BY count DESC LIMIT 20").all();
  const total = await db.prepare("SELECT COUNT(*) as c FROM tool_usage").first<{ c: number }>();
  return NextResponse.json({ popular: popular.results ?? [], searches: searches.results ?? [], totalExecutions: total?.c ?? 0 });
}
