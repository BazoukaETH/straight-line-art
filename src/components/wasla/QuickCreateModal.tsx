import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useApp } from "@/lib/app-context";
import { useTasks } from "@/lib/tasks-store";
import { spaces, members, pillarMeta, type Priority, type Status } from "@/lib/mock-data";
import { SmartTaskInput } from "./SmartTaskInput";
import { parseSmartInput } from "@/lib/task-utils";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export function QuickCreateModal() {
  const { quickCreateOpen, setQuickCreateOpen, quickCreateContext } = useApp();
  const { createTask, lists, folders, applyTemplate, templates, createList, createFolder } = useTasks();
  const [tab, setTab] = useState<string>("task");
  const [title, setTitle] = useState("");
  const [listId, setListId] = useState<string>("");
  const [assigneeId, setAssigneeId] = useState<string>("bassel");
  const [status, setStatus] = useState<Status>("To Do");
  const [priority, setPriority] = useState<Priority>("normal");
  const [templateId, setTemplateId] = useState<string>("none");
  const [spaceForNewList, setSpaceForNewList] = useState<string>(spaces[0].id);
  const [folderForNewList, setFolderForNewList] = useState<string>("none");
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (quickCreateOpen) {
      setTitle("");
      setTemplateId("none");
      setNewName("");
      setTab(quickCreateContext?.tab ?? "task");
      setListId(quickCreateContext?.listId ?? lists[0]?.id ?? "");
    }
  }, [quickCreateOpen, quickCreateContext, lists]);

  const handleSubmit = (clearAndStay: boolean) => {
    if (tab === "task" || tab === "subtask") {
      if (!title.trim()) { toast.error("Title required"); return; }
      const p = parseSmartInput(title);
      const input = {
        title: p.cleanTitle || title,
        listId,
        parentId: tab === "subtask" ? quickCreateContext?.parentId : undefined,
        assigneeId: p.assigneeId ?? assigneeId,
        status,
        priority: p.priority ?? priority,
        due: p.due,
        tags: p.tags,
      };
      if (templateId !== "none") {
        applyTemplate(templateId, input);
        toast.success(`Task + subtasks created from template`);
      } else {
        createTask(input);
        toast.success(`Task created`);
      }
      if (clearAndStay) { setTitle(""); setTemplateId("none"); }
      else { setQuickCreateOpen(false); }
      return;
    }
    if (tab === "list") {
      if (!newName.trim()) return;
      const f = folderForNewList === "none" ? undefined : folderForNewList;
      createList(newName.trim(), spaceForNewList, f);
      toast.success(`List "${newName}" created`);
      setQuickCreateOpen(false);
      return;
    }
    if (tab === "folder") {
      if (!newName.trim()) return;
      createFolder(newName.trim(), spaceForNewList);
      toast.success(`Folder "${newName}" created`);
      setQuickCreateOpen(false);
      return;
    }
    if (tab === "space" || tab === "channel") {
      toast.success(`${tab === "space" ? "Space" : "Channel"} "${newName}" queued (mock)`);
      setQuickCreateOpen(false);
    }
  };

  return (
    <Dialog open={quickCreateOpen} onOpenChange={setQuickCreateOpen}>
      <DialogContent className="max-w-xl p-0 gap-0">
        <DialogHeader className="px-5 pt-4 pb-3 border-b border-border">
          <DialogTitle className="text-base flex items-center gap-2"><Sparkles className="size-4 text-accent" /> Quick Create</DialogTitle>
        </DialogHeader>
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="m-3 grid grid-cols-7">
            <TabsTrigger value="task">Task</TabsTrigger>
            <TabsTrigger value="subtask">Subtask</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="folder">Folder</TabsTrigger>
            <TabsTrigger value="space">Space</TabsTrigger>
            <TabsTrigger value="channel">Channel</TabsTrigger>
            <TabsTrigger value="template" className="text-[11px]">From template</TabsTrigger>
          </TabsList>

          {tab === "template" && (
            <TabsContent value="template" className="px-5 pb-4 space-y-2 mt-0">
              <p className="text-[11px] text-muted-foreground">Pick a template to prefill a new task.</p>
              <div className="grid gap-2">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setTemplateId(t.id);
                      setTitle(t.name);
                      setTab("task");
                    }}
                    className="rounded-lg border border-border bg-card p-3 text-left transition hover:border-foreground/20 hover:shadow-sm"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">{t.name}</span>
                      {t.tags?.length ? (
                        <span className="text-[10px] text-muted-foreground">{t.tags.join(" · ")}</span>
                      ) : null}
                    </div>
                    {t.description && (
                      <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">{t.description}</p>
                    )}
                    {t.subtasks?.length ? (
                      <ul className="space-y-0.5 text-[11px] text-muted-foreground">
                        {t.subtasks.slice(0, 4).map((s, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="size-1 rounded-full bg-muted-foreground/60" />
                            {s}
                          </li>
                        ))}
                        {t.subtasks.length > 4 && (
                          <li className="pl-3 text-[11px] text-muted-foreground/70">+{t.subtasks.length - 4} more</li>
                        )}
                      </ul>
                    ) : null}
                  </button>
                ))}
              </div>
            </TabsContent>
          )}

          {(tab === "task" || tab === "subtask") && (
            <TabsContent value={tab} className="px-5 pb-4 space-y-3 mt-0">
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Use template…</label>
                <Select value={templateId} onValueChange={setTemplateId}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="No template" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No template</SelectItem>
                    {templates.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Title</label>
                <SmartTaskInput
                  value={title}
                  onChange={setTitle}
                  autoFocus
                  onSubmit={({ withShift }) => handleSubmit(withShift)}
                  placeholder="e.g. Design landing hero @hagry tomorrow #urgent !high"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">List</label>
                  <Select value={listId} onValueChange={setListId}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent className="max-h-80">
                      {spaces.map((s) => {
                        const listsInSpace = lists.filter((l) => l.spaceId === s.id);
                        if (!listsInSpace.length) return null;
                        return (
                          <div key={s.id}>
                            <div className="px-2 pt-2 pb-1 text-[10px] font-semibold uppercase text-muted-foreground" style={{ color: pillarMeta[s.pillar].color }}>{s.name}</div>
                            {listsInSpace.map((l) => {
                              const f = folders.find((x) => x.id === l.folderId);
                              return <SelectItem key={l.id} value={l.id}>{f ? `${f.name} / ${l.name}` : l.name}</SelectItem>;
                            })}
                          </div>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Assignee</label>
                  <Select value={assigneeId} onValueChange={setAssigneeId}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {members.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</label>
                  <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(["Backlog","To Do","In Progress","In Review","Blocked","Done"] as Status[]).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Priority</label>
                  <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(["urgent","high","normal","low"] as Priority[]).map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
                <span>⌘↵ submit · ⇧↵ submit and clear</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setQuickCreateOpen(false)}>Cancel</Button>
                  <Button size="sm" onClick={() => handleSubmit(false)}>Create</Button>
                </div>
              </div>
            </TabsContent>
          )}

          {(tab === "list" || tab === "folder" || tab === "space" || tab === "channel") && (
            <TabsContent value={tab} className="px-5 pb-4 space-y-3 mt-0">
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Name</label>
                <Input value={newName} autoFocus onChange={(e) => setNewName(e.target.value)} placeholder={`${tab[0].toUpperCase()}${tab.slice(1)} name`} />
              </div>
              {(tab === "list" || tab === "folder") && (
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Space</label>
                  <Select value={spaceForNewList} onValueChange={setSpaceForNewList}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>{spaces.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              )}
              {tab === "list" && (
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Folder (optional)</label>
                  <Select value={folderForNewList} onValueChange={setFolderForNewList}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">— None (under space)</SelectItem>
                      {folders.filter((f) => f.spaceId === spaceForNewList).map((f) => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="ghost" size="sm" onClick={() => setQuickCreateOpen(false)}>Cancel</Button>
                <Button size="sm" onClick={() => handleSubmit(false)}>Create</Button>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
