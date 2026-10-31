import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { isAdmin } from "@/lib/auth/rbac";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const c = await cookies();
  const user = await getSessionUser(c.get("nasir_session")?.value);
  if (!user || !isAdmin(user.roles)) redirect("/en/login");
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] px-6 py-3 flex items-center justify-between">
        <div className="font-bold">Nasir Tools Admin</div>
        <nav className="flex gap-4 text-sm">
          <a href="/admin">Overview</a>
          <a href="/admin/users">Users</a>
          <a href="/admin/tools">Tools</a>
          <a href="/admin/categories">Categories</a>
          <a href="/admin/blog">Blog</a>
          <a href="/admin/pages">Pages</a>
          <a href="/admin/seo">SEO</a>
          <a href="/admin/redirects">Redirects</a>
          <a href="/admin/analytics">Analytics</a>
          <a href="/admin/settings">Settings</a>
          <a href="/admin/audit">Audit</a>
        </nav>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
