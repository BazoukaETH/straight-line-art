import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { Home, CheckSquare, Inbox, MessageSquare, Layers, BarChart3, Files, Search, Plus, Bell, Command, Sun, Moon, ChevronRight } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar } from "./Avatar";
import { memberById, type Role } from "@/lib/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TaskSlideOver } from "./TaskSlideOver";
import { CommandPalette } from "./CommandPalette";
import { toast } from "sonner";
import type { ReactNode } from "react";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/tasks", icon: CheckSquare, label: "Tasks" },
  { to: "/inbox", icon: Inbox, label: "Inbox" },
  { to: "/chat", icon: MessageSquare, label: "Chat" },
  { to: "/spaces", icon: Layers, label: "Spaces" },
  { to: "/founder", icon: BarChart3, label: "Founder Dashboard", founderOnly: true },
  { to: "/files", icon: Files, label: "Files" },
] as const;

export function AppShell({ children, sidebar, breadcrumb }: { children: ReactNode; sidebar?: ReactNode; breadcrumb?: ReactNode }) {
  const { role, setRole, currentUserId, dark, toggleDark, setCommandOpen } = useApp();
  const loc = useLocation();
  const me = memberById(currentUserId);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
        {/* Left rail */}
        <aside className="hidden md:flex h-full w-[60px] flex-col items-center justify-between border-r border-border/60 bg-[color:var(--rail)] py-4 text-[color:var(--rail-foreground)]">
          <div className="flex flex-col items-center gap-1">
            <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-accent font-bold text-accent-foreground">W</div>
            {navItems.map((item) => {
              if (item.founderOnly && role !== "founder") return null;
              const active = loc.pathname === item.to || (item.to !== "/" && loc.pathname.startsWith(item.to));
              return (
                <Tooltip key={item.to}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.to}
                      className={cn(
                        "flex size-10 items-center justify-center rounded-lg transition-colors",
                        active ? "bg-white/10 text-white" : "hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <item.icon className="size-[18px]" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            })}
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={() => setCommandOpen(true)} className="flex size-10 items-center justify-center rounded-lg hover:bg-white/5 hover:text-white">
                  <Search className="size-[18px]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Search · ⌘K</TooltipContent>
            </Tooltip>
          </div>
          <div className="flex flex-col items-center gap-2">
            <button onClick={toggleDark} className="flex size-9 items-center justify-center rounded-lg hover:bg-white/5 hover:text-white">
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <Avatar memberId={me.id} size={32} status />
          </div>
        </aside>

        {/* Contextual sidebar */}
        {sidebar && (
          <aside className="hidden lg:flex h-full w-[260px] shrink-0 flex-col border-r border-border/60 bg-sidebar">
            {sidebar}
          </aside>
        )}

        {/* Main */}
        <div className="flex h-full flex-1 flex-col overflow-hidden">
          {/* Top bar */}
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-card/60 px-5 backdrop-blur">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {breadcrumb ?? <span className="font-medium text-foreground">{titleFor(loc.pathname)}</span>}
            </div>
            <div className="flex items-center gap-1.5">
              <Button size="sm" variant="ghost" className="gap-1.5" onClick={() => toast.success("Quick create coming soon")}>
                <Plus className="size-4" /> <span className="hidden sm:inline">New</span>
              </Button>
              <Button size="icon" variant="ghost" onClick={() => toast("3 unread notifications")} className="relative">
                <Bell className="size-4" />
                <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-destructive" />
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => setCommandOpen(true)}>
                <Command className="size-3.5" /> ⌘K
              </Button>
              <div className="mx-2 h-6 w-px bg-border" />
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs text-muted-foreground">View as</span>
                <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                  <SelectTrigger className="h-8 w-[110px] text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="founder">Founder</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Avatar memberId={me.id} size={28} status />
            </div>
          </header>

          {/* Canvas */}
          <main className="flex-1 overflow-y-auto scrollbar-thin">{children}</main>

          {/* Mobile bottom tabs */}
          <nav className="md:hidden flex h-14 shrink-0 items-center justify-around border-t border-border bg-card">
            {[Home, CheckSquare, MessageSquare, Inbox, Layers].map((Icon, i) => {
              const paths = ["/", "/tasks", "/chat", "/inbox", "/spaces"];
              const active = loc.pathname === paths[i];
              return (
                <Link key={i} to={paths[i]} className={cn("flex flex-col items-center gap-0.5 text-[10px]", active ? "text-accent" : "text-muted-foreground")}>
                  <Icon className="size-5" />
                </Link>
              );
            })}
          </nav>
        </div>

        <TaskSlideOver />
        <CommandPalette />
      </div>
    </TooltipProvider>
  );
}

function titleFor(path: string) {
  if (path === "/") return "Home";
  return path.replace("/", "").replace(/^\w/, (c) => c.toUpperCase());
}

export function SidebarHeader({ title }: { title: string }) {
  return (
    <div className="border-b border-border/60 px-4 py-3">
      <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search…" className="h-8 pl-8 text-xs" />
      </div>
    </div>
  );
}

export function SidebarTreeItem({ label, count, active, indent = 0, icon: Icon = ChevronRight }: { label: string; count?: number; active?: boolean; indent?: number; icon?: typeof ChevronRight }) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
        active ? "bg-muted text-foreground" : "text-foreground/75 hover:bg-muted/60",
      )}
      style={{ paddingLeft: 8 + indent * 14 }}
    >
      <Icon className="size-3.5 text-muted-foreground" />
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && <span className="text-[11px] text-muted-foreground">{count}</span>}
    </button>
  );
}
