import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/wasla/AppShell";
import { bodEod, members, memberById, pillarMeta, spaces, tasks, type Pillar } from "@/lib/mock-data";
import { Avatar } from "@/components/wasla/Avatar";
import { useApp } from "@/lib/app-context";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Check, X, CircleAlert, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/founder")({ component: FounderPage });

function FounderPage() {
  const { role, currentUserId } = useApp();
  const me = memberById(currentUserId);

  // Scope visible members by role
  const visibleMembers =
    role === "founder" ? members
    : role === "manager" ? members.filter(m => m.pillar === me.pillar)
    : [me];

  const today = new Date().toISOString().slice(0,10);
  const bodToday = bodEod.filter(b => b.date === today && b.bod).length;
  const totalMembers = members.length;

  return (
    <AppShell breadcrumb={<><span>Wasla</span><span className="text-border">/</span><span className="font-medium text-foreground">Founder Dashboard</span></>}>
      <div className="px-6 py-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Founder Dashboard</h1>
            <p className="text-sm text-muted-foreground">Operating signals across people and pillars</p>
          </div>
          <div className="flex items-center gap-3">
            <Select defaultValue="week">
              <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This week</SelectItem>
                <SelectItem value="last">Last week</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 text-sm">
              <Switch defaultChecked id="digest" />
              <label htmlFor="digest" className="text-muted-foreground">Send me the Thursday email</label>
            </div>
          </div>
        </div>

        {/* Row 1: Signals */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Signal label="BOD submitted today" value={`${bodToday} / ${totalMembers}`} tone={bodToday === totalMembers ? "good" : bodToday >= totalMembers - 1 ? "warn" : "bad"} />
          <Signal label="EOD submitted yesterday" value={`5 / ${totalMembers}`} tone="warn" />
          <Signal label="Tasks shipped this week" value="23" tone="good" icon={TrendingUp} />
          <Signal label="Blockers open" value="4" tone="bad" icon={CircleAlert} />
        </div>

        {/* Row 2: People */}
        <Card className="mb-6 border-border p-0 overflow-hidden">
          <div className="border-b border-border bg-muted/40 px-5 py-3">
            <h3 className="text-sm font-semibold">People</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-2">Name</th>
                  <th className="px-2 py-2">BOD today</th>
                  <th className="px-2 py-2">EOD yest.</th>
                  <th className="px-2 py-2">Now</th>
                  <th className="px-2 py-2 text-center">In Progress</th>
                  <th className="px-2 py-2 text-center">Blocked</th>
                  <th className="px-2 py-2">Cycle time</th>
                  <th className="px-5 py-2">Last activity</th>
                </tr>
              </thead>
              <tbody>
                {visibleMembers.map((m, i) => {
                  const submitted = bodEod.some(b => b.memberId === m.id && b.date === today && b.bod);
                  const silent = i % 5 === 3;
                  const now = tasks.find(t => t.assigneeId === m.id && t.status === "In Progress");
                  return (
                    <tr key={m.id} className={`border-t border-border/60 transition hover:bg-muted/40 ${silent ? "bg-[color-mix(in_oklab,var(--warning)_8%,transparent)]" : ""}`}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar memberId={m.id} size={28} status />
                          <div>
                            <div className="font-medium">{m.name}</div>
                            <div className="text-[11px] text-muted-foreground">{m.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2"><CheckCell ok={submitted} /></td>
                      <td className="px-2"><CheckCell ok={i !== 2} /></td>
                      <td className="px-2 text-foreground/85 max-w-[220px] truncate">{now?.title ?? "—"}</td>
                      <td className="px-2 text-center">{tasks.filter(t => t.assigneeId === m.id && t.status === "In Progress").length}</td>
                      <td className="px-2 text-center">
                        <span className={tasks.filter(t => t.assigneeId === m.id && t.status === "Blocked").length > 0 ? "text-destructive font-medium" : ""}>
                          {tasks.filter(t => t.assigneeId === m.id && t.status === "Blocked").length}
                        </span>
                      </td>
                      <td className="px-2 text-muted-foreground">{["1d 4h","2d","18h","3d 2h","1d","9h","1d 8h"][i % 7]}</td>
                      <td className="px-5 text-muted-foreground">{silent ? <span className="text-[color:var(--warning)] font-medium">28h ago</span> : `${(i+1) * 23 % 12 + 1}h ago`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Row 3: Pillar health */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {(Object.keys(pillarMeta) as Pillar[]).map((p) => {
            const pTasks = tasks.filter(t => spaces.find(s => s.id === t.spaceId)?.pillar === p);
            return (
              <Card key={p} className="border-border overflow-hidden p-0">
                <div className="h-1.5" style={{ backgroundColor: pillarMeta[p].color }} />
                <div className="p-5">
                  <h4 className="mb-3 font-semibold">{pillarMeta[p].label}</h4>
                  <div className="mb-4 grid grid-cols-4 gap-2 text-center">
                    <Mini label="Open" value={pTasks.filter(t => t.status !== "Done").length} />
                    <Mini label="Shipped" value={pTasks.filter(t => t.status === "Done").length} />
                    <Mini label="Overdue" value={pTasks.filter(t => new Date(t.due) < new Date() && t.status !== "Done").length} />
                    <Mini label="Blockers" value={pTasks.filter(t => t.status === "Blocked").length} accent />
                  </div>
                  <Sparkline color={pillarMeta[p].color} />
                </div>
              </Card>
            );
          })}
        </div>

        {role !== "founder" && (
          <div className="mt-6 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            Viewing as <b className="capitalize text-foreground">{role}</b> — table scope is limited to your visibility.
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Signal({ label, value, tone, icon: Icon }: { label: string; value: string; tone: "good"|"warn"|"bad"; icon?: typeof CircleAlert }) {
  const colors = { good: "var(--success)", warn: "var(--warning)", bad: "var(--destructive)" } as const;
  return (
    <Card className="border-border p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="size-2 rounded-full" style={{ backgroundColor: colors[tone] }} />
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-semibold tracking-tight">{value}</span>
        {Icon && <Icon className="size-4 text-muted-foreground" />}
      </div>
    </Card>
  );
}

function CheckCell({ ok }: { ok: boolean }) {
  return ok
    ? <span className="inline-flex size-5 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--success)_22%,transparent)] text-[color:var(--success)]"><Check className="size-3" /></span>
    : <span className="inline-flex size-5 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--destructive)_18%,transparent)] text-destructive"><X className="size-3" /></span>;
}

function Mini({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="rounded-md border border-border/60 py-2">
      <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
      <div className={`text-base font-semibold ${accent && value > 0 ? "text-destructive" : ""}`}>{value}</div>
    </div>
  );
}

function Sparkline({ color }: { color: string }) {
  const pts = [3, 5, 4, 6, 8, 5, 9, 7, 10, 8, 12, 9, 11, 14];
  const max = Math.max(...pts);
  const w = 240, h = 40;
  const path = pts.map((v, i) => `${(i / (pts.length - 1)) * w},${h - (v / max) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-10 w-full">
      <polyline points={path} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
