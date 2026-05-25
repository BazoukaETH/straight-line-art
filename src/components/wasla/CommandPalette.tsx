import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { useApp } from "@/lib/app-context";
import { channels, files, members, tasks } from "@/lib/mock-data";
import { useNavigate } from "@tanstack/react-router";
import { useTaskNav } from "@/lib/task-nav";
import { CheckSquare, File, Hash, User } from "lucide-react";

export function CommandPalette() {
  const { commandOpen, setCommandOpen } = useApp();
  const nav = useNavigate();
  const { goTask } = useTaskNav();
  const go = (path: string) => { setCommandOpen(false); nav({ to: path }); };
  return (
    <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
      <CommandInput placeholder="Search tasks, channels, people, files…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Tasks">
          {tasks.slice(0, 6).map((t) => (
            <CommandItem key={t.id} onSelect={() => { setCommandOpen(false); goTask(t.id); }}>
              <CheckSquare className="mr-2 size-4 text-muted-foreground" /> {t.title}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Channels">
          {channels.map((c) => (
            <CommandItem key={c.id} onSelect={() => go("/chat")}>
              <Hash className="mr-2 size-4 text-muted-foreground" /> {c.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="People">
          {members.map((m) => (
            <CommandItem key={m.id} onSelect={() => go("/founder")}>
              <User className="mr-2 size-4 text-muted-foreground" /> {m.name} <span className="ml-auto text-xs text-muted-foreground">{m.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Files">
          {files.slice(0, 5).map((f) => (
            <CommandItem key={f.id} onSelect={() => go("/files")}>
              <File className="mr-2 size-4 text-muted-foreground" /> {f.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
