import { useEffect, useState, type DragEvent } from "react";
import { useLocation } from "@tanstack/react-router";
import { useApp } from "@/lib/app-context";
import { useTasks } from "@/lib/tasks-store";
import { useTaskNav } from "@/lib/task-nav";
import { spaces, pillarMeta } from "@/lib/mock-data";
import { SidebarHeader } from "./AppShell";
import { ChevronRight, Inbox, FolderOpen, List as ListIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function SpaceTreeSidebar() {
  const { tasks, lists, folders, moveTask } = useTasks();
  const { currentUserId } = useApp();
  const { goList, goSpace, goFolder } = useTaskNav();
  const loc = useLocation();
  const path = loc.pathname;
  const isMy = path === "/tasks";
  const activeListId = (path.match(/\/list\/([^/]+)/)?.[1]) ?? null;
  const activeSpaceId = (path.match(/\/space\/([^/]+)/)?.[1]) ?? null;
  const activeFolderId = (path.match(/\/folder\/([^/]+)/)?.[1]) ?? null;

  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem("wasla.tree") || "{}"); } catch { return {}; }
  });
  // Auto-open ancestors of the active route
  useEffect(() => {
    setOpen((s) => {
      const next = { ...s };
      if (activeSpaceId) next[`s:${activeSpaceId}`] = true;
      if (activeFolderId) next[`f:${activeFolderId}`] = true;
      if (activeListId) {
        const l = lists.find((x) => x.id === activeListId);
        if (l) {
          next[`s:${l.spaceId}`] = true;
          if (l.folderId) next[`f:${l.folderId}`] = true;
        }
      }
      return next;
    });
  }, [activeListId, activeSpaceId, activeFolderId, lists]);
  useEffect(() => { localStorage.setItem("wasla.tree", JSON.stringify(open)); }, [open]);
  const toggle = (k: string) => setOpen((s) => ({ ...s, [k]: !s[k] }));

  const handleDrop = (e: DragEvent, listId: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/task-id");
    if (id) { moveTask(id, listId); toast.success("Task moved"); }
  };

  return (
    <>
      <SidebarHeader title="Workspaces" />
      <div className="flex-1 overflow-y-auto px-1.5 py-2 scrollbar-thin text-sm">
        <a
          href="/tasks"
          onClick={(e) => { e.preventDefault(); window.history.pushState({}, "", "/tasks"); window.dispatchEvent(new PopStateEvent("popstate")); }}
          className={cn("mb-2 flex w-full items-center gap-2 rounded-md px-2 py-1.5", isMy ? "bg-muted text-foreground" : "hover:bg-muted/60 text-foreground/80")}
        >
          <Inbox className="size-3.5 text-muted-foreground" /> <span className="flex-1 text-left font-medium">My Work</span>
        </a>

        {(Object.keys(pillarMeta) as Array<keyof typeof pillarMeta>).map((p) => (
          <div key={p} className="mb-2">
            <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color: pillarMeta[p].color }}>{pillarMeta[p].label}</div>
            {spaces.filter((s) => s.pillar === p && (!s.ownerId || s.ownerId === currentUserId)).map((s) => {
              const spaceFolders = folders.filter((f) => f.spaceId === s.id);
              const directLists = lists.filter((l) => l.spaceId === s.id && !l.folderId);
              const opn = open[`s:${s.id}`];
              const spActive = activeSpaceId === s.id && !activeFolderId && !activeListId;
              return (
                <div key={s.id} className="mb-0.5">
                  <div className={cn("group flex items-center gap-1 rounded px-1.5 py-1", spActive ? "bg-muted" : "hover:bg-muted/60")}>
                    <button onClick={() => toggle(`s:${s.id}`)} className="flex size-4 items-center justify-center">
                      <ChevronRight className={cn("size-3 text-muted-foreground transition-transform", opn && "rotate-90")} />
                    </button>
                    <button onClick={() => goSpace(s.id)} className="flex-1 truncate text-left text-[13px] font-medium">
                      {s.name}
                    </button>
                    <span className="text-[10px] text-muted-foreground">{tasks.filter((t) => t.spaceId === s.id).length}</span>
                  </div>
                  {opn && (
                    <div className="ml-2 border-l border-border/60 pl-1">
                      {spaceFolders.map((f) => {
                        const fOpen = open[`f:${f.id}`];
                        const fActive = activeFolderId === f.id;
                        return (
                          <div key={f.id}>
                            <div className={cn("group flex items-center gap-1 rounded px-1.5 py-1", fActive ? "bg-muted" : "hover:bg-muted/60")}>
                              <button onClick={() => toggle(`f:${f.id}`)} className="flex size-4 items-center justify-center">
                                <ChevronRight className={cn("size-3 text-muted-foreground transition-transform", fOpen && "rotate-90")} />
                              </button>
                              <FolderOpen className="size-3.5 text-muted-foreground" />
                              <button onClick={() => goFolder(s.id, f.id)} className="flex-1 truncate text-left text-[12px]">{f.name}</button>
                            </div>
                            {fOpen && (
                              <div className="ml-2 border-l border-border/60 pl-1">
                                {lists.filter((l) => l.folderId === f.id).map((l) => (
                                  <button
                                    key={l.id}
                                    onClick={() => goList(s.id, l.id)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => handleDrop(e, l.id)}
                                    className={cn("flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-[12px]", activeListId === l.id ? "bg-muted text-foreground" : "hover:bg-muted/60 text-foreground/80")}
                                  >
                                    <ListIcon className="size-3 text-muted-foreground" />
                                    <span className="flex-1 truncate text-left">{l.name}</span>
                                    <span className="text-[10px] text-muted-foreground">{tasks.filter((t) => t.listId === l.id && !t.parentId).length}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {directLists.map((l) => (
                        <button
                          key={l.id}
                          onClick={() => goList(s.id, l.id)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDrop(e, l.id)}
                          className={cn("flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-[12px]", activeListId === l.id ? "bg-muted text-foreground" : "hover:bg-muted/60 text-foreground/80")}
                        >
                          <ListIcon className="size-3 text-muted-foreground" />
                          <span className="flex-1 truncate text-left">{l.name}</span>
                          <span className="text-[10px] text-muted-foreground">{tasks.filter((t) => t.listId === l.id && !t.parentId).length}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}
