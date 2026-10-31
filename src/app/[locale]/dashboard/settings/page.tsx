import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import type { Locale } from "@/lib/i18n";
import SettingsForm from "./settings-form";

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const c = await cookies();
  const user = await getSessionUser(c.get("nasir_session")?.value);
  if (!user) redirect(`/${l}/login`);
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold">Profile settings</h1>
      <SettingsForm locale={l} initial={{ name: user.name, locale: user.locale, theme: user.theme }} />
    </div>
  );
}
