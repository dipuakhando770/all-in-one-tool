import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, sessionCookie } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = loginSchema.parse(body);
    const db = await getDb();
    if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    const user = await db.prepare("SELECT id,email,password_hash,status FROM users WHERE email=?").bind(data.email).first<any>();
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    const ok = await verifyPassword(data.password, user.password_hash);
    if (!ok || user.status !== "active") return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    await db.prepare("UPDATE users SET last_login_at=? WHERE id=?").bind(new Date().toISOString(), user.id).run();
    const { token, expiresAt } = await createSession(user.id, { ip: req.headers.get("x-forwarded-for") ?? undefined, userAgent: req.headers.get("user-agent") ?? undefined });
    const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email } });
    res.headers.set("Set-Cookie", sessionCookie(token, expiresAt));
    return res;
  } catch (e: any) {
    if (e?.issues) return NextResponse.json({ error: "Invalid input", details: e.issues }, { status: 400 });
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
