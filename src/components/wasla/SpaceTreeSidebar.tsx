import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/lib/app-context";
import { useTasks } from "@/lib/tasks-store";
import { spaces, pillarMeta, spaceById, members, type Pillar } from "@/lib/mock-data";
import { useFavorites, type Favorite } from "@/lib/favorites";
import { useRecents, pushRecent } from "@/lib/recents";
import { useSidebarCollapse } from "./AppShell";
import {
  ChevronRight, Inbox, FolderOpen, List as ListIcon, Star, Layers,
  CheckSquare, Plus, Search, ChevronsLeft, ChevronsRight, MoreHorizontal, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator,
} from "@/components/ui/context-menu";
import {
  HoverCard, HoverCardTrigger, HoverCardContent,
} from "@/components/ui/hover-card";

function pillarColorForSpace(spaceId: string | undefined): string {
  if (!spaceId) return "var(--accent)";
  try { return pillarMeta[spaceById(spaceId).pillar].color; } catch { return "var(--accent)"; }
}

function activeStyle(color: string): React.CSSProperties {
  return {
    background: `color-mix(in oklab, ${color} 14%, transparent)`,
    boxShadow: `inset 3px 0 0 0 ${color}`,
  };
}

function copyHref(href: string) {
  navigator.clipboard?.writeText(window.location.origin + href).then(
    () => toast.success("Link copied"),
    () => toast.error("Couldn't copy")
  );
}

/** Recorder: writes the current route to recents based on location. */
function useRecentRecorder() {
  const loc = useLocation();
  const { tasks, lists, folders } = useTasks();
  useEffect(() => {
    const p = loc.pathname;
    const mTask = p.match(/^\/space\/([^/]+)\/list\/([^/]+)\/task\/([^/]+)(?:\/subtask\/([^/]+))?/);
    if (mTask) {
      const tid = mTask[4] ?? mTask[3];
      const t = tasks.find((x) => x.id === tid);
      if (t) {
        const l = lists.find((x) => x.id === t.listId);
        pushRecent({ kind: "task", id: t.id, label: t.title, parent: l?.name, href: p });
      }
      return;
    }
    const mList = p.match(/^\/space\/([^/]+)\/list\/([^/]+)/);
    if (mList) {
      const l = lists.find((x) => x.id === mList[2]);
      if (l) {
        const s = spaceById(l.spaceId);
        pushRecent({ kind: "list", id: l.id, label: l.name, parent: s.name, href: p });
      }
      return;
    }
    const mFolder = p.match(/^\/space\/([^/]+)\/folder\/([^/]+)/);
    if (mFolder) {
      const f = folders.find((x) => x.id === mFolder[2]);
      if (f) {
        const s = spaceById(f.spaceId);
        pushRecent({ kind: "folder", id: f.id, label: f.name, parent: s.name, href: p });
      }
      return;
    }
    const mSpace = p.match(/^\/space\/([^/]+)/);
    if (mSpace) {
      try {
        const s = spaceById(mSpace[1]);
        pushRecent({ kind: "space", id: s.id, label: s.name, parent: pillarMeta[s.pillar].label, href: p });
      } catch { /* ignore */ }
    }
  }, [loc.pathname, tasks, lists, folders]);
}

export function SpaceTreeSidebar() {
  const { collapsed, toggle } = useSidebarCollapse();
  useRecentRecorder();
  if (collapsed) return <CollapsedRail />;
  return <ExpandedTree onCollapse={toggle} />;
}

/* =================== COLLAPSED RAIL =================== */
function CollapsedRail() {
  const { toggle } = useSidebarCollapse();
  const { setCommandOpen } = useApp();
  return (
    <div className="flex h-full w-full flex-col items-center gap-1.5 py-3">
      <button
        onClick={toggle}
        className="flex size-8 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
        title="Expand sidebar  (⌘B)"
        aria-label="Expand sidebar"
      >
        <ChevronsRight className="size-4" />
      </button>
      <button
        onClick={() => setCommandOpen(true)}
        className="flex size-8 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
        title="Search · ⌘K"
      >
        <Search className="size-4" />
      </button>
      <div className="my-1 h-px w-6 bg-border" />
      {(Object.keys(pillarMeta) as Pillar[]).map((p) => (
        <PillarDotFlyout key={p} pillar={p} />
      ))}
    </div>
  );
}

