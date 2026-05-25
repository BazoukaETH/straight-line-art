import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { Crown } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { cn } from "@/lib/utils";

export function FounderQuickAccess({ variant = "sidebar" }: { variant?: "sidebar" | "mobile" }) {
  const { role } = useApp();
  const nav = useNavigate();
  const loc = useLocation();
  const active = loc.pathname === "/founder";

  useEffect(() => {
    if (role !== "founder") return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (!t) return;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable) return;
      if ((e.key === "f" || e.key === "F") && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        nav({ to: "/founder" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [role, nav]);

  if (role !== "founder") return null;

  const baseStyle = active
    ? { backgroundColor: "#F59E0B", borderColor: "#F59E0B" }
    : { backgroundColor: "rgba(251,191,36,0.12)", borderColor: "rgba(245,158,11,0.30)" };
  const fg = active ? "#fff" : "#F59E0B";

  if (variant === "mobile") {
    return (
      <Link
        to="/founder"
        aria-label="Founder Dashboard"
        className={cn("flex size-9 items-center justify-center rounded-[10px] border transition-transform hover:scale-[1.02]")}
        style={baseStyle}
        onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = "rgba(251,191,36,0.20)"; }}
        onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = "rgba(251,191,36,0.12)"; }}
      >
        <Crown className="size-4" style={{ color: fg }} />
      </Link>
    );
  }

  return (
    <Link
      to="/founder"
      className="flex w-full items-center gap-2 rounded-[10px] border px-2.5 py-2 transition-transform hover:scale-[1.02]"
      style={baseStyle}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = "rgba(251,191,36,0.20)"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = "rgba(251,191,36,0.12)"; }}
    >
      <Crown className="size-4 shrink-0" style={{ color: fg }} />
      <span className="text-[13px] font-semibold" style={{ color: fg }}>Founder</span>
    </Link>
  );
}
