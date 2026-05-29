import { Link } from "@tanstack/react-router";
import {
  Building2, Calendar, Mail, Phone, ExternalLink, Crown,
  FileText, FolderOpen, Briefcase, TrendingUp, Users, Handshake, Target, StickyNote,
} from "lucide-react";
import { memberById, egp, type Space, type SpaceProfile as Profile } from "@/lib/mock-data";
import { Avatar } from "./Avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function SectionHeader({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      <Icon className="size-3.5" /> {label}
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-lg border border-border bg-card p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]", className)}>
      {children}
    </section>
  );
}

function KV({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/50 py-2 last:border-b-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">{value ?? "—"}</span>
    </div>
  );
}

const statusColors: Record<NonNullable<Profile["status"]>, string> = {
  active: "bg-emerald-100 text-emerald-700",
  pilot: "bg-blue-100 text-blue-700",
  paused: "bg-amber-100 text-amber-700",
  churned: "bg-red-100 text-red-700",
};

function StatusPill({ s }: { s?: Profile["status"] }) {
  if (!s) return <>—</>;
  return <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium capitalize", statusColors[s])}>{s}</span>;
}

function HealthDot({ h }: { h?: Profile["health"] }) {
  if (!h) return <>—</>;
  const color = h === "green" ? "bg-emerald-500" : h === "yellow" ? "bg-amber-500" : "bg-red-500";
  return <span className="inline-flex items-center gap-1.5 text-sm capitalize"><span className={cn("size-2 rounded-full", color)} />{h}</span>;
}

function LinksCard({ links }: { links?: Profile["links"] }) {
  if (!links?.length) return null;
  return (
    <Card>
      <SectionHeader icon={FolderOpen} label="Linked resources" />
      <ul className="space-y-1.5">
        {links.map((l, i) => (
          <li key={i}>
            <a href={l.url} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 text-sm text-foreground hover:text-accent">
              <FileText className="size-3.5 text-muted-foreground" />
              <span className="underline-offset-2 group-hover:underline">{l.label}</span>
              <ExternalLink className="size-3 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function NotesCard({ notes }: { notes?: string }) {
  if (!notes) return null;
  return (
    <Card>
      <SectionHeader icon={StickyNote} label="Notes" />
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">{notes}</p>
    </Card>
  );
}

function OwnerLine({ id }: { id?: string }) {
  if (!id) return <span className="text-sm text-muted-foreground">—</span>;
  const m = memberById(id);
  return (
    <span className="inline-flex items-center gap-2">
      <Avatar memberId={m.id} size={22} />
      <span className="text-sm font-medium">{m.name}</span>
    </span>
  );
}

/* ----------------- Client ----------------- */
function ClientView({ p }: { p: Profile }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <SectionHeader icon={Briefcase} label="Engagement" />
        <KV label="Type" value={<span className="capitalize">{p.type ?? "—"}</span>} />
        <KV label="Status" value={<StatusPill s={p.status} />} />
        <KV label="Health" value={<HealthDot h={p.health} />} />
        <KV label="Owner" value={<OwnerLine id={p.ownerId} />} />
        <KV label="Industry" value={p.industry ? <span className="inline-flex items-center gap-1.5"><Building2 className="size-3.5 text-muted-foreground" />{p.industry}</span> : "—"} />
        <KV label="Start date" value={p.startDate ? <span className="inline-flex items-center gap-1.5"><Calendar className="size-3.5 text-muted-foreground" />{new Date(p.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span> : "—"} />
        <KV label="Renewal" value={p.renewalDate ? <span className="inline-flex items-center gap-1.5"><Calendar className="size-3.5 text-muted-foreground" />{new Date(p.renewalDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span> : "—"} />
        <KV label="Contract value" value={p.contractValue != null ? egp(p.contractValue) : "—"} />
      </Card>

      <Card>
        <SectionHeader icon={Users} label="Contacts" />
        {p.contacts?.length ? (
          <ul className="space-y-3">
            {p.contacts.map((c) => (
              <li key={c.id} className="rounded-md border border-border/60 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-semibold">{c.name}{c.primary && <span className="ml-2 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">Primary</span>}</div>
                </div>
                <div className="text-xs text-muted-foreground">{c.role}</div>
                <div className="mt-1.5 flex flex-wrap gap-3 text-xs">
                  {c.email && <a href={`mailto:${c.email}`} className="inline-flex items-center gap-1 text-foreground/80 hover:text-accent"><Mail className="size-3" />{c.email}</a>}
                  {c.phone && <a href={`tel:${c.phone}`} className="inline-flex items-center gap-1 text-foreground/80 hover:text-accent"><Phone className="size-3" />{c.phone}</a>}
                </div>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted-foreground">No contacts yet.</p>}
      </Card>

      <LinksCard links={p.links} />
      <NotesCard notes={p.notes} />
    </div>
  );
}

/* ----------------- Venture ----------------- */
function VentureView({ p }: { p: Profile }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <SectionHeader icon={TrendingUp} label="Stage & Progress" />
        <KV label="Stage" value={p.stage ?? "—"} />
        <KV label="Status" value={<StatusPill s={p.status} />} />
        <KV label="Health" value={<HealthDot h={p.health} />} />
        <KV label="Owner" value={<OwnerLine id={p.ownerId} />} />
        <KV label="MRR" value={p.mrr != null ? egp(p.mrr) : "—"} />
        {p.progress?.map((r) => <KV key={r.label} label={r.label} value={r.value} />)}
      </Card>

      <Card>
        <SectionHeader icon={Crown} label="Investors" />
        {p.investors?.length ? (
          <ul className="space-y-2">
            {p.investors.map((i) => (
              <li key={i.name} className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2">
                <span className="text-sm font-medium">{i.name}</span>
                <span className="text-xs text-muted-foreground">{i.status}</span>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted-foreground">No investors yet.</p>}
      </Card>

      <Card>
        <SectionHeader icon={Handshake} label="Partners" />
        {p.partners?.length ? (
          <ul className="space-y-2">
            {p.partners.map((i) => (
              <li key={i.name} className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2">
                <span className="text-sm font-medium">{i.name}</span>
                <span className="text-xs text-muted-foreground">{i.role}</span>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted-foreground">No partners yet.</p>}
      </Card>

      <LinksCard links={p.links} />
      <NotesCard notes={p.notes} />
    </div>
  );
}

/* ----------------- Internal ----------------- */
function InternalView({ p }: { p: Profile }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <SectionHeader icon={Target} label="Purpose" />
        <p className="text-sm leading-relaxed text-foreground/85">{p.purpose ?? "—"}</p>
      </Card>
      <Card>
        <SectionHeader icon={Crown} label="Owner" />
        <OwnerLine id={p.ownerId} />
      </Card>
      <LinksCard links={p.links} />
      <NotesCard notes={p.notes} />
    </div>
  );
}

export function SpaceProfile({ space }: { space: Space }) {
  const p = space.profile;
  if (!p) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
        <div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground"><Briefcase className="size-5" /></div>
        <div className="text-sm font-medium">No profile yet</div>
        <div className="text-xs text-muted-foreground">Add details so the team knows the context at a glance.</div>
        <Button size="sm" className="mt-2" onClick={() => toast("Profile editing coming soon")}>Set up profile</Button>
      </div>
    );
  }
  if (space.pillar === "client")   return <ClientView p={p} />;
  if (space.pillar === "ventures") return <VentureView p={p} />;
  return <InternalView p={p} />;
}