function PillarDotFlyout({ pillar }: { pillar: Pillar }) {
  const { tasks, lists, folders } = useTasks();
  const { currentUserId } = useApp();
  const meta = pillarMeta[pillar];
  const pillarSpaces = spaces.filter((s) => s.pillar === pillar && (!s.ownerId || s.ownerId === currentUserId));
  return (
    <HoverCard openDelay={80} closeDelay={120}>
      <HoverCardTrigger asChild>
        <Link
          to="/pillar/$pillarId"
          params={{ pillarId: pillar }}
          className="flex size-8 items-center justify-center rounded-md hover:bg-muted"
          title={meta.label}
        >
          <span className="size-2.5 rounded-full" style={{ background: meta.color }} />
        </Link>
      </HoverCardTrigger>
      <HoverCardContent side="right" align="start" className="w-64 p-2">
        <div className="mb-1 flex items-center justify-between px-1">
          <Link to="/pillar/$pillarId" params={{ pillarId: pillar }} className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: meta.color }}>
            {meta.label}
          </Link>
        </div>
        <div className="max-h-72 space-y-0.5 overflow-y-auto scrollbar-thin">
          {pillarSpaces.map((s) => {
            const sLists = lists.filter((l) => l.spaceId === s.id);
            const sFolders = folders.filter((f) => f.spaceId === s.id);
            return (
              <div key={s.id}>
                <Link to="/space/$spaceId" params={{ spaceId: s.id }} className="flex w-full items-center justify-between rounded px-1.5 py-1 text-[12px] font-medium hover:bg-muted">
                  <span className="truncate">{s.name}</span>
                  <span className="text-[10px] text-muted-foreground">{tasks.filter((t) => t.spaceId === s.id).length}</span>
                </Link>
                {sFolders.map((f) => (
                  <Link key={f.id} to="/space/$spaceId/folder/$folderId" params={{ spaceId: s.id, folderId: f.id }} className="ml-3 flex items-center gap-1.5 rounded px-1.5 py-1 text-[11px] text-foreground/80 hover:bg-muted">
                    <FolderOpen className="size-3 text-muted-foreground" /><span className="truncate">{f.name}</span>
                  </Link>
                ))}
                {sLists.filter((l) => !l.folderId).map((l) => (
                  <Link key={l.id} to="/space/$spaceId/list/$listId" params={{ spaceId: s.id, listId: l.id }} className="ml-3 flex items-center gap-1.5 rounded px-1.5 py-1 text-[11px] text-foreground/80 hover:bg-muted">
                    <ListIcon className="size-3 text-muted-foreground" /><span className="truncate">{l.name}</span>
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

/* =================== EXPANDED TREE =================== */

function ExpandedTree({ onCollapse }: { onCollapse: () => void }) {
  const { tasks, lists, folders, moveTask, createList, createFolder } = useTasks();
  const { currentUserId, openQuickCreate } = useApp();
  const { favorites, toggle: toggleFav, isStarred } = useFavorites();
  const { recents } = useRecents();
  const loc = useLocation();
  const path = loc.pathname;

  const isMy = path === "/tasks";
  const activeListId = (path.match(/\/list\/([^/]+)/)?.[1]) ?? null;
  const activeSpaceId = (path.match(/\/space\/([^/]+)/)?.[1]) ?? null;
  const activeFolderId = (path.match(/\/folder\/([^/]+)/)?.[1]) ?? null;
  const activeTaskId = (path.match(/\/task\/([^/]+)/)?.[1]) ?? null;
  const activePillarId = (path.match(/\/pillar\/([^/]+)/)?.[1]) ?? null;

  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem("wasla.tree") || "{}"); } catch { return {}; }
  });
  useEffect(() => {
    setOpen((s) => {
      const next = { ...s };
      if (activeSpaceId) next[`s:${activeSpaceId}`] = true;
      if (activeFolderId) next[`f:${activeFolderId}`] = true;
      if (activeListId) {
        const l = lists.find((x) => x.id === activeListId);
        if (l) { next[`s:${l.spaceId}`] = true; if (l.folderId) next[`f:${l.folderId}`] = true; }
      }
      return next;
    });
  }, [activeListId, activeSpaceId, activeFolderId, activeTaskId, lists]);
  useEffect(() => { localStorage.setItem("wasla.tree", JSON.stringify(open)); }, [open]);
  const toggleNode = (k: string) => setOpen((s) => ({ ...s, [k]: !s[k] }));

  const handleDrop = (e: DragEvent, listId: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/task-id");
    if (id) { moveTask(id, listId); toast.success("Task moved"); }
  };

  // Counts / badges
  const today = new Date(); today.setHours(23, 59, 59, 999);
  const myWorkCount = useMemo(
    () => tasks.filter((t) => t.assigneeId === currentUserId && t.status !== "Done" && new Date(t.due) <= today).length,
    [tasks, currentUserId, today]
  );
  const pillarOpenCount = (p: Pillar) =>
    tasks.filter((t) => t.status !== "Done" && spaces.some((s) => s.id === t.spaceId && s.pillar === p)).length;
  const spaceHasAlert = (sid: string) =>
    tasks.some((t) => t.spaceId === sid && (t.status === "Blocked" || (t.status !== "Done" && new Date(t.due) < new Date())));

  return (
    <>
      <div className="border-b border-border/60 px-3 py-3">
        <div className="mb-2 flex items-center justify-between gap-1">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Workspaces</h2>
          <button onClick={onCollapse} className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground" title="Collapse (⌘B)" aria-label="Collapse sidebar">
            <ChevronsLeft className="size-3.5" />
          </button>
        </div>
        <SmartSearch />
      </div>

      <div className="flex-1 overflow-y-auto px-1.5 py-2 scrollbar-thin text-sm">
        {/* RECENT */}
        {recents.length > 0 && (
          <Section label="Recent">
            <div className="space-y-0.5">
              {recents.map((r) => {
                const Icon = r.kind === "task" ? CheckSquare : r.kind === "list" ? ListIcon : r.kind === "folder" ? FolderOpen : Layers;
                return (
                  <Link key={`${r.kind}:${r.id}`} to={r.href as never} className="group flex w-full items-center gap-2 rounded-md px-2 py-1 text-[12px] text-foreground/80 hover:bg-muted/60">
                    <Icon className="size-3.5 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate">{r.label}</div>
                      {r.parent && <div className="truncate text-[11px] text-muted-foreground">{r.parent}</div>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </Section>
        )}

        {/* FAVORITES */}
        <FavoritesSection favorites={favorites} toggleFav={toggleFav} />

        {/* MY WORK */}
        <Link
          to="/tasks"
          className={cn("mb-2 mt-3 flex w-full items-center gap-2 rounded-md px-2 py-1.5", isMy ? "text-foreground" : "hover:bg-muted/60 text-foreground/80")}
          style={isMy ? activeStyle("var(--accent)") : undefined}
        >
          <Inbox className="size-3.5 text-muted-foreground" />
          <span className="flex-1 text-left font-medium">My Work</span>
          {myWorkCount > 0 && (
            <span className="rounded-full bg-destructive/15 px-1.5 py-0.5 text-[10px] font-semibold text-destructive">{myWorkCount}</span>
          )}
        </Link>

        {/* SPACES header */}
        <div className="mb-1 mt-3 flex items-center justify-between px-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Spaces</span>
          <button onClick={() => openQuickCreate({ tab: "space" })} className="flex size-5 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="New space" title="New space">
            <Plus className="size-3" />
          </button>
        </div>

        {(Object.keys(pillarMeta) as Pillar[]).map((p) => {
          const meta = pillarMeta[p];
          const isPillarActive = activePillarId === p;
          return (
            <div key={p} className="mb-2">
              <Link
                to="/pillar/$pillarId"
                params={{ pillarId: p }}
                className={cn("mb-0.5 flex items-center justify-between rounded px-2 py-1", isPillarActive ? "bg-muted/60" : "hover:bg-muted/40")}
              >
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: meta.color }}>{meta.label}</span>
                <span className="text-[10px] text-muted-foreground">{pillarOpenCount(p)}</span>
              </Link>
              {spaces.filter((s) => s.pillar === p && (!s.ownerId || s.ownerId === currentUserId)).map((s) => {
                const spaceFolders = folders.filter((f) => f.spaceId === s.id);
                const directLists = lists.filter((l) => l.spaceId === s.id && !l.folderId);
                const opn = open[`s:${s.id}`];
                const spActive = activeSpaceId === s.id && !activeFolderId && !activeListId;
                const color = meta.color;
                const alert = spaceHasAlert(s.id);

                return (
                  <div key={s.id} className="mb-0.5">
                    <RowContextMenu
                      onAddList={() => { const l = createList("Untitled list", s.id); toast.success(`Added “${l.name}”`); }}
                      onAddFolder={() => { const f = createFolder("Untitled folder", s.id); toast.success(`Added “${f.name}”`); }}
                      onCopyLink={() => copyHref(`/space/${s.id}`)}
                      onStar={() => toggleFav({ kind: "space", id: s.id, label: s.name, href: `/space/${s.id}` })}
                      starred={isStarred("space", s.id)}
                    >
                      <div
                        className={cn("group flex items-center gap-1 rounded px-1.5 py-1", !spActive && "hover:bg-muted/60")}
                        style={spActive ? activeStyle(color) : undefined}
                      >
                        <button onClick={() => toggleNode(`s:${s.id}`)} className="flex size-4 items-center justify-center" aria-label="Toggle">
                          <ChevronRight className={cn("size-3 text-muted-foreground transition-transform", opn && "rotate-90")} />
                        </button>
                        <Link to="/space/$spaceId" params={{ spaceId: s.id }} className="flex-1 truncate text-left text-[13px] font-medium">
                          {s.name}
                        </Link>
                        {alert && <span className="size-1.5 rounded-full bg-destructive" title="Has overdue or blocked tasks" />}
                        <span className="text-[10px] text-muted-foreground">{tasks.filter((t) => t.spaceId === s.id).length}</span>
                        <QuickAdd onClick={() => openQuickCreate({ tab: "list" })} />
                      </div>
                    </RowContextMenu>

                    {opn && (
                      <div className="ml-2 border-l border-border/60 pl-1">
                        {spaceFolders.map((f) => {
                          const fOpen = open[`f:${f.id}`];
                          const fActive = activeFolderId === f.id;
                          return (
                            <div key={f.id}>
                              <RowContextMenu
                                onAddList={() => { const l = createList("Untitled list", s.id, f.id); toast.success(`Added “${l.name}”`); }}
                                onCopyLink={() => copyHref(`/space/${s.id}/folder/${f.id}`)}
                                onStar={() => toggleFav({ kind: "folder", id: f.id, label: f.name, href: `/space/${s.id}/folder/${f.id}` })}
                                starred={isStarred("folder", f.id)}
                              >
                                <div
                                  className={cn("group flex items-center gap-1 rounded px-1.5 py-1", !fActive && "hover:bg-muted/60")}
                                  style={fActive ? activeStyle(color) : undefined}
                                >
                                  <button onClick={() => toggleNode(`f:${f.id}`)} className="flex size-4 items-center justify-center" aria-label="Toggle">
                                    <ChevronRight className={cn("size-3 text-muted-foreground transition-transform", fOpen && "rotate-90")} />
                                  </button>
                                  <FolderOpen className="size-3.5 text-muted-foreground" />
                                  <Link to="/space/$spaceId/folder/$folderId" params={{ spaceId: s.id, folderId: f.id }} className="flex-1 truncate text-left text-[12px]">
                                    {f.name}
                                  </Link>
                                  <QuickAdd onClick={() => openQuickCreate({ tab: "list" })} />
                                </div>
                              </RowContextMenu>
                              {fOpen && (
                                <div className="ml-2 border-l border-border/60 pl-1">
                                  {lists.filter((l) => l.folderId === f.id).map((l) => (
                                    <ListRow key={l.id} listId={l.id} listName={l.name} spaceId={s.id} color={color}
                                      active={activeListId === l.id}
                                      count={tasks.filter((t) => t.listId === l.id && !t.parentId).length}
                                      onDrop={(e) => handleDrop(e, l.id)}
                                      onAddTask={() => openQuickCreate({ tab: "task", listId: l.id })}
                                      onCopyLink={() => copyHref(`/space/${s.id}/list/${l.id}`)}
                                      onStar={() => toggleFav({ kind: "list", id: l.id, label: l.name, href: `/space/${s.id}/list/${l.id}` })}
                                      starred={isStarred("list", l.id)}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {directLists.map((l) => (
                          <ListRow key={l.id} listId={l.id} listName={l.name} spaceId={s.id} color={color}
                            active={activeListId === l.id}
                            count={tasks.filter((t) => t.listId === l.id && !t.parentId).length}
                            onDrop={(e) => handleDrop(e, l.id)}
                            onAddTask={() => openQuickCreate({ tab: "task", listId: l.id })}
                            onCopyLink={() => copyHref(`/space/${s.id}/list/${l.id}`)}
                            onStar={() => toggleFav({ kind: "list", id: l.id, label: l.name, href: `/space/${s.id}/list/${l.id}` })}
                            starred={isStarred("list", l.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}

function QuickAdd({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClick(); }}
      className="ml-1 flex size-5 items-center justify-center rounded text-muted-foreground opacity-0 transition hover:bg-muted hover:text-foreground group-hover:opacity-100"
      aria-label="Quick add"
      title="Quick add"
    >
      <Plus className="size-3" />
    </button>
  );
}

function RowContextMenu({
  children, onAddList, onAddFolder, onCopyLink, onStar, starred,
}: {
  children: React.ReactNode;
  onAddList?: () => void;
  onAddFolder?: () => void;
  onCopyLink?: () => void;
  onStar?: () => void;
  starred?: boolean;
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem onClick={() => toast("Rename — coming soon")}>Rename</ContextMenuItem>
        <ContextMenuItem onClick={() => toast("Duplicated")}>Duplicate</ContextMenuItem>
        <ContextMenuItem onClick={() => toast("Move — coming soon")}>Move</ContextMenuItem>
        <ContextMenuItem onClick={() => toast("Archived")}>Archive</ContextMenuItem>
        <ContextMenuSeparator />
        {onAddList && <ContextMenuItem onClick={onAddList}>Add list</ContextMenuItem>}
        {onAddFolder && <ContextMenuItem onClick={onAddFolder}>Add folder</ContextMenuItem>}
        <ContextMenuSeparator />
        {onCopyLink && <ContextMenuItem onClick={onCopyLink}>Copy link</ContextMenuItem>}
        {onStar && <ContextMenuItem onClick={onStar}>{starred ? "Unstar" : "Star"}</ContextMenuItem>}
      </ContextMenuContent>
    </ContextMenu>
  );
}

function ListRow({
  listId, listName, spaceId, color, active, count, onDrop, onAddTask, onCopyLink, onStar, starred,
}: {
  listId: string; listName: string; spaceId: string; color: string;
  active: boolean; count: number;
  onDrop: (e: DragEvent) => void;
  onAddTask: () => void;
  onCopyLink: () => void;
  onStar: () => void;
  starred: boolean;
}) {
  return (
    <RowContextMenu onCopyLink={onCopyLink} onStar={onStar} starred={starred}>
      <Link
        to="/space/$spaceId/list/$listId"
        params={{ spaceId, listId }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className={cn(
          "group flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-[12px]",
          active ? "text-foreground" : "hover:bg-muted/60 text-foreground/80",
        )}
        style={active ? activeStyle(color) : undefined}
      >
        <ListIcon className="size-3 text-muted-foreground" />
        <span className="flex-1 truncate text-left">{listName}</span>
        <span className="text-[10px] text-muted-foreground">{count}</span>
        <QuickAdd onClick={onAddTask} />
      </Link>
    </RowContextMenu>
  );
}

/* =================== FAVORITES with DnD reorder =================== */
function FavoritesSection({ favorites, toggleFav }: { favorites: Favorite[]; toggleFav: (f: Favorite) => void }) {
  const [order, setOrder] = useState<Favorite[]>(favorites);
  useEffect(() => { setOrder(favorites); }, [favorites]);
  const dragId = useRef<string | null>(null);

  return (
    <Section label="Favorites">
      {order.length === 0 ? (
        <div className="px-2 text-[11px] text-muted-foreground">Star anything to pin it here.</div>
      ) : (
        <div className="space-y-0.5">
          {order.map((f) => {
            const Icon = f.kind === "task" ? CheckSquare : f.kind === "list" ? ListIcon : f.kind === "folder" ? FolderOpen : Layers;
            const key = `${f.kind}:${f.id}`;
            return (
              <div
                key={key}
                draggable
                onDragStart={() => { dragId.current = key; }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (!dragId.current || dragId.current === key) return;
                  const from = order.findIndex((x) => `${x.kind}:${x.id}` === dragId.current);
                  const to = order.findIndex((x) => `${x.kind}:${x.id}` === key);
                  if (from < 0 || to < 0) return;
                  const next = [...order];
                  const [moved] = next.splice(from, 1);
                  next.splice(to, 0, moved);
                  setOrder(next);
                  dragId.current = null;
                }}
                className="group flex items-center gap-2 rounded-md px-2 py-1 text-[12px] text-foreground/80 hover:bg-muted/60"
              >
                <Icon className="size-3.5 text-muted-foreground" />
                <Link to={f.href as never} className="flex-1 truncate text-left">{f.label}</Link>
                <button
                  onClick={() => toggleFav(f)}
                  className="opacity-0 transition group-hover:opacity-100"
                  aria-label="Unstar"
                  title="Unstar"
                >
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </Section>
  );
}

/* =================== SMART SEARCH =================== */
type SearchHit = { kind: "task" | "list" | "folder" | "space" | "people"; id: string; label: string; sub?: string; href: string };

function SmartSearch() {
  const { tasks, lists, folders } = useTasks();
  const { currentUserId } = useApp();
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const groups = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return null;

    // NL filters
    const week = new Date(); week.setDate(week.getDate() + 7);
    const today = new Date(); today.setHours(23, 59, 59, 999);
    const assignedMe = /assigned to me|my tasks/.test(term);
    const dueWeek = /this week/.test(term);
    const dueToday = /today/.test(term);
    const onlyBlocked = /blocked/.test(term);
    const stripped = term
      .replace(/assigned to me|my tasks|this week|today|blocked|tasks?|in/g, "")
      .trim();

    const matchText = (s: string) => !stripped || s.toLowerCase().includes(stripped);
    const t = tasks.filter((t) => {
      if (assignedMe && t.assigneeId !== currentUserId) return false;
      if (onlyBlocked && t.status !== "Blocked") return false;
      if (dueWeek && new Date(t.due) > week) return false;
      if (dueToday && new Date(t.due) > today) return false;
      return matchText(t.title);
    });
    const ls = lists.filter((l) => matchText(l.name));
    const fs = folders.filter((f) => matchText(f.name));
    const ss = spaces.filter((s) => matchText(s.name));
    const ps = members.filter((m) => matchText(m.name));

    const hits: Record<string, SearchHit[]> = {
      Tasks: t.slice(0, 3).map((t) => ({ kind: "task", id: t.id, label: t.title, sub: t.status, href: `/space/${t.spaceId}/list/${t.listId}/task/${t.id}` })),
      Lists: ls.slice(0, 3).map((l) => ({ kind: "list", id: l.id, label: l.name, href: `/space/${l.spaceId}/list/${l.id}` })),
      Folders: fs.slice(0, 3).map((f) => ({ kind: "folder", id: f.id, label: f.name, href: `/space/${f.spaceId}/folder/${f.id}` })),
      Spaces: ss.slice(0, 3).map((s) => ({ kind: "space", id: s.id, label: s.name, href: `/space/${s.id}` })),
      People: ps.slice(0, 3).map((m) => ({ kind: "people", id: m.id, label: m.name, sub: m.title, href: `/people/${m.id}` })),
    };
    return hits;
  }, [q, tasks, lists, folders, currentUserId]);

  const flat = useMemo(() => groups ? Object.values(groups).flat() : [], [groups]);

  const go = (h: SearchHit) => { nav({ to: h.href as never }); setOpen(false); setQ(""); };

  return (
    <div ref={wrapRef} className="relative">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setCursor(0); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") { setOpen(false); (e.target as HTMLInputElement).blur(); }
          if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, flat.length - 1)); }
          if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
          if (e.key === "Enter" && flat[cursor]) go(flat[cursor]);
        }}
        placeholder="Search… try “blocked tasks in Tourism”"
        className="h-8 pl-8 pr-7 text-xs"
      />
      {q && (
        <button onClick={() => { setQ(""); setOpen(false); }} className="absolute right-1.5 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded text-muted-foreground hover:bg-muted">
          <X className="size-3" />
        </button>
      )}
      {open && groups && flat.length > 0 && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-[60vh] overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg scrollbar-thin">
          {Object.entries(groups).map(([group, hits]) => hits.length > 0 && (
            <div key={group} className="mb-1">
              <div className="flex items-center justify-between px-2 pt-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{group}</span>
                <button onClick={() => toast(`See all ${group.toLowerCase()} — coming soon`)} className="text-[10px] text-muted-foreground hover:text-foreground">See all</button>
              </div>
              {hits.map((h) => {
                const idx = flat.indexOf(h);
                const active = idx === cursor;
                return (
                  <button
                    key={`${h.kind}:${h.id}`}
                    onMouseEnter={() => setCursor(idx)}
                    onClick={() => go(h)}
                    className={cn("flex w-full items-center justify-between gap-2 rounded px-2 py-1 text-left text-[12px]", active ? "bg-muted" : "hover:bg-muted/60")}
                  >
                    <span className="truncate">{h.label}</span>
                    {h.sub && <span className="text-[10px] text-muted-foreground">{h.sub}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
      {open && q && flat.length === 0 && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 rounded-md border border-border bg-popover p-3 text-center text-[12px] text-muted-foreground shadow-lg">
          No matches.
        </div>
      )}
    </div>
  );
}

export { pillarColorForSpace };
