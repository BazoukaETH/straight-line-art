import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/lib/app-context";
import { useTasks } from "@/lib/tasks-store";
import { memberById, spaceById, listById, folderById } from "@/lib/mock-data";
import { Avatar } from "./Avatar";
import { StatusPill } from "./StatusPill";
import { SpaceTag } from "./PillarTag";
import { PriorityIcon } from "./PriorityIcon";
import { FileText, Hash, Paperclip, MessageSquare, CheckSquare, Download, ExternalLink, ChevronLeft, Plus, MoreHorizontal, Link2, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { getChildren, getAncestors } from "@/lib/task-utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function TaskSlideOver() {
  const { openTaskId, openTask, drillStack, pushDrill, popDrill } = useApp();
  const { tasks, createTask, saveTemplateFromTask, addDependency, removeDependency, updateTask } = useTasks();
  const task = openTaskId ? tasks.find((t) => t.id === openTaskId) : null;
  const ancestors = task ? getAncestors(tasks, task.id) : [];
  const children = task ? getChildren(tasks, task.id) : [];
  const [newSub, setNewSub] = useState("");
  const [depQuery, setDepQuery] = useState("");

  const closeAll = () => openTask(null);

  return (
    <Sheet open={!!task} onOpenChange={(o) => !o && closeAll()}>
      <SheetContent side="right" className="w-full sm:max-w-[600px] overflow-y-auto p-0">
        {task && (
          <div>
            <SheetHeader className="border-b border-border px-6 py-4">
              {drillStack.length > 0 && (
                <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Button size="sm" variant="ghost" className="h-6 px-1.5 gap-1" onClick={popDrill}><ChevronLeft className="size-3.5" /> Back</Button>
                  {ancestors.map((a) => (
                    <span key={a.id} className="truncate">{a.title} <span className="px-0.5">/</span></span>
                  ))}
                </div>
              )}
              <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{task.id}</span><span>·</span>
                <SpaceTag name={spaceById(task.spaceId).name} pillar={spaceById(task.spaceId).pillar} />
                {(() => {
                  const l = listById(task.listId); const f = l?.folderId ? folderById(l.folderId) : null;
                  return l ? <><span>·</span><span>{f ? `${f.name} / ${l.name}` : l.name}</span></> : null;
                })()}
                <div className="ml-auto flex items-center gap-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button size="icon" variant="ghost" className="size-7"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => {
                        const name = prompt("Template name?", task.title);
                        if (name) { saveTemplateFromTask(task.id, name); toast.success(`Template "${name}" saved`); }
                      }}>Save as template</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { navigator.clipboard?.writeText(task.id); toast.success("Task ID copied"); }}>Copy task ID</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button size="icon" variant="ghost" className="size-7" onClick={closeAll}><X className="size-4" /></Button>
                </div>
              </div>
              <SheetTitle className="text-xl font-semibold leading-tight">{task.title}</SheetTitle>
            </SheetHeader>

            <div className="grid grid-cols-3 gap-6 px-6 py-5">
              <div className="col-span-2 space-y-6">
                <section>
                  <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Description</h4>
                  <p className="text-sm leading-relaxed text-foreground/85">{task.description}</p>
                </section>

                <section>
                  <h4 className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <CheckSquare className="size-3.5" /> Subtasks <span className="ml-1 text-muted-foreground/70">({children.length})</span>
                  </h4>
                  <div className="space-y-1">
                    {children.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => pushDrill(s.id)}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted/60"
                      >
                        <Checkbox
                          checked={s.status === "Done"}
                          onClick={(e) => e.stopPropagation()}
                          onCheckedChange={(c) => updateTask(s.id, { status: c ? "Done" : "To Do" })}
                          className="rounded-[5px]"
                        />
                        <PriorityIcon priority={s.priority} />
                        <span className={s.status === "Done" ? "flex-1 text-muted-foreground line-through" : "flex-1"}>{s.title}</span>
                        {getChildren(tasks, s.id).length > 0 && <span className="text-[10px] text-muted-foreground">{getChildren(tasks, s.id).length} sub</span>}
                        <StatusPill status={s.status} />
                        <Avatar memberId={s.assigneeId} size={20} />
                      </button>
                    ))}
                    <div className="flex items-center gap-2 px-2 py-1">
                      <Plus className="size-3.5 text-muted-foreground" />
                      <Input
                        value={newSub}
                        onChange={(e) => setNewSub(e.target.value)}
                        placeholder="Add subtask…"
                        className="h-7 text-sm"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newSub.trim()) {
                            createTask({ title: newSub.trim(), listId: task.listId, parentId: task.id });
                            setNewSub("");
                            toast.success("Subtask added");
                          }
                        }}
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <Paperclip className="size-3.5" /> Attachments
                  </h4>
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                    <div className="flex size-9 items-center justify-center rounded-md bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] text-accent">
                      <FileText className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">Hero option B — final.fig</p>
                      <p className="text-xs text-muted-foreground">Google Drive · Updated 2h ago</p>
                    </div>
                    <Button size="sm" variant="ghost"><ExternalLink className="size-3.5" /> View</Button>
                    <Button size="sm" variant="ghost"><Download className="size-3.5" /></Button>
                  </div>
                </section>

                <section>
                  <h4 className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <MessageSquare className="size-3.5" /> Comments
                  </h4>
                  <div className="space-y-3">
                    {task.comments?.map((c) => {
                      const m = memberById(c.authorId);
                      return (
                        <div key={c.id} className="flex gap-3">
                          <Avatar memberId={c.authorId} size={28} />
                          <div className="flex-1 rounded-lg border border-border bg-card p-3">
                            <div className="mb-1 flex items-center gap-2 text-xs">
                              <span className="font-semibold text-foreground">{m.name}</span>
                              <span className="text-muted-foreground">2h ago</span>
                            </div>
                            <p className="text-sm text-foreground/85">{c.body}</p>
                          </div>
                        </div>
                      );
                    })}
                    {!task.comments?.length && <div className="text-xs text-muted-foreground">No comments yet.</div>}
                  </div>
                </section>

                <Button variant="outline" size="sm" className="gap-2">
                  <Hash className="size-3.5" /> Continue in chat
                </Button>
              </div>

              <aside className="space-y-4 text-sm">
                <Meta label="Status"><StatusPill status={task.status} /></Meta>
                <Meta label="Priority">
                  <div className="flex items-center gap-1.5 capitalize">
                    <PriorityIcon priority={task.priority} /> {task.priority}
                  </div>
                </Meta>
                <Meta label="Assignee">
                  <div className="flex items-center gap-2">
                    <Avatar memberId={task.assigneeId} size={22} />
                    <span>{memberById(task.assigneeId).name}</span>
                  </div>
                </Meta>
                <Meta label="Due"><span>{new Date(task.due).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span></Meta>
                <Separator />
                <Meta label="Watchers">
                  <div className="flex -space-x-1.5">
                    {task.watchers?.map((w) => <Avatar key={w} memberId={w} size={22} className="ring-2 ring-background" />)}
                  </div>
                </Meta>
                <Meta label="Tags">
                  <div className="flex flex-wrap gap-1">
                    {(task.tags ?? []).map((t) => <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">#{t}</span>)}
                    {!task.tags?.length && <span className="text-xs text-muted-foreground">—</span>}
                  </div>
                </Meta>
                <Separator />
                <div>
                  <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <Link2 className="size-3" /> Dependencies
                  </div>
                  <DepGroup label="Blocks" ids={task.dependencies?.blocks ?? []} onRemove={(id) => removeDependency(task.id, id)} onOpen={(id) => pushDrill(id)} />
                  <DepGroup label="Blocked by" ids={task.dependencies?.blockedBy ?? []} onRemove={(id) => removeDependency(id, task.id)} onOpen={(id) => pushDrill(id)} />
                  <Popover>
                    <PopoverTrigger asChild><Button size="sm" variant="ghost" className="mt-1 h-7 gap-1 px-1.5 text-xs"><Plus className="size-3" /> Add dependency</Button></PopoverTrigger>
                    <PopoverContent className="w-80 p-2">
                      <Input value={depQuery} onChange={(e) => setDepQuery(e.target.value)} placeholder="Search tasks…" className="mb-2 h-8 text-sm" />
                      <div className="max-h-60 overflow-y-auto">
                        {tasks.filter((x) => x.id !== task.id && (!depQuery || x.title.toLowerCase().includes(depQuery.toLowerCase()))).slice(0, 20).map((x) => (
                          <button key={x.id} onClick={() => { addDependency(task.id, x.id); toast.success("Dependency added"); setDepQuery(""); }} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-muted">
                            <StatusPill status={x.status} /> <span className="truncate">{x.title}</span>
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                {(() => {
                  const l = listById(task.listId);
                  const cf = l?.customFields ?? [];
                  if (!cf.length) return null;
                  return (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Custom fields</div>
                        {cf.map((f) => (
                          <Meta key={f.id} label={f.name}>
                            <span className="text-xs">{formatCfValue(task.customFieldValues?.[f.id], f)}</span>
                          </Meta>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </aside>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function DepGroup({ label, ids, onRemove, onOpen }: { label: string; ids: string[]; onRemove: (id: string) => void; onOpen: (id: string) => void }) {
  const { tasks } = useTasks();
  return (
    <div className="mb-1">
      <div className="text-[10px] uppercase text-muted-foreground/80">{label} ({ids.length})</div>
      {ids.length === 0 && <div className="text-xs text-muted-foreground/60">—</div>}
      {ids.map((id) => {
        const t = tasks.find((x) => x.id === id); if (!t) return null;
        return (
          <div key={id} className="group flex items-center gap-1 rounded px-1 py-0.5 hover:bg-muted/60">
            <StatusPill status={t.status} />
            <button onClick={() => onOpen(id)} className="flex-1 truncate text-left text-xs">{t.title}</button>
            <button onClick={() => onRemove(id)} className="opacity-0 group-hover:opacity-100"><X className="size-3 text-muted-foreground" /></button>
          </div>
        );
      })}
    </div>
  );
}

function formatCfValue(v: string | number | undefined, f: { type: string; currency?: string }) {
  if (v === undefined || v === "") return "—";
  if (f.type === "money") return `${f.currency ?? "EGP"} ${new Intl.NumberFormat("en-US").format(Number(v))}`;
  return String(v);
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}
