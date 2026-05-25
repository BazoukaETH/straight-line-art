import { Link } from "@tanstack/react-router";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "./Avatar";
import { StatusPill } from "./StatusPill";
import { PriorityIcon } from "./PriorityIcon";
import { SpaceTag } from "./PillarTag";
import { spaceById, type Task } from "@/lib/mock-data";
import { routeForTask } from "@/lib/task-nav";

function relativeDue(iso: string) {
  const due = new Date(iso);
  const now = new Date();
  const diff = Math.round((due.getTime() - now.getTime()) / 86400000);
  if (diff < 0) return `Overdue ${Math.abs(diff)}d`;
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff < 7) return due.toLocaleDateString("en-US", { weekday: "short" });
  return due.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function TaskRow({ task }: { task: Task }) {
  const sp = spaceById(task.spaceId);
  const overdue = relativeDue(task.due).startsWith("Overdue");
  const r = routeForTask(task);
  return (
    <Link
      to={r.to as any}
      params={r.params as any}
      className="group flex w-full items-center gap-3 border-b border-border/60 px-4 py-2.5 text-left transition-colors hover:bg-muted/50"
    >
      <Checkbox onClick={(e) => e.stopPropagation()} className="rounded-[5px]" />
      <PriorityIcon priority={task.priority} />
      <span className="flex-1 truncate text-sm font-medium text-foreground">{task.title}</span>
      <SpaceTag name={sp.name} pillar={sp.pillar} />
      <StatusPill status={task.status} />
      <span className={`w-20 text-xs ${overdue ? "text-destructive" : "text-muted-foreground"}`}>{relativeDue(task.due)}</span>
      <Avatar memberId={task.assigneeId} size={24} />
    </Link>
  );
}
