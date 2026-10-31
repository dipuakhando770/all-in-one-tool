import { getDb } from "@/lib/db/client";
import { randomToken, sha256Hex } from "./tokens";

const COOKIE_NAME = "nasir_session";

export { COOKIE_NAME };

export async function createSession(userId: string, meta?: { ip?: string; userAgent?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const token = randomToken(32);
  const tokenHash = await sha256Hex(token);
  const id = randomToken(16);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();
  await db.prepare(
    "INSERT INTO user_sessions (id, user_id, token_hash, expires_at, created_at, ip, user_agent) VALUES (?,?,?,?,?,?,?)"
  ).bind(id, userId, tokenHash, expiresAt, new Date().toISOString(), meta?.ip ?? null, meta?.userAgent ?? null).run();
  return { token, expiresAt };
}

export async function getSessionUser(token: string | undefined) {
  if (!token) return null;
  const db = await getDb();
  if (!db) return null;
  const tokenHash = await sha256Hex(token);
  const row = await db.prepare(
    `SELECT u.id, u.email, u.name, u.locale, u.theme, u.status FROM user_sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at > ?`
  ).bind(tokenHash, new Date().toISOString()).first<any>();
  if (!row || row.status !== "active") return null;
  // roles
  const rolesRes = await db.prepare(
    "SELECT r.name FROM user_roles ur JOIN roles r ON r.id=ur.role_id WHERE ur.user_id=?"
  ).bind(row.id).all<{ name: string }>();
  const roles = rolesRes.results?.map((r) => r.name) ?? [];
  return { id: row.id, email: row.email, name: row.name, locale: row.locale, theme: row.theme, roles };
}

export async function destroySession(token: string | undefined) {
  if (!token) return;
  const db = await getDb();
  if (!db) return;
  const tokenHash = await sha256Hex(token);
  await db.prepare("DELETE FROM user_sessions WHERE token_hash=?").bind(tokenHash).run();
}

export function sessionCookie(token: string, expiresAt: string) {
  const secure = process.env.NODE_ENV === "production";
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; ${secure ? "Secure; " : ""}SameSite=Lax; Expires=${new Date(expiresAt).toUTCString()}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
