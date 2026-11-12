import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { randomToken, sha256Hex } from "@/lib/auth/tokens";
import { resetRequestSchema } from "@/lib/validation/auth";
import { ZodError } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";

// 3 password reset requests per IP per 30-minute window
const RESET_MAX_ATTEMPTS = 3;
const RESET_WINDOW_MS = 30 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    // ── Rate limiting ───────────────────────────────────────────────
    const ip = getClientIp(req);
    const { limited, retryAfterMs } = checkRateLimit(
      `reset:${ip}`,
      RESET_MAX_ATTEMPTS,
      RESET_WINDOW_MS
    );
    if (limited) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) },
        }
      );
    }

    // ── Validation ──────────────────────────────────────────────────
    const body = await req.json();
    const data = resetRequestSchema.parse(body);

    const db = await getDb();
    if (!db) return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 });

    const user = await db
      .prepare("SELECT id FROM users WHERE email=?")
      .bind(data.email)
      .first<{ id: string }>();

    // Always respond success to prevent email enumeration
    if (!user) return NextResponse.json({ ok: true });

    const token = randomToken(32);
    const tokenHash = await sha256Hex(token);
    const id = randomToken(16);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30).toISOString(); // 30 minutes

    await db
      .prepare(
        "INSERT INTO password_reset_tokens (id,user_id,token_hash,expires_at,created_at) VALUES (?,?,?,?,?)"
      )
      .bind(id, user.id, tokenHash, expiresAt, new Date().toISOString())
      .run();

    // NOTE: In production, send the token via email.
    // Never expose the token in the API response — even in development.
    // For local testing, check the database directly or server logs.
    console.log("[password-reset] Token generated for user", user.id, "— deliver via email in production");

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if (e instanceof ZodError) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    console.error("[auth/password-reset/request]", e);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
