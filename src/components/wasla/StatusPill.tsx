import type { Status } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const styles: Record<Status, string> = {
  "Backlog": "bg-muted text-muted-foreground",
  "To Do": "bg-secondary text-secondary-foreground",
  "In Progress": "bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] text-accent",
  "In Review": "bg-[color-mix(in_oklab,var(--warning)_18%,transparent)] text-[color:var(--warning)]",
  "Blocked": "bg-[color-mix(in_oklab,var(--destructive)_16%,transparent)] text-destructive",
  "Done": "bg-[color-mix(in_oklab,var(--success)_18%,transparent)] text-[color:var(--success)]",
};

export function StatusPill({ status, className }: { status: Status; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium", styles[status], className)}>
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}
