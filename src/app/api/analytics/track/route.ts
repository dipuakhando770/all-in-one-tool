import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { getCurrentUser } from "@/lib/auth/guard";
import { randomToken } from "@/lib/auth/tokens";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await getDb();
    if (!db) return NextResponse.json({ ok: true });
    const user = await getCurrentUser();
    if (body.type === "tool") {
      await db.prepare(
        "INSERT INTO tool_usage (id,user_id,tool_slug,locale,success,error_code,duration_ms,created_at) VALUES (?,?,?,?,?,?,?,?)"
      ).bind(
        randomToken(16), user?.id ?? null, String(body.slug || ""), body.locale ?? null,
        body.success ? 1 : 0, body.errorCode ?? null, typeof body.durationMs === "number" ? body.durationMs : null,
        new Date().toISOString()
      ).run();
    } else if (body.type === "search") {
      await db.prepare(
        "INSERT INTO search_analytics (id,query,locale,results_count,created_at) VALUES (?,?,?,?,?)"
      ).bind(randomToken(16), String(body.query || "").slice(0, 200), body.locale ?? null, body.resultsCount ?? null, new Date().toISOString()).run();
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
