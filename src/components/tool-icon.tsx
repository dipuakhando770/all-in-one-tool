import * as Icons from "lucide-react";

export function ToolIcon({ icon, size = 20 }: { icon: string; size?: number }) {
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[icon] || Icons.Wrench;
  return <Icon size={size} />;
}
