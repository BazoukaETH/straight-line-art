import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, ChevronDown, Plus, MoreHorizontal, Flag, CalendarIcon, UserPlus, Circle, MessageSquare, ArrowUpFromLine, GitBranch, Copy, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type Task, type Status, type Priority, spaceById, memberById, listById, members, pillarMeta,
} from "@/lib/mock-data";
import { useTasks } from "@/lib/tasks-store";
import { useApp } from "@/lib/app-context";
import { getChildren, relativeDue } from "@/lib/task-utils";
import { routeForTask } from "@/lib/task-nav";
import { StatusPill } from "./StatusPill";
import { PriorityIcon } from "./PriorityIcon";
import { Avatar } from "./Avatar";
import { SubtaskBadge } from "./SubtaskBadge";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator,
  ContextMenuSub, ContextMenuSubTrigger, ContextMenuSubContent,
} from "@/components/ui/context-menu";
import { Textarea } from "@/components/ui/textarea";
import { useApp as useAppCtx } from "@/lib/app-context";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export type GroupKey = "none" | "status" | "space" | "assignee" | "priority" | "due" | "tag";

const STATUSES: Status[] = ["Backlog", "To Do", "In Progress", "In Review", "Blocked", "Done"];
const STATUS_COLOR: Record<Status, string> = {
  Backlog: "#94a3b8",
  "To Do": "#64748b",
  "In Progress": "#3b82f6",
  "In Review": "#a855f7",
  Blocked: "#ef4444",
  Done: "#10b981",
};
const PRIORITIES: Priority[] = ["urgent", "high", "normal", "low"];

interface Props {
  tasks: Task[];               // all tasks in scope (workspace or space)
  allTasks: Task[];            // full pool (for resolving subtask children even if filtered)
  primary: GroupKey;
  secondary?: GroupKey;        // optional sub-grouping
  scopeLabel?: string;         // for breadcrumb above space sections
}

export function HierarchicalTaskList({ tasks, allTasks, primary, secondary, scopeLabel }: Props) {
  // Top-level rows = tasks with no parent in scope
  const rootIds = useMemo(() => new Set(tasks.filter((t) => !t.parentId).map((t) => t.id)), [tasks]);
  const roots = useMemo(() => tasks.filter((t) => rootIds.has(t.id)), [tasks, rootIds]);

  if (primary === "none") {
    return (
      <div className="rounded-lg border border-border bg-card">
        <StatusGroupRows tasks={roots} allTasks={allTasks} status={undefined} listId={undefined} />
      </div>
    );
  }

  const groups = groupTasks(roots, primary);

  return (
    <div className="space-y-5">
      {groups.map((g) => (
        <PrimaryGroupSection
          key={g.key}
          group={g}
          allTasks={allTasks}
          secondary={secondary}
          scopeLabel={scopeLabel}
          primary={primary}
        />
      ))}
      {groups.length === 0 && (
        <div className="rounded-lg border border-dashed border-border bg-card py-16 text-center text-sm text-muted-foreground">
          No tasks match this view
        </div>
      )}
    </div>
  );
}

/* ============================ Grouping helpers ============================ */

interface Group { key: string; label: string; meta?: any; tasks: Task[] }

function groupTasks(tasks: Task[], by: GroupKey): Group[] {
  const map = new Map<string, Group>();
  const push = (key: string, label: string, t: Task, meta?: any) => {
    if (!map.has(key)) map.set(key, { key, label, meta, tasks: [] });
    map.get(key)!.tasks.push(t);
  };
  for (const t of tasks) {
    switch (by) {
      case "status":   push(t.status, t.status, t, { status: t.status }); break;
      case "space": {
        const s = spaceById(t.spaceId);
        push(s.id, s.name, t, { space: s });
        break;
      }
      case "assignee": {
        const m = memberById(t.assigneeId);
        push(m.id, m.name, t, { member: m });
        break;
      }
      case "priority": push(t.priority, t.priority, t, { priority: t.priority }); break;
      case "due": {
        const bucket = dueBucket(t.due);
        push(bucket.key, bucket.label, t, { due: bucket.key });
        break;
      }
      case "tag": {
        const tags = t.tags?.length ? t.tags : ["__none"];
        for (const tg of tags) push(tg, tg === "__none" ? "No tag" : `#${tg}`, t);
        break;
      }
      default: push("all", "All", t);
    }
  }
  // Sort
  const order: Group[] = Array.from(map.values());
  if (by === "status") order.sort((a, b) => STATUSES.indexOf(a.key as Status) - STATUSES.indexOf(b.key as Status));
  if (by === "priority") order.sort((a, b) => PRIORITIES.indexOf(a.key as Priority) - PRIORITIES.indexOf(b.key as Priority));
  if (by === "space") order.sort((a, b) => a.label.localeCompare(b.label));
  return order;
}

