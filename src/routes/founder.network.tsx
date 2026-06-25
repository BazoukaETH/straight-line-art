import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Plus, Pencil, X, UserCircle, Briefcase, Users, Eye, Lock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { INVESTOR_SEED, CAP_TABLE_SEED, ADVISOR_BOARD_SEED, PARTNER_SEED } from "@/data/network";
import type { Investor, CapTableEntry, AdvisorBoard, Partner } from "@/data/network";

const statusColors: Record<string, string> = {
  Confirmed: "hsl(160,80%,40%)", Pending: "hsl(36,90%,53%)", Committed: "hsl(220,95%,47%)",
};
const typeColors: Record<string, string> = {
  Founder: "hsl(220,95%,47%)", "Co-founder": "hsl(168,100%,42%)", "Core Team": "hsl(160,80%,40%)",
  Advisor: "hsl(250,60%,60%)", Advisory: "hsl(250,60%,60%)", "F&F Investor": "hsl(36,90%,53%)",
  Strategic: "hsl(330,80%,60%)", Institutional: "hsl(350,75%,50%)", "Parent Holdco": "hsl(220,95%,47%)",
  Reserve: "hsl(220,15%,38%)", ESOP: "hsl(168,100%,42%)", "Minority Stake": "hsl(330,80%,60%)", External: "hsl(220,15%,38%)",
};
const relColors: Record<string, string> = {
  Active: "hsl(160,80%,40%)", Warm: "hsl(36,90%,53%)", Cold: "hsl(220,15%,50%)", Introduced: "hsl(220,95%,47%)",
};

const fmtPct = (n: number) => (n * 100).toFixed(2) + "%";
const fmtEgp = (n: number) => "EGP " + Math.round(n).toLocaleString();

const CAP_TABLE_ENTITIES = Object.keys(CAP_TABLE_SEED);

const ReadOnlyBadge = ({ text }: { text: string }) => (
  <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "hsl(220,15%,38%,0.18)", color: "hsl(220,15%,70%)" }}>
    <Lock className="w-2.5 h-2.5" /> {text}
  </span>
);

