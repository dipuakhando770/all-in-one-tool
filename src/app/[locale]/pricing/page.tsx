import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import { Check, X, Sparkles, HelpCircle, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Pricing & Plans — Nasir Tools",
    description:
      "Simple, transparent plans. Use all core tools completely free, or preview upcoming Pro and Business tiers.",
    alternates: {
      canonical: `https://tools.nasirdigitalhub.com/${locale}/pricing`,
    },
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;

  const plans = [
    {
      name: "Free Forever",
      badge: "Current Plan",
      price: "$0",
      period: "forever",
      description: "Everything you need for daily digital utility workflows.",
      status: "active",
      cta: "Start Using Free",
      ctaHref: `/${l}/tools`,
      features: [
        { text: "Access to all 157+ web tools", included: true },
        { text: "Browser-based client processing", included: true },
        { text: "Standard file size limits (up to 50MB)", included: true },
        { text: "Batch image processing (up to 10 files)", included: true },
        { text: "PDF merge & page extraction", included: true },
        { text: "Full privacy — no server uploads for local tools", included: true },
        { text: "High-priority server queues", included: false },
        { text: "REST API Developer Access", included: false },
        { text: "Dedicated email support", included: false },
      ],
    },
    {
      name: "Pro",
      badge: "Coming Soon",
      price: "$9",
      period: "/ month",
      description: "Supercharged speed, higher batch limits and cloud-powered features.",
      status: "coming_soon",
      cta: "Join Pro Waitlist",
      ctaHref: `/${l}/register`,
      features: [
        { text: "Everything in Free Forever", included: true },
        { text: "Increased file size limits (up to 500MB)", included: true },
        { text: "Unlimited batch file processing", included: true },
        { text: "Advanced OCR & AI text extraction", included: true },
        { text: "Saved presets & customized default settings", included: true },
        { text: "Priority cloud background rendering", included: true },
        { text: "Export history & activity audit exports", included: true },
        { text: "REST API Developer Access", included: false },
        { text: "Enterprise SLA & Dedicated Manager", included: false },
      ],
    },
    {
      name: "Business / Team",
      badge: "Roadmap",
      price: "$29",
      period: "/ month",
      description: "Collaborative workspaces, API access and enterprise-grade reliability.",
      status: "roadmap",
      cta: "Contact for Inquiries",
      ctaHref: "mailto:support@nasirdigitalhub.com",
      features: [
        { text: "Everything in Pro tier", included: true },
        { text: "Team member seats & shared dashboard", included: true },
        { text: "Official Developer REST API access", included: true },
        { text: "Webhooks & automated batch pipelines", included: true },
        { text: "Custom branding & whitelabel outputs", included: true },
        { text: "99.9% Uptime Guarantee SLA", included: true },
        { text: "Dedicated priority support & onboarding", included: true },
      ],
    },
  ];

  const comparisonFeatures = [
    {
      name: "Core Tools Access (157+)",
      free: "Full Access",
      pro: "Full Access",
      business: "Full Access",
    },
    {
      name: "Client-side Browser Security",
      free: "Included",
      pro: "Included",
      business: "Included",
    },
    {
      name: "Batch Image Compression",
      free: "Up to 10 files",
      pro: "Unlimited files",
      business: "Unlimited files",
    },
    {
      name: "Max File Upload Size",
      free: "50 MB",
      pro: "500 MB",
      business: "2 GB",
    },
    {
      name: "Cloud AI & OCR Tools",
      free: "Standard limit",
      pro: "Expanded quota",
      business: "High-volume quota",
    },
    {
      name: "REST API Access",
      free: "Not available",
      pro: "Coming soon",
      business: "Full Access (Roadmap)",
    },
    {
      name: "Support Response Time",
      free: "Community / FAQ",
      pro: "24-48 hours",
      business: "Dedicated / 4 hours",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16 animate-fade-in">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--primary)] mb-4">
          <Sparkles size={13} />
          <span>Transparent SaaS Architecture</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl text-[var(--foreground)]">
          Simple Plans for Every Workflow
        </h1>
        <p className="mt-4 text-base text-[var(--muted-foreground)] md:text-lg leading-relaxed">
          Use all 157+ utilities free today. Explore our planned tiers for high-volume batch processing and developer integrations.
        </p>

        {/* Honest Disclosure Notice */}
        <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[var(--info)] bg-[var(--info-subtle)] px-4 py-2 text-xs text-[var(--info)] text-left">
          <ShieldCheck size={16} className="shrink-0" />
          <span>
            <strong>Honest Disclosure:</strong> Nasir Tools is currently 100% free with no payment collection enabled. Pro and Business tiers are preview architectures on our product roadmap.
          </span>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {plans.map((plan) => {
          const isPro = plan.name === "Pro";
          return (
            <div
              key={plan.name}
              className={`relative flex flex-col justify-between rounded-3xl border p-8 transition-all ${
                isPro
                  ? "border-[var(--primary)] bg-[var(--surface)] shadow-lg shadow-[rgba(91,80,232,0.08)]"
                  : "border-[var(--border)] bg-[var(--surface)]"
              }`}
            >
              {isPro && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[var(--primary)] px-3.5 py-0.5 text-xs font-semibold text-white shadow-sm">
                  Recommended Tier
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[var(--foreground)]">{plan.name}</h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      plan.status === "active"
                        ? "bg-[var(--success-subtle)] text-[var(--success)]"
                        : "bg-[var(--surface-2)] text-[var(--muted-foreground)]"
                    }`}
                  >
                    {plan.badge}
                  </span>
                </div>

                <p className="mt-2 text-xs text-[var(--muted-foreground)] leading-relaxed">
                  {plan.description}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[var(--foreground)]">
                    {plan.price}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)]">{plan.period}</span>
                </div>

                {/* Features List */}
                <ul className="mt-8 space-y-3 border-t border-[var(--border)] pt-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs md:text-sm">
                      {f.included ? (
                        <Check size={16} className="text-[var(--success)] shrink-0 mt-0.5" />
                      ) : (
                        <X size={16} className="text-[var(--subtle-foreground)] shrink-0 mt-0.5" />
                      )}
                      <span
                        className={f.included ? "text-[var(--foreground)]" : "text-[var(--subtle-foreground)]"}
                      >
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <div className="mt-8 pt-4">
                <Link
                  href={plan.ctaHref}
                  className={`w-full text-center rounded-xl py-3 text-xs md:text-sm font-semibold transition ${
                    isPro
                      ? "btn btn-primary block"
                      : "block rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--foreground)] hover:bg-[var(--surface)] hover:border-[var(--primary)]"
                  }`}
                >
                  {plan.cta}
                </Link>
                {plan.status !== "active" && (
                  <p className="mt-2 text-center text-[10px] text-[var(--subtle-foreground)]">
                    No credit card required. Feature preview.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="mt-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            Detailed Plan Comparison
          </h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Side-by-side feature architecture breakdown
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-2)]">
                <th className="p-4 font-semibold text-[var(--foreground)]">Feature</th>
                <th className="p-4 font-semibold text-[var(--foreground)]">Free Forever</th>
                <th className="p-4 font-semibold text-[var(--primary)]">Pro (Upcoming)</th>
                <th className="p-4 font-semibold text-[var(--foreground)]">Business (Roadmap)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {comparisonFeatures.map((row, i) => (
                <tr key={i} className="hover:bg-[var(--surface-2)]/50 transition">
                  <td className="p-4 font-medium text-[var(--foreground)]">{row.name}</td>
                  <td className="p-4 text-[var(--muted-foreground)]">{row.free}</td>
                  <td className="p-4 font-medium text-[var(--primary)]">{row.pro}</td>
                  <td className="p-4 text-[var(--muted-foreground)]">{row.business}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pricing FAQ */}
      <div className="mt-20 mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold text-center text-[var(--foreground)] mb-8">
          Pricing FAQ
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "Will existing free tools stay free?",
              a: "Yes. All current 157+ browser tools will always remain free. Any future paid plans are strictly for cloud computing, high-volume batch jobs, and enterprise APIs.",
            },
            {
              q: "Do I need to enter payment details to use the tools?",
              a: "No. Nasir Tools requires zero payment information or credit card numbers. You can start using any tool right away.",
            },
            {
              q: "When will the Pro plan launch?",
              a: "We are currently completing high-performance server worker infrastructure on Cloudflare. You can create a free account to receive updates when advanced batch processing becomes available.",
            },
          ].map((faq, i) => (
            <div key={i} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <h3 className="font-semibold text-sm text-[var(--foreground)]">{faq.q}</h3>
              <p className="mt-2 text-xs md:text-sm text-[var(--muted-foreground)] leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

