import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  isBefore,
  isToday,
  isTomorrow,
  isThisWeek,
  isWithinInterval,
  startOfDay,
  addDays,
  addWeeks,
  startOfWeek,
  endOfWeek,
  format,
} from "date-fns";
import { toast } from "sonner";
import { AppShell } from "@/components/wasla/AppShell";
import { SpaceTreeSidebar } from "@/components/wasla/SpaceTreeSidebar";
import { StatusPill } from "@/components/wasla/StatusPill";
import { Avatar } from "@/components/wasla/Avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/lib/app-context";
import { useTasks } from "@/lib/tasks-store";
import {
  members,
  memberById,
  spaces,
  type Task,
  type Pillar,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/deadlines")({ component: DeadlinesPage });

type Bucket = "Overdue" | "Today" | "Tomorrow" | "This week" | "Next week" | "Later";
const BUCKET_ORDER: Bucket[] = ["Overdue", "Today", "Tomorrow", "This week", "Next week", "Later"];

function bucketFor(dueIso: string): Bucket {
  const due = new Date(dueIso);
  const now = new Date();
  if (isBefore(due, startOfDay(now))) return "Overdue";
  if (isToday(due)) return "Today";
  if (isTomorrow(due)) return "Tomorrow";
  if (isThisWeek(due, { weekStartsOn: 1 })) return "This week";
  const nextWeekStart = startOfWeek(addWeeks(now, 1), { weekStartsOn: 1 });
  const nextWeekEnd = endOfWeek(addWeeks(now, 1), { weekStartsOn: 1 });
  if (isWithinInterval(due, { start: nextWeekStart, end: nextWeekEnd })) return "Next week";
  return "Later";
}

function DeadlinesPage() {
  const { role, currentUserId } = useApp();
  const { tasks, lists, updateTask } = useTasks();

  const isMember = role === "member";
  const [scope, setScope] = useState<"everyone" | "me">(isMember ? "me" : "everyone");
  const [pillarFilter, setPillarFilter] = useState<Pillar | "all">("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string | "all">("all");

  const listById = useMemo(() => {
    const m: Record<string, (typeof lists)[number]> = {};
    for (const l of lists) m[l.id] = l;
    return m;
  }, [lists]);

  const spaceById = useMemo(() => {
    const m: Record<string, (typeof spaces)[number]> = {};
    for (const s of spaces) m[s.id] = s;
    return m;
  }, []);

  const effectiveScope = isMember ? "me" : scope;

  const filtered = useMemo(() => {
    let arr = tasks.filter((t) => t.status !== "Done");
    if (effectiveScope === "me") {
      arr = arr.filter((t) => t.assigneeId === currentUserId);
    } else {
      if (pillarFilter !== "all") {
        arr = arr.filter((t) => spaceById[t.spaceId]?.pillar === pillarFilter);
      }
      if (assigneeFilter !== "all") {
        arr = arr.filter((t) => t.assigneeId === assigneeFilter);
      }
    }
    return arr;
  }, [tasks, effectiveScope, currentUserId, pillarFilter, assigneeFilter, spaceById]);

  const grouped = useMemo(() => {
    const g: Record<Bucket, Task[]> = {
      Overdue: [], Today: [], Tomorrow: [], "This week": [], "Next week": [], Later: [],
    };
    for (const t of filtered) g[bucketFor(t.due)].push(t);
    for (const k of BUCKET_ORDER) {
      g[k].sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());
    }
    return g;
  }, [filtered]);

  const onBump = (t: Task) => {
    const next = addDays(new Date(t.due), 1).toISOString();
    updateTask(t.id, { due: next });
    toast.success(`Bumped "${t.title}" +1 day`);
  };
  const onDone = (t: Task) => {
    updateTask(t.id, { status: "Done" });
    toast.success(`Marked "${t.title}" as Done`);
  };

  return (
    <AppShell
      sidebar={<SpaceTreeSidebar />}
      breadcrumb={<span>Deadlines</span>}
    >
      <div className="px-6 py-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Deadlines</h1>
            <p className="text-sm text-muted-foreground">
              Every open task, grouped by when it's due.
            </p>
          </div>

          {!isMember && (
            <div className="inline-flex rounded-full border border-border p-0.5 text-xs">
              {(["everyone", "me"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setScope(s)}
                  className={cn(
                    "rounded-full px-3 py-1 transition",
                    scope === s
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {s === "everyone" ? "Everyone" : "Just me"}
                </button>
              ))}
            </div>
          )}
        </div>

        {effectiveScope === "everyone" && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Select value={pillarFilter} onValueChange={(v) => setPillarFilter(v as any)}>
              <SelectTrigger className="h-8 w-[160px] text-xs">
                <SelectValue placeholder="Pillar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All pillars</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="ventures">Ventures</SelectItem>
                <SelectItem value="internal">Internal</SelectItem>
              </SelectContent>
            </Select>

            <Select value={assigneeFilter} onValueChange={(v) => setAssigneeFilter(v)}>
              <SelectTrigger className="h-8 w-[180px] text-xs">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All assignees</SelectItem>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-6">
          {BUCKET_ORDER.map((bucket) => {
            const items = grouped[bucket];
            if (items.length === 0) return null;
            return (
              <section key={bucket}>
                <h2
                  className={cn(
                    "mb-2 text-sm font-semibold uppercase tracking-wide",
                    bucket === "Overdue" ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
                  )}
                >
                  {bucket} <span className="ml-1 font-normal opacity-70">({items.length})</span>
                </h2>
                <div className="overflow-hidden rounded-lg border border-border bg-background">
                  {items.map((t, i) => {
                    const list = listById[t.listId];
                    const space = list ? spaceById[list.spaceId] : undefined;
                    const member = memberById(t.assigneeId);
                    return (
                      <div
                        key={t.id}
                        className={cn(
                          "flex flex-wrap items-center gap-3 px-3 py-2.5 text-sm",
                          i > 0 && "border-t border-border/60"
                        )}
                      >
                        <span className="min-w-0 flex-1 truncate font-medium">{t.title}</span>
                        <StatusPill status={t.status} />
                        <span className="text-xs text-muted-foreground">
                          {space?.name ?? "—"} · {list?.name ?? "—"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(t.due), "EEE, MMM d")}
                        </span>
                        {effectiveScope === "everyone" && member && (
                          <span className="inline-flex items-center gap-1.5">
                            <Avatar memberId={member.id} size={20} />
                            <span className="text-xs text-muted-foreground">{member.name.split(" ")[0]}</span>
                          </span>
                        )}
                        {bucket === "Overdue" && (
                          <div className="flex items-center gap-1.5">
                            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onBump(t)}>
                              Bump +1d
                            </Button>
                            <Button size="sm" className="h-7 text-xs" onClick={() => onDone(t)}>
                              Done
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {BUCKET_ORDER.every((b) => grouped[b].length === 0) && (
            <div className="rounded-lg border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
              Nothing due. You're clear.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
