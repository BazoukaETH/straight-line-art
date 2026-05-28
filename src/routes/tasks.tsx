import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type DragEvent } from "react";
import { AppShell } from "@/components/wasla/AppShell";
import { SpaceTreeSidebar } from "@/components/wasla/SpaceTreeSidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";
import { useTasks } from "@/lib/tasks-store";
import { TaskCard } from "@/components/wasla/TaskCard";
import { ListSettingsDialog } from "@/components/wasla/ListSettingsDialog";
import { spaces, type Status, type Task, memberById, type CustomField } from "@/lib/mock-data";
import { Plus, Settings, Filter, Search, Star, Share2, Sliders, Eye, EyeOff, Hash } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/wasla/Avatar";
import { StatusPill } from "@/components/wasla/StatusPill";
import { PriorityIcon } from "@/components/wasla/PriorityIcon";
import { relativeDue } from "@/lib/task-utils";
import { useTaskNav, routeForTask } from "@/lib/task-nav";
import { HierarchicalTaskList, GroupByPill, type GroupKey } from "@/components/wasla/HierarchicalTaskList";
import { toast } from "sonner";

export const Route = createFileRoute("/tasks")({ component: TasksPage });

const STATUSES: Status[] = ["Backlog", "To Do", "In Progress", "In Review", "Blocked", "Done"];


