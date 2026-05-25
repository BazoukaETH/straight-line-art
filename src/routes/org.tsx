import { createFileRoute, Outlet, useNavigate, useLocation, Link } from "@tanstack/react-router";
import { AppShell, SidebarTreeItem } from "@/components/wasla/AppShell";
import { useApp } from "@/lib/app-context";
import { organization, workspaces } from "@/lib/mock-data";
import { Globe, TrendingUp, Users, CreditCard, Settings as SettingsIcon } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/org")({ component: OrgLayout });

const navItems = [
  { to: "/org",               label: "Org Dashboard",       icon: Globe },
  { to: "/org/financial",     label: "Financial & Portfolio", icon: TrendingUp },
  { to: "/org/members",       label: "Org Members",         icon: Users },
  { to: "/org/subscriptions", label: "Subscriptions",       icon: CreditCard },
  { to: "/org/settings",      label: "Org Settings",        icon: SettingsIcon },
];

function OrgLayout() {
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
            {organization.name}
          </div>
          {navItems.map((t) => {
            const active = loc.pathname === t.to;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm ${active ? "bg-muted text-foreground" : "text-foreground/75 hover:bg-muted/60"}`}
              >
                <t.icon className="size-3.5 text-muted-foreground" />
                <span className="flex-1">{t.label}</span>
              </Link>
            );
          })}
          <div className="mt-3 border-t border-border/60 pt-2">
            <SidebarTreeItem label="Workspaces" />
            {workspaces.map((w) => (
              <div key={w.id} className="ml-3 border-l border-border/60 pl-1">
                <SidebarTreeItem label={w.name} />
              </div>
            ))}
          </div>
        </div>
      }
    >
      <Outlet />
    </AppShell>
  );
}
