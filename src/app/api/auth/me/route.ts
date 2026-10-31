import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  const c = await cookies();
  const token = c.get("nasir_session")?.value;
  const user = await getSessionUser(token);
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ user });
}
