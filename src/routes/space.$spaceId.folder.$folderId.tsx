import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/wasla/AppShell";
import { SpaceTreeSidebar } from "@/components/wasla/SpaceTreeSidebar";
import { PageHeader } from "@/components/wasla/PageHeader";
import { spaceById, folderById, pillarMeta } from "@/lib/mock-data";
import { useTasks } from "@/lib/tasks-store";
import { Button } from "@/components/ui/button";
import { Plus, List as ListIcon } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { TaskTree } from "@/components/wasla/TaskTree";
import { StatusPill } from "@/components/wasla/StatusPill";
import { useMemo, useState } from "react";


export const Route = createFileRoute("/space/$spaceId/folder/$folderId")({ component: FolderPage });

function FolderPage() {
  const { spaceId, folderId } = Route.useParams();
  const space = spaceById(spaceId);
  const folder = folderById(folderId);
  const { tasks, lists } = useTasks();
  const { openQuickCreate } = useApp();
  const folderLists = lists.filter((l) => l.folderId === folderId);
  const folderTasks = tasks.filter((t) => folderLists.some((l) => l.id === t.listId));
  const [flat, setFlat] = useState(false);
  const meta = pillarMeta[space.pillar];

  const rootTasks = useMemo(() => {
    const ids = new Set(folderTasks.map((t) => t.id));
    return folderTasks.filter((t) => !t.parentId || !ids.has(t.parentId!));
  }, [folderTasks]);

  return (
    <AppShell sidebar={<SpaceTreeSidebar />} breadcrumb={<span className="font-medium text-foreground">{space.name} / {folder?.name}</span>}>
      <PageHeader crumbs={[
        { label: "Tasks", to: "/tasks" },
        { label: meta.label },
        { label: space.name, to: "/space/$spaceId", params: { spaceId } },
        { label: folder?.name ?? "Folder" },
      ]} />
      <div className="px-6 py-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">{folder?.name ?? "Folder"}</h1>
          <Button size="sm" className="gap-1.5" onClick={() => openQuickCreate({ tab: "list" })}>
            <Plus className="size-3.5" /> Add list
          </Button>
        </div>

        {!flat ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {folderLists.map((l) => {
              const lTasks = tasks.filter((t) => t.listId === l.id && !t.parentId);
              return (
                <Link
                  key={l.id}
                  to="/space/$spaceId/list/$listId"
                  params={{ spaceId, listId: l.id }}
                  className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex min-w-0 items-center gap-2">
                      <ListIcon className="size-4 shrink-0 text-muted-foreground" />
                      <span className="truncate text-sm font-semibold">{l.name}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{lTasks.length} tasks</span>
                  </div>
                  <div className="space-y-1.5 border-t border-border/60 pt-3">
                    {lTasks.slice(0, 3).map((t) => (
                      <div key={t.id} className="flex items-center gap-2 text-xs">
                        <span className="flex-1 truncate text-foreground/85">{t.title}</span>
                        <StatusPill status={t.status} />
                      </div>
                    ))}
                    {lTasks.length === 0 && <div className="text-[11px] italic text-muted-foreground/70">Empty list</div>}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <TaskTree rootTasks={rootTasks} allTasks={folderTasks} />
        )}

        <div className="mt-5 flex justify-center">
          <Button size="sm" variant="ghost" className="text-xs" onClick={() => setFlat((v) => !v)}>
            {flat ? "Show list cards" : "Show all tasks in folder (flattened)"}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
