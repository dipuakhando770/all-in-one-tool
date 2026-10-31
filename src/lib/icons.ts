import * as Icons from "lucide-react";

export function getToolIcon(slug: string, fallback: string): string {
  const candidate = fallback || "Wrench";
  return (Icons as any)[candidate] ? candidate : "Wrench";
}
