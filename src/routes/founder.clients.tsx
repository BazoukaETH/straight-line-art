import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, Search, LayoutGrid, Table as TableIcon, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CLIENT_DIRECTORY_SEED, CLIENT_STATUSES, CLIENT_VENTURES, type ClientRecord } from "@/data/clients";
import { MONEY_IN_SEED } from "@/data/finance";

const STATUS_COLORS: Record<string, string> = {
  Active: "hsl(160,80%,40%)",
  Dormant: "hsl(36,90%,53%)",
  Churned: "hsl(350,75%,50%)",
  Prospect: "hsl(220,95%,47%)",
};

const TEAM_OWNERS = ["Bassel El Aroussy", "Hussein Shahbender", "Usef El Shazly", "Moaz El Sawy", "Ali El Amir"];

const fmtEgp = (n: number) => "EGP " + Math.round(n).toLocaleString();

const emptyClient = (): ClientRecord => ({
  id: "c" + Date.now(),
  name: "", industry: "", venture: "Wasla Solutions", primaryContact: "", role: "",
  email: "", phone: "", website: "", location: "", status: "Active",
  relationshipOwner: "Bassel El Aroussy", firstEngagement: new Date().toISOString().slice(0, 10),
  lastContact: new Date().toISOString().slice(0, 10), totalRevenue: 0,
  servicesProvided: [], notes: "", tags: [],
});

