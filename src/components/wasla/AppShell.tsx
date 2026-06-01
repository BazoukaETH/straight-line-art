import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Home, CheckSquare, Inbox, MessageSquare, BarChart3, Files,
  Search, Plus, Bell, Command, Sun, Moon, ChevronRight,
  Contact2,
} from "lucide-react";

import { useApp } from "@/lib/app-context";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar } from "./Avatar";
import { memberById, inboxItems, type Role } from "@/lib/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SmartCapture } from "./SmartCapture";
import { CommandPalette } from "./CommandPalette";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { QuickCreateModal } from "./QuickCreateModal";
import { BulkActionBar } from "./BulkActionBar";

import { FounderQuickAccess } from "./FounderQuickAccess";
import { setNav } from "@/lib/nav-bridge";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";


const LS_COLLAPSED = "wasla.sidebar.collapsed";

type SidebarCtx = { collapsed: boolean; toggle: () => void; setCollapsed: (b: boolean) => void };
const SidebarCollapseCtx = createContext<SidebarCtx>({ collapsed: false, toggle: () => {}, setCollapsed: () => {} });
export const useSidebarCollapse = () => useContext(SidebarCollapseCtx);

type NavItem = { to: string; icon: typeof Home; label: string; founderOnly?: boolean };

const workspaceNav: NavItem[] = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/tasks", icon: CheckSquare, label: "Tasks" },
  { to: "/inbox", icon: Inbox, label: "Inbox" },
  { to: "/chat", icon: MessageSquare, label: "Chat" },
  { to: "/clients", icon: Contact2, label: "Clients" },
  { to: "/founder", icon: BarChart3, label: "Founder Dashboard", founderOnly: true },
  { to: "/files", icon: Files, label: "Files" },
];


export function AppShell({ children, sidebar, breadcrumb }: { children: ReactNode; sidebar?: ReactNode; breadcrumb?: ReactNode }) {
  const { role, setRole, currentUserId, dark, toggleDark, setCommandOpen, openQuickCreate } = useApp();
  const loc = useLocation();
  const nav = useNavigate();
  const me = memberById(currentUserId);
  const items = workspaceNav.filter((i) => !i.founderOnly || role === "founder");
  const unreadCount = inboxItems.filter((i) => i.unread).length;
  const showDevTools = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("devTools");
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(LS_COLLAPSED) === "1";
  });
  useEffect(() => { localStorage.setItem(LS_COLLAPSED, collapsed ? "1" : "0"); }, [collapsed]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setCollapsed((c) => !c);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const sidebarCtx: SidebarCtx = { collapsed, toggle: () => setCollapsed((c) => !c), setCollapsed };

  return (
    <SidebarCollapseCtx.Provider value={sidebarCtx}>
    <TooltipProvider delayDuration={200}>
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
        {/* Top header strip with workspace switcher + top bar — slim, single-line */}
        <div className="flex h-11 shrink-0 items-stretch border-b border-border bg-card/60 backdrop-blur">
          {/* Switcher cell */}
          <div className="flex h-full w-[208px] shrink-0 items-center border-r border-border/60 pl-2.5 pr-1.5">
            <WorkspaceSwitcher />
          </div>
          {/* Top bar */}
          <header className="flex flex-1 items-center justify-between gap-2 px-3 min-w-0">
            {/* Left: breadcrumb (truncates instead of wrapping) */}
            <div className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground whitespace-nowrap overflow-hidden">
              <div className="truncate font-medium text-foreground">
                {breadcrumb ?? <span>{titleFor(loc.pathname)}</span>}
              </div>
            </div>
            {/* Right: actions (never wraps) */}
            <div className="flex shrink-0 items-center gap-1 flex-nowrap whitespace-nowrap">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openQuickCreate({ tab: "task" })}>
                    <Plus className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>New</TooltipContent>
              </Tooltip>
              <Button size="icon" variant="ghost" onClick={() => nav({ to: "/inbox" })} className="relative h-7 w-7">
                <Bell className="size-4" />
                {unreadCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
              <Button size="sm" variant="outline" className="h-7 gap-1 px-2 text-[11px]" onClick={() => setCommandOpen(true)}>
                <Command className="size-3" /> ⌘K
              </Button>
              {showDevTools && (
                <>
                  <div className="mx-1 h-5 w-px bg-border" />
                  <div className="hidden sm:flex items-center gap-1.5">
                    <span className="text-[11px] text-muted-foreground">View as</span>
                    <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                      <SelectTrigger className="h-7 w-[100px] text-[11px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="founder">Founder</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              <div className="md:hidden"><FounderQuickAccess variant="mobile" /></div>
              <Avatar memberId={me.id} size={26} status />
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

          {/* Contextual sidebar — narrower default + smooth collapse */}
          {sidebar && (
            <aside
              className={cn(
                "hidden lg:flex h-full shrink-0 flex-col border-r border-border/60 bg-sidebar transition-[width] duration-200",
                collapsed ? "w-[44px]" : "w-[220px]",
              )}
            >
              {sidebar}
            </aside>
          )}

          {/* Main */}
          <div className="flex h-full flex-1 flex-col overflow-hidden min-w-0">
            <main key={loc.pathname} className="wasla-fade-in flex-1 overflow-y-auto scrollbar-thin">{children}</main>
            <SmartCapture />


            {/* Mobile bottom tabs */}
            <nav className="md:hidden flex h-14 shrink-0 items-center justify-around border-t border-border bg-card">
              {[Home, CheckSquare, MessageSquare, Inbox].map((Icon, i) => {
                const paths = ["/", "/tasks", "/chat", "/inbox"];
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

        <NavBridge />
        <CommandPalette />
        <QuickCreateModal />
        <BulkActionBar />
      </div>
    </TooltipProvider>
    </SidebarCollapseCtx.Provider>
  );
}

function titleFor(path: string) {
  if (path === "/") return "Home";
  
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

function NavBridge() {
  const nav = useNavigate();
  useEffect(() => {
    setNav((opts: any) => nav(opts));
    return () => setNav(null);
  }, [nav]);
  return null;
}
