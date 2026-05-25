import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/wasla/AppShell";
import { SpaceTreeSidebar } from "@/components/wasla/SpaceTreeSidebar";
import { PageHeader } from "@/components/wasla/PageHeader";
import { PageActionsMenu } from "@/components/wasla/PageActionsMenu";
import { spaceById, pillarMeta } from "@/lib/mock-data";
import { useTasks } from "@/lib/tasks-store";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Plus, FolderOpen, List as ListIcon, ChevronRight, FolderPlus } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { TaskTree } from "@/components/wasla/TaskTree";
import { usePageTitle, useStickyState } from "@/lib/page-title";
import { useMemo } from "react";

export const Route = createFileRoute("/space/$spaceId")({ component: SpacePage });

function SpacePage() {
  const { spaceId } = Route.useParams();
  const space = spaceById(spaceId);
  const { tasks, lists, folders } = useTasks();
  const { openQuickCreate } = useApp();
  const spaceFolders = folders.filter((f) => f.spaceId === spaceId);
  const directLists = lists.filter((l) => l.spaceId === spaceId && !l.folderId);
  const spaceTasks = tasks.filter((t) => t.spaceId === spaceId);
  const rootTasks = useMemo(() => {
    const ids = new Set(spaceTasks.map((t) => t.id));
    return spaceTasks.filter((t) => !t.parentId || !ids.has(t.parentId!));
  }, [spaceTasks]);
  const meta = pillarMeta[space.pillar];
  usePageTitle(space.name);
  const [tab, setTab] = useStickyState("tab", "overview");
  const isEmpty = spaceFolders.length === 0 && directLists.length === 0;

  return (
    <AppShell sidebar={<SpaceTreeSidebar />} breadcrumb={<span className="font-medium text-foreground">{meta.label} / {space.name}</span>}>
      <PageHeader crumbs={[
        { label: "Tasks", to: "/tasks" },
        { label: meta.label },
        { label: space.name },
      ]} />
      <div className="px-6 py-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{space.name}</h1>
            <span className="rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ background: `color-mix(in oklab, ${meta.color} 14%, transparent)`, color: meta.color }}>
              {meta.label}
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="gap-1.5"><Plus className="size-3.5" /> Add</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openQuickCreate({ tab: "folder" })}>Add folder</DropdownMenuItem>
              <DropdownMenuItem onClick={() => openQuickCreate({ tab: "list" })}>Add list</DropdownMenuItem>
              <DropdownMenuItem onClick={() => openQuickCreate({ tab: "task", listId: directLists[0]?.id ?? lists.find(l => l.spaceId === spaceId)?.id })}>Add task</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-5 space-y-6">
            {spaceFolders.length > 0 && (
              <section>
                <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Folders</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {spaceFolders.map((f) => {
                    const flLists = lists.filter((l) => l.folderId === f.id);
                    const taskCount = tasks.filter((t) => flLists.some((l) => l.id === t.listId)).length;
                    return (
                      <Link
                        key={f.id}
                        to="/space/$spaceId/folder/$folderId"
                        params={{ spaceId, folderId: f.id }}
                        className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:shadow-sm"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"><FolderOpen className="size-4" /></div>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold">{f.name}</div>
                            <div className="text-[11px] text-muted-foreground">{flLists.length} lists · {taskCount} tasks · 2h ago</div>
                          </div>
                        </div>
                        <ChevronRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5" />
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {directLists.length > 0 && (
              <section>
                <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Lists</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {directLists.map((l) => {
                    const cnt = tasks.filter((t) => t.listId === l.id && !t.parentId).length;
                    return (
                      <Link
                        key={l.id}
                        to="/space/$spaceId/list/$listId"
                        params={{ spaceId, listId: l.id }}
                        className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 transition hover:-translate-y-0.5 hover:shadow-sm"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <ListIcon className="size-4 shrink-0 text-muted-foreground" />
                          <span className="truncate text-sm font-medium">{l.name}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">{cnt}</span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {spaceFolders.length === 0 && directLists.length === 0 && (
              <div className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
                No folders or lists yet.
              </div>
            )}
          </TabsContent>

          <TabsContent value="tasks" className="mt-5">
            <TaskTree rootTasks={rootTasks} allTasks={spaceTasks} />
          </TabsContent>

          <TabsContent value="files" className="mt-5">
            <div className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">Files for this space.</div>
          </TabsContent>
          <TabsContent value="members" className="mt-5">
            <div className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">{space.members} members.</div>
          </TabsContent>
          <TabsContent value="activity" className="mt-5">
            <div className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">Activity feed.</div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
