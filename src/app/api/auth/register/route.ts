import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { hashPassword } from "@/lib/auth/password";
import { createSession, sessionCookie } from "@/lib/auth/session";
import { randomToken } from "@/lib/auth/tokens";
import { registerSchema } from "@/lib/validation/auth";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);
    const db = await getDb();
    if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    const existing = await db.prepare("SELECT id FROM users WHERE email=?").bind(data.email).first();
    if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    const id = randomToken(16);
    const now = new Date().toISOString();
    const hash = await hashPassword(data.password);
    await db.prepare(
      "INSERT INTO users (id,email,password_hash,name,locale,theme,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)"
    ).bind(id, data.email, hash, data.name ?? null, "en", "system", "active", now, now).run();
    // assign user role
    const role = await db.prepare("SELECT id FROM roles WHERE name='user'").first<{ id: string }>();
    if (role?.id) {
      await db.prepare("INSERT OR IGNORE INTO user_roles (user_id, role_id) VALUES (?,?)").bind(id, role.id).run();
    }
    const { token, expiresAt } = await createSession(id, { ip: req.headers.get("x-forwarded-for") ?? undefined, userAgent: req.headers.get("user-agent") ?? undefined });
    const res = NextResponse.json({ ok: true, user: { id, email: data.email, name: data.name } });
    res.headers.set("Set-Cookie", sessionCookie(token, expiresAt));
    return res;
  } catch (e: unknown) {
    if (e instanceof ZodError) return NextResponse.json({ error: "Invalid input", details: e.issues }, { status: 400 });
    return NextResponse.json({ error: (e as Error)?.message || "Server error" }, { status: 500 });
  }
}
