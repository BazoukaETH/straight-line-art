import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Plus, Pencil, Trash2, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DOCUMENT_SEED, DOCUMENT_CATEGORIES, DOCUMENT_STATUSES } from "@/data/documents";
import type { DocumentEntry } from "@/data/documents";

const statusColors: Record<string, string> = {
  Draft: "hsl(220,15%,38%)", Pending: "hsl(36,90%,53%)", Active: "hsl(160,80%,40%)", Current: "hsl(220,95%,47%)", Archived: "hsl(220,15%,38%)",
};

const Documents = () => {
  const [docs, setDocs] = useState<DocumentEntry[]>(DOCUMENT_SEED);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [modal, setModal] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const emptyDoc: DocumentEntry = { title: "", category: "Legal", status: "Draft", url: "", lastUpdated: "", notes: "" };
  const [form, setForm] = useState<DocumentEntry>(emptyDoc);
  const [pendingDelete, setPendingDelete] = useState<{ idx: number; name: string } | null>(null);

  function saveDoc() {
    if (!form.title.trim()) return;
    if (editIdx !== null) { setDocs(prev => prev.map((d, i) => i === editIdx ? form : d)); }
    else { setDocs(prev => [...prev, form]); }
    setModal(false);
  }

  const grouped = DOCUMENT_CATEGORIES.map(cat => ({
    category: cat,
    items: docs.map((d, i) => ({ ...d, _idx: i })).filter(d => d.category === cat),
  }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-foreground tracking-tight">Documents</h1>
          <p className="text-xs text-muted-foreground mt-1">Categorized document directory with Google Drive links</p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => { setForm(emptyDoc); setEditIdx(null); setModal(true); }}>
          <Plus className="w-3.5 h-3.5" /> Add Document
        </Button>
      </div>

      {grouped.map(group => (
        <div key={group.category} className="bg-card border border-border rounded-xl overflow-hidden">
          <button onClick={() => setCollapsed(prev => ({ ...prev, [group.category]: !prev[group.category] }))}
            className="w-full p-4 text-left flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" style={{ color: "hsl(220,95%,47%)" }} />
              <span className="text-xs font-semibold text-foreground">{group.category}</span>
              <span className="text-[9px] text-muted-foreground/50">{group.items.length} documents</span>
            </div>
            {collapsed[group.category] ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronUp className="w-4 h-4 text-muted-foreground" />}
          </button>
          {!collapsed[group.category] && (
            <div className="px-4 pb-4 space-y-2">
              {group.items.map((doc) => {
                const sc = statusColors[doc.status] || "hsl(220,15%,38%)";
                return (
                  <div key={doc._idx} className="flex items-center justify-between bg-muted rounded-lg p-3 group">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-foreground">{doc.title}</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>{doc.status}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[9px] text-muted-foreground/50">
                        {doc.lastUpdated && <span>Updated: {doc.lastUpdated}</span>}
                        {doc.notes && <span>- {doc.notes}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {doc.url && (
                        <a href={doc.url} target="_blank" rel="noreferrer" className="p-1 rounded hover:bg-accent" onClick={e => e.stopPropagation()}>
                          <ExternalLink className="w-3 h-3 text-muted-foreground" />
                        </a>
                      )}
                      <button onClick={() => { setForm({ ...doc }); setEditIdx(doc._idx); setModal(true); }} className="p-1 rounded hover:bg-accent">
                        <Pencil className="w-3 h-3 text-muted-foreground" />
                      </button>
                      <button onClick={() => setPendingDelete({ idx: doc._idx, name: doc.title })} className="p-1 rounded hover:bg-destructive/20">
                        <Trash2 className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}

      {/* Document Modal */}
      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent className="sm:max-w-[480px] bg-card border-border">
          <DialogHeader><DialogTitle>{editIdx !== null ? "Edit Document" : "Add Document"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 col-span-2"><label className="text-[10px] text-muted-foreground font-medium">Title *</label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Category</label>
              <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{DOCUMENT_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Status</label>
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{DOCUMENT_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            </div>
          </div>
          <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Google Drive URL</label><Input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://drive.google.com/..." className="h-8 text-xs" /></div>
          <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Last Updated</label><Input value={form.lastUpdated} onChange={e => setForm({ ...form, lastUpdated: e.target.value })} placeholder="e.g. Apr 2026" className="h-8 text-xs" /></div>
          <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Notes</label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="text-xs min-h-[40px]" /></div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setModal(false)} className="text-xs h-8">Cancel</Button>
            <Button onClick={saveDoc} disabled={!form.title.trim()} className="text-xs h-8">{editIdx !== null ? "Save" : "Add"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!pendingDelete} onOpenChange={() => setPendingDelete(null)}>
        <DialogContent className="sm:max-w-[380px] bg-card border-border">
          <DialogHeader>
            <DialogTitle>Remove Document</DialogTitle>
            <DialogDescription>Remove <strong>{pendingDelete?.name}</strong>?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)} className="text-xs h-8">Cancel</Button>
            <Button variant="destructive" onClick={() => { if (pendingDelete) { setDocs(prev => prev.filter((_, i) => i !== pendingDelete.idx)); setPendingDelete(null); } }} className="text-xs h-8">Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const Route = createFileRoute("/founder/documents")({ component: Documents });
