import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import type { Locale } from "@/lib/i18n";

export default async function FavoritesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const c = await cookies();
  const user = await getSessionUser(c.get("nasir_session")?.value);
  if (!user) redirect(`/${l}/login`);
  const db = await getDb();
  const res = db ? await db.prepare("SELECT tool_slug, created_at FROM favorites WHERE user_id=? ORDER BY created_at DESC").bind(user.id).all() : { results: [] };
  const favs = res.results ?? [];
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold">Favorite tools</h1>
      <ul className="mt-4 space-y-2">
        {favs.length === 0 && <li className="text-[var(--foreground)]/60">No favorites yet.</li>}
        {favs.map((f: any) => (
          <li key={f.tool_slug} className="rounded-lg border border-[var(--border)] p-3">
            <a href={`/${l}/tools/${f.tool_slug}`} className="font-medium">{f.tool_slug}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
