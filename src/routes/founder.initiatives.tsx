import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, Target } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { INITIATIVE_SEED, DECISION_LOG_SEED, INITIATIVE_STATUSES, INITIATIVE_PRIORITIES } from "@/data/initiatives";
import type { Initiative, DecisionLogEntry } from "@/data/initiatives";

const statusColors: Record<string, string> = {
  "Not Started": "hsl(220,15%,38%)", "In Progress": "hsl(220,95%,47%)", "Blocked": "hsl(350,75%,50%)", "Complete": "hsl(160,80%,40%)",
};
const prioColors: Record<string, string> = {
  High: "hsl(350,75%,50%)", Medium: "hsl(36,90%,53%)", Low: "hsl(220,15%,38%)",
};

const Initiatives = () => {
  const [initiatives, setInitiatives] = useState<Initiative[]>(INITIATIVE_SEED);
  const [decisionLog, setDecisionLog] = useState<DecisionLogEntry[]>(DECISION_LOG_SEED);
  const [showDecisions, setShowDecisions] = useState(false);

  const [modal, setModal] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const emptyInit: Initiative = { title: "", owner: "Bassel El Aroussy", targetDate: "", status: "Not Started", priority: "Medium", venture: "Wasla Ventures", blockers: "", notes: "" };
  const [form, setForm] = useState<Initiative>(emptyInit);

  const [decModal, setDecModal] = useState(false);
  const [decForm, setDecForm] = useState<DecisionLogEntry>({ date: "", decision: "", rationale: "", madeBy: "Bassel El Aroussy" });

  const [pendingDelete, setPendingDelete] = useState<{ idx: number; name: string } | null>(null);

  function saveInit() {
    if (!form.title.trim()) return;
    if (editIdx !== null) { setInitiatives(prev => prev.map((ini, i) => i === editIdx ? form : ini)); }
    else { setInitiatives(prev => [...prev, form]); }
    setModal(false);
  }

  function saveDec() {
    if (!decForm.decision.trim()) return;
    setDecisionLog(prev => [decForm, ...prev]);
    setDecModal(false);
    setDecForm({ date: "", decision: "", rationale: "", madeBy: "Bassel El Aroussy" });
  }

  const sortedInits = [...initiatives].sort((a, b) => {
    const pOrder = { High: 0, Medium: 1, Low: 2 };
    const sOrder = { "Blocked": 0, "In Progress": 1, "Not Started": 2, "Complete": 3 };
    return (pOrder[a.priority as keyof typeof pOrder] ?? 2) - (pOrder[b.priority as keyof typeof pOrder] ?? 2)
      || (sOrder[a.status as keyof typeof sOrder] ?? 2) - (sOrder[b.status as keyof typeof sOrder] ?? 2);
  });

  return (
    <div className="px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-foreground tracking-tight">Initiatives</h1>
          <p className="text-xs text-muted-foreground mt-1">Active founder-level priorities and strategic initiatives</p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => { setForm(emptyInit); setEditIdx(null); setModal(true); }}>
          <Plus className="w-3.5 h-3.5" /> Add Initiative
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        {[
          { label: "Total", value: initiatives.length, color: "hsl(220,95%,47%)" },
          { label: "In Progress", value: initiatives.filter(i => i.status === "In Progress").length, color: "hsl(220,95%,47%)" },
          { label: "Blocked", value: initiatives.filter(i => i.status === "Blocked").length, color: "hsl(350,75%,50%)" },
          { label: "Complete", value: initiatives.filter(i => i.status === "Complete").length, color: "hsl(160,80%,40%)" },
        ].map(k => (
          <div key={k.label} className="bg-card rounded-xl p-3.5 border border-border relative overflow-hidden">
            <div className="absolute top-0 left-0 w-[3px] h-full" style={{ background: k.color }} />
            <div className="text-[9px] text-muted-foreground/50 font-bold uppercase tracking-wide mb-1">{k.label}</div>
            <div className="text-xl font-bold text-foreground tracking-tight">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {sortedInits.map((ini, i) => {
          const origIdx = initiatives.indexOf(ini);
          const sc = statusColors[ini.status] || "hsl(220,15%,38%)";
          const pc = prioColors[ini.priority] || "hsl(220,15%,38%)";
          return (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-3.5 h-3.5" style={{ color: sc }} />
                    <span className="text-[13px] font-bold text-foreground">{ini.title}</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>{ini.status}</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${pc}22`, color: pc }}>{ini.priority}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span>Owner: {ini.owner}</span>
                    <span>Target: {ini.targetDate}</span>
                    <span>{ini.venture}</span>
                  </div>
                  {ini.blockers && <div className="text-[10px] mt-1" style={{ color: "hsl(350,75%,50%)" }}>Blocker: {ini.blockers}</div>}
                  {ini.notes && <div className="text-[10px] text-muted-foreground/70 mt-0.5">{ini.notes}</div>}
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <Button variant="outline" size="sm" className="h-6 text-[9px] px-2" onClick={() => { setForm({ ...ini }); setEditIdx(origIdx); setModal(true); }}>
                    <Pencil className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="h-6 text-[9px] px-2 border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => setPendingDelete({ idx: origIdx, name: ini.title })}>
                    <Trash2 className="w-3 h-3 mr-1" /> Remove
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Decision Log */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <button onClick={() => setShowDecisions(!showDecisions)} className="w-full p-4 text-left flex items-center justify-between">
          <div className="text-xs font-semibold text-foreground">Decision Log ({decisionLog.length})</div>
          {showDecisions ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        {showDecisions && (
          <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
            <div className="flex justify-end">
              <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" onClick={() => setDecModal(true)}>
                <Plus className="w-3 h-3" /> Add Decision
              </Button>
            </div>
            {decisionLog.map((d, i) => (
              <div key={i} className="border-b border-border/30 pb-2.5 last:border-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] text-muted-foreground/50">{d.date}</span>
                  <span className="text-[11px] font-semibold text-foreground">{d.decision}</span>
                </div>
                <div className="text-[10px] text-muted-foreground leading-relaxed">{d.rationale}</div>
                <div className="text-[9px] text-muted-foreground/50 mt-0.5">By {d.madeBy}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Initiative Modal */}
      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent className="sm:max-w-[520px] bg-card border-border">
          <DialogHeader><DialogTitle>{editIdx !== null ? "Edit Initiative" : "Add Initiative"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 col-span-2"><label className="text-[10px] text-muted-foreground font-medium">Title *</label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Owner</label><Input value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Target Date</label><Input value={form.targetDate} onChange={e => setForm({ ...form, targetDate: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Status</label>
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{INITIATIVE_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Priority</label>
              <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{INITIATIVE_PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-1 col-span-2"><label className="text-[10px] text-muted-foreground font-medium">Venture</label><Input value={form.venture} onChange={e => setForm({ ...form, venture: e.target.value })} className="h-8 text-xs" /></div>
          </div>
          <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Blockers</label><Input value={form.blockers} onChange={e => setForm({ ...form, blockers: e.target.value })} className="h-8 text-xs" /></div>
          <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Notes</label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="text-xs min-h-[50px]" /></div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setModal(false)} className="text-xs h-8">Cancel</Button>
            <Button onClick={saveInit} disabled={!form.title.trim()} className="text-xs h-8">{editIdx !== null ? "Save" : "Add"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Decision Modal */}
      <Dialog open={decModal} onOpenChange={setDecModal}>
        <DialogContent className="sm:max-w-[480px] bg-card border-border">
          <DialogHeader><DialogTitle>Add Decision</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Date</label><Input value={decForm.date} onChange={e => setDecForm({ ...decForm, date: e.target.value })} placeholder="e.g. Apr 2026" className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Made By</label><Input value={decForm.madeBy} onChange={e => setDecForm({ ...decForm, madeBy: e.target.value })} className="h-8 text-xs" /></div>
          </div>
          <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Decision *</label><Input value={decForm.decision} onChange={e => setDecForm({ ...decForm, decision: e.target.value })} className="h-8 text-xs" /></div>
          <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Rationale</label><Textarea value={decForm.rationale} onChange={e => setDecForm({ ...decForm, rationale: e.target.value })} className="text-xs min-h-[50px]" /></div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setDecModal(false)} className="text-xs h-8">Cancel</Button>
            <Button onClick={saveDec} disabled={!decForm.decision.trim()} className="text-xs h-8">Add</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!pendingDelete} onOpenChange={() => setPendingDelete(null)}>
        <DialogContent className="sm:max-w-[380px] bg-card border-border">
          <DialogHeader>
            <DialogTitle>Remove Initiative</DialogTitle>
            <DialogDescription>Remove <strong>{pendingDelete?.name}</strong>?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)} className="text-xs h-8">Cancel</Button>
            <Button variant="destructive" onClick={() => { if (pendingDelete) { setInitiatives(prev => prev.filter((_, i) => i !== pendingDelete.idx)); setPendingDelete(null); } }} className="text-xs h-8">Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const Route = createFileRoute("/founder/initiatives")({ component: Initiatives });
