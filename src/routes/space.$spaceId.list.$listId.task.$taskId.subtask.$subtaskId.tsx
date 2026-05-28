import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/wasla/AppShell";
import { SpaceTreeSidebar } from "@/components/wasla/SpaceTreeSidebar";
import { PageHeader } from "@/components/wasla/PageHeader";
import { PageActionsMenu } from "@/components/wasla/PageActionsMenu";
import { TaskDetail } from "@/components/wasla/TaskDetail";
import { spaceById, folderById, pillarMeta } from "@/lib/mock-data";
import { useTasks } from "@/lib/tasks-store";
import { getAncestors } from "@/lib/task-utils";
import { usePageTitle } from "@/lib/page-title";

export const Route = createFileRoute("/space/$spaceId/list/$listId/task/$taskId/subtask/$subtaskId")({ component: SubtaskPage });

function SubtaskPage() {
  const { spaceId, listId, taskId, subtaskId } = Route.useParams();
  const { tasks, lists } = useTasks();
  const space = spaceById(spaceId);
  const list = lists.find((l) => l.id === listId);
  const folder = list?.folderId ? folderById(list.folderId) : null;
  const root = tasks.find((t) => t.id === taskId);
  const sub = tasks.find((t) => t.id === subtaskId);
  const ancestors = sub ? getAncestors(tasks, sub.id) : [];
  usePageTitle(sub ? `${space.name} · ${sub.title}` : space.name);

  const crumbs = [
    { label: pillarMeta[space.pillar].label },
    { label: space.name, to: "/space/$spaceId", params: { spaceId } as any },
    ...(folder ? [{ label: folder.name, to: "/space/$spaceId/folder/$folderId", params: { spaceId, folderId: folder.id } as any }] : []),
    { label: list?.name ?? "List", to: "/space/$spaceId/list/$listId", params: { spaceId, listId } as any },
    { label: root?.title ?? "Task", to: "/space/$spaceId/list/$listId/task/$taskId", params: { spaceId, listId, taskId } as any },
    ...ancestors.slice(1).map((a) => ({ label: a.title })),
    { label: sub?.title ?? "Subtask" },
  ];

  return (
    <AppShell sidebar={<SpaceTreeSidebar />}>

      <PageHeader
        crumbs={crumbs}
        rightSlot={sub && <div className="ml-2"><PageActionsMenu kind="task" id={sub.id} label={sub.title} /></div>}
      />
      <TaskDetail taskId={subtaskId} />
    </AppShell>
  );
}

