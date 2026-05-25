import { useApp } from "@/lib/app-context";
import { useTasks } from "@/lib/tasks-store";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { members, spaces, folders as foldersSeed, type Status, type Priority } from "@/lib/mock-data";
import { Trash2, Copy, FolderOutput, UserCog, Flag, CircleDot, Tag, X } from "lucide-react";
import { toast } from "sonner";

const STATUSES: Status[] = ["Backlog", "To Do", "In Progress", "In Review", "Blocked", "Done"];
const PRIORITIES: Priority[] = ["urgent", "high", "normal", "low"];

export function BulkActionBar() {
  const { selectedTaskIds, clearSelection } = useApp();
  const { lists, bulkUpdate, bulkDelete, duplicateTasks, moveTask } = useTasks();
  if (!selectedTaskIds.length) return null;
  const n = selectedTaskIds.length;
  return (
    <div className="pointer-events-auto fixed bottom-4 left-1/2 z-40 -translate-x-1/2 animate-in slide-in-from-bottom-4">
      <div className="flex items-center gap-1 rounded-full border border-border bg-popover px-2 py-1.5 shadow-2xl">
        <div className="px-3 text-xs font-semibold">{n} task{n > 1 ? "s" : ""} selected</div>
        <div className="mx-1 h-5 w-px bg-border" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button size="sm" variant="ghost" className="gap-1.5 h-7 text-xs"><CircleDot className="size-3.5" /> Status</Button></DropdownMenuTrigger>
          <DropdownMenuContent>
            {STATUSES.map((s) => <DropdownMenuItem key={s} onClick={() => { bulkUpdate(selectedTaskIds, { status: s }); toast.success(`Status → ${s}`); }}>{s}</DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button size="sm" variant="ghost" className="gap-1.5 h-7 text-xs"><UserCog className="size-3.5" /> Assignee</Button></DropdownMenuTrigger>
          <DropdownMenuContent>
            {members.map((m) => <DropdownMenuItem key={m.id} onClick={() => { bulkUpdate(selectedTaskIds, { assigneeId: m.id }); toast.success(`Assigned to ${m.name}`); }}>{m.name}</DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button size="sm" variant="ghost" className="gap-1.5 h-7 text-xs"><Flag className="size-3.5" /> Priority</Button></DropdownMenuTrigger>
          <DropdownMenuContent>
            {PRIORITIES.map((p) => <DropdownMenuItem key={p} className="capitalize" onClick={() => { bulkUpdate(selectedTaskIds, { priority: p }); toast.success(`Priority → ${p}`); }}>{p}</DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button size="sm" variant="ghost" className="gap-1.5 h-7 text-xs"><Tag className="size-3.5" /> Tag</Button></DropdownMenuTrigger>
          <DropdownMenuContent>
            {["urgent", "design", "bug", "launch", "marketing"].map((t) => <DropdownMenuItem key={t} onClick={() => { bulkUpdate(selectedTaskIds, { tags: [t] }); toast.success(`Tag #${t} applied`); }}>#{t}</DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button size="sm" variant="ghost" className="gap-1.5 h-7 text-xs"><FolderOutput className="size-3.5" /> Move</Button></DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-80 overflow-y-auto">
            {spaces.map((s) => (
              <div key={s.id}>
                <DropdownMenuLabel className="text-[10px] uppercase">{s.name}</DropdownMenuLabel>
                {lists.filter((l) => l.spaceId === s.id).map((l) => {
                  const f = foldersSeed.find((x) => x.id === l.folderId);
                  return (
                    <DropdownMenuItem key={l.id} onClick={() => {
                      selectedTaskIds.forEach((id) => moveTask(id, l.id));
                      toast.success(`Moved to ${l.name}`);
                      clearSelection();
                    }}>
                      {f ? `${f.name} / ${l.name}` : l.name}
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuSeparator />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size="sm" variant="ghost" className="gap-1.5 h-7 text-xs" onClick={() => { duplicateTasks(selectedTaskIds); toast.success(`Duplicated ${n} task${n>1?"s":""}`); }}>
          <Copy className="size-3.5" /> Duplicate
        </Button>
        <Button size="sm" variant="ghost" className="gap-1.5 h-7 text-xs text-destructive hover:text-destructive" onClick={() => {
          if (confirm(`Delete ${n} task${n>1?"s":""}?`)) { bulkDelete(selectedTaskIds); toast.success(`Deleted ${n} task${n>1?"s":""}`); clearSelection(); }
        }}>
          <Trash2 className="size-3.5" /> Delete
        </Button>
        <div className="mx-1 h-5 w-px bg-border" />
        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={clearSelection}><X className="size-3.5" /> Clear</Button>
      </div>
    </div>
  );
}
