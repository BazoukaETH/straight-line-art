import { Flag } from "lucide-react";
import type { Priority } from "@/lib/mock-data";

const color: Record<Priority, string> = {
  urgent: "text-destructive",
  high: "text-[color:var(--warning)]",
  normal: "text-muted-foreground",
  low: "text-muted-foreground/60",
};

export function PriorityIcon({ priority }: { priority: Priority }) {
  return <Flag className={`size-3.5 ${color[priority]}`} strokeWidth={2.5} />;
}