function dueBucket(iso: string): { key: string; label: string } {
  const d = new Date(iso); d.setHours(0,0,0,0);
  const now = new Date(); now.setHours(0,0,0,0);
  const diff = Math.round((d.getTime() - now.getTime()) / 86400000);
  if (diff < 0) return { key: "overdue", label: "Overdue" };
  if (diff === 0) return { key: "today", label: "Today" };
  if (diff <= 7) return { key: "week", label: "This week" };
  if (diff <= 14) return { key: "next", label: "Next week" };
  return { key: "later", label: "Later" };
}

/* ============================ Primary group section ============================ */

function PrimaryGroupSection({
  group, allTasks, secondary, scopeLabel, primary,
}: {
  group: Group; allTasks: Task[]; secondary?: GroupKey; scopeLabel?: string; primary: GroupKey;
}) {
  const storageKey = `wasla.hgrp.${primary}.${group.key}`;
  const [open, setOpen] = useState<boolean>(() => {
    try { const v = localStorage.getItem(storageKey); return v === null ? true : v === "1"; } catch { return true; }
  });
  useEffect(() => { try { localStorage.setItem(storageKey, open ? "1" : "0"); } catch {} }, [storageKey, open]);

  const isSpace = primary === "space";
  const space = group.meta?.space;
  const color = isSpace && space ? pillarMeta[space.pillar as keyof typeof pillarMeta].color : "var(--accent)";
  const pillarLabel = isSpace && space ? pillarMeta[space.pillar as keyof typeof pillarMeta].label : undefined;

  const effectiveSecondary: GroupKey | undefined = secondary ?? (primary === "space" ? "status" : undefined);

  return (
    <section className="rounded-lg">
      <header className="mb-2 flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          {isSpace && (
            <div className="text-[11px] text-muted-foreground">
              {scopeLabel ?? "Workspace"} {pillarLabel ? <>· <span style={{ color }}>{pillarLabel}</span></> : null}
            </div>
          )}
          <button
            onClick={() => setOpen((o) => !o)}
            className="mt-0.5 flex items-center gap-1.5 text-left"
          >
            <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", !open && "-rotate-90")} />
            {isSpace && space && (
              <span
                className="flex size-5 items-center justify-center rounded text-[11px] font-bold text-white"
                style={{ background: color }}
                aria-hidden
              >
                {space.name.slice(0, 1).toUpperCase()}
              </span>
            )}
            <h3 className="text-[18px] font-semibold leading-none">{group.label}</h3>
            <button className="ml-1 flex size-5 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground" onClick={(e) => { e.stopPropagation(); }}>
              <MoreHorizontal className="size-3.5" />
            </button>
          </button>
        </div>
      </header>

      {open && (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          {effectiveSecondary ? (
            <SecondaryGrouped tasks={group.tasks} allTasks={allTasks} by={effectiveSecondary} />
          ) : (
            <StatusGroupRows tasks={group.tasks} allTasks={allTasks} status={undefined} listId={undefined} />
          )}
        </div>
      )}
    </section>
  );
}

function SecondaryGrouped({ tasks, allTasks, by }: { tasks: Task[]; allTasks: Task[]; by: GroupKey }) {
  const groups = groupTasks(tasks, by);
  return (
    <div className="divide-y divide-border">
      {groups.map((g) => (
        <StatusGroupBlock key={g.key} group={g} by={by} allTasks={allTasks} />
      ))}
    </div>
  );
}

