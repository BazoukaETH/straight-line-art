import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Sunrise, Sunset, CheckCircle2, AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/wasla/AppShell";
import { SpaceTreeSidebar } from "@/components/wasla/SpaceTreeSidebar";
import { TeamTabs } from "@/components/wasla/TeamTabs";
import { Avatar } from "@/components/wasla/Avatar";
import { Card } from "@/components/ui/card";
import { useApp } from "@/lib/app-context";
import { useCheckins, cairoNow, type CheckinEntry } from "@/lib/checkins-store";
import { members } from "@/lib/mock-data";

const CHECKIN_VISIBILITY: "team" | "managers" = "team";

export const Route = createFileRoute("/team/checkins")({ component: CheckinsPage });

function CheckinsPage() {
  const { role } = useApp();
  const nav = useNavigate();
  const { entries } = useCheckins();
  const [today, setToday] = useState<string>("");

  useEffect(() => { setToday(cairoNow().dateStr); }, []);

  const isManager = role === "founder" || role === "manager";

  useEffect(() => {
    if (CHECKIN_VISIBILITY === "managers" && !isManager) nav({ to: "/" });
  }, [isManager, nav]);

  const byMember = useMemo(() => {
    const map = new Map<string, { bod?: CheckinEntry; eod?: CheckinEntry }>();
    if (!today) return map;
    for (const e of entries) {
      if (e.date !== today) continue;
      const cur = map.get(e.memberId) ?? {};
      cur[e.phase] = e;
      map.set(e.memberId, cur);
    }
    return map;
  }, [entries, today]);

  const checkedInCount = useMemo(() => {
    let n = 0;
    for (const m of members) {
      const v = byMember.get(m.id);
      if (v?.bod || v?.eod) n++;
    }
    return n;
  }, [byMember]);

  const notYet = useMemo(
    () => members.filter((m) => {
      const v = byMember.get(m.id);
      return !v?.bod && !v?.eod;
    }),
    [byMember],
  );

  if (CHECKIN_VISIBILITY === "managers" && !isManager) return null;

  return (
    <AppShell sidebar={<SpaceTreeSidebar />} breadcrumb={<span>Team / Check-ins</span>}>
      <div className="p-4 md:p-6 space-y-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Check-ins</h1>
          <p className="text-sm text-muted-foreground">Today's BOD and EOD from everyone on the team.</p>
        </div>

        <TeamTabs active="checkins" />

        {/* Counter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm">
            <CheckCircle2 className="size-4 text-[color:var(--success)]" />
            <span><b className="tabular-nums">{checkedInCount}</b> of {members.length} checked in today</span>
          </div>
        </div>

        {/* Manager-only "Not yet" summary */}
        {isManager && notYet.length > 0 && today && (
          <div className="flex items-start gap-2 rounded-md border border-[color:var(--warning)]/40 bg-[color:var(--warning)]/10 px-3 py-2 text-sm">
            <AlertTriangle className="mt-0.5 size-4 text-[color:var(--warning)]" />
            <div>
              <span className="font-medium">Not yet checked in:</span>{" "}
              <span className="text-muted-foreground">{notYet.map((m) => m.name).join(", ")}</span>
            </div>
          </div>
        )}

        {/* Rows */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {members.map((m, idx) => {
            const v = byMember.get(m.id);
            return (
              <div key={m.id} className={`flex flex-col gap-3 px-4 py-3 md:flex-row md:items-start ${idx > 0 ? "border-t border-border" : ""}`}>
                <div className="flex items-center gap-3 md:w-56 md:shrink-0">
                  <Avatar memberId={m.id} size={32} status />
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{m.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{m.title}</div>
                  </div>
                </div>
                <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-2">
                  <PhaseCell icon={<Sunrise className="size-3.5" />} label="BOD" entry={v?.bod} />
                  <PhaseCell icon={<Sunset className="size-3.5" />} label="EOD" entry={v?.eod} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

function PhaseCell({ icon, label, entry }: { icon: React.ReactNode; label: string; entry?: CheckinEntry }) {
  if (!entry) {
    return (
      <Card className="border-border p-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">{icon}</span>
          <span className="font-semibold text-muted-foreground">{label}</span>
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-[color:var(--warning)]/15 px-1.5 py-0.5 text-[10px] font-medium text-[color:var(--warning)]">
            <AlertTriangle className="size-3" /> Missing
          </span>
        </div>
      </Card>
    );
  }
  return (
    <Card className="border-border p-3">
      <div className="flex items-center gap-2 text-xs">
        <span className="size-1.5 rounded-full bg-[color:var(--success)]" />
        <span className="text-muted-foreground">{icon}</span>
        <span className="font-semibold">{label}</span>
      </div>
      <div className="mt-1.5 text-sm leading-snug">{entry.text}</div>
      {entry.blockers && (
        <div className="mt-1 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Blockers:</span> {entry.blockers}
        </div>
      )}
    </Card>
  );
}
