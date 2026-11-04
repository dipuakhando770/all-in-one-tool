import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db/client";
import { getSessionUser } from "@/lib/auth/session";
import { profileSchema } from "@/lib/validation/auth";

export async function GET() {
  const c = await cookies();
  const token = c.get("nasir_session")?.value;
  const user = await getSessionUser(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest) {
  const c = await cookies();
  const token = c.get("nasir_session")?.value;
  const user = await getSessionUser(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const data = profileSchema.parse(body);
    const db = await getDb();
    if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    const fields: string[] = [];
    const vals: unknown[] = [];
    if (data.name !== undefined) { fields.push("name=?"); vals.push(data.name); }
    if (data.locale !== undefined) { fields.push("locale=?"); vals.push(data.locale); }
    if (data.theme !== undefined) { fields.push("theme=?"); vals.push(data.theme); }
    if (fields.length) {
      vals.push(new Date().toISOString(), user.id);
      await db.prepare(`UPDATE users SET ${fields.join(",")}, updated_at=? WHERE id=?`).bind(...vals).run();
    }
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const err = e as { issues?: unknown[]; message?: string };
    if (err.issues) return NextResponse.json({ error: "Invalid input", details: err.issues }, { status: 400 });
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