function StatusGroupBlock({ group, by, allTasks }: { group: Group; by: GroupKey; allTasks: Task[] }) {
  const storageKey = `wasla.hsub.${by}.${group.key}`;
  const [open, setOpen] = useState<boolean>(() => {
    try { const v = localStorage.getItem(storageKey); return v === null ? true : v === "1"; } catch { return true; }
  });
  useEffect(() => { try { localStorage.setItem(storageKey, open ? "1" : "0"); } catch {} }, [storageKey, open]);

  const color = by === "status" ? STATUS_COLOR[group.key as Status] ?? "#94a3b8" : "#94a3b8";

  // Pick a "natural" list to inline-add into. Choose first task's listId.
  const defaultListId = group.tasks[0]?.listId;

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 bg-muted/30 px-3 py-1.5 text-left hover:bg-muted/50"
      >
        <ChevronDown className={cn("size-3.5 text-muted-foreground transition-transform", !open && "-rotate-90")} />
        <span
          className="inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white"
          style={{ background: color }}
        >
          <Circle className="size-2.5 fill-white text-white" />
          {by === "status" ? group.key : group.label}
        </span>
        <span className="text-[11px] text-muted-foreground">{group.tasks.length}</span>
      </button>
      {open && (
        <StatusGroupRows
          tasks={group.tasks}
          allTasks={allTasks}
          status={by === "status" ? (group.key as Status) : undefined}
          listId={defaultListId}
        />
      )}
    </div>
  );
}

/* ============================ Rows ============================ */

function StatusGroupRows({
  tasks, allTasks, status, listId,
}: { tasks: Task[]; allTasks: Task[]; status: Status | undefined; listId: string | undefined }) {
  return (
    <div>
      <div className="grid grid-cols-[1fr_140px_120px_60px_180px_32px] gap-2 border-b border-border bg-muted/20 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <div>Name</div>
        <div>Assignee</div>
        <div>Due date</div>
        <div>Priority</div>
        <div>Latest comment</div>
        <div className="text-right"><Plus className="ml-auto size-3" /></div>
      </div>
      {tasks.map((t) => (
        <TaskRowNode key={t.id} task={t} allTasks={allTasks} depth={0} />
      ))}
      {listId && <AddInlineRow listId={listId} status={status} />}
      {tasks.length === 0 && !listId && (
        <div className="px-3 py-4 text-[12px] text-muted-foreground">No tasks</div>
      )}
    </div>
  );
}