function TasksPage() {

  const { openQuickCreate } = useApp();
  const { tasks, lists, folders } = useTasks();
  const [activeListId, setActiveListId] = useState<string | "my">("my");
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Group/subgroup state, persisted per scope
  const scopeKey = activeListId === "my" ? "workspace" : `list:${activeListId}`;
  const groupStorageKey = `wasla.tasks.group.${scopeKey}`;
  const [group, setGroup] = useState<GroupKey>(() => {
    try {
      const v = localStorage.getItem(groupStorageKey) as GroupKey | null;
      if (v) return v;
    } catch {}
    return activeListId === "my" ? "space" : "status";
  });
  useEffect(() => {
    try {
      const v = localStorage.getItem(groupStorageKey) as GroupKey | null;
      setGroup(v ?? (activeListId === "my" ? "space" : "status"));
    } catch {}
  }, [groupStorageKey, activeListId]);
  useEffect(() => { try { localStorage.setItem(groupStorageKey, group); } catch {} }, [groupStorageKey, group]);

  // Filters
  const [showSubtasks, setShowSubtasks] = useState<"collapse" | "show" | "separate">("collapse");
  const [showClosed, setShowClosed] = useState(false);
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const activeList = activeListId !== "my" ? lists.find((l) => l.id === activeListId) : null;
  const activeFolder = activeList ? folders.find((f) => f.id === activeList.folderId) : null;
  const activeSpace = activeList ? spaces.find((s) => s.id === activeList.spaceId) : null;

  const scopedTasks = useMemo(() => {
    let arr = activeListId === "my" ? tasks : tasks.filter((t) => t.listId === activeListId);
    if (!showClosed) arr = arr.filter((t) => t.status !== "Done");
    if (assigneeFilter) arr = arr.filter((t) => t.assigneeId === assigneeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter((t) => t.title.toLowerCase().includes(q));
    }
    if (showSubtasks === "collapse") arr = arr.filter((t) => !t.parentId);
    return arr;
  }, [tasks, activeListId, showClosed, assigneeFilter, search, showSubtasks]);

  const viewTitle = activeListId === "my" ? "Wasla Ventures" : (activeList?.name ?? "Tasks");

  return (
    <AppShell
      sidebar={<SpaceTreeSidebar />}
      breadcrumb={
        <div className="flex items-center gap-1.5">
          <span>Tasks</span>
          {activeListId === "my" ? <><span className="text-border">/</span><span className="font-medium text-foreground">All</span></> :
            <>
              <span className="text-border">/</span><span>{activeSpace?.name}</span>
              {activeFolder && <><span className="text-border">/</span><span>{activeFolder.name}</span></>}
              <span className="text-border">/</span><span className="font-medium text-foreground">{activeList?.name}</span>
            </>}
        </div>
      }
    >
      <div className="px-6 py-5">
        {/* Header strip */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="truncate text-xl font-semibold">{viewTitle}</h1>
            <button className="text-muted-foreground hover:text-amber-500" title="Star view"><Star className="size-4" /></button>
            {activeList && (
              <Button size="icon" variant="ghost" className="size-7" onClick={() => setSettingsOpen(true)}><Settings className="size-3.5" /></Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1.5"><Sliders className="size-3.5" /> Customize</Button>
            <Button variant="ghost" size="sm" className="gap-1.5"><Share2 className="size-3.5" /> Share</Button>
          </div>
        </div>

        <Tabs defaultValue="list">
          <TabsList>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="add" className="text-muted-foreground" onClick={(e: any) => { e.preventDefault(); toast("Custom views coming soon"); }}>+</TabsTrigger>
          </TabsList>

          {/* Toolbar */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <GroupByPill value={group} onChange={setGroup} />
            <SubtasksToggle value={showSubtasks} onChange={setShowSubtasks} />
            <Button variant="outline" size="sm" className="h-7 gap-1 rounded-full text-xs"><Filter className="size-3" /> Filter</Button>
            <button
              onClick={() => setShowClosed((v) => !v)}
              className={cn("inline-flex h-7 items-center gap-1 rounded-full border px-3 text-xs", showClosed ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:bg-muted")}
            >
              {showClosed ? <Eye className="size-3" /> : <EyeOff className="size-3" />} Closed
            </button>
            <AssigneeFilterChip value={assigneeFilter} onChange={setAssigneeFilter} />
            <div className="relative ml-auto">
              <Search className="pointer-events-none absolute left-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="h-7 w-44 rounded-full border border-border bg-background pl-7 pr-2 text-xs focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <Button size="sm" className="h-7 gap-1 rounded-full text-xs" onClick={() => openQuickCreate({ listId: activeListId === "my" ? lists[0].id : activeListId, tab: "task" })}>
              <Plus className="size-3" /> Add Task
            </Button>
          </div>

          <TabsContent value="list" className="mt-4">
            <HierarchicalTaskList
              tasks={scopedTasks}
              allTasks={tasks}
              primary={group}
              secondary={group === "space" ? "status" : undefined}
              scopeLabel={activeListId === "my" ? "Workspace" : activeSpace?.name}
            />
          </TabsContent>

          <TabsContent value="board" className="mt-4">
            <BoardView tasks={scopedTasks} />
          </TabsContent>

          <TabsContent value="calendar" className="mt-4">
            <CalendarView tasks={scopedTasks} />
          </TabsContent>

          <TabsContent value="table" className="mt-4">
            <TableView tasks={scopedTasks} customFields={activeList?.customFields ?? []} />
          </TabsContent>

          <TabsContent value="timeline" className="mt-4">
            <TimelineView tasks={scopedTasks} />
          </TabsContent>
        </Tabs>
      </div>
      {activeList && <ListSettingsDialog listId={activeList.id} open={settingsOpen} onOpenChange={setSettingsOpen} />}
    </AppShell>
  );
}

// ============ Toolbar bits ============
function SubtasksToggle({ value, onChange }: { value: "collapse" | "show" | "separate"; onChange: (v: "collapse" | "show" | "separate") => void }) {
  const labels = { collapse: "Hide", show: "Show", separate: "Separate" } as const;
  const next = value === "collapse" ? "show" : value === "show" ? "separate" : "collapse";
  return (
    <button
      onClick={() => onChange(next)}
      className="inline-flex h-7 items-center gap-1 rounded-full border border-border px-3 text-xs text-muted-foreground hover:bg-muted"
      title="Cycle subtasks display"
    >
      Subtasks: <span className="font-semibold text-foreground">{labels[value]}</span>
    </button>
  );
}

function AssigneeFilterChip({ value, onChange }: { value: string | null; onChange: (v: string | null) => void }) {
  const m = value ? memberById(value) : null;
  return (
    <div className="inline-flex items-center gap-1">
      {m ? (
        <button onClick={() => onChange(null)} className="inline-flex h-7 items-center gap-1.5 rounded-full bg-accent/15 px-2 text-xs text-foreground">
          <Avatar memberId={m.id} size={18} /> {m.name.split(" ")[0]} <span className="text-muted-foreground">×</span>
        </button>
      ) : (
        <Button variant="outline" size="sm" className="h-7 gap-1 rounded-full text-xs" onClick={() => {
          // simple cycle: pick a different demo assignee
          toast("Use a member's avatar in a task row to filter; or pick from filter menu (V2)");
        }}>
          <Avatar memberId={"bassel"} size={18} /> Assignee
        </Button>
      )}
    </div>
  );
}


// ============ Board ============
function BoardView({ tasks }: { tasks: Task[] }) {
  const { updateTask } = useTasks();
  const onDrop = (e: DragEvent, status: Status) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/task-id");
    if (id) { updateTask(id, { status }); toast.success(`Moved to ${status}`); }
  };
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {STATUSES.map((col) => {
        const items = tasks.filter((t) => t.status === col);
        return (
          <div
            key={col}
            className="flex w-72 shrink-0 flex-col gap-2 rounded-lg bg-muted/40 p-3"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, col)}
          >
            <div className="flex items-center justify-between px-1">
              <h4 className="text-xs font-semibold">{col}</h4>
              <span className="text-[11px] text-muted-foreground">{items.length}</span>
            </div>
            <div className="space-y-2">
              {items.map((t) => (
                <div key={t.id} draggable onDragStart={(e) => e.dataTransfer.setData("text/task-id", t.id)}>
                  <TaskCard task={t} />
                </div>
              ))}
              {items.length === 0 && <div className="rounded-md border border-dashed border-border/60 py-6 text-center text-[11px] text-muted-foreground">Drop here</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============ Calendar ============
function CalendarView({ tasks }: { tasks: Task[] }) {
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const startDow = monthStart.getDay();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  
  return (
    <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-border text-sm">
      {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
        <div key={d} className="bg-muted/40 px-2 py-1.5 text-[11px] font-semibold uppercase text-muted-foreground">{d}</div>
      ))}
      {Array.from({ length: 42 }, (_, i) => {
        const dayNum = i - startDow + 1;
        const valid = dayNum > 0 && dayNum <= daysInMonth;
        const dateStr = valid ? new Date(today.getFullYear(), today.getMonth(), dayNum).toDateString() : "";
        const dayTasks = valid ? tasks.filter((t) => new Date(t.due).toDateString() === dateStr) : [];
        const isToday = valid && dayNum === today.getDate();
        return (
          <div key={i} className="min-h-[110px] bg-card p-1.5">
            {valid && <div className={cn("mb-1 text-[11px]", isToday ? "font-bold text-accent" : "text-muted-foreground")}>{dayNum}</div>}
            {dayTasks.slice(0, 3).map((t) => {
              const r = routeForTask(t);
              return (
                <Link key={t.id} to={r.to as any} params={r.params as any} className="mb-1 block w-full truncate rounded bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] px-1.5 py-0.5 text-left text-[11px] text-accent hover:bg-[color-mix(in_oklab,var(--accent)_22%,transparent)]">
                  {t.title}
                </Link>
              );
            })}
            {dayTasks.length > 3 && <div className="text-[10px] text-muted-foreground">+{dayTasks.length - 3} more</div>}
          </div>
        );
      })}
    </div>
  );
}

// ============ Table ============
function TableView({ tasks, customFields }: { tasks: Task[]; customFields: CustomField[] }) {
  const { goTask } = useTaskNav();
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" }>({ key: "title", dir: "asc" });
  const sorted = useMemo(() => {
    const arr = [...tasks];
    arr.sort((a: any, b: any) => {
      const x = a[sort.key] ?? "";
      const y = b[sort.key] ?? "";
      return (x > y ? 1 : x < y ? -1 : 0) * (sort.dir === "asc" ? 1 : -1);
    });
    return arr;
  }, [tasks, sort]);
  const head = (k: string, label: string) => (
    <th onClick={() => setSort((s) => ({ key: k, dir: s.key === k && s.dir === "asc" ? "desc" : "asc" }))} className="cursor-pointer px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground">{label}</th>
  );
  return (
    <div className="overflow-auto rounded-lg border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/40">
          <tr>
            {head("title", "Title")}
            {head("status", "Status")}
            {head("assigneeId", "Assignee")}
            {head("priority", "Priority")}
            {head("due", "Due")}
            {head("createdAt", "Created")}
            <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Tags</th>
            {customFields.map((f) => <th key={f.id} className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{f.name}</th>)}
          </tr>
        </thead>
        <tbody>
          {sorted.map((t) => {
            const due = relativeDue(t.due);
            const r = routeForTask(t);
            return (
              <tr key={t.id} onClick={() => goTask(t.id)} onDoubleClick={() => goTask(t.id)} className="cursor-pointer border-b border-border/60 hover:bg-muted/40">
                <td className="px-3 py-2 font-medium"><Link to={r.to as any} params={r.params as any} className="block hover:underline">{t.title}</Link></td>
                <td className="px-3 py-2"><StatusPill status={t.status} /></td>
                <td className="px-3 py-2"><div className="flex items-center gap-1.5"><Avatar memberId={t.assigneeId} size={20} /><span className="text-xs">{memberById(t.assigneeId).name.split(" ")[0]}</span></div></td>
                <td className="px-3 py-2"><div className="flex items-center gap-1 capitalize text-xs"><PriorityIcon priority={t.priority} /> {t.priority}</div></td>
                <td className={cn("px-3 py-2 text-xs", due.tone === "overdue" ? "text-destructive" : "text-muted-foreground")}>{due.label}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : ""}</td>
                <td className="px-3 py-2"><div className="flex flex-wrap gap-1">{(t.tags ?? []).map((tg) => <span key={tg} className="inline-flex items-center rounded-full bg-muted px-1.5 py-0.5 text-[10px]"><Hash className="size-2.5" />{tg}</span>)}</div></td>
                {customFields.map((f) => <td key={f.id} className="px-3 py-2 text-xs">{formatCF(t.customFieldValues?.[f.id], f)}</td>)}
              </tr>
            );
          })}
          {sorted.length === 0 && (
            <tr><td colSpan={7 + customFields.length} className="py-12 text-center text-sm text-muted-foreground">No tasks in this view</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function formatCF(v: string | number | undefined, f: CustomField) {
  if (v === undefined || v === "") return <span className="text-muted-foreground/60">—</span>;
  if (f.type === "money") return `${f.currency ?? "EGP"} ${new Intl.NumberFormat("en-US").format(Number(v))}`;
  if (f.type === "dropdown") return <span className="rounded-full bg-muted px-2 py-0.5">{v}</span>;
  return String(v);
}

// ============ Timeline (simple Gantt) ============
function TimelineView({ tasks }: { tasks: Task[] }) {
  
  const days = 28;
  const start = new Date(); start.setDate(start.getDate() - 7); start.setHours(0,0,0,0);
  const pxPerDay = 28;
  const colWidth = days * pxPerDay;
  const rowH = 36;
  const positions = useMemo(() => {
    const map = new Map<string, { x: number; w: number; y: number }>();
    tasks.forEach((t, i) => {
      const s = t.startDate ? new Date(t.startDate) : new Date(new Date(t.due).getTime() - 86400000 * 2);
      const d = new Date(t.due);
      const x = Math.max(0, Math.round((s.getTime() - start.getTime()) / 86400000)) * pxPerDay;
      const w = Math.max(pxPerDay, Math.round((d.getTime() - s.getTime()) / 86400000) * pxPerDay);
      map.set(t.id, { x, w, y: i * rowH + 12 });
    });
    return map;
  }, [tasks, start]);

  return (
    <div className="overflow-auto rounded-lg border border-border bg-card">
      <div className="relative" style={{ width: 240 + colWidth, minHeight: tasks.length * rowH + 40 }}>
        <div className="sticky top-0 z-10 flex border-b border-border bg-muted/40">
          <div className="w-60 shrink-0 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Task</div>
          <div className="flex" style={{ width: colWidth }}>
            {Array.from({ length: days }, (_, i) => {
              const d = new Date(start); d.setDate(start.getDate() + i);
              const isToday = d.toDateString() === new Date().toDateString();
              return <div key={i} className={cn("shrink-0 border-l border-border/60 px-1 py-1 text-[10px]", isToday ? "bg-accent/10 text-accent font-bold" : "text-muted-foreground")} style={{ width: pxPerDay }}>{d.getDate()}</div>;
            })}
          </div>
        </div>
        {tasks.map((t) => {
          const p = positions.get(t.id)!;
          const r = routeForTask(t);
          return (
            <div key={t.id} className="flex border-b border-border/60" style={{ height: rowH }}>
              <div className="flex w-60 shrink-0 items-center gap-2 truncate px-3 text-xs">
                <PriorityIcon priority={t.priority} />
                <Link to={r.to as any} params={r.params as any} className="truncate hover:underline">{t.title}</Link>
              </div>
              <div className="relative" style={{ width: colWidth }}>
                <Link to={r.to as any} params={r.params as any} className="absolute flex h-5 items-center rounded bg-accent/70 px-2 text-[10px] text-accent-foreground hover:bg-accent" style={{ left: p.x, width: p.w, top: 8 }}>
                  {t.title.slice(0, 24)}
                </Link>
              </div>
            </div>
          );
        })}
        {/* dependency arrows */}
        <svg className="pointer-events-none absolute left-60 top-10" width={colWidth} height={tasks.length * rowH}>
          {tasks.map((t) => (t.dependencies?.blocks ?? []).map((bId) => {
            const from = positions.get(t.id); const to = positions.get(bId);
            if (!from || !to) return null;
            const x1 = from.x + from.w; const y1 = from.y - 4;
            const x2 = to.x; const y2 = to.y - 4;
            return <path key={`${t.id}-${bId}`} d={`M${x1},${y1} C${x1+20},${y1} ${x2-20},${y2} ${x2},${y2}`} stroke="hsl(var(--destructive))" strokeWidth={1.2} fill="none" markerEnd="url(#arr)" />;
          }))}
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--destructive))" />
            </marker>
          </defs>
        </svg>
      </div>
    </div>
  );
}
