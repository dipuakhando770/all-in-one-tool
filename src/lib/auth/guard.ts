import { cookies } from "next/headers";
import { getSessionUser } from "./session";
import { isAdmin } from "./rbac";

export async function getCurrentUser() {
  const c = await cookies();
  const token = c.get("nasir_session")?.value;
  return getSessionUser(token);
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) return { user: null, error: "Unauthorized" as const };
  return { user, error: null };
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) return { user: null, error: "Unauthorized" as const };
  if (!isAdmin(user.roles)) return { user: null, error: "Forbidden" as const };
  return { user, error: null };
}