function TaskRowNode({ task, allTasks, depth }: { task: Task; allTasks: Task[]; depth: number }) {
  const { updateTask } = useTasks();
  const [open, setOpen] = useState(false);
  const children = useMemo(() => getChildren(allTasks, task.id), [allTasks, task.id]);
  const due = relativeDue(task.due);
  const r = routeForTask(task);
  const sp = spaceById(task.spaceId);
  const list = listById(task.listId);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className="group grid grid-cols-[1fr_140px_120px_60px_180px_32px] items-center gap-2 border-b border-border/60 px-3 py-1.5 text-sm hover:bg-muted/30"
            style={{ paddingLeft: 12 + depth * 20 }}
          >
        <div className="flex min-w-0 items-center gap-1.5">
          <button
            onClick={() => setOpen((o) => !o)}
            className={cn("flex size-4 items-center justify-center text-muted-foreground", !children.length && "invisible")}
            aria-label="Expand subtasks"
          >
            <ChevronRight className={cn("size-3.5 transition-transform", open && "rotate-90")} />
          </button>
          <Popover>
            <PopoverTrigger asChild>
              <button onClick={(e) => e.stopPropagation()} aria-label="Status">
                <span
                  className="block size-3.5 rounded-full border-2"
                  style={{
                    borderColor: STATUS_COLOR[task.status],
                    background: task.status === "Done" ? STATUS_COLOR[task.status] : "transparent",
                  }}
                />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-44 p-1" onClick={(e) => e.stopPropagation()}>
              {STATUSES.map((s) => (
                <button key={s} onClick={() => { updateTask(task.id, { status: s }); toast.success(`Status → ${s}`); }} className="flex w-full items-center rounded px-2 py-1.5 text-left text-sm hover:bg-muted">
                  <StatusPill status={s} />
                </button>
              ))}
            </PopoverContent>
          </Popover>
          <Link to={r.to as any} params={r.params as any} className="truncate font-medium text-foreground hover:underline">
            {task.title}
          </Link>
          <SubtaskBadge count={children.length} onClick={() => setOpen((o) => !o)} />
          {depth === 0 && list && (
            <span className="hidden truncate text-[10px] text-muted-foreground md:inline">
              {sp.name} / {list.name}
            </span>
          )}
        </div>
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-1.5 rounded px-1 py-0.5 hover:bg-muted">
                {task.assigneeId ? (
                  <>
                    <Avatar memberId={task.assigneeId} size={22} />
                    <span className="text-xs text-foreground/80">{memberById(task.assigneeId).name.split(" ")[0]}</span>
                  </>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><UserPlus className="size-3.5" /></span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-1">
              {members.map((m) => (
                <button key={m.id} onClick={() => { updateTask(task.id, { assigneeId: m.id }); toast.success(`Assigned ${m.name}`); }} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-muted">
                  <Avatar memberId={m.id} size={20} /> {m.name}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <button className={cn("flex items-center gap-1 rounded px-1 py-0.5 text-xs hover:bg-muted", due.tone === "overdue" ? "text-destructive" : due.tone === "today" ? "text-accent" : "text-muted-foreground")}>
                <CalendarIcon className="size-3" />{due.label}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={new Date(task.due)} onSelect={(d) => d && updateTask(task.id, { due: d.toISOString() })} className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center justify-center rounded p-1 hover:bg-muted">
                {task.priority !== "normal" ? <PriorityIcon priority={task.priority} /> : <Flag className="size-3.5 text-muted-foreground/60" />}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-1">
              {PRIORITIES.map((p) => (
                <button key={p} onClick={() => { updateTask(task.id, { priority: p }); toast.success(`Priority → ${p}`); }} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm capitalize hover:bg-muted">
                  <PriorityIcon priority={p} /> {p}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        </div>
        <LatestCommentCell task={task} />
        <div />
          </div>
        </ContextMenuTrigger>
        <TaskContextMenu task={task} allTasks={allTasks} />
      </ContextMenu>
      {open && children.map((c) => (
        <TaskRowNode key={c.id} task={c} allTasks={allTasks} depth={depth + 1} />
      ))}
    </>
  );
}

/* ============================ Latest comment cell ============================ */
function LatestCommentCell({ task }: { task: Task }) {
  const { updateTask } = useTasks();
  const { currentUserId } = useAppCtx();
  const comments = task.comments ?? [];
  const latest = comments.length > 0 ? comments[comments.length - 1] : null;
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);

  const submit = () => {
    const body = draft.trim();
    if (!body) return;
    const newComment = {
      id: `c-${task.id}-${Date.now()}`,
      authorId: currentUserId,
      body,
      at: new Date().toISOString(),
    };
    updateTask(task.id, { comments: [...comments, newComment] });
    setDraft("");
    toast.success("Comment added");
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-xs hover:bg-muted",
              !latest && "text-muted-foreground"
            )}
          >
            <MessageSquare className="size-3 shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate">
              {latest ? latest.body : "Add comment"}
            </span>
            {comments.length > 1 && (
              <span className="shrink-0 rounded-full bg-muted px-1.5 text-[10px] font-semibold text-muted-foreground">
                {comments.length}
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[360px] p-0" align="end">
          <div className="border-b border-border px-3 py-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Comments</div>
            <div className="truncate text-xs text-foreground/70">{task.title}</div>
          </div>
          <div className="max-h-[260px] space-y-3 overflow-y-auto p-3">
            {comments.length === 0 ? (
              <div className="text-center text-xs text-muted-foreground">No comments yet. Be the first.</div>
            ) : (
              comments.map((c) => {
                const author = memberById(c.authorId);
                return (
                  <div key={c.id} className="flex gap-2">
                    <Avatar memberId={author.id} size={24} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-semibold">{author.name}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(c.at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="text-xs text-foreground/85">{c.body}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="border-t border-border bg-muted/30 p-2">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a comment…"
              rows={2}
              className="resize-none text-xs"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); submit(); }
              }}
            />
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">⌘+Enter to send</span>
              <Button size="sm" className="h-6 px-2 text-[11px]" onClick={submit} disabled={!draft.trim()}>
                Comment
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

/* ============================ Task context menu ============================ */
function TaskContextMenu({ task, allTasks }: { task: Task; allTasks: Task[] }) {
  const { moveTask, updateTask, deleteTask, duplicateTasks } = useTasks();

  const hasParent = !!task.parentId;
  const sameListSiblings = allTasks.filter(
    (t) => t.listId === task.listId && t.id !== task.id && t.parentId !== task.id
  );

  const promote = () => {
    moveTask(task.id, task.listId, undefined);
    toast.success("Promoted to top-level task");
  };
  const makeSubtaskOf = (parent: Task) => {
    moveTask(task.id, parent.listId, parent.id);
    toast.success(`Now subtask of "${parent.title}"`);
  };

  return (
    <ContextMenuContent className="w-56">
      {hasParent && (
        <ContextMenuItem onClick={promote}>
          <ArrowUpFromLine className="mr-2 size-3.5" />
          Promote to top-level task
        </ContextMenuItem>
      )}
      <ContextMenuSub>
        <ContextMenuSubTrigger>
          <GitBranch className="mr-2 size-3.5" />
          Make subtask of…
        </ContextMenuSubTrigger>
        <ContextMenuSubContent className="max-h-72 w-64 overflow-y-auto">
          {sameListSiblings.length === 0 ? (
            <ContextMenuItem disabled>No eligible parent in this list</ContextMenuItem>
          ) : (
            sameListSiblings.map((p) => (
              <ContextMenuItem key={p.id} onClick={() => makeSubtaskOf(p)} className="text-xs">
                <span className="truncate">{p.title}</span>
              </ContextMenuItem>
            ))
          )}
        </ContextMenuSubContent>
      </ContextMenuSub>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={() => { duplicateTasks([task.id]); toast.success("Duplicated"); }}>
        <Copy className="mr-2 size-3.5" />
        Duplicate
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => { deleteTask(task.id); toast.success("Deleted"); }}
        className="text-destructive focus:text-destructive"
      >
        <Trash2 className="mr-2 size-3.5" />
        Delete
      </ContextMenuItem>
    </ContextMenuContent>
  );
}

function AddInlineRow({ listId, status }: { listId: string; status: Status | undefined }) {
  const { createTask } = useTasks();
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState("");
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 px-4 py-2 text-left text-[12px] text-muted-foreground hover:bg-muted/40"
      >
        <Plus className="size-3.5" /> Add Task
      </button>
    );
  }
  const submit = () => {
    if (!val.trim()) return;
    createTask({ title: val.trim(), listId, status: status });
    setVal("");
    toast.success("Task created");
  };
  return (
    <div className="border-t border-border bg-muted/20 px-3 py-2">
      <Input
        autoFocus
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Task name"
        onKeyDown={(e) => {
          if (e.key === "Enter") { submit(); if (!e.shiftKey) setOpen(false); }
          if (e.key === "Escape") setOpen(false);
        }}
        onBlur={() => { if (val.trim()) submit(); setOpen(false); }}
        className="h-7 text-sm"
      />
      <div className="mt-1 text-[10px] text-muted-foreground">Enter to add · Shift+Enter to add and stay · Esc to close</div>
    </div>
  );
}

/* ============================ Group-by dropdown ============================ */

export function GroupByPill({ value, onChange }: { value: GroupKey; onChange: (g: GroupKey) => void }) {
  const labels: Record<GroupKey, string> = {
    none: "None", status: "Status", space: "Space", assignee: "Assignee",
    priority: "Priority", due: "Due date", tag: "Tag",
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 gap-1 rounded-full text-xs">
          Group: <span className="font-semibold">{labels[value]}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-44 p-1" align="start">
        {(Object.keys(labels) as GroupKey[]).map((k) => (
          <button
            key={k}
            onClick={() => onChange(k)}
            className={cn(
              "flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm hover:bg-muted",
              value === k && "bg-muted font-semibold"
            )}
          >
            {labels[k]}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
