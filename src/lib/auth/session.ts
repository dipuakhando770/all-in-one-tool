import { getDb } from "@/lib/db/client";
import { randomToken, sha256Hex } from "./tokens";

const COOKIE_NAME = "nasir_session";
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export { COOKIE_NAME };

export async function createSession(userId: string, meta?: { ip?: string; userAgent?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const token = randomToken(32);
  const tokenHash = await sha256Hex(token);
  const id = randomToken(16);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS).toISOString();

  await db
    .prepare(
      "INSERT INTO user_sessions (id, user_id, token_hash, expires_at, created_at, ip, user_agent) VALUES (?,?,?,?,?,?,?)"
    )
    .bind(
      id,
      userId,
      tokenHash,
      expiresAt,
      new Date().toISOString(),
      meta?.ip ?? null,
      meta?.userAgent ?? null
    )
    .run();

  return { token, expiresAt };
}

export async function getSessionUser(token: string | undefined) {
  if (!token) return null;

  const db = await getDb();
  if (!db) return null;

  const tokenHash = await sha256Hex(token);
  const row = await db
    .prepare(
      `SELECT u.id, u.email, u.name, u.locale, u.theme, u.status
       FROM user_sessions s
       JOIN users u ON u.id=s.user_id
       WHERE s.token_hash=? AND s.expires_at > ?`
    )
    .bind(tokenHash, new Date().toISOString())
    .first<{
      id: string;
      email: string;
      name: string;
      locale: string;
      theme: string;
      status: string;
    }>();

  if (!row || row.status !== "active") return null;

  // Fetch roles
  const rolesRes = await db
    .prepare("SELECT r.name FROM user_roles ur JOIN roles r ON r.id=ur.role_id WHERE ur.user_id=?")
    .bind(row.id)
    .all<{ name: string }>();

  const roles = rolesRes.results?.map((r) => r.name) ?? [];

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    locale: row.locale,
    theme: row.theme,
    roles,
  };
}

export async function destroySession(token: string | undefined) {
  if (!token) return;
  const db = await getDb();
  if (!db) return;
  const tokenHash = await sha256Hex(token);
  await db.prepare("DELETE FROM user_sessions WHERE token_hash=?").bind(tokenHash).run();
}

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * Build Set-Cookie header for a new session.
 * - HttpOnly: prevents JavaScript access (XSS mitigation)
 * - Secure: only sent over HTTPS (production)
 * - SameSite=Lax: CSRF protection for top-level navigations
 * - Path=/: available site-wide
 */
export function sessionCookie(token: string, expiresAt: string) {
  const parts = [
    `${COOKIE_NAME}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Expires=${new Date(expiresAt).toUTCString()}`,
  ];
  if (isProduction()) parts.push("Secure");
  return parts.join("; ");
}

/**
 * Build Set-Cookie header to clear the session.
 * Must mirror the same flags as sessionCookie so the browser clears it.
 */
export function clearSessionCookie() {
  const parts = [
    `${COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];
  if (isProduction()) parts.push("Secure");
  return parts.join("; ");
}
