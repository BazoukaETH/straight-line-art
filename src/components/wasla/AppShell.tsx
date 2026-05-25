import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Home, CheckSquare, Inbox, MessageSquare, Layers, BarChart3, Files,
  Search, Plus, Bell, Command, Sun, Moon, ChevronRight,
  BookOpen, Video, CalendarPlus, ClipboardList, Users, Briefcase,
  Globe, CreditCard, Settings as SettingsIcon, ArrowLeft, TrendingUp,
} from "lucide-react";
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
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { QuickCreateModal } from "./QuickCreateModal";
import { BulkActionBar } from "./BulkActionBar";
import { toast } from "sonner";
import { FounderQuickAccess } from "./FounderQuickAccess";
import type { ReactNode } from "react";

type NavItem = { to: string; icon: typeof Home; label: string; founderOnly?: boolean };

const workspaceNav: NavItem[] = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/tasks", icon: CheckSquare, label: "Tasks" },
  { to: "/inbox", icon: Inbox, label: "Inbox" },
  { to: "/chat", icon: MessageSquare, label: "Chat" },
  { to: "/spaces", icon: Layers, label: "Spaces" },
  { to: "/founder", icon: BarChart3, label: "Founder Dashboard", founderOnly: true },
  { to: "/files", icon: Files, label: "Files" },
];

const comingSoonNav: { icon: typeof BookOpen; label: string; tooltip: string }[] = [
  { icon: BookOpen,      label: "Docs",       tooltip: "Coming in Phase 3. Replaces Notion." },
  { icon: Video,         label: "Recordings", tooltip: "Coming in Phase 5. Replaces Loom." },
  { icon: CalendarPlus,  label: "Scheduling", tooltip: "Coming in Phase 6. Replaces Calendly." },
  { icon: ClipboardList, label: "Forms",      tooltip: "Coming in Phase 7. Replaces Typeform." },
  { icon: Users,         label: "CRM",        tooltip: "Coming in Phase 8. Replaces HubSpot / Pipedrive." },
  { icon: Briefcase,     label: "HR",         tooltip: "Coming in Phase 9. Replaces BambooHR." },
];

const orgNav: NavItem[] = [
  { to: "/org",               icon: Globe,         label: "Org Dashboard" },
  { to: "/org/financial",     icon: TrendingUp,    label: "Financial & Portfolio" },
  { to: "/org/members",       icon: Users,         label: "Org Members" },
  { to: "/org/subscriptions", icon: CreditCard,    label: "Subscriptions" },
  { to: "/org/settings",      icon: SettingsIcon,  label: "Org Settings" },
];

export function AppShell({ children, sidebar, breadcrumb }: { children: ReactNode; sidebar?: ReactNode; breadcrumb?: ReactNode }) {
  const { role, setRole, currentUserId, dark, toggleDark, setCommandOpen, openQuickCreate } = useApp();
  const loc = useLocation();
  const nav = useNavigate();
  const me = memberById(currentUserId);
  const inOrg = loc.pathname.startsWith("/org");
  const items = inOrg ? orgNav : workspaceNav.filter((i) => !i.founderOnly || role === "founder");

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
        {/* Top header strip with workspace switcher + top bar */}
        <div className="flex h-14 shrink-0 items-stretch border-b border-border bg-card/60 backdrop-blur">
          {/* Switcher cell */}
          <div className="flex w-[280px] shrink-0 items-center border-r border-border/60 pl-3 pr-2">
            <WorkspaceSwitcher />
          </div>
          {/* Top bar */}
          <header className="flex flex-1 items-center justify-between px-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {inOrg && (
                <Button size="sm" variant="ghost" className="gap-1.5 -ml-2" onClick={() => nav({ to: "/" })}>
                  <ArrowLeft className="size-3.5" /> Back to Wasla Solutions
                </Button>
              )}
              {breadcrumb ?? <span className="font-medium text-foreground">{titleFor(loc.pathname)}</span>}
            </div>
            <div className="flex items-center gap-1.5">
              <Button size="sm" variant="ghost" className="gap-1.5" onClick={() => openQuickCreate({ tab: "task" })}>
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
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left rail */}
          <aside className="hidden md:flex h-full w-[60px] flex-col items-center justify-between border-r border-border/60 bg-[color:var(--rail)] py-4 text-[color:var(--rail-foreground)]">
            <div className="flex flex-col items-center gap-1 overflow-y-auto px-1 scrollbar-thin">
              {role === "founder" && (
                <>
                  <div className="mb-1 w-full px-0.5">
                    <FounderQuickAccess variant="mobile" />
                  </div>
                  <div className="mb-1 h-px w-7 bg-white/15" />
                </>
              )}
              {items.map((item) => {
                const active = loc.pathname === item.to || (item.to !== "/" && item.to !== "/org" && loc.pathname.startsWith(item.to));
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

              {!inOrg && (
                <>
                  <div className="my-2 h-px w-6 bg-white/15" />
                  <div className="mb-1 text-[8px] font-semibold uppercase tracking-wider text-white/40">Soon</div>
                  {comingSoonNav.map((item) => (
                    <Tooltip key={item.label}>
                      <TooltipTrigger asChild>
                        <button
                          aria-disabled
                          onClick={() => toast(item.tooltip)}
                          className="relative flex size-10 cursor-not-allowed items-center justify-center rounded-lg text-white/30 hover:bg-white/5"
                        >
                          <item.icon className="size-[18px]" />
                          <span className="absolute right-0.5 top-0.5 rounded-full bg-white/15 px-1 text-[8px] font-semibold leading-tight text-white/70">·</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-[11px] text-muted-foreground">{item.tooltip}</div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </>
              )}
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
        </div>

        <TaskSlideOver />
        <CommandPalette />
        <QuickCreateModal />
        <BulkActionBar />
      </div>
    </TooltipProvider>
  );
}

function titleFor(path: string) {
  if (path === "/") return "Home";
  if (path === "/org") return "Organization";
  return path.replace(/^\//, "").replace(/\//g, " / ").replace(/^\w/, (c) => c.toUpperCase());
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
