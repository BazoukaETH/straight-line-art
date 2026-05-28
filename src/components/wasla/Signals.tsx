import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Radar, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Severity = "red" | "orange" | "yellow";
type Signal = {
  id: string;
  severity: Severity;
  title: string;
  context: string;
  actionLabel: string;
  to: string;
};

const SEED: Signal[] = [
  { id: "s1", severity: "red",    title: "Wasla Tourism Fundraise has cooled", context: "No activity in 12 days. Target close in 6 weeks.", actionLabel: "Open Fundraise list", to: "/tasks" },
  { id: "s2", severity: "orange", title: "Mohamed has been blocked 3 times this week", context: "All blockers tied to backend handoffs from Moaz.", actionLabel: "Open Mohamed's profile", to: "/tasks" },
  { id: "s3", severity: "orange", title: "Saif silent", context: "No BOD or task activity in 30+ working hours.", actionLabel: "Open Saif's profile", to: "/tasks" },
  { id: "s4", severity: "yellow", title: "3 leads stale", context: "Yehia Shazly (9d), Mansour (11d), Aly El Garahy (9d).", actionLabel: "Open Leads", to: "/tasks" },
  { id: "s5", severity: "yellow", title: "Decision aging", context: "Payment aggregation Tier 2 launch timing — open 6 days.", actionLabel: "Open Decision", to: "/tasks" },
  { id: "s6", severity: "yellow", title: "HIX timeline at risk", context: "Target date in 3 weeks; velocity down 40% week-over-week.", actionLabel: "Open HIX", to: "/tasks" },
];

const COLOR: Record<Severity, string> = {
  red: "#EF4444",
  orange: "#F59E0B",
  yellow: "#EAB308",
};
const RANK: Record<Severity, number> = { red: 0, orange: 1, yellow: 2 };

const LS_KEY = "wasla.signals.dismissed";

function getDismissed(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
}

export function Signals() {
  const [dismissed, setDismissed] = useState<string[]>(() => getDismissed());

  const dismiss = (id: string) => {
    const next = [...dismissed, id];
    setDismissed(next);
    if (typeof window !== "undefined") localStorage.setItem(LS_KEY, JSON.stringify(next));
  };

  const visible = SEED
    .filter((s) => !dismissed.includes(s.id))
    .sort((a, b) => RANK[a.severity] - RANK[b.severity]);
  const shown = visible.slice(0, 5);
  const totalCount = SEED.length;

  return (
    <Card className="border-border p-5">
      <div className="mb-3 flex items-center gap-2">
        <Radar className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">Signals</h3>
        <span className="ml-1 rounded-full border border-border/70 bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          Auto-detected
        </span>
      </div>

      {shown.length === 0 ? (
        <div className="rounded-md border border-dashed border-border/70 p-4 text-center text-xs text-muted-foreground">
          No signals right now.
        </div>
      ) : (
        <ul className="space-y-2">
          {shown.map((s) => (
            <li
              key={s.id}
              className="group relative rounded-lg border border-border/70 p-3 transition-colors hover:bg-foreground/[0.02]"
            >
              <button
                onClick={() => dismiss(s.id)}
                className="absolute right-1.5 top-1.5 rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:bg-foreground/5 hover:text-foreground group-hover:opacity-100"
                title="Dismiss · Don't show again"
                aria-label="Dismiss signal"
              >
                <X className="size-3" />
              </button>
              <div className="flex items-start gap-2 pr-5">
                <span
                  className="mt-1.5 size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: COLOR[s.severity] }}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium leading-snug text-foreground">{s.title}</div>
                  <div className="mt-0.5 text-[12px] leading-snug text-muted-foreground">{s.context}</div>
                  <Link
                    to={s.to}
                    className="mt-1.5 inline-block text-[12px] font-medium text-[color:var(--accent)] hover:underline"
                  >
                    {s.actionLabel} →
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {visible.length > 5 && (
        <div className="mt-3 text-center">
          <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
            See all ({totalCount})
          </Button>
        </div>
      )}
    </Card>
  );
}
