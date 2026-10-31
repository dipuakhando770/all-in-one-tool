import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import type { Locale } from "@/lib/i18n";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const c = await cookies();
  const token = c.get("nasir_session")?.value;
  const user = await getSessionUser(token);
  if (!user) redirect(`/${l}/login`);
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-[var(--foreground)]/70">Welcome, {user.name || user.email}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <a href={`/${l}/dashboard/favorites`} className="rounded-xl border border-[var(--border)] p-5 hover:shadow-md">Favorites</a>
        <a href={`/${l}/dashboard/recent`} className="rounded-xl border border-[var(--border)] p-5 hover:shadow-md">Recently used</a>
        <a href={`/${l}/dashboard/settings`} className="rounded-xl border border-[var(--border)] p-5 hover:shadow-md">Settings</a>
      </div>
    </div>
  );
}
