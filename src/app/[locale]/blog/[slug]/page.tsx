import { notFound } from "next/navigation";
import { getDb } from "@/lib/db/client";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import { ChevronRight, Calendar, User, ArrowLeft, Share2, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const db = await getDb();
  if (!db) return {};

  const post = await db
    .prepare(`
      SELECT p.slug, t.title, t.seo_title, t.seo_description
      FROM blog_posts p
      LEFT JOIN blog_translations t ON t.post_id = p.id AND t.locale = ?
      WHERE p.slug = ? AND p.status = 'published'
    `)
    .bind(locale, slug)
    .first<any>();

  if (!post) return {};

  return {
    title: post.seo_title || post.title || "Blog Post — Nasir Tools",
    description: post.seo_description || "Read this guide on Nasir Tools.",
    alternates: {
      canonical: `https://tools.nasirdigitalhub.com/${locale}/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const db = await getDb();
  if (!db) notFound();

  const post = await db
    .prepare(`
      SELECT p.id, p.slug, p.category, p.featured_image, p.published_at, p.created_at,
             t.title, t.content, t.seo_title, t.seo_description,
             u.name as author_name
      FROM blog_posts p
      LEFT JOIN blog_translations t ON t.post_id = p.id AND t.locale = ?
      LEFT JOIN users u ON u.id = p.author_id
      WHERE p.slug = ? AND p.status = 'published'
    `)
    .bind(l, slug)
    .first<any>();

  if (!post) notFound();

  const title = post.title || post.slug;
  const date = post.published_at || post.created_at;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
        <Link href={`/${l}`} className="hover:text-[var(--primary)] transition">Home</Link>
        <ChevronRight size={12} />
        <Link href={`/${l}/blog`} className="hover:text-[var(--primary)] transition">Blog</Link>
        <ChevronRight size={12} />
        <span className="text-[var(--foreground)] truncate max-w-xs">{title}</span>
      </nav>

      <Link
        href={`/${l}/blog`}
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition"
      >
        <ArrowLeft size={14} /> Back to all articles
      </Link>

      <article className="mt-4">
        {post.category && (
          <span className="rounded-full bg-[var(--primary-subtle)] px-3 py-1 text-xs font-semibold text-[var(--primary)] capitalize">
            {post.category}
          </span>
        )}

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl text-[var(--foreground)] leading-tight">
          {title}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-[var(--border)] pb-6 text-xs text-[var(--muted-foreground)]">
          {post.author_name && (
            <span className="flex items-center gap-1.5 font-medium text-[var(--foreground)]">
              <User size={14} />
              {post.author_name}
            </span>
          )}
          {date && (
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="my-8 overflow-hidden rounded-3xl border border-[var(--border)]">
            <img
              src={post.featured_image}
              alt={title}
              className="h-auto w-full object-cover max-h-[460px]"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg mt-8 max-w-none text-[var(--foreground)]">
          {post.content ? (
            <div className="whitespace-pre-wrap leading-relaxed">{post.content}</div>
          ) : (
            <p className="text-[var(--muted-foreground)] italic">Content coming soon.</p>
          )}
        </div>
      </article>
    </div>
  );
}

