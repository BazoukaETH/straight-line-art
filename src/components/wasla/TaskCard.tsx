import { Avatar } from "./Avatar";
import { PriorityIcon } from "./PriorityIcon";
import { SpaceTag } from "./PillarTag";
import { spaceById, type Task } from "@/lib/mock-data";
import { useApp } from "@/lib/app-context";

export function TaskCard({ task }: { task: Task }) {
  const { openTask } = useApp();
  const sp = spaceById(task.spaceId);
  return (
    <button
      onClick={() => openTask(task.id)}
      className="group w-full rounded-lg border border-border bg-card p-3 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-foreground/15 hover:shadow-sm"
    >
      <div className="mb-2 flex items-center justify-between">
        <SpaceTag name={sp.name} pillar={sp.pillar} />
        <PriorityIcon priority={task.priority} />
      </div>
      <p className="mb-3 line-clamp-2 text-sm font-medium leading-snug text-foreground">{task.title}</p>
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">{task.id}</span>
        <Avatar memberId={task.assigneeId} size={22} />
      </div>
    </button>
  );
}
