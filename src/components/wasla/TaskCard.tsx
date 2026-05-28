import { Link } from "@tanstack/react-router";
import { Avatar } from "./Avatar";
import { PriorityIcon } from "./PriorityIcon";
import { SpaceTag } from "./PillarTag";
import { SubtaskBadge } from "./SubtaskBadge";
import { spaceById, tasks as allTasks, type Task } from "@/lib/mock-data";
import { useTasks } from "@/lib/tasks-store";
import { routeForTask } from "@/lib/task-nav";
import { getChildren } from "@/lib/task-utils";

export function TaskCard({ task }: { task: Task }) {
  const sp = spaceById(task.spaceId);
  const r = routeForTask(task);
  // Prefer store tasks if available, fall back to seed pool.
  let pool: Task[] = allTasks;
  try { pool = useTasks().tasks; } catch { /* outside provider */ }
  const subCount = getChildren(pool, task.id).length;
  return (
    <Link
      to={r.to as any}
      params={r.params as any}
      className="group block w-full rounded-lg border border-border bg-card p-3 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-foreground/15 hover:shadow-sm"
    >
      <div className="mb-2 flex items-center justify-between">
        <SpaceTag name={sp.name} pillar={sp.pillar} />
        <PriorityIcon priority={task.priority} />
      </div>
      <p className="mb-2 line-clamp-2 text-sm font-medium leading-snug text-foreground">{task.title}</p>
      <div className="mb-2 flex items-center gap-1.5">
        <SubtaskBadge count={subCount} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">{task.id}</span>
        <Avatar memberId={task.assigneeId} size={22} />
      </div>
    </Link>
  );
}