const StatusPill = ({ status }: { status: string }) => {
  const c = STATUS_COLORS[status] || "hsl(220,15%,38%)";
  return <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${c}22`, color: c }}>{status}</span>;
};

const ChipInput = ({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder: string }) => {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (v && !value.includes(v)) onChange([...value, v]);
    setDraft("");
  };
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap gap-1">
        {value.map((v, i) => (
          <span key={i} className="inline-flex items-center gap-1 text-[10px] bg-muted px-2 py-0.5 rounded-full">
            {v}
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive">
              <X className="w-2.5 h-2.5" />
            </button>
          </span>
        ))}
      </div>
      <Input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }} onBlur={add} className="h-7 text-xs" placeholder={placeholder} />
    </div>
  );
};

const Clients = () => {
  const [clients, setClients] = useState<ClientRecord[]>(CLIENT_DIRECTORY_SEED);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("All");
  const [ventureF, setVentureF] = useState("All");
  const [industryF, setIndustryF] = useState("All");
  const [page, setPage] = useState(1);

  const [modal, setModal] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [form, setForm] = useState<ClientRecord>(emptyClient());
  const [pendingDelete, setPendingDelete] = useState<{ idx: number; name: string } | null>(null);

  const industries = useMemo(() => ["All", ...Array.from(new Set(clients.map(c => c.industry).filter(Boolean))).sort()], [clients]);

  const filtered = useMemo(() => {
    return clients.filter(c => {
      if (statusF !== "All" && c.status !== statusF) return false;
      if (ventureF !== "All" && c.venture !== ventureF) return false;
      if (industryF !== "All" && c.industry !== industryF) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.primaryContact.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q) && !c.industry.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [clients, search, statusF, ventureF, industryF]);

  const kpis = useMemo(() => {
    const totalRev = clients.reduce((s, c) => s + c.totalRevenue, 0);
    const active = clients.filter(c => c.status === "Active").length;
    const counts: Record<string, number> = {};
    for (const c of clients) if (c.industry) counts[c.industry] = (counts[c.industry] || 0) + 1;
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return { total: clients.length, active, totalRev, topIndustry: top ? `${top[0]} (${top[1]})` : "-" };
  }, [clients]);

  function openAdd() { setForm(emptyClient()); setEditIdx(null); setModal(true); }
  function openEdit(idx: number) { setForm({ ...clients[idx] }); setEditIdx(idx); setModal(true); }
  function save() {
    if (!form.name.trim()) return;
    if (editIdx !== null) setClients(prev => prev.map((c, i) => i === editIdx ? form : c));
    else setClients(prev => [...prev, form]);
    setModal(false);
  }
  function confirmDelete() {
    if (!pendingDelete) return;
    setClients(prev => prev.filter((_, i) => i !== pendingDelete.idx));
    setPendingDelete(null);
  }

  // Cross-reference revenue from MONEY_IN_SEED for the open form
  const formRevenueFromSheet = useMemo(() => {
    if (!form.name) return 0;
    return MONEY_IN_SEED.filter(r => r.client === form.name).reduce((s, r) => s + r.amount, 0);
  }, [form.name]);

  const PER_PAGE = 25;
  const pageRows = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  return (
    <div className="px-6 py-6 space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-[22px] font-bold text-foreground tracking-tight">Clients Directory</h1>
          <p className="text-xs text-muted-foreground mt-1">Company contacts, relationship history, and engagement tracking</p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">Managed on dashboard · Revenue cross-referenced from Money In</p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5" onClick={openAdd}>
          <Plus className="w-3.5 h-3.5" /> Add Client
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Clients", value: String(kpis.total), color: "hsl(220,95%,47%)" },
          { label: "Active Clients", value: String(kpis.active), color: "hsl(160,80%,40%)" },
          { label: "Total Lifetime Revenue", value: fmtEgp(kpis.totalRev), color: "hsl(168,100%,42%)" },
          { label: "Top Industry", value: kpis.topIndustry, color: "hsl(36,90%,53%)" },
        ].map(k => (
          <div key={k.label} className="bg-card border border-border rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-[3px] h-full" style={{ background: k.color }} />
            <div className="text-[9px] text-muted-foreground/50 font-bold uppercase tracking-wide mb-1">{k.label}</div>
            <div className="text-base font-bold text-foreground tracking-tight truncate">{k.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, contact, email, industry" className="h-8 text-xs pl-8" />
        </div>
        <Select value={statusF} onValueChange={setStatusF}>
          <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All statuses</SelectItem>
            {CLIENT_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={ventureF} onValueChange={setVentureF}>
          <SelectTrigger className="w-[160px] h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All ventures</SelectItem>
            {CLIENT_VENTURES.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={industryF} onValueChange={setIndustryF}>
          <SelectTrigger className="w-[150px] h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {industries.map(i => <SelectItem key={i} value={i}>{i === "All" ? "All industries" : i}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="ml-auto flex bg-muted rounded-lg p-0.5">
          <button onClick={() => setView("grid")} className={`px-2 py-1 rounded-md ${view === "grid" ? "bg-card" : ""}`} title="Grid view"><LayoutGrid className="w-3.5 h-3.5" /></button>
          <button onClick={() => setView("table")} className={`px-2 py-1 rounded-md ${view === "table" ? "bg-card" : ""}`} title="Table view"><TableIcon className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((c, i) => {
            const idx = clients.indexOf(c);
            return (
              <div key={c.id} className="bg-card border border-border rounded-xl p-4 group relative cursor-pointer hover:border-secondary/50 transition-colors" onClick={() => openEdit(idx)}>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); openEdit(idx); }} className="w-5 h-5 rounded flex items-center justify-center bg-muted hover:bg-accent">
                    <Pencil className="w-2.5 h-2.5 text-muted-foreground" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setPendingDelete({ idx, name: c.name }); }} className="w-5 h-5 rounded flex items-center justify-center bg-muted hover:bg-destructive/20">
                    <Trash2 className="w-2.5 h-2.5 text-muted-foreground" />
                  </button>
                </div>
                <div className="text-[14px] font-bold text-foreground mb-1.5">{c.name}</div>
                <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                  <StatusPill status={c.status} />
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "hsl(220,95%,47%,0.15)", color: "hsl(220,95%,47%)" }}>{c.venture}</span>
                </div>
                <div className="text-[10px] text-muted-foreground">{c.industry || "-"}</div>
                {c.primaryContact && <div className="text-[10px] text-muted-foreground/70 mt-1">Contact: {c.primaryContact}</div>}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/40">
                  <div className="text-[10px] text-muted-foreground/60">Last: {c.lastContact || "-"}</div>
                  <div className="text-[11px] font-bold text-foreground tabular-nums">{fmtEgp(c.totalRevenue)}</div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full border border-dashed border-border rounded-xl p-8 text-center text-[11px] text-muted-foreground/60">
              No clients match the current filters.
            </div>
          )}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead><tr className="border-b border-border bg-muted/30">
                {["Name", "Industry", "Venture", "Contact", "Email", "Phone", "Status", "Last Contact", "Total Revenue", ""].map(h => (
                  <th key={h} className="text-left p-2.5 font-semibold text-muted-foreground/60 text-[9px] uppercase tracking-wide">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {pageRows.map((c) => {
                  const idx = clients.indexOf(c);
                  return (
                    <tr key={c.id} className="border-b border-border/30 hover:bg-muted/20">
                      <td className="p-2.5 font-semibold text-foreground">{c.name}</td>
                      <td className="p-2.5 text-muted-foreground">{c.industry || "-"}</td>
                      <td className="p-2.5 text-muted-foreground">{c.venture}</td>
                      <td className="p-2.5 text-muted-foreground">{c.primaryContact || "-"}</td>
                      <td className="p-2.5 text-muted-foreground">{c.email || "-"}</td>
                      <td className="p-2.5 text-muted-foreground">{c.phone || "-"}</td>
                      <td className="p-2.5"><StatusPill status={c.status} /></td>
                      <td className="p-2.5 text-muted-foreground">{c.lastContact || "-"}</td>
                      <td className="p-2.5 text-foreground font-semibold tabular-nums">{fmtEgp(c.totalRevenue)}</td>
                      <td className="p-2.5">
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(idx)} className="w-6 h-6 rounded flex items-center justify-center bg-muted hover:bg-accent"><Pencil className="w-3 h-3 text-muted-foreground" /></button>
                          <button onClick={() => setPendingDelete({ idx, name: c.name })} className="w-6 h-6 rounded flex items-center justify-center bg-muted hover:bg-destructive/20"><Trash2 className="w-3 h-3 text-muted-foreground" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {pageRows.length === 0 && (
                  <tr><td colSpan={10} className="p-6 text-center text-[11px] text-muted-foreground/60">No clients match the current filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-2 border-t border-border text-[10px]">
              <div className="text-muted-foreground/60">Page {page} of {totalPages} · {filtered.length} clients</div>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" className="h-6 text-[10px]" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
                <Button size="sm" variant="outline" className="h-6 text-[10px]" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent className="sm:max-w-[640px] bg-card border-border max-h-[88vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editIdx !== null ? "Edit Client" : "Add Client"}</DialogTitle>
            <DialogDescription>Profile and relationship data managed on the dashboard.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 col-span-2"><label className="text-[10px] text-muted-foreground font-medium">Name *</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Industry</label><Input value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Venture</label>
              <Select value={form.venture} onValueChange={v => setForm({ ...form, venture: v })}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{CLIENT_VENTURES.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Primary Contact</label><Input value={form.primaryContact} onChange={e => setForm({ ...form, primaryContact: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Role</label><Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Email</label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Phone</label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Website</label><Input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Location</label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Status</label>
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{CLIENT_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Relationship Owner</label>
              <Select value={form.relationshipOwner} onValueChange={v => setForm({ ...form, relationshipOwner: v })}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{TEAM_OWNERS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">First Engagement</label><Input type="date" value={form.firstEngagement} onChange={e => setForm({ ...form, firstEngagement: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Last Contact</label><Input type="date" value={form.lastContact} onChange={e => setForm({ ...form, lastContact: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1 col-span-2"><label className="text-[10px] text-muted-foreground font-medium">Services Provided</label>
              <ChipInput value={form.servicesProvided} onChange={v => setForm({ ...form, servicesProvided: v })} placeholder="Type a service and press Enter" />
            </div>
            <div className="space-y-1 col-span-2"><label className="text-[10px] text-muted-foreground font-medium">Tags</label>
              <ChipInput value={form.tags} onChange={v => setForm({ ...form, tags: v })} placeholder="Type a tag and press Enter" />
            </div>
            <div className="space-y-1 col-span-2"><label className="text-[10px] text-muted-foreground font-medium">Notes</label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="text-xs min-h-[60px]" /></div>
          </div>

          <div className="bg-muted rounded-lg p-3 mt-2">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[11px] font-semibold text-foreground">Revenue Summary</div>
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "hsl(220,15%,38%,0.18)", color: "hsl(220,15%,70%)" }}>From sheet · read-only</span>
            </div>
            <div className="text-[10px] text-muted-foreground">
              Revenue from this client (from Money In sheet): <span className="text-foreground font-bold tabular-nums">{fmtEgp(formRevenueFromSheet)}</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" className="text-xs h-8" onClick={() => setModal(false)}>Cancel</Button>
            <Button className="text-xs h-8" onClick={save} disabled={!form.name.trim()}>{editIdx !== null ? "Save" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!pendingDelete} onOpenChange={() => setPendingDelete(null)}>
        <DialogContent className="sm:max-w-[380px] bg-card border-border">
          <DialogHeader>
            <DialogTitle>Remove Client</DialogTitle>
            <DialogDescription>Remove <strong>{pendingDelete?.name}</strong> from the directory?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)} className="text-xs h-8">Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} className="text-xs h-8">Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const Route = createFileRoute("/founder/clients")({ component: Clients });
