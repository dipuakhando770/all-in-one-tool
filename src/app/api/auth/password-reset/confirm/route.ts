import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { sha256Hex } from "@/lib/auth/tokens";
import { hashPassword } from "@/lib/auth/password";
import { resetConfirmSchema } from "@/lib/validation/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = resetConfirmSchema.parse(body);
    const db = await getDb();
    if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    const tokenHash = await sha256Hex(data.token);
    const row = await db.prepare(
      "SELECT id,user_id,expires_at,used_at FROM password_reset_tokens WHERE token_hash=?"
    ).bind(tokenHash).first<{ id: string; user_id: string; expires_at: string; used_at: string | null }>();
    if (!row || row.used_at || new Date(row.expires_at) < new Date()) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }
    const hash = await hashPassword(data.password);
    await db.prepare("UPDATE users SET password_hash=?, updated_at=? WHERE id=?").bind(hash, new Date().toISOString(), row.user_id).run();
    await db.prepare("UPDATE password_reset_tokens SET used_at=? WHERE id=?").bind(new Date().toISOString(), row.id).run();
    // invalidate sessions
    await db.prepare("DELETE FROM user_sessions WHERE user_id=?").bind(row.user_id).run();
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const err = e as { issues?: unknown[]; message?: string };
    if (err.issues) return NextResponse.json({ error: "Invalid input", details: err.issues }, { status: 400 });
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
