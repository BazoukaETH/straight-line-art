import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Spark, StackedRevenue } from "@/components/wasla/Charts";
import {
  egp, financialMetrics, ventures, revenueByWorkspace,
} from "@/lib/mock-data";
import { useApp } from "@/lib/app-context";
import { MoreVertical, RefreshCw, Plus, ArrowUpRight, FileSpreadsheet, EyeOff, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/org/financial")({ component: FinancialPage });

const VENTURE_STATUS_STYLES: Record<string, string> = {
  Active: "bg-[color-mix(in_oklab,var(--success)_14%,transparent)] text-[color:var(--success)]",
  Pilot:  "bg-[color-mix(in_oklab,var(--warning)_18%,transparent)] text-[color:var(--warning)]",
  Paused: "bg-muted text-muted-foreground",
};

function FinancialPage() {
  const { subscriptions } = useApp();
  const cancelled = subscriptions.filter((s) => s.status === "Cancelled");
  const projectedSavings = subscriptions.reduce((sum, s) => sum + s.monthly, 0);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); toast.success("All widgets refreshed from Google Sheets"); }, 900);
  };

  return (
    <div className="px-6 py-6 max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Financial &amp; Portfolio</h1>
          <p className="text-sm text-muted-foreground">Wasla Ventures group overview, read from connected Google Sheets.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="month">
            <SelectTrigger className="h-9 w-[140px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This month</SelectItem>
              <SelectItem value="last">Last month</SelectItem>
              <SelectItem value="ytd">YTD</SelectItem>
              <SelectItem value="custom">Custom…</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" onClick={refresh} className="gap-1.5">
            <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh all
          </Button>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs">
            <span className="size-1.5 rounded-full bg-[color:var(--success)]" />
            Connected to Google Sheets
          </span>
        </div>
      </div>

      {/* Row 1 - primary metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <FinMetric label="Cash position"  value={egp(financialMetrics.cash.value)}      trend={financialMetrics.cash.trend}    source={financialMetrics.cash.source} />
        <FinMetric label="Runway"         value={`${financialMetrics.runway.value} months`} trend={financialMetrics.runway.trend} source={financialMetrics.runway.source} />
        <FinMetric label="MRR (group)"    value={egp(financialMetrics.mrr.value)}       trend={financialMetrics.mrr.trend}     source={financialMetrics.mrr.source} />
        <FinMetric label="Monthly burn"   value={egp(financialMetrics.burn.value)}      trend={financialMetrics.burn.trend}    source={financialMetrics.burn.source} negative />
      </div>

      {/* Row 2 - revenue by workspace */}
      <Card className="border-border p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Revenue by workspace</h3>
            <p className="text-[11px] text-muted-foreground">Last 12 months · stacked</p>
          </div>
        </div>
        <StackedRevenue
          data={revenueByWorkspace}
          series={[
            { key: "Wasla Solutions", color: "#8B5CF6" },
            { key: "Paperwork Studio", color: "#cbd5e1" },
          ]}
        />
        <SourceLine source="Wasla Finance Master / RevByWorkspace!A1:D13" />
      </Card>

      {/* Row 3 - venture KPIs */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Venture KPIs</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ventures.map((v) => (
            <Card key={v.id} className="border-border p-5">
              <div className="mb-3 flex items-start justify-between gap-2">
                <h4 className="text-sm font-semibold leading-tight">{v.name}</h4>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${VENTURE_STATUS_STYLES[v.status]}`}>{v.status}</span>
              </div>
              <div className="mb-3 grid grid-cols-3 gap-2 text-center">
                <Mini label="MRR" value={egp(v.mrr).replace("EGP ", "")} suffix="EGP" />
                <Mini label={v.metricLabel} value={new Intl.NumberFormat("en-US").format(v.metricValue)} />
                <Mini label="MoM" value={`+${v.growthMoM}%`} accent />
              </div>
              <Spark data={v.spark} color="#8B5CF6" />
              <SourceLine source={v.source} />
            </Card>
          ))}
        </div>
      </div>

      {/* Row 4 - subscription savings banner */}
      <Card className="border-border bg-gradient-to-r from-[color:var(--accent)]/8 to-transparent p-5">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex-1 min-w-[220px]">
            <div className="text-xs text-muted-foreground">Subscriptions cancelled</div>
            <div className="mt-0.5 text-2xl font-semibold">{cancelled.length} / {subscriptions.length}</div>
          </div>
          <div className="flex-1 min-w-[220px]">
            <div className="text-xs text-muted-foreground">Projected monthly savings at full migration</div>
            <div className="mt-0.5 text-2xl font-semibold text-[color:var(--success)]">{egp(projectedSavings)}</div>
          </div>
          <Link to="/org/subscriptions">
            <Button size="sm" variant="outline" className="gap-1.5">View subscriptions <ArrowUpRight className="size-3.5" /></Button>
          </Link>
        </div>
      </Card>

      {/* Row 5 - custom widgets placeholder */}
      <AddWidgetCard />
    </div>
  );
}

function FinMetric({ label, value, trend, source, negative }: { label: string; value: string; trend: string; source: string; negative?: boolean }) {
  return (
    <Card className="border-border p-5">
      <div className="mb-1.5 flex items-start justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded p-1 text-muted-foreground hover:bg-muted"><MoreVertical className="size-3.5" /></button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toast.success("Widget refreshed")}><RefreshCw className="mr-2 size-3.5" /> Refresh</DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast("Opening source sheet…")}><FileSpreadsheet className="mr-2 size-3.5" /> View source sheet</DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast("Widget hidden")}><EyeOff className="mr-2 size-3.5" /> Hide widget</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="text-[26px] font-semibold leading-tight tracking-tight">{value}</div>
      <div className={`mt-1 text-[11px] ${negative ? "text-[color:var(--success)]" : "text-[color:var(--success)]"}`}>{trend}</div>
      <SourceLine source={source} />
    </Card>
  );
}

function Mini({ label, value, accent, suffix }: { label: string; value: string; accent?: boolean; suffix?: string }) {
  return (
    <div className="rounded-md border border-border/60 px-2 py-2">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-sm font-semibold ${accent ? "text-[color:var(--success)]" : ""}`}>
        {value}{suffix && <span className="ml-0.5 text-[9px] font-medium text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}

function SourceLine({ source }: { source: string }) {
  return <div className="mt-3 truncate text-[10px] text-muted-foreground">Source: {source}</div>;
}

function AddWidgetCard() {
  const [open, setOpen] = useState(false);
  const [sheet, setSheet] = useState("Wasla Finance Master");
  const [tab, setTab] = useState("Cash");
  const [range, setRange] = useState("");
  const [viz, setViz] = useState("Number");
  const [title, setTitle] = useState("");

  const tabsBySheet: Record<string, string[]> = {
    "Wasla Finance Master":    ["Cash", "Runway", "Revenue", "Burn", "RevByWorkspace"],
    "Loop Commerce Metrics":   ["Summary", "Users", "Cohorts"],
    "Layer Studios Metrics":   ["Summary", "Projects"],
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card/50 px-5 py-10 text-sm font-medium text-muted-foreground transition hover:bg-card hover:text-foreground">
          <Plus className="size-4" /> Add widget
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Add widget</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="mb-1.5 block text-xs">Pick a sheet</Label>
            <Select value={sheet} onValueChange={(v) => { setSheet(v); setTab(tabsBySheet[v][0]); }}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.keys(tabsBySheet).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 block text-xs">Pick a tab</Label>
            <Select value={tab} onValueChange={setTab}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {tabsBySheet[sheet].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 block text-xs">Pick a range</Label>
            <Input value={range} onChange={(e) => setRange(e.target.value)} placeholder="e.g., A1:B12 or NamedRange" />
          </div>
          <div>
            <Label className="mb-1.5 block text-xs">Visualization</Label>
            <Select value={viz} onValueChange={setViz}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Number", "Sparkline", "Bar chart", "Pie chart", "Table"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 block text-xs">Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Widget title" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => { setOpen(false); toast.success(`Widget "${title || "Untitled"}" added`); }} className="gap-1.5">
            Add widget <ArrowRight className="size-3.5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
