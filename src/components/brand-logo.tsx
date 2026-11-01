import Link from "next/link";
import type { Locale } from "@/lib/i18n";

export function BrandLogo({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  return (
    <Link href={`/${locale}`} className="flex items-center gap-2.5 font-semibold shrink-0">
      <svg
        width={compact ? 30 : 34}
        height={compact ? 30 : 34}
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Background */}
        <rect width="34" height="34" rx="9" fill="var(--primary)" />
        {/* Wrench/tool icon — stylized N + tool mark */}
        <path d="M10 24V10h3.4l8 9.7V10H24.5v14h-3.4l-8-9.7V24H10z" fill="white" />
        {/* Accent dot */}
        <circle cx="27" cy="8" r="3" fill="#A5B4FC" />
      </svg>
      {!compact && (
        <span className="text-[15px] tracking-tight" style={{ color: "var(--foreground)" }}>
          Nasir<span style={{ color: "var(--primary)" }}>Tools</span>
        </span>
      )}
    </Link>
  );
}
