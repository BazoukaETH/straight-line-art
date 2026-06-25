import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { GripVertical, ChevronDown, ChevronUp, Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PipelineEntry {
  id: string; company: string; contact: string; stage: string; value: string; probability: number; nextAction: string; owner: string;
}

interface ClientProject {
  client: string; project: string; value: string; status: string; phase: string; team: string[];
  contactName: string; contactEmail: string; contactPhone: string;
  payments: { milestone: string; amount: string; status: string }[];
}

const pipelineData: PipelineEntry[] = [
  { id: "1", company: "TechNova Solutions", contact: "Khaled Ibrahim", stage: "Lead", value: "350,000", probability: 10, nextAction: "Initial call Mar 28", owner: "Hussein" },
  { id: "2", company: "Green Valley Farms", contact: "Sara Mahmoud", stage: "Lead", value: "450,000", probability: 10, nextAction: "Send intro deck", owner: "Hussein" },
  { id: "3", company: "Cairo Capital Group", contact: "Ahmed Fawzy", stage: "Discovery", value: "400,000/mo", probability: 30, nextAction: "Requirements session", owner: "Bassel" },
  { id: "4", company: "SMG Engineering", contact: "Tarek Hassan", stage: "Proposal", value: "2-3M", probability: 50, nextAction: "Final proposal Apr 1", owner: "Bassel" },
  { id: "5", company: "Nile Logistics", contact: "Mona Adel", stage: "Proposal", value: "180,000", probability: 40, nextAction: "Follow up call", owner: "Hussein" },
  { id: "6", company: "Cairo Food Solutions", contact: "Omar Sherif", stage: "Won", value: "500,000", probability: 100, nextAction: "Phase 1 in progress", owner: "Moaz" },
  { id: "7", company: "Baraka Pharm", contact: "Layla Hassan", stage: "Won", value: "60,000+", probability: 100, nextAction: "Monthly retainer active", owner: "Moaz" },
  { id: "8", company: "EJB", contact: "Amr Nabil", stage: "Won", value: "100,000", probability: 100, nextAction: "SLA retainer ongoing", owner: "Moaz" },
];

const stages = ["Lead", "Discovery", "Proposal", "Negotiation", "Won", "Lost"];
const stageColors: Record<string, string> = {
  Lead: "hsl(220, 15%, 38%)", Discovery: "hsl(220, 95%, 47%)", Proposal: "hsl(36, 90%, 53%)",
  Negotiation: "hsl(250, 60%, 60%)", Won: "hsl(160, 80%, 40%)", Lost: "hsl(350, 75%, 50%)",
};

const clients: ClientProject[] = [
  {
    client: "Cairo Food Solutions", project: "Full digital platform", value: "500,000 EGP", status: "Active",
    phase: "Phase 1 of 3", team: ["Moaz", "Mohamed", "Saif"], contactName: "Omar Sherif", contactEmail: "", contactPhone: "",
    payments: [
      { milestone: "Upfront (30%)", amount: "150,000", status: "Paid" },
      { milestone: "Phase 1 delivery", amount: "175,000", status: "Pending" },
      { milestone: "Final delivery", amount: "175,000", status: "Upcoming" },
    ],
  },
  {
    client: "Baraka Pharm", project: "Shopify redesign + retainer", value: "60,000+ EGP", status: "Active",
    phase: "Redesign complete, retainer active", team: ["Moaz", "Mohamed"], contactName: "Layla Hassan", contactEmail: "", contactPhone: "",
    payments: [
      { milestone: "Redesign", amount: "60,000", status: "Paid" },
      { milestone: "Monthly retainer", amount: "15,000/mo", status: "Recurring" },
    ],
  },
  {
    client: "EJB", project: "App SLA retainer", value: "100,000 EGP (4 months)", status: "Active",
    phase: "Month 2 of 4", team: ["Moaz"], contactName: "Amr Nabil", contactEmail: "", contactPhone: "",
    payments: [
      { milestone: "Month 1", amount: "25,000", status: "Paid" },
      { milestone: "Month 2", amount: "25,000", status: "Pending" },
      { milestone: "Month 3", amount: "25,000", status: "Upcoming" },
      { milestone: "Month 4", amount: "25,000", status: "Upcoming" },
    ],
  },
];

const paymentColors: Record<string, string> = {
  Paid: "hsl(160, 80%, 40%)", Pending: "hsl(36, 90%, 53%)", Upcoming: "hsl(220, 15%, 38%)",
  Recurring: "hsl(220, 95%, 47%)", Overdue: "hsl(350, 75%, 50%)",
};

export const Pipeline = () => {
  const [tab, setTab] = useState<"projects" | "pipeline">("projects");
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const tabs = [{ id: "projects" as const, l: "Client Projects" }, { id: "pipeline" as const, l: "Sales Pipeline" }];

  return (
    <div className="px-6 py-6 space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-foreground tracking-tight">Pipeline</h1>
        <p className="text-xs text-muted-foreground mt-1">Wasla Solutions client projects & sales pipeline</p>
      </div>

      <div className="flex gap-0 border-b border-border">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-[11px] font-medium transition-colors border-b-2 -mb-px ${tab === t.id ? "text-foreground border-primary" : "text-muted-foreground border-transparent hover:text-foreground"}`}>
            {t.l}
          </button>
        ))}
      </div>

      {tab === "projects" && (
        <div className="space-y-2">
          {clients.map((c) => (
            <div key={c.client} className="bg-card border border-border rounded-xl overflow-hidden">
              <button onClick={() => setExpandedClient(expandedClient === c.client ? null : c.client)} className="w-full p-4 text-left flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[13px] font-bold text-foreground">{c.client}</h3>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: "hsl(160,80%,40%,0.12)", color: "hsl(160,80%,40%)" }}>{c.status}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{c.project} - {c.value}</p>
                </div>
                {expandedClient === c.client ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {expandedClient === c.client && (
                <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
                  <div className="grid sm:grid-cols-4 gap-3">
                    {[
                      { label: "Current Phase", value: c.phase },
                      { label: "Team", value: c.team.join(", ") },
                      { label: "Total Value", value: c.value },
                      { label: "Contact", value: c.contactName || "-" },
                    ].map((d) => (
                      <div key={d.label} className="bg-muted rounded-lg p-2.5">
                        <div className="text-[8px] text-muted-foreground/50 uppercase tracking-wide">{d.label}</div>
                        <div className="text-[11px] text-foreground font-medium mt-0.5">{d.value}</div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-[9px] text-muted-foreground/50 uppercase tracking-wide font-semibold mb-2">Payment Milestones</div>
                    <div className="space-y-1.5">
                      {c.payments.map((p, i) => (
                        <div key={i} className="flex items-center justify-between text-[11px]">
                          <span className="text-foreground">{p.milestone}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground tabular-nums">{p.amount} EGP</span>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                              style={{ background: `${paymentColors[p.status] || "hsl(220,15%,38%)"}22`, color: paymentColors[p.status] || "hsl(220,15%,38%)" }}>{p.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "pipeline" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground/60">Source: Wasla Ventures Master · Revenue Pipeline · Read-only</p>
            <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "hsl(220,15%,38%,0.18)", color: "hsl(220,15%,70%)" }}>Read-only · Edit in Google Sheet</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
          {stages.map((stage) => {
            const items = pipelineData.filter((p) => p.stage === stage);
            const sc = stageColors[stage] || "hsl(220, 15%, 38%)";
            return (
              <div key={stage} className="min-w-[220px] w-[220px] shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: sc }} />
                    <h3 className="text-[11px] font-semibold text-foreground">{stage}</h3>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="bg-card border border-border rounded-xl p-3">
                      <div className="flex items-start gap-2">
                        <GripVertical className="w-3 h-3 text-muted-foreground/30 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-foreground truncate">{item.company}</p>
                          <p className="text-[10px] text-muted-foreground">{item.contact}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-[10px] font-bold text-foreground tabular-nums">{item.value} EGP</span>
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>{item.probability}%</span>
                          </div>
                          <p className="text-[9px] text-muted-foreground mt-1">{item.nextAction}</p>
                          <p className="text-[9px] text-muted-foreground/50 mt-0.5">Owner: {item.owner}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <div className="border border-dashed border-border rounded-xl p-4 text-center">
                      <p className="text-[10px] text-muted-foreground/50">No entries</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        </div>
      )}
    </div>
  );
};

export const Route = createFileRoute("/founder/pipeline")({
  beforeLoad: () => {
    throw redirect({ to: "/clients/pipeline" });
  },
});
