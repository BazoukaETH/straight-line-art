import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell, SidebarTreeItem } from "@/components/wasla/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/wasla/Avatar";
import { members, workspaces, organization, formatCairoDate } from "@/lib/mock-data";
import { useApp } from "@/lib/app-context";
import { Globe, Users, CreditCard, Settings as SettingsIcon, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/org")({ component: OrgPage });

const tabs = [
  { id: "dashboard",     label: "Org Dashboard",  icon: Globe },
  { id: "members",       label: "Org Members",    icon: Users },
  { id: "subscriptions", label: "Subscriptions",  icon: CreditCard },
  { id: "settings",      label: "Org Settings",   icon: SettingsIcon },
] as const;

type TabId = typeof tabs[number]["id"];

function OrgPage() {
  const { role } = useApp();
  const nav = useNavigate();
  const [active, setActive] = useState<TabId>("dashboard");

  useEffect(() => {
    if (role === "member") nav({ to: "/" });
  }, [role, nav]);

  if (role === "member") return null;

  return (
    <AppShell
      sidebar={
        <div className="px-2 py-3">
          <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {organization.name}
          </div>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm ${active === t.id ? "bg-muted text-foreground" : "text-foreground/75 hover:bg-muted/60"}`}
            >
              <t.icon className="size-3.5 text-muted-foreground" />
              <span className="flex-1">{t.label}</span>
            </button>
          ))}
          <div className="mt-3 border-t border-border/60 pt-2">
            <SidebarTreeItem label="Workspaces" />
            {workspaces.map((w) => (
              <div key={w.id} className="ml-3 border-l border-border/60 pl-1">
                <SidebarTreeItem label={w.name} count={w.comingSoon ? undefined : members.length} />
              </div>
            ))}
          </div>
        </div>
      }
      breadcrumb={<><span>{organization.name}</span><span className="text-border">/</span><span className="font-medium text-foreground capitalize">{active}</span></>}
    >
      <div className="px-6 py-6 max-w-5xl">
        {active === "dashboard" && <Dashboard />}
        {active === "members" && <OrgMembers />}
        {active === "subscriptions" && <Subscriptions />}
        {active === "settings" && <OrgSettings />}
      </div>
    </AppShell>
  );
}

function Dashboard() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{organization.name}</h1>
        <p className="text-sm text-muted-foreground">{formatCairoDate()} · Africa/Cairo</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Workspaces",    value: workspaces.filter(w => !w.comingSoon).length, sub: `${workspaces.length} total` },
          { label: "Org members",   value: members.length,                                sub: "Across all workspaces" },
          { label: "Plan",          value: "Studio",                                      sub: "Renews Jan 2027 · EGP" },
        ].map((s) => (
          <Card key={s.label} className="border-border p-5">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="mt-1 text-2xl font-semibold tracking-tight">{s.value}</div>
            <div className="text-[11px] text-muted-foreground">{s.sub}</div>
          </Card>
        ))}
      </div>
      <Card className="border-border p-5">
        <h3 className="mb-3 text-sm font-semibold">Workspaces</h3>
        <div className="space-y-2">
          {workspaces.map((w) => (
            <div key={w.id} className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
              <div className="flex size-9 items-center justify-center rounded-md bg-[#0B2545] text-sm font-bold text-white">{w.name.charAt(0)}</div>
              <div className="flex-1">
                <div className="font-medium">{w.name}</div>
                <div className="text-xs text-muted-foreground">{w.comingSoon ? "Not active yet" : `${members.length} members`}</div>
              </div>
              {w.comingSoon ? (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">Coming soon</span>
              ) : (
                <Link to="/" className="text-xs text-accent hover:underline">Open →</Link>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function OrgMembers() {
  return (
    <Card className="border-border p-0 overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h2 className="text-base font-semibold">Org Members</h2>
        <Button size="sm" onClick={() => toast.success("Invite link copied")}>Invite to organization</Button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <th className="px-5 py-2">Name</th>
            <th className="px-2 py-2">Workspaces</th>
            <th className="px-2 py-2">Org role</th>
            <th className="px-5 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} className="border-t border-border/60">
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <Avatar memberId={m.id} size={28} />
                  <div>
                    <div className="font-medium">{m.name}</div>
                    <div className="text-[11px] text-muted-foreground">{m.title}</div>
                  </div>
                </div>
              </td>
              <td className="px-2 text-muted-foreground">Wasla Solutions</td>
              <td className="px-2">
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] capitalize">
                  {m.orgFounder ? "Org Founder" : "Member"}
                </span>
              </td>
              <td className="px-5 text-right"><Button size="sm" variant="ghost">Manage</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function Subscriptions() {
  const items = [
    { name: "Wasla OS — Studio plan",  amount: "EGP 14,800 / mo", status: "active" as const },
    { name: "Google Workspace",         amount: "EGP 3,200 / mo",  status: "active" as const },
    { name: "Figma — Org",              amount: "EGP 5,600 / mo",  status: "active" as const },
    { name: "Linear — Standard",        amount: "EGP 2,100 / mo",  status: "trial"  as const },
  ];
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold">Subscriptions</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((i) => (
          <Card key={i.name} className="border-border p-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold">{i.name}</h3>
              <span className={`text-[11px] ${i.status === "active" ? "text-[color:var(--success)]" : "text-[color:var(--warning)]"}`}>{i.status}</span>
            </div>
            <div className="text-sm text-muted-foreground">{i.amount}</div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" className="gap-1.5"><Check className="size-3.5" /> Manage</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function OrgSettings() {
  return (
    <Card className="border-border p-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Organization settings</h2>
        <p className="text-sm text-muted-foreground">High-level settings for {organization.name}.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">Org name</Label>
          <Input defaultValue={organization.name} />
        </div>
        <div>
          <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">Billing currency</Label>
          <Input defaultValue="EGP — Egyptian Pound" />
        </div>
        <div>
          <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">Time zone</Label>
          <Input defaultValue="Africa/Cairo (UTC+2)" />
        </div>
        <div>
          <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">Working days</Label>
          <Input defaultValue="Sun – Thu" />
        </div>
      </div>
      <Button onClick={() => toast.success("Org settings saved")}>Save changes</Button>
    </Card>
  );
}
