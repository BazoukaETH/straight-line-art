import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Crown, LayoutDashboard, BarChart2, Globe, TrendingUp, CreditCard, ArrowRight } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { cn } from "@/lib/utils";

const links = [
  { icon: LayoutDashboard, title: "Command Center", desc: "Founder home with critical projects, matters, decisions", to: "/" },
  { icon: BarChart2, title: "Workspace Dashboard", desc: "Operational rollup for the current workspace", to: "/founder" },
  { icon: Globe, title: "Organization Dashboard", desc: "Cross-workspace rollup, all operating companies", to: "/org" },
  { icon: TrendingUp, title: "Financial & Portfolio", desc: "Cash, runway, MRR, ventures", to: "/org/financial" },
  { icon: CreditCard, title: "Subscriptions", desc: "SaaS replacement tracker", to: "/org/subscriptions" },
] as const;

export function FounderQuickAccess({ variant = "sidebar" }: { variant?: "sidebar" | "mobile" }) {
  const { role } = useApp();
  const [open, setOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState(0);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    if (role !== "founder") return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const editable = (e.target as HTMLElement)?.isContentEditable;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || editable) return;
      if (e.key === "f" || e.key === "F") {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        e.preventDefault();
        setOpen(true);
        setFocusIdx(0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [role]);

  useEffect(() => {
    if (open) setTimeout(() => itemRefs.current[focusIdx]?.focus(), 30);
  }, [open, focusIdx]);

  if (role !== "founder") return null;

  const go = (to: string) => { setOpen(false); nav({ to }); };

  const handleListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setFocusIdx((i) => Math.min(i + 1, links.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setFocusIdx((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Escape") { e.preventDefault(); setOpen(false); }
  };

  const trigger = variant === "sidebar" ? (
    <button
      className={cn(
        "group flex w-full items-center gap-2 rounded-[10px] border px-2.5 py-2 text-left transition-all",
        open
          ? "bg-[#F59E0B] border-[#F59E0B] text-white"
          : "hover:scale-[1.02]"
      )}
      style={
        open
          ? undefined
          : { backgroundColor: "rgba(251,191,36,0.12)", borderColor: "rgba(245,158,11,0.30)" }
      }
      onMouseEnter={(e) => { if (!open) e.currentTarget.style.backgroundColor = "rgba(251,191,36,0.20)"; }}
      onMouseLeave={(e) => { if (!open) e.currentTarget.style.backgroundColor = "rgba(251,191,36,0.12)"; }}
    >
      <Crown className="size-4 shrink-0" style={{ color: open ? "#fff" : "#F59E0B" }} />
      <span className="text-[13px] font-semibold" style={{ color: open ? "#fff" : "#F59E0B" }}>Founder</span>
    </button>
  ) : (
    <button
      aria-label="Founder quick access"
      className={cn(
        "flex size-9 items-center justify-center rounded-[10px] border transition-all",
        open ? "bg-[#F59E0B] border-[#F59E0B]" : "hover:scale-[1.02]"
      )}
      style={
        open
          ? undefined
          : { backgroundColor: "rgba(251,191,36,0.12)", borderColor: "rgba(245,158,11,0.30)" }
      }
    >
      <Crown className="size-4" style={{ color: open ? "#fff" : "#F59E0B" }} />
    </button>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        side={variant === "sidebar" ? "right" : "bottom"}
        align={variant === "sidebar" ? "start" : "end"}
        sideOffset={variant === "sidebar" ? 12 : 8}
        className="w-[260px] p-1.5"
        onKeyDown={handleListKey}
      >
        <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Founder quick access
        </div>
        <div className="flex flex-col">
          {links.map((l, i) => (
            <button
              key={l.to}
              ref={(el) => { itemRefs.current[i] = el; }}
              onClick={() => go(l.to)}
              onFocus={() => setFocusIdx(i)}
              className="flex items-start gap-2.5 rounded-md px-2 py-2 text-left outline-none transition-colors hover:bg-muted focus:bg-muted"
            >
              <l.icon className="mt-0.5 size-[18px] shrink-0 text-[#F59E0B]" />
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold leading-tight">{l.title}</div>
                <div className="mt-0.5 text-[12px] leading-tight text-muted-foreground">{l.desc}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="my-1 h-px bg-border" />
        <button
          onClick={() => go("/org/settings")}
          className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[12px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <span>Manage organization settings</span>
          <ArrowRight className="size-3" />
        </button>
      </PopoverContent>
    </Popover>
  );
}
