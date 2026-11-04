import { Suspense } from "react";
import { SearchClient } from "./search-client";
import type { Locale } from "@/lib/i18n";

export default function SearchPage({ params }: { params: Promise<{ locale: string }> }) {
  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <SearchClientWrapper params={params} />
    </Suspense>
  );
}

async function SearchClientWrapper({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <SearchClient locale={locale as Locale} />;
}

