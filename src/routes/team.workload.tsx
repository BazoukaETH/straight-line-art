import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { isBefore, isToday, addDays, formatDistanceToNowStrict, format } from "date-fns";
import { ChevronDown, ChevronRight, AlertTriangle, Activity, Users, Coffee } from "lucide-react";
import { useTasks } from "@/lib/tasks-store";
import { useApp } from "@/lib/app-context";
import { members, memberById, spaces, pillarMeta, type Pillar, type Task } from "@/lib/mock-data";
import { Avatar } from "@/components/wasla/Avatar";
import { StatusPill } from "@/components/wasla/StatusPill";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { routeForTask } from "@/lib/task-nav";
import { TeamTabs } from "@/components/wasla/TeamTabs";
import { AppShell } from "@/components/wasla/AppShell";
import { SpaceTreeSidebar } from "@/components/wasla/SpaceTreeSidebar";

export const Route = createFileRoute("/team/workload")({ component: WorkloadPage });

type SortKey = "overdue" | "load" | "name";
type PillarFilter = "all" | Pillar;

interface MemberStats {
  active: Task[];
  overdue: Task[];
  dueToday: Task[];
  dueWeek: Task[];
  blocked: Task[];
  lastActivity: Date | null;
}

function computeStats(memberId: string, allTasks: Task[]): MemberStats {
  const now = new Date();
  const weekFromNow = addDays(now, 7);
  const mine = allTasks.filter(t => t.assigneeId === memberId);
  const active = mine.filter(t => t.status !== "Done");
  const overdue = active.filter(t => t.due && isBefore(new Date(t.due), now));
  const dueToday = active.filter(t => t.due && isToday(new Date(t.due)));
  const dueWeek = active.filter(t => {
    if (!t.due) return false;
    const d = new Date(t.due);
    return d >= now && d <= weekFromNow;
  });
  const blocked = mine.filter(t => t.status === "Blocked");
  const lastActivity = mine.reduce<Date | null>((acc, t) => {
    if (!t.createdAt) return acc;
    const d = new Date(t.createdAt);
    if (!acc || d > acc) return d;
    return acc;
  }, null);
  return { active, overdue, dueToday, dueWeek, blocked, lastActivity };
}

function loadColor(active: number) {
  if (active >= 9) return { bar: "hsl(350,75%,50%)", label: "Overloaded" };
  if (active >= 5) return { bar: "hsl(36,90%,53%)", label: "Busy" };
  return { bar: "hsl(160,80%,40%)", label: "Healthy" };
}

