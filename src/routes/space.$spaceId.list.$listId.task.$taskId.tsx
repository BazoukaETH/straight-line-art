import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/wasla/AppShell";
import { SpaceTreeSidebar } from "@/components/wasla/SpaceTreeSidebar";
import { PageHeader } from "@/components/wasla/PageHeader";
import { PageActionsMenu } from "@/components/wasla/PageActionsMenu";
import { TaskDetail } from "@/components/wasla/TaskDetail";
import { spaceById, folderById, pillarMeta } from "@/lib/mock-data";
import { useTasks } from "@/lib/tasks-store";
import { usePageTitle } from "@/lib/page-title";

export const Route = createFileRoute("/space/$spaceId/list/$listId/task/$taskId")({ component: TaskPage });

function TaskPage() {
  const { spaceId, listId, taskId } = Route.useParams();
  const { tasks, lists } = useTasks();
  const space = spaceById(spaceId);
  const list = lists.find((l) => l.id === listId);
  const folder = list?.folderId ? folderById(list.folderId) : null;
  const task = tasks.find((t) => t.id === taskId);
  usePageTitle(task ? `${space.name} · ${task.title}` : space.name);

  const crumbs = [
    { label: "Tasks", to: "/tasks" },
    { label: pillarMeta[space.pillar].label },
    { label: space.name, to: "/space/$spaceId", params: { spaceId } as any },
    ...(folder ? [{ label: folder.name, to: "/space/$spaceId/folder/$folderId", params: { spaceId, folderId: folder.id } as any }] : []),
    { label: list?.name ?? "List", to: "/space/$spaceId/list/$listId", params: { spaceId, listId } as any },
    { label: task?.title ?? "Task" },
  ];

  return (
    <AppShell sidebar={<SpaceTreeSidebar />} breadcrumb={<span className="font-medium text-foreground truncate max-w-md">{task?.title}</span>}>
      <PageHeader
        crumbs={crumbs}
        rightSlot={task && <div className="ml-2"><PageActionsMenu kind="task" id={task.id} label={task.title} /></div>}
      />
      <TaskDetail taskId={taskId} />
    </AppShell>
  );
}
