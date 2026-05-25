import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  to?: string;
  params?: Record<string, string>;
}

export function PageHeader({ crumbs, className }: { crumbs: Crumb[]; className?: string }) {
  const router = useRouter();
  return (
    <div className={cn("flex items-center gap-2 border-b border-border/60 px-5 py-3", className)}>
      <Button
        size="icon"
        variant="ghost"
        className="size-9 shrink-0"
        aria-label="Back"
        onClick={() => router.history.back()}
      >
        <ArrowLeft className="size-4" />
      </Button>
      <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto text-sm text-muted-foreground scrollbar-thin">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          const content = (
            <span className={cn("truncate", last ? "font-semibold text-foreground" : "hover:text-foreground")}>
              {c.label}
            </span>
          );
          return (
            <div key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="size-3.5 shrink-0 text-border" />}
              {c.to && !last ? (
                <Link to={c.to as any} params={c.params as any} className="truncate">{content}</Link>
              ) : (
                content
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