function WorkloadPage() {
  const { role } = useApp();
  const nav = useNavigate();
  const { tasks } = useTasks();
  const [sort, setSort] = useState<SortKey>("overdue");
  const [pillarFilter, setPillarFilter] = useState<PillarFilter>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (role === "member") nav({ to: "/" });
  }, [role, nav]);

  const spaceById = useMemo(() => {
    const map = new Map(spaces.map(s => [s.id, s] as const));
    return (id: string) => map.get(id);
  }, []);

  const rows = useMemo(() => {
    return members.map(m => ({ member: m, stats: computeStats(m.id, tasks) }));
  }, [tasks]);

  const filtered = useMemo(() => {
    let r = rows;
    if (pillarFilter !== "all") r = r.filter(x => x.member.pillar === pillarFilter);
    const sorted = [...r];
    sorted.sort((a, b) => {
      if (sort === "name") return a.member.name.localeCompare(b.member.name);
      if (sort === "load") return b.stats.active.length - a.stats.active.length;
      return b.stats.overdue.length - a.stats.overdue.length;
    });
    return sorted;
  }, [rows, sort, pillarFilter]);

  const totals = useMemo(() => {
    const open = rows.reduce((s, r) => s + r.stats.active.length, 0);
    const overdue = rows.reduce((s, r) => s + r.stats.overdue.length, 0);
    const idle = rows.filter(r => r.stats.active.length === 0).length;
    const overloaded = rows.filter(r => r.stats.active.length >= 9).length;
    return { open, overdue, idle, overloaded };
  }, [rows]);

  if (role === "member") return null;

  return (
    <AppShell sidebar={<SpaceTreeSidebar />} breadcrumb={<span>Team / Workload</span>}>
      <div className="p-4 md:p-6 space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Team</h1>
        <p className="text-sm text-muted-foreground">Who is overloaded, who is idle, what is slipping.</p>
      </div>

      <TeamTabs active="workload" />

      {/* Stat tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Tile icon={Activity} label="Open tasks" value={totals.open} color="hsl(220,95%,47%)" />
        <Tile icon={AlertTriangle} label="Overdue" value={totals.overdue} color="hsl(350,75%,50%)" />
        <Tile icon={Coffee} label="Idle" value={totals.idle} color="hsl(160,80%,40%)" />
        <Tile icon={Users} label="Overloaded" value={totals.overloaded} color="hsl(36,90%,53%)" />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Sort</span>
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="load">Load</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Pillar</span>
          <Select value={pillarFilter} onValueChange={(v) => setPillarFilter(v as PillarFilter)}>
            <SelectTrigger className="h-8 w-[160px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="ventures">Ventures</SelectItem>
              <SelectItem value="internal">Internal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Rows */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {filtered.map(({ member, stats }, idx) => {
          const isOpen = expanded === member.id;
          const load = loadColor(stats.active.length);
          const barPct = Math.min(100, (stats.active.length / 12) * 100);
          return (
            <div key={member.id} className={idx > 0 ? "border-t border-border" : ""}>
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : member.id)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/40 text-left"
              >
                <span className="text-muted-foreground">
                  {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </span>
                <Avatar memberId={member.id} size={32} status />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{member.name}</span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full"
                      style={{ background: `${pillarMeta[member.pillar].color}1f`, color: pillarMeta[member.pillar].color }}
                    >
                      {pillarMeta[member.pillar].label}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">{member.title}</div>
                </div>

                <div className="hidden md:flex items-center gap-5 text-xs">
                  <Stat label="Active" value={stats.active.length} />
                  <Stat label="Today" value={stats.dueToday.length} />
                  <Stat label="Week" value={stats.dueWeek.length} />
                  <Stat label="Overdue" value={stats.overdue.length} valueClass={stats.overdue.length > 0 ? "text-destructive" : ""} />
                  <Stat label="Blocked" value={stats.blocked.length} valueClass={stats.blocked.length > 0 ? "text-[color:var(--warning)]" : ""} />
                </div>

                <div className="hidden lg:flex flex-col items-end gap-1 w-40">
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${barPct}%`, background: load.bar }} />
                  </div>
                  <span className="text-[10px] uppercase tracking-wide" style={{ color: load.bar }}>{load.label}</span>
                </div>

                <div className="hidden md:block w-24 text-right text-[11px] text-muted-foreground">
                  {stats.lastActivity
                    ? `${formatDistanceToNowStrict(stats.lastActivity)} ago`
                    : "no activity"}
                </div>
              </button>

              {/* Mobile counters */}
              <div className="md:hidden px-4 pb-3 flex flex-wrap items-center gap-3 text-xs">
                <Stat label="Active" value={stats.active.length} />
                <Stat label="Today" value={stats.dueToday.length} />
                <Stat label="Week" value={stats.dueWeek.length} />
                <Stat label="Overdue" value={stats.overdue.length} valueClass={stats.overdue.length > 0 ? "text-destructive" : ""} />
                <Stat label="Blocked" value={stats.blocked.length} valueClass={stats.blocked.length > 0 ? "text-[color:var(--warning)]" : ""} />
                <div className="ml-auto text-[11px] text-muted-foreground">
                  {stats.lastActivity ? `${formatDistanceToNowStrict(stats.lastActivity)} ago` : "no activity"}
                </div>
              </div>

              {isOpen && (
                <div className="px-4 pb-4">
                  {stats.active.length === 0 ? (
                    <div className="text-xs text-muted-foreground px-2 py-3">No open tasks.</div>
                  ) : (
                    <div className="border border-border rounded-lg divide-y divide-border overflow-hidden">
                      {stats.active.map(t => {
                        const r = routeForTask(t);
                        const space = spaceById(t.spaceId);
                        const dueDate = t.due ? new Date(t.due) : null;
                        const isOverdue = dueDate && isBefore(dueDate, new Date());
                        return (
                          <Link
                            key={t.id}
                            to={r.to}
                            params={r.params}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 text-xs"
                          >
                            <span className="flex-1 min-w-0 truncate text-foreground">{t.title}</span>
                            <StatusPill status={t.status} />
                            <span className={`w-20 text-right ${isOverdue ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                              {dueDate ? format(dueDate, "MMM d") : "—"}
                            </span>
                            <span className="w-28 text-right text-muted-foreground truncate">{space?.name ?? "—"}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">No members match this filter.</div>
        )}
      </div>
    </AppShell>
  );
}

function Tile({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-3">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: `${color}1f` }}>
          <Icon className="w-3 h-3" style={{ color }} />
        </div>
        <span className="text-[9px] uppercase tracking-wide text-muted-foreground/70 font-semibold">{label}</span>
      </div>
      <div className="text-[18px] font-bold tracking-tight">{value}</div>
    </div>
  );
}

function Stat({ label, value, valueClass = "" }: { label: string; value: number; valueClass?: string }) {
  return (
    <div className="flex flex-col items-center min-w-[44px]">
      <span className={`text-sm font-semibold tabular-nums ${valueClass}`}>{value}</span>
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground/80">{label}</span>
    </div>
  );
}
