import { useState, useMemo, type DragEvent } from "react";
import { useApp } from "@/lib/app-context";
import { useTasks } from "@/lib/tasks-store";
import { type Task, type Status, type Priority, members, memberById, spaceById, listById } from "@/lib/mock-data";
import { getChildren, relativeDue } from "@/lib/task-utils";
import { StatusPill } from "./StatusPill";
import { PriorityIcon } from "./PriorityIcon";
import { Avatar } from "./Avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight, GripVertical, Plus, Link2 } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { SmartTaskInput } from "./SmartTaskInput";
import { parseSmartInput } from "@/lib/task-utils";
import { toast } from "sonner";

const STATUSES: Status[] = ["Backlog", "To Do", "In Progress", "In Review", "Blocked", "Done"];
const PRIORITIES: Priority[] = ["urgent", "high", "normal", "low"];

interface TaskTreeProps {
  rootTasks: Task[];           // top-level tasks (parentId undefined relative to scope)
  allTasks: Task[];            // full pool for resolving children
  listId?: string;             // for inline add
  emptyAction?: React.ReactNode;
}

export function TaskTree({ rootTasks, allTasks, listId, emptyAction }: TaskTreeProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const visibleIds = useMemo(() => flatten(rootTasks, allTasks, expanded), [rootTasks, allTasks, expanded]);
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {rootTasks.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground"><Plus className="size-4" /></div>
          <div className="text-sm font-medium">No tasks yet</div>
          <div className="text-xs text-muted-foreground">Add the first task to get rolling.</div>
          {emptyAction}
        </div>
      )}
      {rootTasks.map((t) => (
        <TaskNode key={t.id} task={t} allTasks={allTasks} depth={0} expanded={expanded} setExpanded={setExpanded} visibleIds={visibleIds} />
      ))}
      {listId && <InlineAddRow listId={listId} />}
    </div>
  );
}

function flatten(roots: Task[], all: Task[], expanded: Record<string, boolean>): string[] {
  const out: string[] = [];
  const walk = (t: Task) => {
    out.push(t.id);
    if (expanded[t.id]) {
      for (const c of getChildren(all, t.id)) walk(c);
    }
  };
  roots.forEach(walk);
  return out;
}

