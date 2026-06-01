import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, Check, Plus } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { workspaces } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function WorkspaceSwitcher() {
  const { workspaceId, setWorkspaceId } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const nav = useNavigate();

  const current = workspaces.find((w) => w.id === workspaceId) ?? workspaces[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-8 w-[220px] items-center gap-2 rounded-lg px-3 text-left transition hover:bg-muted/60",
        )}
      >
        <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[#0B2545] text-xs font-bold text-white">W</div>
        <div className="min-w-0 flex-1 truncate text-sm font-semibold leading-tight">
          {current.name}
        </div>
        <ChevronDown className="size-4 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-[100] w-[280px] overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-xl">
          {/* WORKSPACES */}
          <div className="px-3 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Workspaces
          </div>
          {workspaces.map((w) => {
            const active = w.id === workspaceId;
            const disabled = !!w.comingSoon;
            return (
              <button
                key={w.id}
                disabled={disabled}
                onClick={() => {
                  if (disabled) return;
                  setWorkspaceId(w.id);
                  setOpen(false);
                  toast.success(`Switched to ${w.name}`);
                }}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition",
                  disabled ? "cursor-not-allowed text-muted-foreground" : "hover:bg-muted/60",
                  active && "bg-muted/40",
                )}
              >
                <div className={cn(
                  "flex size-6 items-center justify-center rounded-md text-[10px] font-bold text-white",
                  disabled ? "bg-muted-foreground/40" : "bg-[#0B2545]",
                )}>
                  {w.name.charAt(0)}
                </div>
                <span className="flex-1 font-medium">{w.name}</span>
                {disabled && (
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">Coming soon</span>
                )}
                {active && <Check className="size-4 text-accent" />}
              </button>
            );
          })}

          <div className="my-1 h-px bg-border" />
          <button
            onClick={() => { setOpen(false); toast("New workspace flow coming soon"); }}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-foreground/80 hover:bg-muted/60"
          >
            <Plus className="size-4" /> New workspace
          </button>
        </div>
      )}
    </div>
  );
}
