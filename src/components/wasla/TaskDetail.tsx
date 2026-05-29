import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useTasks } from "@/lib/tasks-store";
import { memberById, listById, spaceById, taskById, members } from "@/lib/mock-data";
import { Avatar } from "./Avatar";
import { StatusPill } from "./StatusPill";
import { PriorityIcon } from "./PriorityIcon";
import {
  CheckSquare, Plus, Link2, X, ListChecks, Paperclip, FileText, Upload, Download,
  ExternalLink, Activity, Bell, Filter, Send, Smile, AtSign, GripVertical,
  Clock, CalendarDays, Tag,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { getChildren } from "@/lib/task-utils";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useTaskNav } from "@/lib/task-nav";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { useNavigate } from "@tanstack/react-router";


const STATUSES = ["Backlog", "To Do", "In Progress", "In Review", "Blocked", "Done"] as const;
const PRIORITIES = ["urgent", "high", "normal", "low"] as const;

// Short code: derived from id + space prefix
function shortCode(id: string, spaceName: string) {
  const prefix = spaceName.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase() || "WSL";
  const digits = id.replace(/\D/g, "").slice(-4).padStart(4, "0") || "0001";
  return `${prefix}-${digits}`;
}

interface ChecklistItem { id: string; text: string; done: boolean }
interface Checklist { id: string; title: string; items: ChecklistItem[] }

export function TaskDetail({ taskId }: { taskId: string }) {
  const { tasks, createTask, updateTask } = useTasks();
  const task = tasks.find((t) => t.id === taskId);
  const { goTask } = useTaskNav();

  if (!task) {
    return <div className="px-6 py-12 text-center text-sm text-muted-foreground">Task not found.</div>;
  }

  const space = spaceById(task.spaceId);
  const list = listById(task.listId);
  const children = getChildren(tasks, task.id);
  const doneChildren = children.filter((c) => c.status === "Done").length;
  const code = shortCode(task.id, space.name);

  return (
    <div className="grid gap-0 lg:grid-cols-[1fr_280px]">
      {/* Main column */}
      <div className="space-y-6 px-6 py-5 min-w-0">
        {/* Title block */}
        <TitleBlock task={task} code={code} onRename={(t) => updateTask(task.id, { title: t })} />
        {(space.id === "leads" || space.id === "proposals") && <WonCreateClientButton task={task} />}


        {/* Properties grid */}
        <PropertiesGrid task={task} updateTask={updateTask} />

        {/* Description */}
        <DescriptionSection task={task} onSave={(v) => updateTask(task.id, { description: v })} />

        {/* Subtasks */}
        <section>
          <div className="mb-2 flex items-center gap-2">
            <CheckSquare className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Subtasks</h3>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {doneChildren}/{children.length}
            </span>
          </div>
          {children.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <div className="grid grid-cols-[1fr_140px_120px_120px] border-b border-border bg-muted/30 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <div>Name</div><div>Assignee</div><div>Priority</div><div>Due</div>
              </div>
              {children.map((s) => (
                <button
                  key={s.id}
                  onClick={() => goTask(s)}
                  className="grid w-full grid-cols-[1fr_140px_120px_120px] items-center border-b border-border/60 px-3 py-2 text-left text-sm last:border-b-0 hover:bg-muted/40"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <Checkbox
                      checked={s.status === "Done"}
                      onClick={(e) => e.stopPropagation()}
                      onCheckedChange={(c) => updateTask(s.id, { status: c ? "Done" : "To Do" })}
                      className="rounded-[5px]"
                    />
                    <span className={cn("truncate", s.status === "Done" && "text-muted-foreground line-through")}>{s.title}</span>
                    {getChildren(tasks, s.id).length > 0 && <span className="rounded bg-muted px-1 text-[10px] text-muted-foreground">{getChildren(tasks, s.id).length}</span>}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs"><Avatar memberId={s.assigneeId} size={20} /><span className="truncate">{memberById(s.assigneeId).name.split(" ")[0]}</span></div>
                  <div className="flex items-center gap-1 text-xs capitalize"><PriorityIcon priority={s.priority} />{s.priority}</div>
                  <div className="text-xs text-muted-foreground">{new Date(s.due).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                </button>
              ))}
            </div>
          )}
          <InlineAddSub onAdd={(title) => { createTask({ title, listId: task.listId, parentId: task.id }); toast.success("Subtask added"); }} />
        </section>

        {/* Checklists */}
        <ChecklistsSection taskId={task.id} />

        {/* Attachments */}
        <AttachmentsSection task={task} />
      </div>

      {/* Right rail: Activity */}
      <ActivityRail task={task} />
    </div>
  );
}

