import { getDictionary } from "@/lib/dictionary";
import { allTools, getPopularTools, getNewTools } from "@/tools/registry";
import { categories } from "@/lib/categories";
import { ToolCard } from "@/components/tool-card";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import {
  Shield, Zap, Globe, ArrowRight, Sparkles,
  Image as ImageIcon, FileText, Code, Calculator, Type,
  CheckCircle2, Search,
} from "lucide-react";

const categoryIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  image: ImageIcon,
  pdf: FileText,
  developer: Code,
  calculator: Calculator,
  text: Type,
  seo: Search,
};

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const dict = await getDictionary(l);

  const popular = getPopularTools().slice(0, 8);
  const featured = allTools.filter(t => t.category === "image" || t.category === "pdf").slice(0, 8);
  const recent = getNewTools().slice(0, 6);
  const allRecent = recent.length < 6 ? allTools.slice(-6) : recent;

  const stats = [
    { value: "157+", label: "Free Tools" },
    { value: "10+", label: "Categories" },
    { value: "100%", label: "Browser-based" },
    { value: "0", label: "Registration needed" },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Instant Results",
      description: "No waiting, no uploads to servers. Most tools run entirely in your browser.",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Files and data are processed locally. Nothing is stored without your consent.",
    },
    {
      icon: Globe,
      title: "Works Everywhere",
      description: "Mobile, tablet, desktop — Nasir Tools works on any device with a browser.",
    },
    {
      icon: Sparkles,
      title: "Always Free",
      description: "Core tools are completely free. No ads cluttering your workspace.",
    },
  ];

  const faqs = [
    {
      q: "Are these tools free?",
      a: "Yes. All tools on Nasir Tools are free to use. No subscription, no hidden fees.",
    },
    {
      q: "Is my data safe and private?",
      a: "For image and text tools, processing happens entirely in your browser. Files are not uploaded to any server. For tools that require server interaction, this is clearly indicated.",
    },
    {
      q: "Do I need to create an account?",
      a: "No. All public tools work without registration. An optional account lets you save favorites and track recent usage.",
    },
    {
      q: "Which formats are supported?",
      a: "We support common image formats (JPEG, PNG, WebP, GIF), PDF files, and standard text/data formats. Each tool page lists its supported formats.",
    },
    {
      q: "Can I use these tools on mobile?",
      a: "Absolutely. Nasir Tools is fully responsive and works on all screen sizes.",
    },
  ];

  return (
    <div>
      {/* FAQ JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })),
          }),
        }}
      />
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden py-20 md:py-28 lg:py-32">
        {/* Subtle background grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Gradient blobs */}
        <div
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--primary)" }}
        />
        <div
          className="pointer-events-none absolute top-20 right-10 h-64 w-64 rounded-full opacity-10 blur-3xl"
          style={{ background: "var(--secondary)" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 text-center md:px-6">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-sm shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
            <span className="text-[var(--muted-foreground)]">157+ tools — all free, all instant</span>
            <Link
              href={`/${l}/tools`}
              className="font-medium text-[var(--primary)] hover:underline"
            >
              Explore →
            </Link>
          </div>

          {/* Headline */}
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span style={{ color: "var(--foreground)" }}>Everyday Tools.</span>{" "}
            <span className="text-gradient">All in One Place.</span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed md:text-xl"
            style={{ color: "var(--muted-foreground)" }}
          >
            Compress images, convert PDFs, format code, calculate, analyze text and hundreds more — 
            fast, free, and without leaving your browser.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/${l}/tools`}
              className="btn btn-primary btn-lg shadow-sm"
              style={{
                background: "var(--primary)",
                color: "white",
                padding: "0.75rem 1.75rem",
                borderRadius: "10px",
                fontSize: "0.9375rem",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
                transition: "all 150ms ease",
              }}
            >
              Explore All Tools
              <ArrowRight size={16} />
            </Link>
            <Link
              href={`/${l}/popular`}
              className="btn btn-secondary btn-lg"
              style={{
                background: "var(--surface)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
                padding: "0.75rem 1.75rem",
                borderRadius: "10px",
                fontSize: "0.9375rem",
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
                transition: "all 150ms ease",
              }}
            >
              Popular Tools
            </Link>
          </div>

          {/* Search bar */}
          <div className="mx-auto mt-10 max-w-xl">
            <Link
              href={`/${l}/search`}
              className="flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-sm transition-all hover:border-[var(--primary)] hover:shadow-md"
            >
              <Search size={16} style={{ color: "var(--muted-foreground)" }} />
              <span className="flex-1 text-left text-sm" style={{ color: "var(--subtle-foreground)" }}>
                Search any tool — image compressor, JSON formatter, PDF merger...
              </span>
              <kbd
                className="hidden rounded border border-[var(--border)] px-2 py-0.5 text-xs sm:inline-flex"
                style={{ color: "var(--subtle-foreground)" }}
              >
                ⌘K
              </kbd>
            </Link>
          </div>

          {/* Quick links */}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {["image compressor", "json formatter", "pdf merger", "word counter", "age calculator"].map((s) => (
              <Link
                key={s}
                href={`/${l}/search?q=${encodeURIComponent(s)}`}
                className="rounded-full border border-[var(--border)] px-3 py-1 text-xs transition-all hover:border-[var(--primary)] hover:bg-[var(--primary-subtle)] hover:text-[var(--primary)]"
                style={{ color: "var(--muted-foreground)", background: "var(--surface)" }}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="border-y border-[var(--border)] bg-[var(--surface)] py-8">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold md:text-3xl" style={{ color: "var(--primary)" }}>
                  {value}
                </div>
                <div className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── POPULAR TOOLS ─── */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--primary)" }}>Most used</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
                Popular Tools
              </h2>
            </div>
            <Link
              href={`/${l}/popular`}
              className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-[var(--primary)]"
              style={{ color: "var(--muted-foreground)" }}
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((t) => <ToolCard key={t.id} tool={t} locale={l} />)}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="py-16 md:py-20" style={{ background: "var(--surface)" }}>
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--primary)" }}>Browse by type</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
                Tool Categories
              </h2>
            </div>
            <Link
              href={`/${l}/categories`}
              className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-[var(--primary)]"
              style={{ color: "var(--muted-foreground)" }}
            >
              All categories <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((c) => {
              const Icon = categoryIcons[c.slug];
              const count = allTools.filter((t) => t.category === c.slug).length;
              return (
                <Link
                  key={c.slug}
                  href={`/${l}/categories/${c.slug}`}
                  className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--elevated)] p-5 transition-all hover:border-[var(--primary)] hover:shadow-md"
                  style={{ transition: "all 200ms ease" }}
                >
                  {/* Icon */}
                  <div
                    className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ background: "var(--primary-subtle)", color: "var(--primary)" }}
                  >
                    {Icon ? <Icon size={18} /> : <Sparkles size={18} />}
                  </div>
                  <h3 className="font-semibold group-hover:text-[var(--primary)] transition-colors">
                    {c.name[l]}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed line-clamp-2" style={{ color: "var(--muted-foreground)" }}>
                    {c.description[l]}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-xs" style={{ color: "var(--subtle-foreground)" }}>
                    <Sparkles size={10} />
                    {count} {count === 1 ? "tool" : "tools"}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FEATURED TOOLS ─── */}
      {featured.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--primary)" }}>Handpicked</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
                  Featured Tools
                </h2>
              </div>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((t) => <ToolCard key={t.id} tool={t} locale={l} />)}
            </div>
          </div>
        </section>
      )}

      {/* ─── RECENTLY ADDED ─── */}
      {allRecent.length > 0 && (
        <section className="py-16 md:py-20" style={{ background: "var(--surface)" }}>
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--primary)" }}>What&apos;s new</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
                  Recently Added
                </h2>
              </div>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {allRecent.map((t) => <ToolCard key={t.id} tool={t} locale={l} />)}
            </div>
          </div>
        </section>
      )}

      {/* ─── WHY NASIR TOOLS ─── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium" style={{ color: "var(--primary)" }}>Why choose us</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
              Built for real productivity
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              No bloat, no distractions. Just the tools you need, working the way you expect.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6"
              >
                <div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ background: "var(--primary-subtle)", color: "var(--primary)" }}
                >
                  <Icon size={18} />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-16 md:py-20" style={{ background: "var(--surface)" }}>
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium" style={{ color: "var(--primary)" }}>Simple process</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              How it works
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {dict.how.map((h: { title: string; desc: string }, i: number) => (
              <div key={i} className="relative text-center">
                {/* Step number */}
                <div
                  className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold"
                  style={{ background: "var(--primary-subtle)", color: "var(--primary)" }}
                >
                  {i + 1}
                </div>
                {/* Connector line (not on last) */}
                {i < 2 && (
                  <div
                    className="absolute left-1/2 top-6 hidden h-0.5 w-full translate-x-6 md:block"
                    style={{ background: "var(--border)" }}
                  />
                )}
                <h3 className="font-semibold">{h.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                  {h.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <div className="text-center">
            <p className="text-sm font-medium" style={{ color: "var(--primary)" }}>Got questions?</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-xl border border-[var(--border)] bg-[var(--surface)]"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 font-medium list-none">
                  <span>{faq.q}</span>
                  <span
                    className="shrink-0 text-xl leading-none transition-transform group-open:rotate-45"
                    style={{ color: "var(--muted-foreground)" }}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <div className="border-t border-[var(--border)] px-5 pb-5 pt-4">
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                    {faq.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 md:py-24" style={{ background: "var(--surface)" }}>
        <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
          <div
            className="rounded-2xl border border-[var(--border)] p-10 md:p-14"
            style={{ background: "var(--elevated)" }}
          >
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-white"
              style={{ background: "var(--primary)" }}
            >
              <Sparkles size={28} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              Browse 157+ free tools and simplify your daily digital work.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/${l}/tools`}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: "var(--primary)" }}
              >
                Browse All Tools
                <ArrowRight size={15} />
              </Link>
              <Link
                href={`/${l}/register`}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-6 py-3 text-sm font-medium transition-all hover:bg-[var(--surface-2)]"
                style={{ color: "var(--foreground)" }}
              >
                Create Free Account
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs" style={{ color: "var(--muted-foreground)" }}>
              {["No credit card needed", "157+ tools", "Browser-based processing"].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} style={{ color: "var(--success)" }} />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
