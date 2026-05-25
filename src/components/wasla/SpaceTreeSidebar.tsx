import { useEffect, useState, type DragEvent } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useApp } from "@/lib/app-context";
import { useTasks } from "@/lib/tasks-store";
import { spaces, pillarMeta, spaceById, type Pillar } from "@/lib/mock-data";
import { useFavorites } from "@/lib/favorites";
import { SidebarHeader } from "./AppShell";
import { ChevronRight, Inbox, FolderOpen, List as ListIcon, Star, Layers, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/** Pick the pillar color for any node by spaceId. */
function pillarColorForSpace(spaceId: string | undefined): string {
  if (!spaceId) return "var(--accent)";
  try {
    const s = spaceById(spaceId);
    return pillarMeta[s.pillar].color;
  } catch { return "var(--accent)"; }
}

/** Active row styling: soft tinted background + 3px left accent border. */
function activeStyle(color: string): React.CSSProperties {
  return {
    background: `color-mix(in oklab, ${color} 14%, transparent)`,
    boxShadow: `inset 3px 0 0 0 ${color}`,
  };
}

export function SpaceTreeSidebar() {
  const { tasks, lists, folders, moveTask } = useTasks();
  const { currentUserId } = useApp();
  const { favorites } = useFavorites();
  const loc = useLocation();
  const path = loc.pathname;
  const isMy = path === "/tasks";
  const activeListId = (path.match(/\/list\/([^/]+)/)?.[1]) ?? null;
  const activeSpaceId = (path.match(/\/space\/([^/]+)/)?.[1]) ?? null;
  const activeFolderId = (path.match(/\/folder\/([^/]+)/)?.[1]) ?? null;
  const activeTaskId = (path.match(/\/task\/([^/]+)/)?.[1]) ?? null;

  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem("wasla.tree") || "{}"); } catch { return {}; }
  });
  // Auto-open every ancestor of the active route.
  useEffect(() => {
    setOpen((s) => {
      const next = { ...s };
      // Space + folder explicit
      if (activeSpaceId) next[`s:${activeSpaceId}`] = true;
      if (activeFolderId) next[`f:${activeFolderId}`] = true;
      // Resolve list -> space + (optional) folder
      if (activeListId) {
        const l = lists.find((x) => x.id === activeListId);
        if (l) {
          next[`s:${l.spaceId}`] = true;
          if (l.folderId) next[`f:${l.folderId}`] = true;
        }
      }
      return next;
    });
  }, [activeListId, activeSpaceId, activeFolderId, activeTaskId, lists]);

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
        {/* Starred section */}
        {favorites.length > 0 && (
          <div className="mb-3">
            <div className="mb-1 flex items-center gap-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Star className="size-3 fill-amber-400 text-amber-400" /> Starred
            </div>
            <div className="space-y-0.5">
              {favorites.map((f) => {
                const active = typeof window !== "undefined" && window.location.pathname === f.href;
                const Icon = f.kind === "task" ? CheckSquare : f.kind === "list" ? ListIcon : f.kind === "folder" ? FolderOpen : Layers;
                return (
                  <Link
                    key={`${f.kind}:${f.id}`}
                    to={f.href}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[12px]",
                      active ? "text-foreground" : "text-foreground/80 hover:bg-muted/60",
                    )}
                    style={active ? activeStyle("#F59E0B") : undefined}
                  >
                    <Icon className="size-3.5 text-muted-foreground" />
                    <span className="flex-1 truncate text-left">{f.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <Link
          to="/tasks"
          className={cn(
            "mb-2 flex w-full items-center gap-2 rounded-md px-2 py-1.5",
            isMy ? "text-foreground" : "hover:bg-muted/60 text-foreground/80",
          )}
          style={isMy ? activeStyle("var(--accent)") : undefined}
        >
          <Inbox className="size-3.5 text-muted-foreground" />
          <span className="flex-1 text-left font-medium">My Work</span>
        </Link>

        {(Object.keys(pillarMeta) as Pillar[]).map((p) => (
          <div key={p} className="mb-2">
            <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color: pillarMeta[p].color }}>
              {pillarMeta[p].label}
            </div>
            {spaces.filter((s) => s.pillar === p && (!s.ownerId || s.ownerId === currentUserId)).map((s) => {
              const spaceFolders = folders.filter((f) => f.spaceId === s.id);
              const directLists = lists.filter((l) => l.spaceId === s.id && !l.folderId);
              const opn = open[`s:${s.id}`];
              const spActive = activeSpaceId === s.id && !activeFolderId && !activeListId;
              const color = pillarMeta[p].color;
              return (
                <div key={s.id} className="mb-0.5">
                  <div
                    className={cn("group flex items-center gap-1 rounded px-1.5 py-1", !spActive && "hover:bg-muted/60")}
                    style={spActive ? activeStyle(color) : undefined}
                  >
                    <button onClick={() => toggle(`s:${s.id}`)} className="flex size-4 items-center justify-center" aria-label="Toggle">
                      <ChevronRight className={cn("size-3 text-muted-foreground transition-transform", opn && "rotate-90")} />
                    </button>
                    <Link
                      to="/space/$spaceId"
                      params={{ spaceId: s.id }}
                      className="flex-1 truncate text-left text-[13px] font-medium"
                    >
                      {s.name}
                    </Link>
                    <span className="text-[10px] text-muted-foreground">{tasks.filter((t) => t.spaceId === s.id).length}</span>
                  </div>
                  {opn && (
                    <div className="ml-2 border-l border-border/60 pl-1">
                      {spaceFolders.map((f) => {
                        const fOpen = open[`f:${f.id}`];
                        const fActive = activeFolderId === f.id;
                        return (
                          <div key={f.id}>
                            <div
                              className={cn("group flex items-center gap-1 rounded px-1.5 py-1", !fActive && "hover:bg-muted/60")}
                              style={fActive ? activeStyle(color) : undefined}
                            >
                              <button onClick={() => toggle(`f:${f.id}`)} className="flex size-4 items-center justify-center" aria-label="Toggle">
                                <ChevronRight className={cn("size-3 text-muted-foreground transition-transform", fOpen && "rotate-90")} />
                              </button>
                              <FolderOpen className="size-3.5 text-muted-foreground" />
                              <Link
                                to="/space/$spaceId/folder/$folderId"
                                params={{ spaceId: s.id, folderId: f.id }}
                                className="flex-1 truncate text-left text-[12px]"
                              >
                                {f.name}
                              </Link>
                            </div>
                            {fOpen && (
                              <div className="ml-2 border-l border-border/60 pl-1">
                                {lists.filter((l) => l.folderId === f.id).map((l) => {
                                  const lActive = activeListId === l.id;
                                  return (
                                    <Link
                                      key={l.id}
                                      to="/space/$spaceId/list/$listId"
                                      params={{ spaceId: s.id, listId: l.id }}
                                      onDragOver={(e) => e.preventDefault()}
                                      onDrop={(e) => handleDrop(e, l.id)}
                                      className={cn(
                                        "flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-[12px]",
                                        lActive ? "text-foreground" : "hover:bg-muted/60 text-foreground/80",
                                      )}
                                      style={lActive ? activeStyle(color) : undefined}
                                    >
                                      <ListIcon className="size-3 text-muted-foreground" />
                                      <span className="flex-1 truncate text-left">{l.name}</span>
                                      <span className="text-[10px] text-muted-foreground">{tasks.filter((t) => t.listId === l.id && !t.parentId).length}</span>
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {directLists.map((l) => {
                        const lActive = activeListId === l.id;
                        return (
                          <Link
                            key={l.id}
                            to="/space/$spaceId/list/$listId"
                            params={{ spaceId: s.id, listId: l.id }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e, l.id)}
                            className={cn(
                              "flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-[12px]",
                              lActive ? "text-foreground" : "hover:bg-muted/60 text-foreground/80",
                            )}
                            style={lActive ? activeStyle(color) : undefined}
                          >
                            <ListIcon className="size-3 text-muted-foreground" />
                            <span className="flex-1 truncate text-left">{l.name}</span>
                            <span className="text-[10px] text-muted-foreground">{tasks.filter((t) => t.listId === l.id && !t.parentId).length}</span>
                          </Link>
                        );
                      })}
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

// keep helper exported in case routes need pillar color
export { pillarColorForSpace };
