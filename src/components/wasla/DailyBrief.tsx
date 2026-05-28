import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Bullet = { text: string; to: string };
type Section = { icon: string; title: string; bullets: Bullet[] };

const VARIANTS: Section[][] = [
  [
    {
      icon: "☀️",
      title: "Since yesterday EOD",
      bullets: [
        { text: "6 of 7 team members submitted EOD. Saif missed.", to: "/inbox" },
        { text: "12 tasks shipped overnight, including SMG Corporate Holding Site final QA pass and HIX brand identity v3 deck.", to: "/tasks" },
        { text: "1 new blocker raised: EJB Mobile App auth flow waiting on backend API decision.", to: "/tasks" },
      ],
    },
    {
      icon: "🎯",
      title: "What I'd focus on today",
      bullets: [
        { text: "HIX founding team equity finalization — still Urgent, no movement in 4 days.", to: "/tasks" },
        { text: "Tourism investor deck review — Bassel listed it In Review yesterday; decision needed before Thursday call.", to: "/tasks" },
        { text: "Lead follow-up: Aly El Garahy — last touch 9 days ago.", to: "/tasks" },
      ],
    },
    {
      icon: "⚠️",
      title: "Heads up",
      bullets: [
        { text: "Mohamed has been the assignee on 3 blocked tasks this week.", to: "/tasks" },
        { text: "Wasla Tourism Fundraise list: no activity in 12 days, target close in 6 weeks.", to: "/tasks" },
      ],
    },
    {
      icon: "✅",
      title: "Quick wins available",
      bullets: [
        { text: "2 decisions waiting on you that have been open > 48 hours.", to: "/tasks" },
        { text: "5 tasks marked In Review across the team; none assigned for follow-up review.", to: "/tasks" },
      ],
    },
  ],
  [
    {
      icon: "☀️",
      title: "Since yesterday EOD",
      bullets: [
        { text: "7 of 7 EODs in. Hagry flagged the SMG handoff as at-risk.", to: "/inbox" },
        { text: "9 tasks shipped — Loop Commerce launch checklist now 80% complete.", to: "/tasks" },
        { text: "New blocker: Cairo Capital legal review awaiting counsel reply.", to: "/tasks" },
      ],
    },
    {
      icon: "🎯",
      title: "What I'd focus on today",
      bullets: [
        { text: "Approve HIX equity split — partners waiting since Monday.", to: "/tasks" },
        { text: "Review tourism deck v4 before 3:30pm investor call.", to: "/tasks" },
        { text: "Close out April invoices — finance needs sign-off today.", to: "/tasks" },
      ],
    },
    {
      icon: "⚠️",
      title: "Heads up",
      bullets: [
        { text: "Mohamed assigned to 3 blocked tasks — consider reshuffling.", to: "/tasks" },
        { text: "Personal Decisions list has 4 open items > 1 week.", to: "/tasks" },
      ],
    },
    {
      icon: "✅",
      title: "Quick wins available",
      bullets: [
        { text: "3 decisions waiting on you, all < 5 min reads.", to: "/tasks" },
        { text: "6 In Review tasks unassigned for reviewer.", to: "/tasks" },
      ],
    },
  ],
];

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function DailyBrief() {
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [variant, setVariant] = useState(0);
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null);
  const [, force] = useState(0);

  useEffect(() => {
    setMounted(true);
    const key = todayKey();
    if (typeof window !== "undefined" && localStorage.getItem("wasla.dailyBrief.hidden") === key) {
      setHidden(true);
    }
    setGeneratedAt(new Date(Date.now() - 2 * 60 * 1000));
    const t = setInterval(() => force((x) => x + 1), 60_000);
    return () => clearInterval(t);
  }, []);

  const sections = useMemo(() => VARIANTS[variant % VARIANTS.length], [variant]);

  if (!mounted || hidden) return null;

  const minsAgo = generatedAt ? Math.max(0, Math.floor((Date.now() - generatedAt.getTime()) / 60_000)) : 0;
  const stamp = minsAgo < 1 ? "Generated just now" : `Generated ${minsAgo} min ago`;

  return (
    <div
      className="rounded-xl border border-border/70 p-5 shadow-sm"
      style={{ background: "linear-gradient(135deg, oklch(0.97 0.02 250) 0%, oklch(1 0 0) 60%)" }}
    >
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="size-4" style={{ color: "#0B2545" }} />
        <h2 className="text-[16px] font-semibold tracking-tight">Daily Brief</h2>
        <div className="ml-auto flex items-center gap-1">
          <span className="text-[11px] text-muted-foreground">{stamp}</span>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => {
              setVariant((v) => v + 1);
              setGeneratedAt(new Date());
            }}
            aria-label="Refresh brief"
          >
            <RefreshCw className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.setItem("wasla.dailyBrief.hidden", todayKey());
              }
              setHidden(true);
            }}
            title="Hide for today"
            aria-label="Hide for today"
          >
            <X className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <div key={s.title}>
            <div className="mb-1.5 flex items-center gap-1.5 text-[12px] font-semibold text-foreground/85">
              <span aria-hidden>{s.icon}</span>
              <span>{s.title}</span>
            </div>
            <ul className="space-y-1">
              {s.bullets.map((b, i) => (
                <li key={i}>
                  <Link
                    to={b.to}
                    className="block rounded-md px-2 py-1.5 text-[13px] leading-snug text-foreground/80 hover:bg-foreground/5 hover:text-foreground"
                  >
                    {b.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
