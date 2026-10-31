import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { randomToken, sha256Hex } from "@/lib/auth/tokens";
import { resetRequestSchema } from "@/lib/validation/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = resetRequestSchema.parse(body);
    const db = await getDb();
    if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    const user = await db.prepare("SELECT id FROM users WHERE email=?").bind(data.email).first<{ id: string }>();
    // Always respond success to avoid enumeration
    if (!user) return NextResponse.json({ ok: true });
    const token = randomToken(32);
    const tokenHash = await sha256Hex(token);
    const id = randomToken(16);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30).toISOString();
    await db.prepare(
      "INSERT INTO password_reset_tokens (id,user_id,token_hash,expires_at,created_at) VALUES (?,?,?,?,?)"
    ).bind(id, user.id, tokenHash, expiresAt, new Date().toISOString()).run();
    const payload: any = { ok: true };
    if (process.env.NODE_ENV !== "production") payload.token = token;
    return NextResponse.json(payload);
  } catch (e: any) {
    if (e?.issues) return NextResponse.json({ error: "Invalid input", details: e.issues }, { status: 400 });
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
