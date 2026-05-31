import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, Play, Pause, Clock, Zap, Calendar, ChevronDown, ChevronUp } from "lucide-react";

interface Agent {
  id: string; name: string; description: string; type: string; trigger: "manual" | "scheduled" | "event"; triggerDetail: string; status: "active" | "paused" | "draft"; connectedTools: string[];
}

const agents: Agent[] = [
  { id: "1", name: "Weekly Status Digest", description: "Compiles a weekly status report across all active client projects by reading ClickUp tasks and Drive updates. Sends summary to Bassel via email.", type: "Reporting", trigger: "scheduled", triggerDetail: "Every Thursday 8pm", status: "draft", connectedTools: ["ClickUp", "Google Drive", "Gmail"] },
  { id: "2", name: "Pipeline Follow-up Reminder", description: "Checks pipeline entries with overdue next-action dates and sends reminders to the assigned owner.", type: "Automation", trigger: "scheduled", triggerDetail: "Daily 9am", status: "draft", connectedTools: ["Internal DB", "Gmail"] },
  { id: "3", name: "Invoice Generator", description: "Generates client invoices from payment milestone data and sends them for review before dispatch.", type: "Finance", trigger: "manual", triggerDetail: "Triggered by button press", status: "draft", connectedTools: ["Google Sheets", "Google Drive", "Gmail"] },
  { id: "4", name: "New Lead Enrichment", description: "When a new pipeline entry is created, enriches it with company info and suggests a first-touch template.", type: "Sales", trigger: "event", triggerDetail: "On new pipeline entry", status: "draft", connectedTools: ["Internal DB", "Web Search"] },
  { id: "5", name: "Monthly Financial Summary", description: "Reads the latest Google Sheets financial data and generates a monthly summary with highlights and alerts.", type: "Finance", trigger: "scheduled", triggerDetail: "1st of each month", status: "draft", connectedTools: ["Google Sheets", "Internal DB"] },
  { id: "6", name: "Market Intel Updater", description: "Scrapes exchange rates, EGX data, and startup funding news. Updates Market Intel section automatically.", type: "Intelligence", trigger: "scheduled", triggerDetail: "Daily 7am", status: "draft", connectedTools: ["Web Scraping", "ExchangeRate API", "NewsAPI"] },
  { id: "7", name: "Initiative Deadline Tracker", description: "Monitors active initiatives and sends alerts when deadlines approach or items are overdue.", type: "Automation", trigger: "scheduled", triggerDetail: "Daily 8am", status: "draft", connectedTools: ["Internal DB", "Gmail"] },
  { id: "8", name: "Venture Performance Report", description: "Generates monthly performance snapshots for each active venture with revenue, expenses, and key metrics.", type: "Reporting", trigger: "scheduled", triggerDetail: "1st of each month", status: "draft", connectedTools: ["Google Sheets", "Internal DB"] },
];

const statusStyles: Record<string, { bg: string; color: string }> = {
  active: { bg: "hsl(160,80%,40%,0.12)", color: "hsl(160,80%,40%)" },
  paused: { bg: "hsl(36,90%,53%,0.12)", color: "hsl(36,90%,53%)" },
  draft: { bg: "hsl(220,15%,38%,0.15)", color: "hsl(220,15%,38%)" },
};

const triggerIcon = { manual: Zap, scheduled: Calendar, event: Play };

const AIAgents = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-bold text-foreground tracking-tight">AI Agents</h1>
        <p className="text-xs text-muted-foreground mt-1">0 active - {agents.length} total agents - All draft status</p>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {[
          { label: "Total Agents", value: agents.length, color: "hsl(220,95%,47%)" },
          { label: "Active", value: 0, color: "hsl(160,80%,40%)" },
          { label: "Draft", value: agents.length, color: "hsl(220,15%,38%)" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card rounded-xl p-4 border border-border relative overflow-hidden">
            <div className="absolute top-0 left-0 w-[3px] h-full" style={{ background: kpi.color }} />
            <div className="text-[9px] text-muted-foreground/50 font-bold uppercase tracking-wide mb-1">{kpi.label}</div>
            <div className="text-xl font-bold text-foreground tracking-tight">{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {agents.map((agent) => {
          const ss = statusStyles[agent.status];
          const TriggerIcon = triggerIcon[agent.trigger];
          const isExpanded = expanded === agent.id;
          return (
            <div key={agent.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <button onClick={() => setExpanded(isExpanded ? null : agent.id)} className="w-full p-4 text-left">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: "hsl(220,95%,47%,0.12)", border: "1px solid hsl(220,95%,47%,0.2)" }}>
                      <Bot className="w-4 h-4" style={{ color: "hsl(220,95%,47%)" }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[13px] font-bold text-foreground">{agent.name}</h3>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full capitalize" style={{ background: ss.bg, color: ss.color }}>{agent.status}</span>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-muted text-muted-foreground">{agent.type}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{agent.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-[9px] text-muted-foreground/60">
                        <span className="flex items-center gap-1"><TriggerIcon className="w-3 h-3" />{agent.triggerDetail}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border pt-4">
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[
                      { label: "Type", value: agent.type },
                      { label: "Trigger", value: `${agent.trigger} - ${agent.triggerDetail}` },
                      { label: "Connected Tools", value: agent.connectedTools.join(", ") },
                    ].map((d) => (
                      <div key={d.label} className="bg-muted rounded-lg p-2.5">
                        <div className="text-[8px] text-muted-foreground/50 uppercase tracking-wide">{d.label}</div>
                        <div className="text-[10px] text-foreground font-medium mt-0.5">{d.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Route = createFileRoute("/founder/ai-agents")({ component: AIAgents });
