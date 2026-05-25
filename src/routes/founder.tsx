import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/wasla/AppShell";
import { Avatar } from "@/components/wasla/Avatar";
import { Spark } from "@/components/wasla/Charts";
import { useApp } from "@/lib/app-context";
import {
  bodEod, members, memberById, pillarMeta, spaces, tasks, dailyShipped, workspaces, type Pillar,
} from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, X, ArrowUp, ArrowDown, MessageCircle, ChevronRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/founder")({ component: FounderPage });

function FounderPage() {
  const { role, currentUserId, workspaceId } = useApp();
  const me = memberById(currentUserId);
  const ws = workspaces.find((w) => w.id === workspaceId) ?? workspaces[0];

  const visibleMembers =
    role === "founder" ? members
    : role === "manager" ? members.filter((m) => m.pillar === me.pillar)
    : [me];

  const today = new Date().toISOString().slice(0, 10);
  const bodSubmitted = visibleMembers.filter((m) => bodEod.some((b) => b.memberId === m.id && b.date === today && b.bod));
  const bodMissing = visibleMembers.filter((m) => !bodEod.some((b) => b.memberId === m.id && b.date === today && b.bod));

  return (
    <AppShell breadcrumb={<><span>Wasla</span><span className="text-border">/</span><span className="font-medium text-foreground">Founder Dashboard</span></>}>
      <div className="px-6 py-6 max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Founder Dashboard</h1>
            <p className="text-sm text-muted-foreground">{ws.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Select defaultValue="week">
              <SelectTrigger className="h-9 w-[150px] text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This week</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="custom">Custom…</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 text-sm">
              <Switch defaultChecked id="thurs" />
              <label htmlFor="thurs" className="text-xs text-muted-foreground">Email me Thursday digest</label>
            </div>
          </div>
        </div>

        {/* Row 1 - metric cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <MetricCard
            label="BOD submitted today"
            value={`${bodSubmitted.length} / ${visibleMembers.length}`}
            trend={{ dir: "up", text: "+1 vs yesterday" }}
            expandable
            expanded={
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Submitted today</div>
                  <div className="space-y-1.5">
                    {bodSubmitted.length === 0 && <div className="text-xs text-muted-foreground">No one yet.</div>}
                    {bodSubmitted.map((m) => (
                      <div key={m.id} className="flex items-center gap-2">
                        <Avatar memberId={m.id} size={22} />
                        <span className="flex-1 truncate text-xs">{m.name}</span>
                        <Check className="size-3.5 text-[color:var(--success)]" />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Not submitted</div>
                  <div className="space-y-1.5">
                    {bodMissing.length === 0 && <div className="text-xs text-muted-foreground">Everyone is in.</div>}
                    {bodMissing.map((m) => (
                      <div key={m.id} className="flex items-center gap-2">
                        <Avatar memberId={m.id} size={22} />
                        <span className="flex-1 truncate text-xs">{m.name}</span>
                        <span className="size-1.5 rounded-full bg-destructive" />
                        <Button size="sm" variant="ghost" className="h-6 px-1.5 text-[10px]" onClick={() => toast.success(`Pinged ${m.name.split(" ")[0]} on WhatsApp`)}>
                          <MessageCircle className="mr-1 size-3" /> Ping
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            }
          />
          <MetricCard label="EOD submitted yesterday" value={`5 / ${visibleMembers.length}`} trend={{ dir: "down", text: "-1 vs day before" }} />
          <MetricCard label="Tasks shipped this week" value="23" trend={{ dir: "up", text: "+18% vs last week" }} />
          <MetricCard label="Blockers open" value="4" trend={{ dir: "up", text: "+1 vs yesterday" }} negativeIsBad />
        </div>

        {/* Row 2 - team table */}
        <Card className="border-border p-0 overflow-hidden">
          <div className="border-b border-border bg-muted/40 px-5 py-3">
            <h3 className="text-sm font-semibold">Team</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-2">Member</th>
                  <th className="px-2 py-2">BOD today</th>
                  <th className="px-2 py-2">EOD yest.</th>
                  <th className="px-2 py-2">Now</th>
                  <th className="px-2 py-2 text-center">In Prog</th>
                  <th className="px-2 py-2 text-center">Blocked</th>
                  <th className="px-2 py-2">Cycle (wk)</th>
                  <th className="px-5 py-2">Last activity</th>
                </tr>
              </thead>
              <tbody>
                {visibleMembers.map((m, i) => <TeamRow key={m.id} m={m} i={i} today={today} />)}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Row 3 - pillar cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {(Object.keys(pillarMeta) as Pillar[]).map((p) => {
            const pTasks = tasks.filter((t) => spaces.find((s) => s.id === t.spaceId)?.pillar === p);
            return (
              <Card key={p} className="border-border overflow-hidden p-0">
                <div className="h-1" style={{ backgroundColor: pillarMeta[p].color }} />
                <div className="p-5">
                  <h4 className="mb-3 text-base font-semibold">{pillarMeta[p].label}</h4>
                  <div className="mb-4 grid grid-cols-4 gap-2 text-center">
                    <Mini label="Open"     value={pTasks.filter((t) => t.status !== "Done").length} />
                    <Mini label="Shipped"  value={pTasks.filter((t) => t.status === "Done").length} />
                    <Mini label="Overdue"  value={pTasks.filter((t) => new Date(t.due) < new Date() && t.status !== "Done").length} />
                    <Mini label="Blockers" value={pTasks.filter((t) => t.status === "Blocked").length} accent />
                  </div>
                  <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">Shipped per day · 14d</div>
                  <Spark data={dailyShipped(p.length).map((d) => d.v)} color={pillarMeta[p].color} height={48} />
                </div>
              </Card>
            );
          })}
        </div>

        {role !== "founder" && (
          <div className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            Viewing as <b className="capitalize text-foreground">{role}</b> — scope is limited to your pillar.
          </div>
        )}
      </div>
    </AppShell>
  );
}

function TeamRow({ m, i, today }: { m: ReturnType<typeof memberById>; i: number; today: string }) {
  const nav = useNavigate();
  const submitted = bodEod.some((b) => b.memberId === m.id && b.date === today && b.bod);
  const eodOk = i !== 2;
  const now = tasks.find((t) => t.assigneeId === m.id && t.status === "In Progress");
  const inProgress = tasks.filter((t) => t.assigneeId === m.id && t.status === "In Progress").length;
  const blocked = tasks.filter((t) => t.assigneeId === m.id && t.status === "Blocked").length;
  const cycle = ["1d 4h","2d","18h","3d 2h","1d","9h","1d 8h"][i % 7];
  const silent = i % 5 === 3;
  const lastActivity = silent ? "28h ago" : `${((i + 1) * 23 % 12) + 1}h ago`;

  return (
    <tr
      onClick={() => nav({ to: "/people/$id", params: { id: m.id } })}
      className={cn(
        "cursor-pointer border-t border-border/60 transition hover:bg-muted/50",
        silent && "border-l-[3px] border-l-[color:var(--warning)]",
      )}
    >
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <Avatar memberId={m.id} size={28} status />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 font-medium">
              {m.name}
              {silent && <span className="size-1.5 rounded-full bg-[color:var(--warning)]" />}
            </div>
            <div className="text-[11px] text-muted-foreground truncate">{m.title}</div>
          </div>
        </div>
      </td>
      <td className="px-2"><CheckCell ok={submitted} /></td>
      <td className="px-2"><CheckCell ok={eodOk} /></td>
      <td className="px-2 max-w-[220px]">
        {now ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="block truncate text-foreground/85">{now.title}</span>
            </TooltipTrigger>
            <TooltipContent>{now.title}</TooltipContent>
          </Tooltip>
        ) : <span className="text-muted-foreground">—</span>}
      </td>
      <td className="px-2 text-center tabular-nums">{inProgress}</td>
      <td className="px-2 text-center tabular-nums">
        <span className={blocked > 0 ? "font-medium text-destructive" : ""}>{blocked}</span>
      </td>
      <td className="px-2 text-muted-foreground">{cycle}</td>
      <td className="px-5">
        <div className="flex items-center justify-between gap-2">
          <span className={silent ? "text-[color:var(--warning)] font-medium" : "text-muted-foreground"}>{lastActivity}</span>
          <ChevronRight className="size-3.5 text-muted-foreground" />
        </div>
      </td>
    </tr>
  );
}

