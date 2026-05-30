import { createFileRoute, Outlet, useNavigate, useLocation, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/wasla/AppShell";
import { useApp } from "@/lib/app-context";
import { organization } from "@/lib/mock-data";
import { LayoutDashboard, Rocket, Briefcase, Contact2, DollarSign, Users, Globe, BarChart3, Target, FileText, Settings as SettingsIcon } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/founder")({ component: FounderLayout });

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; disabled?: boolean };

const navItems: NavItem[] = [
  { to: "/founder",              label: "Command Center", icon: LayoutDashboard },
  { to: "/founder/ventures",     label: "Ventures",       icon: Rocket },
  { to: "/founder/pipeline",     label: "Pipeline",       icon: Briefcase },
  { to: "/founder/clients",      label: "Clients",        icon: Contact2,     disabled: true },
  { to: "/founder/finance",      label: "Finance",        icon: DollarSign,   disabled: true },
  { to: "/founder/team",         label: "Team",           icon: Users,        disabled: true },
  { to: "/founder/network",      label: "Network",        icon: Globe },
  { to: "/founder/market-intel", label: "Market Intel",   icon: BarChart3,    disabled: true },
  { to: "/founder/initiatives",  label: "Initiatives",    icon: Target },
  { to: "/founder/documents",    label: "Documents",      icon: FileText,     disabled: true },
  { to: "/founder/settings",     label: "Settings",       icon: SettingsIcon, disabled: true },
];

function FounderLayout() {
  const { role } = useApp();
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    if (role !== "founder") nav({ to: "/" });
  }, [role, nav]);

  if (role !== "founder") return null;

  return (
    <AppShell
      sidebar={
        <div className="px-2 py-3">
          <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {organization.name} · Founder
          </div>
          {navItems.map((item) => {
            const active = loc.pathname === item.to;
            if (item.disabled) {
              return (
                <div
                  key={item.to}
                  title="Coming soon — being ported"
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm cursor-not-allowed text-muted-foreground/40"
                >
                  <item.icon className="size-3.5" />
                  <span className="flex-1">{item.label}</span>
                  <span className="text-[9px] uppercase tracking-wider">soon</span>
                </div>
              );
            }
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm ${active ? "bg-muted text-foreground" : "text-foreground/75 hover:bg-muted/60"}`}
              >
                <item.icon className="size-3.5 text-muted-foreground" />
                <span className="flex-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      }
    >
      <Outlet />
    </AppShell>
  );
}
