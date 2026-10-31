import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rateLimit = new Map<string, { count: number; reset: number }>();

export function proxy(req: NextRequest) {
  const res = NextResponse.next();
  // Security headers
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  // Basic in-memory rate limiting for API
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const key = `${ip}:${req.nextUrl.pathname}`;
    const now = Date.now();
    const entry = rateLimit.get(key);
    if (!entry || entry.reset < now) {
      rateLimit.set(key, { count: 1, reset: now + 60_000 });
    } else {
      entry.count++;
      if (entry.count > 60) {
        return new NextResponse("Too Many Requests", { status: 429 });
      }
    }
  }
  // CSRF: check origin for state-changing requests
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method) && req.nextUrl.pathname.startsWith("/api/")) {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    if (origin && host && !origin.includes(host)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