function MetricCard({
  label, value, trend, expandable, expanded, negativeIsBad,
}: {
  label: string; value: string;
  trend: { dir: "up" | "down"; text: string };
  expandable?: boolean; expanded?: React.ReactNode; negativeIsBad?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const Arrow = trend.dir === "up" ? ArrowUp : ArrowDown;
  const good = negativeIsBad ? trend.dir === "down" : trend.dir === "up";
  return (
    <Card
      onClick={() => expandable && setOpen((v) => !v)}
      className={cn("border-border p-5", expandable && "cursor-pointer transition hover:border-foreground/15")}
    >
      <div className="text-[28px] font-bold leading-none tracking-tight">{value}</div>
      <div className="mt-2 text-[12px] text-muted-foreground">{label}</div>
      <div className="my-3 h-px bg-border" />
      <div className="flex items-center gap-1.5 text-[11px]">
        {negativeIsBad && trend.dir === "up" && <span className="size-1.5 rounded-full bg-destructive" />}
        <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium ${good ? "bg-[color-mix(in_oklab,var(--success)_14%,transparent)] text-[color:var(--success)]" : "bg-[color-mix(in_oklab,var(--destructive)_14%,transparent)] text-destructive"}`}>
          <Arrow className="size-3" /> {trend.text}
        </span>
      </div>
      {expandable && open && expanded}
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
