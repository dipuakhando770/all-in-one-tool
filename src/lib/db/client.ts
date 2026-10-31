import type { D1Database } from "./types";

export async function getDb(): Promise<D1Database | null> {
  // Cloudflare Workers (OpenNext)
  try {
    // Optional Cloudflare adapter; loaded at runtime in Workers
    const mod: any = await new Function("m", "return import(m)")("@opennextjs/cloudflare");
    if (mod?.getCloudflareContext) {
      const ctx = mod.getCloudflareContext();
      const db = ctx?.env?.DB;
      if (db) return db as D1Database;
    }
  } catch {
    // not available
  }
  // Local/test override
  const g: any = globalThis as any;
  if (g.__NASIR_DB__) return g.__NASIR_DB__ as D1Database;
  // Env-based (wrangler dev injects)
  if (typeof process !== "undefined" && (process as any).env?.DB) {
    return (process as any).env.DB as D1Database;
  }
  return null;
}

export function setDbForTests(db: D1Database | null) {
  (globalThis as any).__NASIR_DB__ = db;
}
