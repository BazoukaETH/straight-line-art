import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar } from "@/components/wasla/Avatar";
import { Spark } from "@/components/wasla/Charts";
import { useApp } from "@/lib/app-context";
import {
  organization, members, workspaces, tasks, spaceById, formatCairoDate, egp, dailyShipped,
} from "@/lib/mock-data";
import { ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/org/")({ component: OrgDashboard });

function OrgDashboard() {
  const { subscriptions } = useApp();
  const nav = useNavigate();
  const activeWs = workspaces.filter((w) => !w.comingSoon);
  const shippedThisWeek = tasks.filter((t) => t.status === "Done").length;
  const activeSubs = subscriptions.filter((s) => s.status === "Active");
  const monthlySpend = activeSubs.reduce((sum, s) => sum + s.monthly, 0);
  const cancelled = subscriptions.filter((s) => s.status === "Cancelled");
  const projectedSavings = subscriptions.reduce((sum, s) => sum + s.monthly, 0);

  // Top blockers across workspaces (we only have one workspace in V1, but build for many)
  const blockerTasks = tasks
    .filter((t) => t.status === "Blocked")
    .slice(0, 5)
    .map((t, i) => ({ task: t, days: 3 + i * 2, workspaceId: workspaces[0].id }));

  return (
    <div className="px-6 py-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Organization Dashboard</h1>
          <p className="text-sm text-muted-foreground">{organization.name} · {formatCairoDate()}</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="week">
            <SelectTrigger className="h-9 w-[160px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="custom">Custom…</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 text-sm">
            <Switch defaultChecked id="weekly-digest" />
            <label htmlFor="weekly-digest" className="text-xs text-muted-foreground">Email me weekly digest</label>
          </div>
        </div>
      </div>

      {/* Row 1 - Org-wide metric cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <OrgMetric label="Team members" value={`${members.length}`} sub={`across ${activeWs.length} active workspace${activeWs.length > 1 ? "s" : ""}`} />
        <OrgMetric label="BOD compliance (week)" value="86%" sub="6 of 7 today" trend="+4% vs last week" />
        <OrgMetric label="Tasks shipped this week" value={`${shippedThisWeek}`} sub="across all workspaces" trend="+12% vs last week" />
        <OrgMetric label="Monthly SaaS spend" value={egp(monthlySpend)} sub={`${activeSubs.length} active subs`} trend="-EGP 0 saved" />
      </div>

      {/* Row 2 - Workspace health */}
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Workspaces</h3>
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        {workspaces.map((w) => {
          const isActive = !w.comingSoon;
          return (
            <Card key={w.id} className={`border-border overflow-hidden p-0 ${!isActive ? "opacity-70" : ""}`}>
              <div className="p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-[#0B2545] text-base font-bold text-white">{w.name.charAt(0)}</div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold leading-tight">{w.name}</h4>
                    <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${isActive ? "bg-[color-mix(in_oklab,var(--success)_14%,transparent)] text-[color:var(--success)]" : "bg-muted text-muted-foreground"}`}>
                      {isActive ? "Active" : "Coming soon"}
                    </span>
                  </div>
                </div>
                <div className="mb-3 grid grid-cols-3 gap-2">
                  <Mini label="Members" value={isActive ? members.length : 0} />
                  <Mini label="Shipped wk" value={isActive ? shippedThisWeek : 0} />
                  <Mini label="Blockers" value={isActive ? blockerTasks.length : 0} accent={isActive && blockerTasks.length > 0} />
                </div>
                <Spark data={dailyShipped(isActive ? 2 : 0).map(d => d.v)} color={isActive ? "#8B5CF6" : "#cbd5e1"} />
                <div className="mt-3 flex">
                  {isActive ? (
                    <Button size="sm" className="gap-1.5" onClick={() => nav({ to: "/" })}>Open workspace <ArrowRight className="size-3.5" /></Button>
                  ) : (
                    <Button size="sm" variant="outline">Set up workspace</Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Row 3 - Top blockers */}
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Top blockers across workspaces</h3>
      <Card className="mb-6 border-border p-0 overflow-hidden">
        {blockerTasks.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">No open blockers — nice.</div>
        ) : blockerTasks.map(({ task, days, workspaceId }) => {
          const ws = workspaces.find((w) => w.id === workspaceId)!;
          const sp = spaceById(task.spaceId);
          return (
            <div key={task.id} className="flex items-center gap-3 border-b border-border/60 px-5 py-3 last:border-0">
              <div className="size-1.5 shrink-0 rounded-full bg-destructive" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{task.title}</div>
                <div className="text-[11px] text-muted-foreground">{sp.name} · blocked {days}d</div>
              </div>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">{ws.name}</span>
              <Avatar memberId={task.assigneeId} size={24} />
              <Button size="sm" variant="ghost" className="gap-1">Open <ExternalLink className="size-3" /></Button>
            </div>
          );
        })}
      </Card>

      {/* Row 4 - Subscription savings banner */}
      <Card className="border-border bg-gradient-to-r from-[color:var(--accent)]/8 to-transparent p-5">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex-1 min-w-[220px]">
            <div className="text-xs text-muted-foreground">Subscriptions cancelled</div>
            <div className="mt-0.5 text-2xl font-semibold">{cancelled.length} / {subscriptions.length}</div>
          </div>
          <div className="flex-1 min-w-[220px]">
            <div className="text-xs text-muted-foreground">Projected monthly savings at full migration</div>
            <div className="mt-0.5 text-2xl font-semibold text-[color:var(--success)]">{egp(projectedSavings)}</div>
          </div>
          <Link to="/org/subscriptions">
            <Button size="sm" variant="outline" className="gap-1.5">View subscriptions <ArrowUpRight className="size-3.5" /></Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

function OrgMetric({ label, value, sub, trend }: { label: string; value: string; sub: string; trend?: string }) {
  return (
    <Card className="border-border p-5">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1.5 text-[28px] font-semibold leading-none tracking-tight">{value}</div>
      <div className="mt-1 text-[11px] text-muted-foreground">{sub}</div>
      {trend && (
        <>
          <div className="my-3 h-px bg-border" />
          <div className="text-[11px] text-[color:var(--success)]">{trend}</div>
        </>
      )}
    </Card>
  );
}

function Mini({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="rounded-md border border-border/60 px-2 py-2">
      <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
      <div className={`text-base font-semibold ${accent ? "text-destructive" : ""}`}>{value}</div>
    </div>
  );
}
