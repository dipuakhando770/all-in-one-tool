import * as Icons from "lucide-react";

export function ToolIcon({ icon, size = 20 }: { icon: string; size?: number }) {
  const Icon = (Icons as any)[icon] || Icons.Wrench;
  return <Icon size={size} />;
}
