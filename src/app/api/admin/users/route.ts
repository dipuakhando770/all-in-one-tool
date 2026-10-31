import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { requireAdmin } from "@/lib/auth/guard";

export async function GET() {
  const { user, error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: error === "Unauthorized" ? 401 : 403 });
  const db = await getDb();
  if (!db) return NextResponse.json({ users: [] });
  const res = await db.prepare("SELECT id,email,name,locale,theme,status,created_at,last_login_at FROM users ORDER BY created_at DESC LIMIT 200").all();
  return NextResponse.json({ users: res.results ?? [] });
}