function TaskNode({ task, allTasks, depth, expanded, setExpanded, visibleIds }: { task: Task; allTasks: Task[]; depth: number; expanded: Record<string, boolean>; setExpanded: (f: any) => void; visibleIds: string[] }) {
  const { openTask, selectedTaskIds, toggleSelectTask } = useApp();
  const { updateTask, moveTask } = useTasks();
  const children = getChildren(allTasks, task.id);
  const isOpen = expanded[task.id];
  const sel = selectedTaskIds.includes(task.id);
  const due = relativeDue(task.due);
  const sp = spaceById(task.spaceId);
  const list = listById(task.listId);
  const depCount = (task.dependencies?.blocks.length ?? 0) + (task.dependencies?.blockedBy.length ?? 0);

  const [editing, setEditing] = useState(false);
  const [titleDraft, setTitleDraft] = useState(task.title);

  const onDragStart = (e: DragEvent) => { e.dataTransfer.setData("text/task-id", task.id); e.dataTransfer.effectAllowed = "move"; };
  const onDropOnRow = (e: DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/task-id");
    if (!id || id === task.id) return;
    moveTask(id, task.listId, task.id);
    setExpanded((s: any) => ({ ...s, [task.id]: true }));
    toast.success("Nested as subtask");
  };
  const onDragOver = (e: DragEvent) => e.preventDefault();

  return (
    <>
      <div
        className={cn("group flex items-center gap-2 border-b border-border/60 px-2 py-2 text-sm transition-colors hover:bg-muted/40", sel && "bg-[color-mix(in_oklab,var(--accent)_8%,transparent)]")}
        style={{ paddingLeft: 8 + depth * 24 }}
        onDoubleClick={() => openTask(task.id)}
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDropOnRow}
      >
        {/* tree connector */}
        {depth > 0 && (
          <div className="pointer-events-none absolute" aria-hidden />
        )}
        <button className="flex size-5 shrink-0 items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100" title="Drag to reorder / nest">
          <GripVertical className="size-3.5" />
        </button>
        <Checkbox checked={sel} onCheckedChange={() => toggleSelectTask(task.id, false, visibleIds)} onClick={(e: any) => { if (e.shiftKey) { e.preventDefault(); toggleSelectTask(task.id, true, visibleIds); } }} className="rounded-[5px]" />
        <button
          onClick={() => setExpanded((s: any) => ({ ...s, [task.id]: !s[task.id] }))}
          className={cn("flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted", !children.length && "invisible")}
        >
          <ChevronRight className={cn("size-3.5 transition-transform", isOpen && "rotate-90")} />
        </button>

        {/* Priority inline */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex size-5 items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <PriorityIcon priority={task.priority} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-1" onClick={(e) => e.stopPropagation()}>
            {PRIORITIES.map((p) => (
              <button key={p} onClick={() => { updateTask(task.id, { priority: p }); toast.success(`Priority → ${p}`); }} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm capitalize hover:bg-muted">
                <PriorityIcon priority={p} /> {p}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        {/* Title (inline edit) */}
        {editing ? (
          <Input
            autoFocus
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={() => { if (titleDraft.trim()) updateTask(task.id, { title: titleDraft.trim() }); setEditing(false); }}
            onKeyDown={(e) => {
              if (e.key === "Enter") { updateTask(task.id, { title: titleDraft.trim() }); setEditing(false); }
              if (e.key === "Escape") { setTitleDraft(task.title); setEditing(false); }
            }}
            className="h-7 flex-1 text-sm"
          />
        ) : (
          <button
            className="flex-1 truncate text-left font-medium text-foreground"
            onClick={(e) => { e.stopPropagation(); setEditing(true); }}
          >
            {task.title}
          </button>
        )}

        {depCount > 0 && (
          <span title={`${depCount} dependencies`} className="inline-flex items-center gap-0.5 rounded bg-muted px-1 text-[10px] text-muted-foreground">
            <Link2 className="size-3" />{depCount}
          </span>
        )}
        {list && depth === 0 && (
          <span className="hidden md:inline truncate text-[10px] text-muted-foreground">{sp.name} / {list.name}</span>
        )}

        {/* Status */}
        <Popover>
          <PopoverTrigger asChild><button onClick={(e) => e.stopPropagation()}><StatusPill status={task.status} /></button></PopoverTrigger>
          <PopoverContent className="w-44 p-1" onClick={(e) => e.stopPropagation()}>
            {STATUSES.map((s) => (
              <button key={s} onClick={() => { updateTask(task.id, { status: s }); toast.success(`Status → ${s}`); }} className="flex w-full items-center rounded px-2 py-1.5 text-left text-sm hover:bg-muted">
                <StatusPill status={s} />
              </button>
            ))}
          </PopoverContent>
        </Popover>

        {/* Due */}
        <Popover>
          <PopoverTrigger asChild>
            <button onClick={(e) => e.stopPropagation()} className={cn("w-20 shrink-0 text-right text-xs", due.tone === "overdue" ? "text-destructive" : due.tone === "today" ? "text-accent" : "text-muted-foreground")}>{due.label}</button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" onClick={(e) => e.stopPropagation()}>
            <Calendar mode="single" selected={new Date(task.due)} onSelect={(d) => d && updateTask(task.id, { due: d.toISOString() })} className="p-3 pointer-events-auto" />
          </PopoverContent>
        </Popover>

        {/* Assignee */}
        <Popover>
          <PopoverTrigger asChild><button onClick={(e) => e.stopPropagation()}><Avatar memberId={task.assigneeId} size={24} /></button></PopoverTrigger>
          <PopoverContent className="w-56 p-1" onClick={(e) => e.stopPropagation()}>
            {members.map((m) => (
              <button key={m.id} onClick={() => { updateTask(task.id, { assigneeId: m.id }); toast.success(`Assigned ${m.name}`); }} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-muted">
                <Avatar memberId={m.id} size={20} /> {m.name}
              </button>
            ))}
          </PopoverContent>
        </Popover>
      </div>
      {isOpen && children.map((c) => (
        <TaskNode key={c.id} task={c} allTasks={allTasks} depth={depth + 1} expanded={expanded} setExpanded={setExpanded} visibleIds={visibleIds} />
      ))}
    </>
  );
}

function InlineAddRow({ listId }: { listId: string }) {
  const { createTask } = useTasks();
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState("");
  const submit = () => {
    if (!val.trim()) return;
    const p = parseSmartInput(val);
    createTask({ title: p.cleanTitle || val, listId, assigneeId: p.assigneeId, priority: p.priority, due: p.due, tags: p.tags });
    toast.success("Task created");
    setVal("");
  };
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-muted-foreground hover:bg-muted/40">
        <Plus className="size-3.5" /> Add task
      </button>
    );
  }
  return (
    <div className="border-t border-border bg-muted/30 px-3 py-2">
      <SmartTaskInput
        value={val}
        onChange={setVal}
        autoFocus
        size="sm"
        placeholder="Title — type @ for people, # for tags, ! for priority, 'tomorrow' etc."
        onSubmit={({ withShift }) => { submit(); if (!withShift) setOpen(false); }}
      />
      <div className="mt-1 text-[10px] text-muted-foreground">Enter creates and stays · Esc closes</div>
      <input className="sr-only" onBlur={(e) => { if (!e.currentTarget.parentElement?.contains(document.activeElement)) setOpen(false); }} />
    </div>
  );
}
