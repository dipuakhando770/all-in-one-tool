import Link from "next/link";
import type { Locale } from "@/lib/i18n";

export function BrandLogo({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  return (
    <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-lg">
      <svg width={compact ? 28 : 32} height={compact ? 28 : 32} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Nasir Tools">
        <rect width="32" height="32" rx="8" fill="var(--accent)" />
        <path d="M9 23V9h3.2l7.6 9.2V9H23v14h-3.2L12.2 13.8V23H9z" fill="white" />
      </svg>
      {!compact && <span>Nasir Tools</span>}
    </Link>
  );
}
