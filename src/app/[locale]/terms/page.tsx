import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import { FileText, ChevronRight } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Terms of Service — Nasir Tools",
    description: "Terms and conditions for using Nasir Tools online utilities.",
    alternates: {
      canonical: `https://tools.nasirdigitalhub.com/${locale}/terms`,
    },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12 animate-fade-in">
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
        <Link href={`/${l}`} className="hover:text-[var(--primary)] transition">Home</Link>
        <ChevronRight size={12} />
        <span className="text-[var(--foreground)]">Terms of Service</span>
      </nav>

      <div className="border-b border-[var(--border)] pb-6 mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary-subtle)] px-3 py-1 text-xs font-semibold text-[var(--primary)] mb-3">
          <FileText size={13} />
          <span>User Agreement</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl text-[var(--foreground)]">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Last updated: November 2026
        </p>
      </div>

      <div className="space-y-8 text-sm md:text-base leading-relaxed text-[var(--foreground)]">
        <section>
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">1. Acceptance of Terms</h2>
          <p className="text-[var(--muted-foreground)]">
            By accessing or using Nasir Tools (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">2. Permitted Use</h2>
          <p className="text-[var(--muted-foreground)]">
            You agree to use Nasir Tools only for lawful purposes. You must not use the platform to process malware, illegal content, copyrighted materials without authorization, or perform automated attacks against our infrastructure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">3. Disclaimer of Warranty</h2>
          <p className="text-[var(--muted-foreground)]">
            The Service is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis without warranties of any kind, whether express or implied. Nasir Tools does not guarantee uninterrupted operation or zero errors during file conversion or compression.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">4. Limitation of Liability</h2>
          <p className="text-[var(--muted-foreground)]">
            In no event shall Nasir Tools or its maintainers be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the tools.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">5. Modifications</h2>
          <p className="text-[var(--muted-foreground)]">
            We reserve the right to modify or replace these Terms at any time. Continued use of the platform after updates indicates your agreement to revised terms.
          </p>
        </section>
      </div>
    </div>
  );
}

