import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Globe, TrendingUp, Building2, BarChart3, Newspaper, Shield, Plus, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MACRO_INDICATORS, RATE_HISTORY, FUNDING_ROUNDS, VC_DIRECTORY, INDUSTRY_SIGNALS, REGULATORY_UPDATES, NEWS_FEED,
  type VCTarget,
} from "@/data/market-intel";

const MarketIntel = () => {
  const [tab, setTab] = useState<"macro" | "funding" | "vc" | "signals" | "news">("macro");
  const [vcView, setVcView] = useState<"directory" | "targets">("directory");
  const [targets, setTargets] = useState<VCTarget[]>([]);

  // Target modal
  const [targetModal, setTargetModal] = useState(false);
  const [editTargetIdx, setEditTargetIdx] = useState<number | null>(null);
  const emptyTarget: VCTarget = { name: "", fund: "", connectionType: "Cold", status: "Not Contacted", lastInteraction: "", email: "", phone: "", notes: "" };
  const [targetForm, setTargetForm] = useState<VCTarget>(emptyTarget);

  function addFromDirectory(fund: string) {
    setTargetForm({ ...emptyTarget, fund, name: "" }); setEditTargetIdx(null); setTargetModal(true);
  }
  function saveTarget() {
    if (!targetForm.name.trim()) return;
    if (editTargetIdx !== null) { setTargets(prev => prev.map((t, i) => i === editTargetIdx ? targetForm : t)); }
    else { setTargets(prev => [...prev, targetForm]); }
    setTargetModal(false);
  }

  const tabs = [
    { id: "macro" as const, l: "Macro Dashboard" },
    { id: "funding" as const, l: "Startup & Funding" },
    { id: "vc" as const, l: "VC Directory" },
    { id: "signals" as const, l: "Industry Signals" },
    { id: "news" as const, l: "News Feed" },
  ];

  const totalFunding = FUNDING_ROUNDS.length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-bold text-foreground tracking-tight">Market Intel</h1>
        <p className="text-xs text-muted-foreground mt-1">Egypt & MENA economic data, startup ecosystem, and industry intelligence</p>
      </div>

      <div className="flex gap-0 border-b border-border overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-[11px] font-medium transition-colors border-b-2 whitespace-nowrap ${tab === t.id ? "text-secondary border-secondary" : "text-muted-foreground border-transparent hover:text-foreground"}`}>
            {t.l}
          </button>
        ))}
      </div>

      {tab === "macro" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {MACRO_INDICATORS.map((ind, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-3.5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-[3px] h-full" style={{ background: "hsl(220,95%,47%)" }} />
                <div className="text-[9px] text-muted-foreground/50 font-bold uppercase tracking-wide mb-1">{ind.label}</div>
                <div className="text-lg font-bold text-foreground tracking-tight">{ind.value}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[9px] text-muted-foreground/50">{ind.source} - {ind.date}</span>
                </div>
                {ind.detail && <div className="text-[9px] text-muted-foreground/70 mt-0.5">{ind.detail}</div>}
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs font-semibold text-foreground mb-3">CBE Policy Rate History</div>
            <div className="space-y-2">
              {RATE_HISTORY.map((entry, i) => (
                <div key={i} className="flex items-center gap-3 text-[11px]">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: "hsl(220,95%,47%)" }} />
                  <span className="text-muted-foreground w-20">{entry.date}</span>
                  <span className="font-bold text-foreground w-16">{entry.rate}</span>
                  <span className="text-muted-foreground/70">{entry.change}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-6 mt-4 pt-3 border-t border-border text-[10px]">
              <div><span className="text-muted-foreground/50">Long-term Avg:</span> <span className="font-semibold text-foreground">12.67%</span></div>
              <div><span className="text-muted-foreground/50">All-time High:</span> <span className="font-semibold text-foreground">27.75%</span></div>
              <div><span className="text-muted-foreground/50">All-time Low:</span> <span className="font-semibold text-foreground">8.25%</span></div>
            </div>
          </div>
          <div className="text-[9px] text-muted-foreground/40 text-right">Last Updated: Apr 2026</div>
        </div>
      )}

      {tab === "funding" && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2.5">
            {[
              { label: "Total Rounds (Seeded)", value: String(totalFunding), color: "hsl(220,95%,47%)" },
              { label: "Top Sector", value: "Fintech", color: "hsl(168,100%,42%)" },
              { label: "Largest Round", value: "$100M", color: "hsl(36,90%,53%)" },
              { label: "Active Investors", value: String(new Set(FUNDING_ROUNDS.map(f => f.leadInvestor)).size), color: "hsl(250,60%,60%)" },
            ].map(k => (
              <div key={k.label} className="bg-card rounded-xl p-3.5 border border-border relative overflow-hidden">
                <div className="absolute top-0 left-0 w-[3px] h-full" style={{ background: k.color }} />
                <div className="text-[9px] text-muted-foreground/50 font-bold uppercase tracking-wide mb-1">{k.label}</div>
                <div className="text-lg font-bold text-foreground tracking-tight">{k.value}</div>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs font-semibold text-foreground mb-3">Recent Funding Rounds</div>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead><tr className="border-b border-border">
                  {["Company", "Amount", "Stage", "Sector", "Lead Investor", "Date"].map(h => (
                    <th key={h} className="text-left p-2 font-semibold text-muted-foreground/50 text-[9px] uppercase tracking-wide">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {FUNDING_ROUNDS.map((r, i) => (
                    <tr key={i} className="border-b border-border/30">
                      <td className="p-2 font-semibold text-foreground">{r.company}</td>
                      <td className="p-2 font-bold" style={{ color: "hsl(168,100%,42%)" }}>{r.amount}</td>
                      <td className="p-2"><span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "hsl(220,95%,47%,0.12)", color: "hsl(220,95%,47%)" }}>{r.stage}</span></td>
                      <td className="p-2 text-muted-foreground">{r.sector}</td>
                      <td className="p-2 text-muted-foreground">{r.leadInvestor}</td>
                      <td className="p-2 text-muted-foreground/50">{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "vc" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex bg-muted rounded-lg p-0.5">
              {(["directory", "targets"] as const).map(v => (
                <button key={v} onClick={() => setVcView(v)}
                  className={`text-[11px] px-3 py-1.5 rounded-md font-medium transition-colors ${vcView === v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                  {v === "directory" ? "Directory" : `My Targets (${targets.length})`}
                </button>
              ))}
            </div>
            {vcView === "targets" && (
              <Button size="sm" className="h-7 text-[10px] gap-1" onClick={() => { setTargetForm(emptyTarget); setEditTargetIdx(null); setTargetModal(true); }}>
                <Plus className="w-3 h-3" /> Add Target
              </Button>
            )}
          </div>

          {vcView === "directory" && (
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead><tr className="border-b border-border">
                    {["Fund", "Stage Focus", "Sector Focus", "Ticket Size", "HQ", ""].map(h => (
                      <th key={h} className="text-left p-2 font-semibold text-muted-foreground/50 text-[9px] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {VC_DIRECTORY.map((vc, i) => (
                      <tr key={i} className="border-b border-border/30">
                        <td className="p-2 font-semibold text-foreground">{vc.fund}</td>
                        <td className="p-2 text-muted-foreground">{vc.stageFocus}</td>
                        <td className="p-2 text-muted-foreground">{vc.sectorFocus}</td>
                        <td className="p-2 text-muted-foreground">{vc.ticketSize}</td>
                        <td className="p-2 text-muted-foreground">{vc.hq}</td>
                        <td className="p-2">
                          <button onClick={() => addFromDirectory(vc.fund)} className="text-[9px] font-semibold" style={{ color: "hsl(220,95%,47%)" }}>Add to Targets</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {vcView === "targets" && (
            <div className="space-y-2">
              {targets.length === 0 ? (
                <div className="border border-dashed border-border rounded-xl p-8 text-center">
                  <p className="text-[11px] text-muted-foreground/50">No targets yet. Add from Directory or manually.</p>
                </div>
              ) : targets.map((t, i) => {
                const statusColor = t.status === "Committed" ? "hsl(160,80%,40%)" : t.status === "In Conversation" ? "hsl(220,95%,47%)" : t.status === "Passed" ? "hsl(350,75%,50%)" : "hsl(220,15%,38%)";
                return (
                  <div key={i} className="bg-card border border-border rounded-xl p-4 group relative">
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setTargetForm({ ...t }); setEditTargetIdx(i); setTargetModal(true); }} className="w-5 h-5 rounded flex items-center justify-center bg-muted hover:bg-accent"><Pencil className="w-2.5 h-2.5 text-muted-foreground" /></button>
                      <button onClick={() => setTargets(prev => prev.filter((_, idx) => idx !== i))} className="w-5 h-5 rounded flex items-center justify-center bg-muted hover:bg-destructive/20"><X className="w-2.5 h-2.5 text-muted-foreground" /></button>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[13px] font-bold text-foreground">{t.name}</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${statusColor}22`, color: statusColor }}>{t.status}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground">{t.fund} - {t.connectionType}</div>
                    {t.notes && <div className="text-[10px] text-muted-foreground/70 mt-1">{t.notes}</div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === "signals" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {INDUSTRY_SIGNALS.map((sig, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-[3px] h-full" style={{ background: "hsl(168,100%,42%)" }} />
                <div className="text-[9px] text-muted-foreground/50 font-bold uppercase tracking-wide mb-1">{sig.label}</div>
                <div className="text-xl font-bold text-foreground tracking-tight">{sig.value}</div>
                <div className="text-[10px] text-muted-foreground/50 mt-0.5">{sig.detail}</div>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-3.5 h-3.5" style={{ color: "hsl(250,60%,60%)" }} />
              <div className="text-xs font-semibold text-foreground">Regulatory Updates</div>
            </div>
            <div className="space-y-3">
              {REGULATORY_UPDATES.map((r, i) => (
                <div key={i} className="border-b border-border/30 pb-2.5 last:border-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] font-semibold text-foreground">{r.title}</span>
                    <span className="text-[9px] text-muted-foreground/50">{r.date}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground leading-relaxed">{r.description}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[9px] text-muted-foreground/40 text-right">Last Updated: Apr 2026</div>
        </div>
      )}

      {tab === "news" && (
        <div className="space-y-2">
          {NEWS_FEED.map((news, i) => {
            const catColor = news.category === "Funding" ? "hsl(168,100%,42%)" : news.category === "Policy" ? "hsl(250,60%,60%)" : news.category === "Macro" ? "hsl(36,90%,53%)" : "hsl(220,95%,47%)";
            return (
              <div key={i} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${catColor}22`, color: catColor }}>{news.category}</span>
                  <span className="text-[9px] text-muted-foreground/50">{news.source} - {news.date}</span>
                </div>
                <div className="text-[13px] font-bold text-foreground mb-0.5">{news.headline}</div>
                <div className="text-[10px] text-muted-foreground leading-relaxed">{news.summary}</div>
              </div>
            );
          })}
          <div className="text-[9px] text-muted-foreground/40 text-right">Last Updated: Apr 2026</div>
        </div>
      )}

      {/* Target Modal */}
      <Dialog open={targetModal} onOpenChange={setTargetModal}>
        <DialogContent className="sm:max-w-[480px] bg-card border-border">
          <DialogHeader><DialogTitle>{editTargetIdx !== null ? "Edit Target" : "Add Target"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Name *</label><Input value={targetForm.name} onChange={e => setTargetForm({ ...targetForm, name: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Fund</label><Input value={targetForm.fund} onChange={e => setTargetForm({ ...targetForm, fund: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Connection Type</label><Input value={targetForm.connectionType} onChange={e => setTargetForm({ ...targetForm, connectionType: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Status</label><Input value={targetForm.status} onChange={e => setTargetForm({ ...targetForm, status: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Email</label><Input value={targetForm.email} onChange={e => setTargetForm({ ...targetForm, email: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Phone</label><Input value={targetForm.phone} onChange={e => setTargetForm({ ...targetForm, phone: e.target.value })} className="h-8 text-xs" /></div>
          </div>
          <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Notes</label><Textarea value={targetForm.notes} onChange={e => setTargetForm({ ...targetForm, notes: e.target.value })} className="text-xs min-h-[50px]" /></div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setTargetModal(false)} className="text-xs h-8">Cancel</Button>
            <Button onClick={saveTarget} disabled={!targetForm.name.trim()} className="text-xs h-8">{editTargetIdx !== null ? "Save" : "Add"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const Route = createFileRoute("/founder/market-intel")({ component: MarketIntel });
