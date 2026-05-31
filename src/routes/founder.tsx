import { createFileRoute, Outlet, useNavigate, useLocation, Link } from "@tanstack/react-router";
import { AppShell, useSidebarCollapse } from "@/components/wasla/AppShell";
import { useApp } from "@/lib/app-context";
import { organization } from "@/lib/mock-data";
import { LayoutDashboard, Rocket, Briefcase, Contact2, DollarSign, Users, Globe, BarChart3, Target, Bot, FileText, Settings as SettingsIcon, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useEffect } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const Route = createFileRoute("/founder")({ component: FounderLayout });

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard };

const navItems: NavItem[] = [
  { to: "/founder",              label: "Command Center", icon: LayoutDashboard },
  { to: "/founder/ventures",     label: "Ventures",       icon: Rocket },
  { to: "/founder/pipeline",     label: "Pipeline",       icon: Briefcase },
  { to: "/founder/clients",      label: "Clients",        icon: Contact2 },
  { to: "/founder/finance",      label: "Finance",        icon: DollarSign },
  { to: "/founder/team",         label: "Team",           icon: Users },
  { to: "/founder/network",      label: "Network",        icon: Globe },
  { to: "/founder/market-intel", label: "Market Intel",   icon: BarChart3 },
  { to: "/founder/initiatives",  label: "Initiatives",    icon: Target },
  { to: "/founder/ai-agents",    label: "AI Agents",      icon: Bot },
  { to: "/founder/documents",    label: "Documents",      icon: FileText },
  { to: "/founder/settings",     label: "Settings",       icon: SettingsIcon },
];

function FounderSidebar() {
  const { collapsed, toggle } = useSidebarCollapse();
  const loc = useLocation();

  if (collapsed) {
    return (
      <div className="flex h-full flex-col items-center gap-1 py-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggle}
              className="mb-1 flex size-8 items-center justify-center rounded-md border border-border/60 bg-card text-foreground hover:bg-muted"
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="size-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Expand (⌘B)</TooltipContent>
        </Tooltip>
        {navItems.map((item) => {
          const active = loc.pathname === item.to;
          return (
            <Tooltip key={item.to}>
              <TooltipTrigger asChild>
                <Link
                  to={item.to}
                  className={`flex size-8 items-center justify-center rounded-md transition-colors ${active ? "bg-muted text-foreground" : "text-foreground/70 hover:bg-muted/60 hover:text-foreground"}`}
                >
                  <item.icon className="size-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-border/50 px-2.5 py-2">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground truncate">
          {organization.name} · Founder
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggle}
              className="flex size-7 items-center justify-center rounded-md border border-border/60 bg-card text-foreground hover:bg-muted shrink-0"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="size-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Collapse (⌘B)</TooltipContent>
        </Tooltip>
      </div>
      <div className="flex-1 overflow-y-auto px-1.5 py-2 scrollbar-thin">
        {navItems.map((item) => {
          const active = loc.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] ${active ? "bg-muted text-foreground font-medium" : "text-foreground/75 hover:bg-muted/60"}`}
            >
              <item.icon className="size-3.5 text-muted-foreground shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function FounderLayout() {
  const { role } = useApp();
  const nav = useNavigate();

  useEffect(() => {
    if (role !== "founder") nav({ to: "/" });
  }, [role, nav]);

  if (role !== "founder") return null;

  return (
    <AppShell sidebar={<FounderSidebar />}>
      <Outlet />
    </AppShell>
  );
}
