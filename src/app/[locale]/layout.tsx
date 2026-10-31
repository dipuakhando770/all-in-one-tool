import { Suspense } from "react";
import { notFound } from "next/navigation";
import { locales, isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { Header, Footer } from "@/components/header";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);
  return (
    <div lang={locale}>
      <Suspense fallback={<div />}>
        <Header locale={locale as Locale} dict={dict} />
      </Suspense>
      <main className="min-h-[60vh]">{children}</main>
      <Footer locale={locale as Locale} dict={dict} />
    </div>
  );
}
