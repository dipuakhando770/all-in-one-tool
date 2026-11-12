import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, sessionCookie } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation/auth";
import { ZodError } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";

// 5 login attempts per IP per 15-minute window
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    // ── Rate limiting ───────────────────────────────────────────────
    const ip = getClientIp(req);
    const { limited, retryAfterMs } = checkRateLimit(
      `login:${ip}`,
      LOGIN_MAX_ATTEMPTS,
      LOGIN_WINDOW_MS
    );
    if (limited) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) },
        }
      );
    }

    // ── Validation ──────────────────────────────────────────────────
    const body = await req.json();
    const data = loginSchema.parse(body);

    const db = await getDb();
    if (!db) return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 });

    // ── User lookup ─────────────────────────────────────────────────
    const user = await db
      .prepare("SELECT id,email,password_hash,status FROM users WHERE email=?")
      .bind(data.email)
      .first<{ id: string; email: string; password_hash: string; status: string }>();

    // Generic error — do not reveal whether the email exists
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const ok = await verifyPassword(data.password, user.password_hash);
    if (!ok || user.status !== "active")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    // ── Session creation ────────────────────────────────────────────
    await db
      .prepare("UPDATE users SET last_login_at=? WHERE id=?")
      .bind(new Date().toISOString(), user.id)
      .run();

    const { token, expiresAt } = await createSession(user.id, {
      ip,
      userAgent: req.headers.get("user-agent") ?? undefined,
    });

    const res = NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email },
    });
    res.headers.set("Set-Cookie", sessionCookie(token, expiresAt));
    return res;
  } catch (e: unknown) {
    if (e instanceof ZodError) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    // Never expose internal error details to the client
    console.error("[auth/login]", e);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
