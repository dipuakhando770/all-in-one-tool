import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { isAdmin } from "@/lib/auth/rbac";
import AdminShell from "./admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const c = await cookies();
  const user = await getSessionUser(c.get("nasir_session")?.value);
  if (!user || !isAdmin(user.roles)) redirect("/en/login");

  return <AdminShell>{children}</AdminShell>;
}