/* ---------- Title block ---------- */
function TitleBlock({ task, code, onRename }: { task: any; code: string; onRename: (t: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          <span className="inline-block size-1.5 rounded-full bg-accent" /> Task
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">{code}</span>
      </div>
      {editing ? (
        <Input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => { if (draft.trim()) onRename(draft.trim()); setEditing(false); }}
          onKeyDown={(e) => {
            if (e.key === "Enter") { onRename(draft.trim()); setEditing(false); }
            if (e.key === "Escape") { setDraft(task.title); setEditing(false); }
          }}
          className="h-auto border-none bg-transparent p-0 text-3xl font-bold leading-tight shadow-none focus-visible:ring-0"
        />
      ) : (
        <h1
          onClick={() => { setDraft(task.title); setEditing(true); }}
          className="-mx-1 cursor-text rounded px-1 text-3xl font-bold leading-tight tracking-tight hover:bg-muted/40"
        >
          {task.title}
        </h1>
      )}
    </div>
  );
}

/* ---------- Properties grid ---------- */
function PropertiesGrid({ task, updateTask }: { task: any; updateTask: (id: string, p: any) => void }) {
  return (
    <div className="grid gap-x-8 gap-y-3 rounded-lg border border-border bg-card p-4 md:grid-cols-2">
      {/* LEFT */}
      <Row label="Status" icon={<span className="size-2 rounded-full bg-muted-foreground" />}>
        <Popover>
          <PopoverTrigger asChild><button><StatusPill status={task.status} /></button></PopoverTrigger>
          <PopoverContent className="w-44 p-1">
            {STATUSES.map((s) => (
              <button key={s} onClick={() => { updateTask(task.id, { status: s }); toast.success(`Status → ${s}`); }} className="flex w-full items-center rounded px-2 py-1.5 text-left text-sm hover:bg-muted">
                <StatusPill status={s} />
              </button>
            ))}
          </PopoverContent>
        </Popover>
      </Row>

      <Row label="Assignees" icon={<span className="size-3 rounded-full bg-muted-foreground/30" />}>
        <div className="flex items-center gap-1">
          <Avatar memberId={task.assigneeId} size={24} />
          <span className="text-sm">{memberById(task.assigneeId).name}</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost" className="size-6"><Plus className="size-3" /></Button>
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
      </Row>

      <Row label="Dates" icon={<CalendarDays className="size-3.5 text-muted-foreground" />}>
        <div className="flex items-center gap-1.5 text-sm">
          <Popover>
            <PopoverTrigger asChild>
              <button className="rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-muted">
                {task.startDate ? new Date(task.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Start"}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={task.startDate ? new Date(task.startDate) : undefined} onSelect={(d) => d && updateTask(task.id, { startDate: d.toISOString() })} className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
          <span className="text-muted-foreground/60">→</span>
          <Popover>
            <PopoverTrigger asChild>
              <button className="rounded px-1.5 py-0.5 text-xs hover:bg-muted">
                {new Date(task.due).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={new Date(task.due)} onSelect={(d) => d && updateTask(task.id, { due: d.toISOString() })} className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
        </div>
      </Row>

      <Row label="Priority" icon={<PriorityIcon priority={task.priority} />}>
        <Popover>
          <PopoverTrigger asChild>
            <button className="inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 text-sm capitalize hover:bg-muted">
              {task.priority}
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
      </Row>

      <Row label="Time Estimate" icon={<Clock className="size-3.5 text-muted-foreground" />}>
        <button className="text-xs text-muted-foreground/70 hover:text-foreground">Empty</button>
      </Row>

      <Row label="Track Time" icon={<Clock className="size-3.5 text-muted-foreground" />}>
        <button onClick={() => toast("Time tracking coming in V2")} className="text-xs text-muted-foreground/70 hover:text-foreground">+ Add time</button>
      </Row>

      <Row label="Tags" icon={<Tag className="size-3.5 text-muted-foreground" />}>
        <TagEditor tags={task.tags ?? []} onChange={(tags) => updateTask(task.id, { tags })} />
      </Row>

      <Row label="Relationships" icon={<Link2 className="size-3.5 text-muted-foreground" />}>
        <DependencyEditor task={task} />
      </Row>
    </div>
  );
}

function Row({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex w-32 shrink-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}{label}
      </div>
      <div className="flex min-w-0 flex-1 items-center">{children}</div>
    </div>
  );
}

function TagEditor({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [val, setVal] = useState("");
  return (
    <div className="flex flex-wrap items-center gap-1">
      {tags.map((t) => (
        <span key={t} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
          #{t}
          <button onClick={() => onChange(tags.filter((x) => x !== t))} className="text-muted-foreground/70 hover:text-destructive"><X className="size-2.5" /></button>
        </span>
      ))}
      <Input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && val.trim()) { onChange([...tags, val.trim().replace(/^#/, "")]); setVal(""); }
        }}
        placeholder="+ Add tag"
        className="h-6 w-24 border-none bg-transparent px-1 text-xs shadow-none focus-visible:ring-0"
      />
    </div>
  );
}

function DependencyEditor({ task }: { task: any }) {
  const { tasks, addDependency, removeDependency } = useTasks();
  const { goTask } = useTaskNav();
  const [q, setQ] = useState("");
  return (
    <div className="flex flex-col gap-1 text-xs">
      <DepLine label="Blocks" ids={task.dependencies?.blocks ?? []} onOpen={(id) => goTask(id)} onRemove={(id) => removeDependency(task.id, id)} />
      <DepLine label="Blocked by" ids={task.dependencies?.blockedBy ?? []} onOpen={(id) => goTask(id)} onRemove={(id) => removeDependency(id, task.id)} />
      <Popover>
        <PopoverTrigger asChild><Button size="sm" variant="ghost" className="h-6 w-fit gap-1 px-1.5 text-xs"><Plus className="size-3" /> Link</Button></PopoverTrigger>
        <PopoverContent className="w-80 p-2">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tasks…" className="mb-2 h-8 text-sm" />
          <div className="max-h-60 overflow-y-auto">
            {tasks.filter((x) => x.id !== task.id && (!q || x.title.toLowerCase().includes(q.toLowerCase()))).slice(0, 20).map((x) => (
              <button key={x.id} onClick={() => { addDependency(task.id, x.id); toast.success("Linked"); setQ(""); }} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-muted">
                <StatusPill status={x.status} /> <span className="truncate">{x.title}</span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function DepLine({ label, ids, onOpen, onRemove }: { label: string; ids: string[]; onOpen: (id: string) => void; onRemove: (id: string) => void }) {
  if (ids.length === 0) return <div className="text-[10px] uppercase text-muted-foreground/60">{label}: —</div>;
  return (
    <div>
      <div className="text-[10px] uppercase text-muted-foreground/80">{label}</div>
      <div className="flex flex-col gap-0.5">
        {ids.map((id) => {
          const t = taskById(id); if (!t) return null;
          return (
            <div key={id} className="group flex items-center gap-1 rounded px-1 py-0.5 hover:bg-muted/60">
              <StatusPill status={t.status} />
              <button onClick={() => onOpen(id)} className="flex-1 truncate text-left text-xs">{t.title}</button>
              <button onClick={() => onRemove(id)} className="opacity-0 group-hover:opacity-100"><X className="size-3 text-muted-foreground" /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Description ---------- */
function DescriptionSection({ task, onSave }: { task: any; onSave: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.description ?? "");
  return (
    <section>
      <div className="mb-2 flex items-center gap-2">
        <FileText className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">Description</h3>
      </div>
      {editing ? (
        <textarea
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => { onSave(draft); setEditing(false); }}
          rows={5}
          className="w-full resize-y rounded-lg border border-border bg-card p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Write a description. Markdown, @mentions, #task refs supported."
        />
      ) : (
        <button
          onClick={() => { setDraft(task.description ?? ""); setEditing(true); }}
          className="block w-full rounded-lg border border-border bg-card p-3 text-left text-sm hover:border-foreground/15"
        >
          {task.description
            ? <span className="whitespace-pre-wrap text-foreground/85">{task.description}</span>
            : <span className="italic text-muted-foreground/70">Add description</span>}
        </button>
      )}
    </section>
  );
}

/* ---------- Inline sub add ---------- */
function InlineAddSub({ onAdd }: { onAdd: (t: string) => void }) {
  const [val, setVal] = useState("");
  return (
    <div className="mt-2 flex items-center gap-2 rounded-lg border border-dashed border-border/70 bg-card px-3 py-2">
      <Plus className="size-3.5 text-muted-foreground" />
      <Input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="+ Add Task   (Tab to nest)"
        className="h-7 border-none bg-transparent text-sm shadow-none focus-visible:ring-0"
        onKeyDown={(e) => {
          if (e.key === "Enter" && val.trim()) { onAdd(val.trim()); setVal(""); }
        }}
      />
    </div>
  );
}

/* ---------- Checklists (local state per task) ---------- */
const checklistStores = new Map<string, Checklist[]>();
function useChecklists(taskId: string): [Checklist[], (l: Checklist[]) => void] {
  const [, force] = useState(0);
  const lists = checklistStores.get(taskId) ?? [];
  const set = (l: Checklist[]) => { checklistStores.set(taskId, l); force((x) => x + 1); };
  return [lists, set];
}

function ChecklistsSection({ taskId }: { taskId: string }) {
  const [lists, setLists] = useChecklists(taskId);
  const addList = () => {
    const title = prompt("Checklist title?", "Checklist");
    if (title) setLists([...lists, { id: `cl-${Date.now()}`, title, items: [] }]);
  };
  return (
    <section>
      <div className="mb-2 flex items-center gap-2">
        <ListChecks className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">Checklists</h3>
      </div>
      {lists.length === 0 ? (
        <Button variant="outline" size="sm" onClick={addList} className="gap-1.5"><Plus className="size-3.5" /> Create checklist</Button>
      ) : (
        <div className="space-y-3">
          {lists.map((cl) => (
            <ChecklistCard key={cl.id} list={cl}
              onChange={(updated) => setLists(lists.map((x) => x.id === cl.id ? updated : x))}
              onDelete={() => setLists(lists.filter((x) => x.id !== cl.id))} />
          ))}
          <Button variant="ghost" size="sm" onClick={addList} className="gap-1.5"><Plus className="size-3.5" /> Add checklist</Button>
        </div>
      )}
    </section>
  );
}

function ChecklistCard({ list, onChange, onDelete }: { list: Checklist; onChange: (l: Checklist) => void; onDelete: () => void }) {
  const [val, setVal] = useState("");
  const done = list.items.filter((i) => i.done).length;
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium">{list.title}</h4>
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{done}/{list.items.length}</span>
        </div>
        <Button size="icon" variant="ghost" className="size-6" onClick={onDelete}><X className="size-3" /></Button>
      </div>
      <div className="space-y-1">
        {list.items.map((it) => (
          <div key={it.id} className="group flex items-center gap-2 rounded px-1 py-0.5 hover:bg-muted/40">
            <GripVertical className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
            <Checkbox checked={it.done} onCheckedChange={(c) => onChange({ ...list, items: list.items.map((x) => x.id === it.id ? { ...x, done: !!c } : x) })} className="rounded-[5px]" />
            <span className={cn("flex-1 text-sm", it.done && "text-muted-foreground line-through")}>{it.text}</span>
            <button onClick={() => onChange({ ...list, items: list.items.filter((x) => x.id !== it.id) })} className="opacity-0 group-hover:opacity-100"><X className="size-3 text-muted-foreground" /></button>
          </div>
        ))}
        <div className="flex items-center gap-2 px-1">
          <Plus className="size-3 text-muted-foreground" />
          <Input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Add item"
            className="h-6 border-none bg-transparent px-1 text-sm shadow-none focus-visible:ring-0"
            onKeyDown={(e) => {
              if (e.key === "Enter" && val.trim()) {
                onChange({ ...list, items: [...list.items, { id: `i-${Date.now()}`, text: val.trim(), done: false }] });
                setVal("");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- Attachments ---------- */
function AttachmentsSection({ task }: { task: any }) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Paperclip className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Attachments</h3>
        </div>
        <Button size="icon" variant="ghost" className="size-7" onClick={() => toast("Upload coming soon")}><Plus className="size-3.5" /></Button>
      </div>
      <label
        className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border bg-card/40 py-6 text-center text-xs text-muted-foreground hover:border-foreground/20 hover:bg-card"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); toast.success("File received (mock)"); }}
      >
        <Upload className="size-4" />
        Drop your files here to upload, or click to browse
        <input type="file" className="hidden" onChange={() => toast.success("File received (mock)")} />
      </label>
      {(task.attachments ?? []).length > 0 && (
        <div className="mt-3 space-y-2">
          {task.attachments.map((a: any) => (
            <div key={a.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
              <div className="flex size-9 items-center justify-center rounded-md bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] text-accent"><FileText className="size-4" /></div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{a.name}</p>
                <p className="text-xs text-muted-foreground">{a.kind} · Updated 2h ago</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => toast("Preview soon")}>Preview</Button>
              <Button size="sm" variant="ghost"><ExternalLink className="size-3.5" /></Button>
              <Button size="sm" variant="ghost"><Download className="size-3.5" /></Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------- Activity right rail ---------- */
function ActivityRail({ task }: { task: any }) {
  const events = useMemo(() => {
    const ev: { id: string; actor: string; text: string; at: string }[] = [];
    if (task.createdAt) ev.push({ id: "c", actor: task.assigneeId, text: "created this task", at: task.createdAt });
    (task.comments ?? []).forEach((c: any) => ev.push({ id: c.id, actor: c.authorId, text: c.body, at: c.at ?? task.createdAt ?? new Date().toISOString() }));
    return ev;
  }, [task]);
  const [comment, setComment] = useState("");

  return (
    <aside className="border-t border-border bg-muted/20 lg:sticky lg:top-0 lg:h-[calc(100vh-56px)] lg:border-l lg:border-t-0">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Activity</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" className="size-7"><Filter className="size-3.5" /></Button>
          <Button size="icon" variant="ghost" className="relative size-7">
            <Bell className="size-3.5" />
            <span className="absolute -right-0.5 -top-0.5 flex size-3.5 items-center justify-center rounded-full bg-accent text-[8px] font-bold text-accent-foreground">2</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col lg:h-[calc(100%-49px)]">
        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3 scrollbar-thin">
          {events.length === 0 && <div className="text-xs text-muted-foreground">No activity yet.</div>}
          {events.map((e) => {
            const m = memberById(e.actor);
            return (
              <div key={e.id} className="flex gap-2">
                <Avatar memberId={e.actor} size={24} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs">
                    <span className="font-medium text-foreground">{m.name}</span>{" "}
                    <span className="text-muted-foreground">{e.text}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground/70">{new Date(e.at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</div>
                </div>
              </div>
            );
          })}
        </div>
        <Separator />
        <div className="space-y-2 px-3 py-2.5">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            rows={2}
            className="w-full resize-none rounded-md border border-border bg-card p-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5 text-muted-foreground">
              <Button size="icon" variant="ghost" className="size-7"><AtSign className="size-3.5" /></Button>
              <Button size="icon" variant="ghost" className="size-7"><Paperclip className="size-3.5" /></Button>
              <Button size="icon" variant="ghost" className="size-7"><Smile className="size-3.5" /></Button>
            </div>
            <Button
              size="sm"
              disabled={!comment.trim()}
              onClick={() => { toast.success("Comment posted"); setComment(""); }}
              className="gap-1.5"
            >
              <Send className="size-3.5" /> Send
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ---------- Won → Create Client ---------- */



function WonCreateClientButton({ task }: { task: any }) {
  const { createSpace } = useTasks();
  const { currentUserId } = useApp();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(task.title);
  const [type, setType] = useState<"retainer" | "project" | "one-time">("project");
  const [value, setValue] = useState<string>("");
  const [owner, setOwner] = useState(currentUserId);

  const submit = () => {
    const sp = createSpace({
      name: name.trim() || task.title,
      pillar: "client",
      profile: {
        ownerId: owner,
        type,
        status: "active",
        health: "green",
        contractValue: value ? Number(value) : undefined,
        currency: "EGP",
      },
    });
    setOpen(false);
    toast.success(`Client "${sp.name}" created`, {
      action: { label: "Open", onClick: () => nav({ to: "/space/$spaceId", params: { spaceId: sp.id } }) },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Trophy className="size-3.5" /> Won → Create Client
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create client from this proposal</DialogTitle></DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Client name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Engagement type</Label>
            <Select value={type} onValueChange={(v) => setType(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="retainer">Retainer</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="one-time">One-time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Contract value (EGP)</Label>
            <Input type="number" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} placeholder="240000" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Owner</Label>
            <Select value={owner} onValueChange={setOwner}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {members.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit}>Create client</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
