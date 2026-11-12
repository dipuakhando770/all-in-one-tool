import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { hashPassword } from "@/lib/auth/password";
import { createSession, sessionCookie } from "@/lib/auth/session";
import { randomToken } from "@/lib/auth/tokens";
import { registerSchema } from "@/lib/validation/auth";
import { ZodError } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";

// 3 registration attempts per IP per 30-minute window
const REGISTER_MAX_ATTEMPTS = 3;
const REGISTER_WINDOW_MS = 30 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    // ── Rate limiting ───────────────────────────────────────────────
    const ip = getClientIp(req);
    const { limited, retryAfterMs } = checkRateLimit(
      `register:${ip}`,
      REGISTER_MAX_ATTEMPTS,
      REGISTER_WINDOW_MS
    );
    if (limited) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) },
        }
      );
    }

    // ── Validation ──────────────────────────────────────────────────
    const body = await req.json();
    const data = registerSchema.parse(body);

    const db = await getDb();
    if (!db) return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 });

    const existing = await db.prepare("SELECT id FROM users WHERE email=?").bind(data.email).first();
    if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

    const id = randomToken(16);
    const now = new Date().toISOString();
    const hash = await hashPassword(data.password);
    await db
      .prepare(
        "INSERT INTO users (id,email,password_hash,name,locale,theme,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)"
      )
      .bind(id, data.email, hash, data.name ?? null, "en", "system", "active", now, now)
      .run();

    // Assign default user role
    const role = await db.prepare("SELECT id FROM roles WHERE name='user'").first<{ id: string }>();
    if (role?.id) {
      await db
        .prepare("INSERT OR IGNORE INTO user_roles (user_id, role_id) VALUES (?,?)")
        .bind(id, role.id)
        .run();
    }

    const { token, expiresAt } = await createSession(id, {
      ip,
      userAgent: req.headers.get("user-agent") ?? undefined,
    });

    const res = NextResponse.json({
      ok: true,
      user: { id, email: data.email, name: data.name },
    });
    res.headers.set("Set-Cookie", sessionCookie(token, expiresAt));
    return res;
  } catch (e: unknown) {
    if (e instanceof ZodError) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    console.error("[auth/register]", e);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
