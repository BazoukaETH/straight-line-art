import { createFileRoute, Outlet, useChildMatches, useRouter } from "@tanstack/react-router";
import { AppShell } from "@/components/wasla/AppShell";
import { SpaceTreeSidebar } from "@/components/wasla/SpaceTreeSidebar";
import { PageHeader } from "@/components/wasla/PageHeader";
import { PageActionsMenu } from "@/components/wasla/PageActionsMenu";
import { TaskDetail } from "@/components/wasla/TaskDetail";
import { spaceById, folderById, pillarMeta } from "@/lib/mock-data";
import { useTasks } from "@/lib/tasks-store";
import { usePageTitle } from "@/lib/page-title";
import { Button } from "@/components/ui/button";
import { Share2, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/space/$spaceId/list/$listId/task/$taskId")({ component: TaskPage });

function TaskPage() {
  const childMatches = useChildMatches();
  if (childMatches.length > 0) return <Outlet />;
  const { spaceId, listId, taskId } = Route.useParams();
  const { tasks, lists, updateTask } = useTasks();
  const router = useRouter();
  const space = spaceById(spaceId);
  const list = lists.find((l) => l.id === listId);
  const folder = list?.folderId ? folderById(list.folderId) : null;
  const task = tasks.find((t) => t.id === taskId);
  usePageTitle(task ? `${space.name} · ${task.title}` : space.name);

  const crumbs = [
    { label: pillarMeta[space.pillar].label },
    { label: space.name, to: "/space/$spaceId", params: { spaceId } as any },
    ...(folder ? [{ label: folder.name, to: "/space/$spaceId/folder/$folderId", params: { spaceId, folderId: folder.id } as any }] : []),
    { label: list?.name ?? "List", to: "/space/$spaceId/list/$listId", params: { spaceId, listId } as any },
    { label: task?.title ?? "Task" },
  ];

  const created = task?.createdAt ? new Date(task.createdAt) : null;
  const isDone = task?.status === "Done";

  return (
    <AppShell sidebar={<SpaceTreeSidebar />}>
      <PageHeader
        crumbs={crumbs}
        rightSlot={task && (
          <div className="ml-2 flex items-center gap-1">
            {created && (
              <span className="hidden md:inline text-[11px] text-muted-foreground">
                Created {created.toLocaleDateString("en-US", { day: "numeric", month: "short" })}
              </span>
            )}
            <Button
              size="sm"
              variant={isDone ? "secondary" : "default"}
              className="gap-1.5 h-8"
              onClick={() => { updateTask(task.id, { status: isDone ? "To Do" : "Done" }); toast.success(isDone ? "Reopened" : "Marked done"); }}
            >
              <CheckCircle2 className="size-3.5" /> {isDone ? "Reopen" : "Mark Done"}
            </Button>
            <Button size="icon" variant="ghost" className="size-8" aria-label="Share" onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied"); }}>
              <Share2 className="size-4" />
            </Button>
            <PageActionsMenu kind="task" id={task.id} label={task.title} />
            <Button size="icon" variant="ghost" className="size-8" aria-label="Close" onClick={() => router.history.back()}>
              <X className="size-4" />
            </Button>
          </div>
        )}
      />

      <TaskDetail taskId={taskId} />
    </AppShell>
  );
}
