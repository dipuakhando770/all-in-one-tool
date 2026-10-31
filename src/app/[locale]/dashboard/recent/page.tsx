import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import type { Locale } from "@/lib/i18n";

export default async function RecentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const c = await cookies();
  const user = await getSessionUser(c.get("nasir_session")?.value);
  if (!user) redirect(`/${l}/login`);
  const db = await getDb();
  const res = db ? await db.prepare("SELECT tool_slug, success, created_at FROM tool_usage WHERE user_id=? ORDER BY created_at DESC LIMIT 50").bind(user.id).all() : { results: [] };
  const rows = res.results ?? [];
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold">Recently used tools</h1>
      <ul className="mt-4 space-y-2">
        {rows.length === 0 && <li className="text-[var(--foreground)]/60">No usage yet.</li>}
        {rows.map((r: any, i: number) => (
          <li key={i} className="rounded-lg border border-[var(--border)] p-3 flex justify-between">
            <a href={`/${l}/tools/${r.tool_slug}`} className="font-medium">{r.tool_slug}</a>
            <span className="text-xs text-[var(--foreground)]/60">{r.created_at}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