const Network = () => {
  const [tab, setTab] = useState<"investors" | "advisors" | "partners">("investors");
  const [investors, setInvestors] = useState<Investor[]>(INVESTOR_SEED);
  const [advisorBoard, setAdvisorBoard] = useState<AdvisorBoard[]>(ADVISOR_BOARD_SEED);
  const [partners, setPartners] = useState<Partner[]>(PARTNER_SEED);
  const [showCapTable, setShowCapTable] = useState(false);
  const [capEntity, setCapEntity] = useState("Wasla Ventures");

  // Investor modal
  const [investorModal, setInvestorModal] = useState(false);
  const [editInvIdx, setEditInvIdx] = useState<number | null>(null);
  const [profileIdx, setProfileIdx] = useState<number | null>(null);
  const emptyInvestor: Investor = { name: "", type: "F&F Investor", entity: "Wasla Ventures", whatTheyDo: "", email: "", phone: "", specialty: "", relationshipStatus: "Warm", lastContact: "", preferredComm: "Email", notes: "" };
  const [invForm, setInvForm] = useState<Investor>(emptyInvestor);

  // Advisor modal
  const [advModal, setAdvModal] = useState(false);
  const [editAdvIdx, setEditAdvIdx] = useState<number | null>(null);
  const emptyAdvisor: AdvisorBoard = { name: "", role: "", entity: "Wasla Ventures", terms: "", email: "", phone: "", specialty: "", notes: "" };
  const [advForm, setAdvForm] = useState<AdvisorBoard>(emptyAdvisor);

  // Partner modal
  const [partnerModal, setPartnerModal] = useState(false);
  const [editPartIdx, setEditPartIdx] = useState<number | null>(null);
  const emptyPartner: Partner = { name: "", type: "", relationship: "", contact: "", email: "", phone: "", notes: "" };
  const [partForm, setPartForm] = useState<Partner>(emptyPartner);

  const [pendingDelete, setPendingDelete] = useState<{ type: string; idx: number; name: string } | null>(null);

  function saveInvestor() {
    if (!invForm.name.trim()) return;
    if (editInvIdx !== null) setInvestors(prev => prev.map((inv, i) => i === editInvIdx ? invForm : inv));
    else setInvestors(prev => [...prev, invForm]);
    setInvestorModal(false);
  }
  function saveAdvisorBoard() {
    if (!advForm.name.trim()) return;
    if (editAdvIdx !== null) setAdvisorBoard(prev => prev.map((a, i) => i === editAdvIdx ? advForm : a));
    else setAdvisorBoard(prev => [...prev, advForm]);
    setAdvModal(false);
  }
  function savePartner() {
    if (!partForm.name.trim()) return;
    if (editPartIdx !== null) setPartners(prev => prev.map((p, i) => i === editPartIdx ? partForm : p));
    else setPartners(prev => [...prev, partForm]);
    setPartnerModal(false);
  }
  function confirmDelete() {
    if (!pendingDelete) return;
    if (pendingDelete.type === "investor") setInvestors(prev => prev.filter((_, i) => i !== pendingDelete.idx));
    else if (pendingDelete.type === "advisor") setAdvisorBoard(prev => prev.filter((_, i) => i !== pendingDelete.idx));
    else if (pendingDelete.type === "partner") setPartners(prev => prev.filter((_, i) => i !== pendingDelete.idx));
    setPendingDelete(null);
  }

  // Cap table read-only summary
  const capRows = useMemo(() => {
    const rows = CAP_TABLE_SEED[capEntity] || [];
    return [...rows].sort((a, b) => b.ownershipPct - a.ownershipPct);
  }, [capEntity]);
  const capSummary = useMemo(() => {
    const totalCommitted = capRows.reduce((s, r) => s + r.capitalCommitted, 0);
    const totalPaid = capRows.reduce((s, r) => s + r.capitalPaid, 0);
    const totalOutstanding = capRows.reduce((s, r) => s + r.outstanding, 0);
    return { count: capRows.length, totalCommitted, totalPaid, totalOutstanding };
  }, [capRows]);

  // Find cap-table financial data for a profile
  function capDataFor(name: string, entity: string): CapTableEntry | undefined {
    return (CAP_TABLE_SEED[entity] || []).find(r => r.shareholder === name);
  }

  const tabs = [
    { id: "investors" as const, l: "Investors", icon: UserCircle },
    { id: "advisors" as const, l: "Advisors & Board", icon: Briefcase },
    { id: "partners" as const, l: "Partners", icon: Users },
  ];

  const profileInv = profileIdx !== null ? investors[profileIdx] : null;
  const profileCap = profileInv ? capDataFor(profileInv.name, profileInv.entity) : undefined;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-bold text-foreground tracking-tight">Network</h1>
        <p className="text-xs text-muted-foreground mt-1">Investor relations, advisors, board, and strategic partners</p>
        <p className="text-[10px] text-muted-foreground/60 mt-1">Profiles managed on dashboard</p>
      </div>

      <div className="flex gap-0 border-b border-border">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-[11px] font-medium transition-colors border-b-2 -mb-px ${tab === t.id ? "text-foreground border-primary" : "text-muted-foreground border-transparent hover:text-foreground"}`}>
            {t.l}
          </button>
        ))}
      </div>

      {/* INVESTORS */}
      {tab === "investors" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground">{investors.length} investors and stakeholders</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" onClick={() => setShowCapTable(!showCapTable)}>
                <Eye className="w-3 h-3" /> {showCapTable ? "Hide" : "View"} Cap Table
              </Button>
              <Button size="sm" className="h-7 text-[10px] gap-1" onClick={() => { setInvForm(emptyInvestor); setEditInvIdx(null); setInvestorModal(true); }}>
                <Plus className="w-3 h-3" /> Add Investor
              </Button>
            </div>
          </div>

          {showCapTable && (
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-semibold text-foreground">Cap Table</div>
                  <div className="text-[10px] text-muted-foreground/60 mt-0.5">Source: Wasla Ventures Master Google Sheet · Cap Table tab · Financial data read-only</div>
                </div>
                <div className="flex items-center gap-2">
                  <ReadOnlyBadge text="Read-only · Edit in Google Sheet" />
                  <Select value={capEntity} onValueChange={setCapEntity}>
                    <SelectTrigger className="w-[180px] h-7 text-[10px]"><SelectValue /></SelectTrigger>
                    <SelectContent>{CAP_TABLE_ENTITIES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="bg-muted rounded-lg p-2.5">
                  <div className="text-[8px] text-muted-foreground/60 uppercase tracking-wide">Shareholders</div>
                  <div className="text-[13px] font-bold text-foreground mt-0.5">{capSummary.count}</div>
                </div>
                <div className="bg-muted rounded-lg p-2.5">
                  <div className="text-[8px] text-muted-foreground/60 uppercase tracking-wide">Total Committed</div>
                  <div className="text-[13px] font-bold text-foreground mt-0.5">{fmtEgp(capSummary.totalCommitted)}</div>
                </div>
                <div className="bg-muted rounded-lg p-2.5">
                  <div className="text-[8px] text-muted-foreground/60 uppercase tracking-wide">Total Paid</div>
                  <div className="text-[13px] font-bold mt-0.5" style={{ color: "hsl(160,80%,40%)" }}>{fmtEgp(capSummary.totalPaid)}</div>
                </div>
                <div className="bg-muted rounded-lg p-2.5">
                  <div className="text-[8px] text-muted-foreground/60 uppercase tracking-wide">Total Outstanding</div>
                  <div className="text-[13px] font-bold mt-0.5" style={{ color: capSummary.totalOutstanding > 0 ? "hsl(350,75%,50%)" : "hsl(220,15%,55%)" }}>{fmtEgp(capSummary.totalOutstanding)}</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead><tr className="border-b border-border">
                    {["Shareholder", "Role", "Ownership", "Committed", "Paid", "Outstanding", "Round", "Valuation", "Status", "Notes"].map(h => (
                      <th key={h} className="text-left p-2 font-semibold text-muted-foreground/50 text-[9px] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {capRows.map((row, i) => (
                      <tr key={i} className="border-b border-border/30">
                        <td className="p-2 font-semibold text-foreground">{row.shareholder}</td>
                        <td className="p-2"><span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${typeColors[row.roleCategory] || "hsl(220,15%,38%)"}22`, color: typeColors[row.roleCategory] || "hsl(220,15%,38%)" }}>{row.roleCategory}</span></td>
                        <td className="p-2 font-bold tabular-nums" style={{ color: "hsl(220,95%,47%)" }}>{fmtPct(row.ownershipPct)}</td>
                        <td className="p-2 text-muted-foreground tabular-nums">{row.capitalCommitted ? fmtEgp(row.capitalCommitted) : "-"}</td>
                        <td className="p-2 text-muted-foreground tabular-nums">{row.capitalPaid ? fmtEgp(row.capitalPaid) : "-"}</td>
                        <td className="p-2 tabular-nums font-semibold" style={{ color: row.outstanding > 0 ? "hsl(350,75%,50%)" : "hsl(220,15%,55%)" }}>{row.outstanding ? fmtEgp(row.outstanding) : "-"}</td>
                        <td className="p-2 text-muted-foreground">{row.roundStage}</td>
                        <td className="p-2 text-muted-foreground">{row.valuationAtEntry}</td>
                        <td className="p-2"><span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${statusColors[row.status] || "hsl(220,15%,38%)"}22`, color: statusColors[row.status] || "hsl(220,15%,38%)" }}>{row.status}</span></td>
                        <td className="p-2 text-muted-foreground/70 max-w-[220px]">{row.notes || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {investors.map((inv, i) => {
              const tc = typeColors[inv.type] || "hsl(220,15%,38%)";
              const rc = relColors[inv.relationshipStatus] || "hsl(220,15%,38%)";
              return (
                <div key={i} className="bg-card border border-border rounded-xl p-4 group relative cursor-pointer hover:border-secondary/50 transition-colors" onClick={() => setProfileIdx(i)}>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); setInvForm({ ...inv }); setEditInvIdx(i); setInvestorModal(true); }} className="w-5 h-5 rounded flex items-center justify-center bg-muted hover:bg-accent transition-colors">
                      <Pencil className="w-2.5 h-2.5 text-muted-foreground" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setPendingDelete({ type: "investor", idx: i, name: inv.name }); }} className="w-5 h-5 rounded flex items-center justify-center bg-muted hover:bg-destructive/20 transition-colors">
                      <X className="w-2.5 h-2.5 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="text-[13px] font-bold text-foreground mb-2">{inv.name}</div>
                  <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${tc}22`, color: tc }}>{inv.type}</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${rc}22`, color: rc }}>{inv.relationshipStatus}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">{inv.entity}</div>
                  {inv.whatTheyDo && <div className="text-[10px] text-muted-foreground/70 mt-1.5">{inv.whatTheyDo}</div>}
                  {(inv.email || inv.phone) && (
                    <div className="text-[10px] text-muted-foreground/60 mt-1.5">
                      {inv.email && <div>{inv.email}</div>}
                      {inv.phone && <div>{inv.phone}</div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ADVISORS & BOARD */}
      {tab === "advisors" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground">{advisorBoard.length} advisors and board members</p>
            <Button size="sm" className="h-7 text-[10px] gap-1" onClick={() => { setAdvForm(emptyAdvisor); setEditAdvIdx(null); setAdvModal(true); }}>
              <Plus className="w-3 h-3" /> Add Advisor
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {advisorBoard.map((a, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 group relative">
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setAdvForm({ ...a }); setEditAdvIdx(i); setAdvModal(true); }} className="w-5 h-5 rounded flex items-center justify-center bg-muted hover:bg-accent transition-colors"><Pencil className="w-2.5 h-2.5 text-muted-foreground" /></button>
                  <button onClick={() => setPendingDelete({ type: "advisor", idx: i, name: a.name })} className="w-5 h-5 rounded flex items-center justify-center bg-muted hover:bg-destructive/20 transition-colors"><X className="w-2.5 h-2.5 text-muted-foreground" /></button>
                </div>
                <div className="text-[13px] font-bold text-foreground mb-0.5">{a.name}</div>
                <div className="text-[10px] font-semibold mb-1.5" style={{ color: "hsl(220,95%,47%)" }}>{a.role}</div>
                <div className="text-[10px] text-muted-foreground mb-1">{a.entity}</div>
                <div className="text-[10px] text-muted-foreground/70">{a.terms}</div>
                {a.specialty && <div className="text-[10px] text-muted-foreground/50 mt-1">{a.specialty}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PARTNERS */}
      {tab === "partners" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground">{partners.length} strategic partners</p>
            <Button size="sm" className="h-7 text-[10px] gap-1" onClick={() => { setPartForm(emptyPartner); setEditPartIdx(null); setPartnerModal(true); }}>
              <Plus className="w-3 h-3" /> Add Partner
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {partners.map((p, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 group relative">
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setPartForm({ ...p }); setEditPartIdx(i); setPartnerModal(true); }} className="w-5 h-5 rounded flex items-center justify-center bg-muted hover:bg-accent transition-colors"><Pencil className="w-2.5 h-2.5 text-muted-foreground" /></button>
                  <button onClick={() => setPendingDelete({ type: "partner", idx: i, name: p.name })} className="w-5 h-5 rounded flex items-center justify-center bg-muted hover:bg-destructive/20 transition-colors"><X className="w-2.5 h-2.5 text-muted-foreground" /></button>
                </div>
                <div className="text-[13px] font-bold text-foreground mb-0.5">{p.name}</div>
                <div className="text-[10px] font-semibold mb-1" style={{ color: "hsl(168,100%,42%)" }}>{p.type}</div>
                <div className="text-[10px] text-muted-foreground mb-1">{p.relationship}</div>
                <div className="text-[10px] text-muted-foreground/50">Contact: {p.contact || "-"}</div>
                {p.notes && <div className="text-[10px] text-muted-foreground/70 mt-1">{p.notes}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Investor Profile Modal (hybrid: read-only sheet + editable profile) */}
      <Dialog open={profileIdx !== null} onOpenChange={(o) => !o && setProfileIdx(null)}>
        <DialogContent className="sm:max-w-[640px] bg-card border-border max-h-[85vh] overflow-y-auto">
          {profileInv && (
            <>
              <DialogHeader>
                <DialogTitle>{profileInv.name}</DialogTitle>
                <DialogDescription>{profileInv.type} · {profileInv.entity}</DialogDescription>
              </DialogHeader>

              {/* Read-only financial section */}
              <div className="bg-muted rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-semibold text-foreground">Equity & Capital</div>
                  <ReadOnlyBadge text="Source: Sheet" />
                </div>
                {profileCap ? (
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div><span className="text-muted-foreground/60">Ownership:</span> <span className="text-foreground font-bold tabular-nums">{fmtPct(profileCap.ownershipPct)}</span></div>
                    <div><span className="text-muted-foreground/60">Round:</span> <span className="text-foreground">{profileCap.roundStage}</span></div>
                    <div><span className="text-muted-foreground/60">Status:</span> <span className="text-foreground">{profileCap.status}</span></div>
                    <div><span className="text-muted-foreground/60">Committed:</span> <span className="text-foreground tabular-nums">{fmtEgp(profileCap.capitalCommitted)}</span></div>
                    <div><span className="text-muted-foreground/60">Paid:</span> <span className="text-foreground tabular-nums">{fmtEgp(profileCap.capitalPaid)}</span></div>
                    <div><span className="text-muted-foreground/60">Outstanding:</span> <span className="font-semibold tabular-nums" style={{ color: profileCap.outstanding > 0 ? "hsl(350,75%,50%)" : "hsl(220,15%,55%)" }}>{fmtEgp(profileCap.outstanding)}</span></div>
                    <div className="col-span-3"><span className="text-muted-foreground/60">Valuation at entry:</span> <span className="text-foreground">{profileCap.valuationAtEntry}</span></div>
                  </div>
                ) : (
                  <div className="text-[10px] text-muted-foreground/60">No matching cap table entry for {profileInv.entity}.</div>
                )}
              </div>

              {/* Editable profile section */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-foreground">Relationship & Contact</div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div><span className="text-muted-foreground/60">What they do:</span> <span className="text-foreground">{profileInv.whatTheyDo || "-"}</span></div>
                  <div><span className="text-muted-foreground/60">Specialty:</span> <span className="text-foreground">{profileInv.specialty || "-"}</span></div>
                  <div><span className="text-muted-foreground/60">Email:</span> <span className="text-foreground">{profileInv.email || "-"}</span></div>
                  <div><span className="text-muted-foreground/60">Phone:</span> <span className="text-foreground">{profileInv.phone || "-"}</span></div>
                  <div><span className="text-muted-foreground/60">Status:</span> <span className="text-foreground">{profileInv.relationshipStatus}</span></div>
                  <div><span className="text-muted-foreground/60">Preferred:</span> <span className="text-foreground">{profileInv.preferredComm}</span></div>
                  <div><span className="text-muted-foreground/60">Last contact:</span> <span className="text-foreground">{profileInv.lastContact || "-"}</span></div>
                </div>
                {profileInv.notes && <div className="text-[10px] text-muted-foreground/70 pt-1">{profileInv.notes}</div>}
              </div>

              <DialogFooter>
                <Button variant="outline" className="text-xs h-8" onClick={() => setProfileIdx(null)}>Close</Button>
                <Button className="text-xs h-8" onClick={() => { setInvForm({ ...profileInv }); setEditInvIdx(profileIdx); setProfileIdx(null); setInvestorModal(true); }}>Edit Profile</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Investor Add/Edit Modal (profile-only fields) */}
      <Dialog open={investorModal} onOpenChange={setInvestorModal}>
        <DialogContent className="sm:max-w-[600px] bg-card border-border max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editInvIdx !== null ? "Edit Investor" : "Add Investor"}</DialogTitle>
            <DialogDescription>Equity, capital, round, and valuation are sourced from the sheet and edited there.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Name *</label><Input value={invForm.name} onChange={e => setInvForm({ ...invForm, name: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Type</label>
              <Select value={invForm.type} onValueChange={(v) => setInvForm({ ...invForm, type: v })}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Founder", "Co-founder", "Core Team", "F&F Investor", "Strategic", "Institutional", "Advisor"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Entity</label>
              <Select value={invForm.entity} onValueChange={(v) => setInvForm({ ...invForm, entity: v })}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{CAP_TABLE_ENTITIES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Relationship Status</label>
              <Select value={invForm.relationshipStatus} onValueChange={(v) => setInvForm({ ...invForm, relationshipStatus: v })}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{["Active", "Warm", "Cold", "Introduced"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1 col-span-2"><label className="text-[10px] text-muted-foreground font-medium">What they do</label><Input value={invForm.whatTheyDo} onChange={e => setInvForm({ ...invForm, whatTheyDo: e.target.value })} className="h-8 text-xs" placeholder="e.g. Managing Director at XYZ Bank" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Email</label><Input value={invForm.email} onChange={e => setInvForm({ ...invForm, email: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Phone</label><Input value={invForm.phone} onChange={e => setInvForm({ ...invForm, phone: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Preferred Communication</label>
              <Select value={invForm.preferredComm} onValueChange={(v) => setInvForm({ ...invForm, preferredComm: v })}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{["Email", "Phone", "WhatsApp", "In-person"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Last Contact</label><Input type="date" value={invForm.lastContact} onChange={e => setInvForm({ ...invForm, lastContact: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1 col-span-2"><label className="text-[10px] text-muted-foreground font-medium">Specialty</label><Input value={invForm.specialty} onChange={e => setInvForm({ ...invForm, specialty: e.target.value })} className="h-8 text-xs" /></div>
          </div>
          <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Notes</label><Textarea value={invForm.notes} onChange={e => setInvForm({ ...invForm, notes: e.target.value })} className="text-xs min-h-[60px]" /></div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setInvestorModal(false)} className="text-xs h-8">Cancel</Button>
            <Button onClick={saveInvestor} disabled={!invForm.name.trim()} className="text-xs h-8">{editInvIdx !== null ? "Save" : "Add"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Advisor Modal */}
      <Dialog open={advModal} onOpenChange={setAdvModal}>
        <DialogContent className="sm:max-w-[480px] bg-card border-border">
          <DialogHeader><DialogTitle>{editAdvIdx !== null ? "Edit Advisor" : "Add Advisor"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Name *</label><Input value={advForm.name} onChange={e => setAdvForm({ ...advForm, name: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Role</label><Input value={advForm.role} onChange={e => setAdvForm({ ...advForm, role: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Entity</label><Input value={advForm.entity} onChange={e => setAdvForm({ ...advForm, entity: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Terms</label><Input value={advForm.terms} onChange={e => setAdvForm({ ...advForm, terms: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Specialty</label><Input value={advForm.specialty} onChange={e => setAdvForm({ ...advForm, specialty: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Email</label><Input value={advForm.email} onChange={e => setAdvForm({ ...advForm, email: e.target.value })} className="h-8 text-xs" /></div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setAdvModal(false)} className="text-xs h-8">Cancel</Button>
            <Button onClick={saveAdvisorBoard} disabled={!advForm.name.trim()} className="text-xs h-8">{editAdvIdx !== null ? "Save" : "Add"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Partner Modal */}
      <Dialog open={partnerModal} onOpenChange={setPartnerModal}>
        <DialogContent className="sm:max-w-[480px] bg-card border-border">
          <DialogHeader><DialogTitle>{editPartIdx !== null ? "Edit Partner" : "Add Partner"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Name *</label><Input value={partForm.name} onChange={e => setPartForm({ ...partForm, name: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Type</label><Input value={partForm.type} onChange={e => setPartForm({ ...partForm, type: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Contact</label><Input value={partForm.contact} onChange={e => setPartForm({ ...partForm, contact: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Email</label><Input value={partForm.email} onChange={e => setPartForm({ ...partForm, email: e.target.value })} className="h-8 text-xs" /></div>
          </div>
          <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Relationship</label><Input value={partForm.relationship} onChange={e => setPartForm({ ...partForm, relationship: e.target.value })} className="h-8 text-xs" /></div>
          <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Notes</label><Textarea value={partForm.notes} onChange={e => setPartForm({ ...partForm, notes: e.target.value })} className="text-xs min-h-[50px]" /></div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setPartnerModal(false)} className="text-xs h-8">Cancel</Button>
            <Button onClick={savePartner} disabled={!partForm.name.trim()} className="text-xs h-8">{editPartIdx !== null ? "Save" : "Add"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!pendingDelete} onOpenChange={() => setPendingDelete(null)}>
        <DialogContent className="sm:max-w-[380px] bg-card border-border">
          <DialogHeader>
            <DialogTitle>Remove Entry</DialogTitle>
            <DialogDescription>Remove <strong>{pendingDelete?.name}</strong>?</DialogDescription>
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

export const Route = createFileRoute("/founder/network")({ component: Network });
