import type { D1Database } from "./types";

export async function getDb(): Promise<D1Database | null> {
  // Cloudflare Workers (OpenNext)
  try {
    const mod: unknown = await import("@opennextjs/cloudflare");
    if ((mod as { getCloudflareContext?: () => { env?: { DB?: D1Database } } } | undefined)?.getCloudflareContext) {
      const ctx = (mod as { getCloudflareContext: () => { env?: { DB?: D1Database } } }).getCloudflareContext();
      const db = ctx?.env?.DB;
      if (db) return db as D1Database;
    }
  } catch {
    // not available
  }
  // Local/test override
  const g: unknown = globalThis as unknown;
  if ((g as { __NASIR_DB__?: D1Database | null }).__NASIR_DB__) return (g as { __NASIR_DB__: D1Database | null }).__NASIR_DB__;
  // Env-based (wrangler dev injects)
  if (typeof process !== "undefined" && (process as unknown as { env?: { DB?: D1Database } }).env?.DB) {
    return (process as unknown as { env: { DB?: D1Database } }).env.DB as D1Database;
  }
  return null;
}

export function setDbForTests(db: D1Database | null) {
  (globalThis as unknown as { __NASIR_DB__?: D1Database | null }).__NASIR_DB__ = db;
}
