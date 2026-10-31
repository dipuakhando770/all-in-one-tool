import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { destroySession, clearSessionCookie } from "@/lib/auth/session";

export async function POST() {
  const c = await cookies();
  const token = c.get("nasir_session")?.value;
  await destroySession(token);
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", clearSessionCookie());
  return res;
}
