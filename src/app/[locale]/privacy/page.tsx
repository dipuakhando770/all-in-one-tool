import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import { Shield, ChevronRight, CheckCircle2 } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Privacy Policy — Nasir Tools",
    description: "Learn how Nasir Tools protects your privacy through local in-browser processing.",
    alternates: {
      canonical: `https://tools.nasirdigitalhub.com/${locale}/privacy`,
    },
  };
}

export default async function PrivacyPage({
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
        <span className="text-[var(--foreground)]">Privacy Policy</span>
      </nav>

      <div className="border-b border-[var(--border)] pb-6 mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--success-subtle)] px-3 py-1 text-xs font-semibold text-[var(--success)] mb-3">
          <Shield size={13} />
          <span>Privacy-First Architecture</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl text-[var(--foreground)]">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Last updated: November 2026
        </p>
      </div>

      <div className="space-y-8 text-sm md:text-base leading-relaxed text-[var(--foreground)]">
        <section>
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">1. Local In-Browser Processing</h2>
          <p className="text-[var(--muted-foreground)]">
            At Nasir Tools, we prioritize user privacy above everything else. Most of our tools — including image compression, image format conversion, text counters, JSON formatters, and PDF manipulation — operate <strong>entirely within your browser&apos;s WebAssembly and JavaScript environment</strong>. Your files, documents, and text data are never transferred to or saved on remote servers during client-side operations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">2. Information We Collect</h2>
          <p className="text-[var(--muted-foreground)] mb-2">
            We only collect information necessary to provide and secure our services:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[var(--muted-foreground)]">
            <li><strong>Account Information:</strong> If you choose to register, we collect your email address, name (optional), and encrypted password credentials.</li>
            <li><strong>Usage Telemetry:</strong> Aggregated, anonymous metrics on tool execution count and error occurrences to diagnose operational bugs and improve performance.</li>
            <li><strong>Browser & Device Preferences:</strong> Stored locally in your browser (e.g. dark/light theme, language selection).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">3. Cookies and Local Storage</h2>
          <p className="text-[var(--muted-foreground)]">
            We use strictly necessary cookies solely for authenticating logged-in user sessions. We also use browser <code className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 text-xs font-mono">localStorage</code> to remember your theme and recent searches on your device.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">4. Third-Party Services</h2>
          <p className="text-[var(--muted-foreground)]">
            Nasir Tools is hosted on Cloudflare infrastructure. Cloudflare may process network requests strictly to provide DDoS protection, SSL termination, and content delivery network (CDN) acceleration in accordance with their privacy standards.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">5. Contact Us</h2>
          <p className="text-[var(--muted-foreground)]">
            If you have any questions or feedback regarding this Privacy Policy, please contact us at{" "}
            <a href="mailto:privacy@nasirdigitalhub.com" className="text-[var(--primary)] underline">
              privacy@nasirdigitalhub.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}

