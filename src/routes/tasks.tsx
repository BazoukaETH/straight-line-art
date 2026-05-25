import { createFileRoute } from "@tanstack/react-router";
import { AppShell, SidebarHeader, SidebarTreeItem } from "@/components/wasla/AppShell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { tasks, spaces, type Status, pillarMeta } from "@/lib/mock-data";
import { TaskRow } from "@/components/wasla/TaskRow";
import { TaskCard } from "@/components/wasla/TaskCard";
import { useApp } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { Plus, Filter, ArrowDownAZ, Layers } from "lucide-react";

export const Route = createFileRoute("/tasks")({ component: TasksPage });

const COLUMNS: Status[] = ["Backlog", "To Do", "In Progress", "In Review", "Blocked", "Done"];

function Sidebar() {
  return (
    <>
      <SidebarHeader title="Tasks" />
      <div className="flex-1 overflow-y-auto px-2 py-2 scrollbar-thin">
        <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Views</div>
        <SidebarTreeItem label="My Work" active />
        <SidebarTreeItem label="All assigned to me" />
        <SidebarTreeItem label="I'm watching" />
        <SidebarTreeItem label="Overdue" />
        <div className="mb-1 mt-3 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Pillars</div>
        {(Object.keys(pillarMeta) as Array<keyof typeof pillarMeta>).map((p) => (
          <div key={p} className="mb-1">
            <SidebarTreeItem label={pillarMeta[p].label} icon={Layers} />
            <div className="ml-3 border-l border-border/60 pl-1">
              {spaces.filter((s) => s.pillar === p).map((s) => (
                <SidebarTreeItem key={s.id} label={s.name} count={tasks.filter((t) => t.spaceId === s.id).length} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function TasksPage() {
  const { currentUserId } = useApp();
  const my = tasks.filter((t) => t.assigneeId === currentUserId);
  return (
    <AppShell sidebar={<Sidebar />} breadcrumb={<><span>Tasks</span><span className="text-border">/</span><span className="font-medium text-foreground">My Work</span></>}>
      <div className="px-6 py-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">My Work</h1>
            <p className="text-sm text-muted-foreground">Everything assigned to you across spaces</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1.5"><Filter className="size-3.5" /> Filter</Button>
            <Button variant="ghost" size="sm" className="gap-1.5"><ArrowDownAZ className="size-3.5" /> Sort</Button>
            <Button size="sm" className="gap-1.5"><Plus className="size-3.5" /> New task</Button>
          </div>
        </div>

        <Tabs defaultValue="my">
          <TabsList>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="nnb">Now / Next / Blocked</TabsTrigger>
            <TabsTrigger value="my">My Work</TabsTrigger>
          </TabsList>

          <TabsContent value="my" className="mt-4">
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <div className="border-b border-border bg-muted/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {my.length} tasks
              </div>
              {my.map((t) => <TaskRow key={t.id} task={t} />)}
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-4">
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              {tasks.slice(0, 30).map((t) => <TaskRow key={t.id} task={t} />)}
            </div>
          </TabsContent>

          <TabsContent value="board" className="mt-4">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {COLUMNS.map((col) => {
                const items = tasks.filter((t) => t.status === col);
                return (
                  <div key={col} className="flex w-72 shrink-0 flex-col gap-2 rounded-lg bg-muted/40 p-3">
                    <div className="flex items-center justify-between px-1">
                      <h4 className="text-xs font-semibold text-foreground">{col}</h4>
                      <span className="text-[11px] text-muted-foreground">{items.length}</span>
                    </div>
                    <div className="space-y-2">
                      {items.map((t) => <TaskCard key={t.id} task={t} />)}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="mt-4">
            <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-border text-sm">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                <div key={d} className="bg-muted/40 px-2 py-1.5 text-[11px] font-semibold uppercase text-muted-foreground">{d}</div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 3;
                const dayTasks = tasks.filter((_, j) => j % 7 === i % 7).slice(0, 2);
                return (
                  <div key={i} className="min-h-[96px] bg-card p-1.5">
                    <div className="mb-1 text-[11px] text-muted-foreground">{day > 0 && day <= 31 ? day : ""}</div>
                    {day > 0 && dayTasks.map((t) => (
                      <div key={t.id} className="mb-1 truncate rounded bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] px-1.5 py-0.5 text-[11px] text-accent">{t.title}</div>
                    ))}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="nnb" className="mt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {(["In Progress","To Do","Blocked"] as Status[]).map((s) => (
                <div key={s} className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s === "In Progress" ? "Now" : s === "To Do" ? "Next" : "Blocked"}</h4>
                  {tasks.filter((t) => t.status === s).slice(0, 5).map((t) => <TaskCard key={t.id} task={t} />)}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
