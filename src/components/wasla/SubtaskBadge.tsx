import { GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  count: number;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  title?: string;
}

/** Small pill showing the subtask count next to a task title. */
export function SubtaskBadge({ count, onClick, className, title }: Props) {
  if (!count) return null;
  const Cmp: any = onClick ? "button" : "span";
  return (
    <Cmp
      type={onClick ? "button" : undefined}
      onClick={onClick ? (e: React.MouseEvent) => { e.stopPropagation(); e.preventDefault(); onClick(e); } : undefined}
      title={title ?? `${count} subtask${count === 1 ? "" : "s"}`}
      className={cn(
        "inline-flex h-[18px] items-center gap-0.5 rounded-lg bg-muted px-1.5 text-[11px] font-medium text-muted-foreground hover:bg-muted/80",
        onClick && "cursor-pointer",
        className
      )}
    >
      <GitBranch className="size-3" />
      {count}
    </Cmp>
  );
}
