import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/lib/app-context";
import { memberById, spaceById, taskById } from "@/lib/mock-data";
import { Avatar } from "./Avatar";
import { StatusPill } from "./StatusPill";
import { SpaceTag } from "./PillarTag";
import { PriorityIcon } from "./PriorityIcon";
import { FileText, Hash, Paperclip, MessageSquare, CheckSquare, Download, ExternalLink } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export function TaskSlideOver() {
  const { openTaskId, openTask } = useApp();
  const task = openTaskId ? taskById(openTaskId) : null;
  return (
    <Sheet open={!!task} onOpenChange={(o) => !o && openTask(null)}>
      <SheetContent side="right" className="w-full sm:max-w-[540px] overflow-y-auto p-0">
        {task && (
          <div>
            <SheetHeader className="border-b border-border px-6 py-4">
              <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{task.id}</span>
                <span>·</span>
                <SpaceTag name={spaceById(task.spaceId).name} pillar={spaceById(task.spaceId).pillar} />
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
                    <CheckSquare className="size-3.5" /> Subtasks
                  </h4>
                  <div className="space-y-1.5">
                    {task.subtasks?.map((s) => (
                      <label key={s.id} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted/60">
                        <Checkbox checked={s.done} className="rounded-[5px]" />
                        <span className={s.done ? "text-muted-foreground line-through" : ""}>{s.title}</span>
                      </label>
                    ))}
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
                  </div>
                </section>

                <Button variant="outline" size="sm" className="gap-2">
                  <Hash className="size-3.5" /> Continue in #venture-x
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
                    {task.tags?.map((t) => <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">#{t}</span>)}
                  </div>
                </Meta>
              </aside>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}
