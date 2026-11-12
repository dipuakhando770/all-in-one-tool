// In-memory rate limiter for Cloudflare Workers / Edge runtime
// Uses a simple sliding-window counter per key.
// Note: In a multi-instance deployment, each worker isolate has its own state.
// For production at scale, consider Cloudflare Durable Objects or KV for shared state.

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean expired entries periodically (every 1000 calls)
let cleanupCounter = 0;
function maybeCleanup() {
  cleanupCounter++;
  if (cleanupCounter % 1000 !== 0) return;
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key);
  }
}

/**
 * Check if a request is rate-limited.
 * @param key - Unique key (e.g., IP address or email)
 * @param maxAttempts - Maximum attempts allowed in the window
 * @param windowMs - Time window in milliseconds
 * @returns { limited: boolean; remaining: number; retryAfterMs: number }
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): { limited: boolean; remaining: number; retryAfterMs: number } {
  maybeCleanup();
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    // Start a new window
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, remaining: maxAttempts - 1, retryAfterMs: 0 };
  }

  // Within existing window
  entry.count++;
  if (entry.count > maxAttempts) {
    const retryAfterMs = entry.resetAt - now;
    return { limited: true, remaining: 0, retryAfterMs };
  }

  return { limited: false, remaining: maxAttempts - entry.count, retryAfterMs: 0 };
}

/**
 * Get the client IP from a Next.js request (prefers x-forwarded-for, then
 * falls back to x-real-ip, then "unknown").
 */
export function getClientIp(req: { headers: { get: (name: string) => string | null } }): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

