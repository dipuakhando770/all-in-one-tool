import { Suspense } from "react";
import { notFound } from "next/navigation";
import { locales, isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { Header, Footer } from "@/components/header";
import { CommandPaletteProvider } from "@/components/command-palette";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <div lang={locale} className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Nasir Tools",
            url: "https://tools.nasirdigitalhub.com",
            inLanguage: [locale],
            potentialAction: {
              "@type": "SearchAction",
              target: `https://tools.nasirdigitalhub.com/${locale}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      {/* Command Palette — global Cmd+K */}
      <CommandPaletteProvider locale={locale as Locale} />

      <Suspense fallback={<div className="h-14 border-b border-[var(--border)]" />}>
        <Header locale={locale as Locale} dict={dict} />
      </Suspense>

      <main className="flex-1">{children}</main>

      <Footer locale={locale as Locale} dict={dict} />
    </div>
  );
}
