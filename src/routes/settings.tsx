import { createFileRoute } from "@tanstack/react-router";
import { AppShell, SidebarTreeItem } from "@/components/wasla/AppShell";
import { members, pillarMeta, type Pillar, type Role } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar } from "@/components/wasla/Avatar";
import { Building2, Building, Users, Layers, Plug, BellRing, CreditCard, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

const sections = [
  { id: "company", label: "Company", icon: Building },
  { id: "workspace", label: "Workspace", icon: Building2 },
  { id: "members", label: "Members & Roles", icon: Users },
  { id: "pillars", label: "Pillars", icon: Layers },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "notifications", label: "Notifications", icon: BellRing },
  { id: "billing", label: "Billing", icon: CreditCard },
];

function SettingsPage() {
  const [active, setActive] = useState("workspace");
  return (
    <AppShell
      breadcrumb={<><span>Settings</span><span className="text-border">/</span><span className="font-medium text-foreground capitalize">{active}</span></>}
      sidebar={
        <div className="px-2 py-3">
          <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Admin</div>
          {sections.map((s) => (
            <button key={s.id} onClick={() => setActive(s.id)} className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm ${active === s.id ? "bg-muted text-foreground" : "text-foreground/75 hover:bg-muted/60"}`}>
              <s.icon className="size-3.5 text-muted-foreground" />{s.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="px-6 py-5 max-w-3xl">
        {active === "company" && <Company />}
        {active === "workspace" && <Workspace />}
        {active === "members" && <Members />}
        {active === "pillars" && <Pillars />}
        {active === "integrations" && <Integrations />}
        {active === "notifications" && <Notifications />}
        {active === "billing" && <Billing />}
      </div>
    </AppShell>
  );
}

function Workspace() {
  return (
    <Card className="border-border p-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Workspace</h2>
        <p className="text-sm text-muted-foreground">Settings for the Wasla workspace.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Workspace name" defaultValue="Wasla Solutions" />
        <Field label="Time zone" defaultValue="Africa/Cairo (UTC+2)" />
      </div>
      <div>
        <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">Working days</Label>
        <div className="flex flex-wrap gap-2">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d, i) => (
            <button key={d} className={`rounded-md border px-3 py-1.5 text-xs font-medium ${i >= 0 && i <= 4 ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground"}`}>{d}</button>
          ))}
        </div>
      </div>
      <div>
        <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">Logo</Label>
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-lg bg-accent font-bold text-accent-foreground">W</div>
          <Button variant="outline" size="sm">Upload new logo</Button>
        </div>
      </div>
      <Button onClick={() => toast.success("Workspace settings saved")}>Save changes</Button>
    </Card>
  );
}

function Members() {
  return (
    <Card className="border-border p-0 overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h2 className="text-base font-semibold">Members & Roles</h2>
        <Button size="sm">Invite member</Button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <th className="px-5 py-2">Name</th>
            <th className="px-2 py-2">Pillar</th>
            <th className="px-2 py-2">Role</th>
            <th className="px-5 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} className="border-t border-border/60">
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <Avatar memberId={m.id} size={28} />
                  <div><div className="font-medium">{m.name}</div><div className="text-[11px] text-muted-foreground">{m.title}</div></div>
                </div>
              </td>
              <td className="px-2"><span className="capitalize">{pillarMeta[m.pillar as Pillar].label}</span></td>
              <td className="px-2">
                <Select defaultValue={m.role}>
                  <SelectTrigger className="h-8 w-[120px] text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["founder","manager","member"] as Role[]).map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </td>
              <td className="px-5 text-right"><Button size="sm" variant="ghost">Remove</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function Pillars() {
  return (
    <Card className="border-border p-6 space-y-3">
      <h2 className="text-lg font-semibold">Pillars</h2>
      <p className="text-sm text-muted-foreground">Pillars are fixed in V1.</p>
      {(Object.keys(pillarMeta) as Pillar[]).map((p) => (
        <div key={p} className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
          <span className="size-3 rounded-full" style={{ backgroundColor: pillarMeta[p].color }} />
          <span className="font-medium">{pillarMeta[p].label}</span>
          <span className="ml-auto text-xs text-muted-foreground">Read-only</span>
        </div>
      ))}
    </Card>
  );
}

function Integrations() {
  const integrations = [
    { name: "Google Drive", status: "connected" as const, desc: "Sync files and folders" },
    { name: "Google Calendar", status: "connected" as const, desc: "Today's meetings on Home" },
    { name: "WhatsApp", status: "disconnected" as const, desc: "Mirror channels to WA groups" },
    { name: "Gmail", status: "connected" as const, desc: "Send digests and replies" },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {integrations.map((i) => (
        <Card key={i.name} className="border-border p-5">
          <div className="mb-3 flex items-center gap-2">
            <h3 className="font-semibold">{i.name}</h3>
            <span className={`ml-auto inline-flex items-center gap-1.5 text-xs ${i.status === "connected" ? "text-[color:var(--success)]" : "text-muted-foreground"}`}>
              <span className={`size-1.5 rounded-full ${i.status === "connected" ? "bg-[color:var(--success)]" : "bg-muted-foreground"}`} />
              {i.status}
            </span>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">{i.desc}</p>
          {i.status === "connected" ? (
            <Button variant="outline" size="sm" className="gap-1.5"><Check className="size-3.5" /> Connected</Button>
          ) : <Button size="sm">Connect</Button>}
        </Card>
      ))}
    </div>
  );
}

function Notifications() {
  return (
    <Card className="border-border p-6 space-y-3">
      <h2 className="text-lg font-semibold">Notification defaults</h2>
      {["@mentions", "Task assignments", "Status changes", "BOD/EOD reminders", "Weekly digest"].map((r) => (
        <div key={r} className="flex items-center justify-between border-b border-border/60 py-2 last:border-0">
          <span className="text-sm">{r}</span>
          <Select defaultValue="push"><SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="push">Push + Email</SelectItem><SelectItem value="email">Email only</SelectItem><SelectItem value="off">Off</SelectItem></SelectContent>
          </Select>
        </div>
      ))}
    </Card>
  );
}

function Billing() {
  return (
    <Card className="border-border p-6">
      <h2 className="text-lg font-semibold">Billing</h2>
      <p className="text-sm text-muted-foreground">Billing setup will live here in V2.</p>
    </Card>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</Label>
      <Input defaultValue={defaultValue} />
    </div>
  );
}
