import { getDb } from "@/lib/db/client";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import { BookOpen, Calendar, User, ChevronRight, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Blog & Guides — Nasir Tools",
    description:
      "Articles, tutorials, guides and technical insights for digital utilities, privacy, image processing and PDF workflows.",
    alternates: {
      canonical: `https://tools.nasirdigitalhub.com/${locale}/blog`,
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const db = await getDb();

interface BlogPostItem {
  id: string;
  slug: string;
  title?: string;
  category?: string;
  content?: string;
  seo_description?: string;
  published_at?: string;
  created_at?: string;
  author_name?: string;
}

  let posts: BlogPostItem[] = [];
  if (db) {
    try {
      const res = await db
        .prepare(`
          SELECT p.id, p.slug, p.category, p.featured_image, p.published_at, p.created_at,
                 t.title, t.content, t.seo_description,
                 u.name as author_name
          FROM blog_posts p
          LEFT JOIN blog_translations t ON t.post_id = p.id AND t.locale = ?
          LEFT JOIN users u ON u.id = p.author_id
          WHERE p.status = 'published'
          ORDER BY p.published_at DESC, p.created_at DESC
        `)
        .bind(l)
        .all();
      posts = (res.results ?? []) as BlogPostItem[];
    } catch {
      posts = [];
    }
  }

  const blogCategories = [
    "Product Updates",
    "Image Processing",
    "PDF Workflows",
    "Developer Tips",
    "Privacy & Security",
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
        <Link href={`/${l}`} className="hover:text-[var(--primary)] transition">Home</Link>
        <ChevronRight size={12} />
        <span className="text-[var(--foreground)]">Blog</span>
      </nav>

      {/* Header */}
      <div className="mx-auto max-w-3xl text-center mb-10">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--primary)] mb-3">
          <BookOpen size={13} />
          <span>Articles, Guides & Insights</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl text-[var(--foreground)]">
          The Nasir Tools Blog
        </h1>
        <p className="mt-3 text-sm text-[var(--muted-foreground)] md:text-base leading-relaxed">
          Learn how to get the most out of everyday digital tools, automate repetitive tasks and optimize your media files.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        <span className="rounded-full bg-[var(--primary)] px-3.5 py-1.5 text-xs font-semibold text-white">
          All Posts
        </span>
        {blogCategories.map((cat) => (
          <span
            key={cat}
            className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)]"
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Posts Grid or Honest Empty State */}
      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const title = post.title || post.slug;
            const snippet = post.seo_description || (post.content ? post.content.slice(0, 140) + "..." : "");
            const date = post.published_at || post.created_at;

            return (
              <article
                key={post.id}
                className="card-hover flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition"
              >
                <div>
                  {post.category && (
                    <span className="mb-3 inline-block rounded-full bg-[var(--primary-subtle)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--primary)] capitalize">
                      {post.category}
                    </span>
                  )}
                  <h2 className="text-lg font-bold text-[var(--foreground)] hover:text-[var(--primary)] transition line-clamp-2">
                    <Link href={`/${l}/blog/${post.slug}`}>{title}</Link>
                  </h2>
                  <p className="mt-2 text-xs md:text-sm text-[var(--muted-foreground)] line-clamp-3 leading-relaxed">
                    {snippet}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4 text-xs text-[var(--subtle-foreground)]">
                  <div className="flex items-center gap-2">
                    {post.author_name && (
                      <span className="flex items-center gap-1 font-medium text-[var(--foreground)]">
                        <User size={12} />
                        {post.author_name}
                      </span>
                    )}
                    {date && (
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/${l}/blog/${post.slug}`}
                    className="flex items-center gap-1 font-semibold text-[var(--primary)] hover:underline"
                  >
                    Read <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Honest empty state — no fabricated posts */
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center max-w-2xl mx-auto">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-2)] text-[var(--primary)]">
            <BookOpen size={26} />
          </div>
          <h2 className="text-lg font-bold text-[var(--foreground)]">
            Articles in Production
          </h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-relaxed">
            Our editorial team is preparing comprehensive guides on client-side image compression, PDF optimization best practices, and developer utilities. Check back soon!
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={`/${l}/tools`}
              className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:opacity-90 transition"
            >
              Browse All Tools
            </Link>
            <Link
              href={`/${l}/popular`}
              className="rounded-xl border border-[var(--border)] px-5 py-2.5 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--surface-2)] transition"
            >
              Popular Utilities
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

