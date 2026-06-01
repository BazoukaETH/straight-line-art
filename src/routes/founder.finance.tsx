import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, CartesianGrid } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Check, X, Plus, Trash2, Info, MoreVertical, RefreshCw, ArrowUpRight, FileSpreadsheet, EyeOff, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Spark, StackedRevenue } from "@/components/wasla/Charts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  MONEY_IN_SEED, MONEY_OUT_SEED, CASH_ACCOUNTS_SEED, EXCHANGE_RATES_SEED, PROJECTIONS_SEED,
  FY26_REVENUE_PLAN, FY26_BURN_PLAN,
  type CashAccount, type ExchangeRates,
} from "@/data/finance";
import {
  calculateMonthlyBurn, calculateCashOnHand, calculateRunway, calculateMRR,
  calculateInvoiceAging, calculateClientConcentration, calculateActualVsPlan, calculateRecurringVsOneTime,
} from "@/lib/finance-calculations";
import { useSalaries } from "@/contexts/SalaryContext";
import { useApp } from "@/lib/app-context";
import { egp, financialMetrics, ventures, revenueByWorkspace } from "@/lib/mock-data";

const SUB_STATUS_STYLES: Record<string, string> = {
  Active:    "bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] text-accent",
  Cutover:   "bg-[color-mix(in_oklab,var(--warning)_18%,transparent)] text-[color:var(--warning)]",
  Cancelled: "bg-muted text-muted-foreground",
};

const VENTURE_STATUS_STYLES: Record<string, string> = {
  Active: "bg-[color-mix(in_oklab,var(--success)_14%,transparent)] text-[color:var(--success)]",
  Pilot:  "bg-[color-mix(in_oklab,var(--warning)_18%,transparent)] text-[color:var(--warning)]",
  Paused: "bg-muted text-muted-foreground",
};

const PC = ["hsl(220,95%,47%)", "hsl(168,100%,42%)", "hsl(36,90%,53%)", "hsl(250,60%,60%)", "hsl(350,75%,50%)", "hsl(160,80%,40%)"];

const fmtE = (n: number) => { if (!n) return "0"; const a = Math.abs(n); if (a >= 1000000) return (n / 1000000).toFixed(2) + "M"; if (a >= 1000) return (n / 1000).toFixed(0) + "K"; return String(n); };
const fmtF = (n: number) => "EGP " + Math.round(n).toLocaleString();
const pMonth = (d: string) => { const p = d.split("-"); return p.length >= 2 && p[0].length === 4 ? p[0] + "-" + p[1].padStart(2, "0") : null; };
const mLabel = (k: string) => { const [y, m] = k.split("-"); return new Date(+y, +m - 1).toLocaleDateString("en", { month: "short", year: "2-digit" }); };
const todayStr = new Date().toISOString().slice(0, 10);

const ChartTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-muted p-2 rounded-lg border border-border text-[11px]">
      <div className="font-semibold text-muted-foreground/50 text-[10px] mb-1">{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-1.5 mt-0.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground/60">{p.name}:</span>
          <span className="font-semibold text-foreground">{fmtF(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

const KPI = ({ label, value, sub, color, prefix = "" }: { label: string; value: string; sub?: string; color: string; prefix?: string }) => (
  <div className="bg-card rounded-xl p-4 border border-border relative overflow-hidden">
    <div className="absolute top-0 left-0 w-[3px] h-full" style={{ background: color }} />
    <div className="text-[9px] text-muted-foreground/50 font-bold uppercase tracking-wide mb-1">{label}</div>
    <div className="text-xl font-bold text-foreground tracking-tight">{prefix}{value}</div>
    {sub && <div className="text-[10px] text-muted-foreground/50 mt-0.5">{sub}</div>}
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const s = status.toLowerCase();
  const color = s === "paid" ? "hsl(160,80%,40%)" : s === "50% paid" ? "hsl(250,60%,60%)" : s === "overdue" ? "hsl(350,75%,50%)" : "hsl(36,90%,53%)";
  return <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${color}22`, color }}>{status}</span>;
};

const allVentures = ["All Ventures", ...Array.from(new Set([...MONEY_IN_SEED.map(r => r.venture), ...MONEY_OUT_SEED.map(r => r.venture)]))];
const BASSEL_COMMITMENT = 1000000;

const Finance = () => {
  const [page, setPage] = useState<"overview" | "engine" | "subscriptions">("overview");
  const [tab, setTab] = useState("overview");
  const [ventureFilter, setVentureFilter] = useState("All Ventures");
  const { subscriptions, setSubStatus } = useApp();
  const activeSubs = subscriptions.filter(s => s.status === "Active");
  const subsMonthlySpend = activeSubs.reduce((sum, s) => sum + s.monthly, 0);
  const subsProjectedSavings = subscriptions.reduce((sum, s) => sum + s.monthly, 0);
  const { salaries, setSalaries } = useSalaries();
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [addSalaryModal, setAddSalaryModal] = useState(false);
  const [salaryForm, setSalaryForm] = useState({ name: "", role: "", dept: "Engineering", monthlySalary: "", equity: "—", venture: "Wasla Solutions" });
  const [pendingDelete, setPendingDelete] = useState<{ idx: number; name: string } | null>(null);

  // Cash position state
  const [accounts, setAccounts] = useState<CashAccount[]>(CASH_ACCOUNTS_SEED);
  const [fx, setFx] = useState<ExchangeRates>(EXCHANGE_RATES_SEED);
  const [addAccountModal, setAddAccountModal] = useState(false);
  const [accountForm, setAccountForm] = useState<CashAccount>({ accountName: "", accountType: "Business Bank", owner: "Wasla Ventures", currency: "EGP", balanceNative: 0, lastUpdated: todayStr, bankLocation: "", notes: "" });
  const [editingBalanceIdx, setEditingBalanceIdx] = useState<number | null>(null);
  const [balanceEditValue, setBalanceEditValue] = useState("");

  // Transactions tab state
  const [txType, setTxType] = useState("All");
  const [txStatus, setTxStatus] = useState("All");
  const [txCategory, setTxCategory] = useState("All");
  const [txFrom, setTxFrom] = useState("");
  const [txTo, setTxTo] = useState("");
  const [txSearch, setTxSearch] = useState("");
  const [txSort, setTxSort] = useState<"date" | "amount" | "status">("date");
  const [txSortDir, setTxSortDir] = useState<"asc" | "desc">("desc");
  const [txLimit, setTxLimit] = useState(50);

  const tabs = [
    { id: "overview", l: "Overview" },
    { id: "transactions", l: "Transactions" },
    { id: "salaries", l: "Salaries" },
    { id: "cash", l: "Cash Position" },
    { id: "projections", l: "Projections" },
  ];

  const filteredIn = ventureFilter === "All Ventures" ? MONEY_IN_SEED : MONEY_IN_SEED.filter(r => r.venture === ventureFilter);
  const filteredOut = ventureFilter === "All Ventures" ? MONEY_OUT_SEED : MONEY_OUT_SEED.filter(r => r.venture === ventureFilter);

  const overview = useMemo(() => {
    const tR = filteredIn.reduce((s, r) => s + r.amount, 0);
    const tE = filteredOut.reduce((s, r) => s + r.amount, 0);
    const net = tR - tE;
    const burn = calculateMonthlyBurn(filteredOut);
    const cash = calculateCashOnHand(accounts, fx);
    const runway = calculateRunway(cash, burn);
    const mrr = calculateMRR(filteredIn);
    let pendingTotal = 0; let pendingCount = 0;
    for (const r of filteredIn) {
      if (r.status === "Pending") { pendingTotal += r.amount; pendingCount++; }
      else if (r.status === "50% Paid") { pendingTotal += r.amount / 2; pendingCount++; }
    }
    const aging = calculateInvoiceAging(filteredIn);
    const top5 = calculateClientConcentration(filteredIn);
    const mix = calculateRecurringVsOneTime(filteredIn);
    const mixTotal = mix.recurring + mix.oneTime;
    const recPct = mixTotal > 0 ? (mix.recurring / mixTotal) * 100 : 0;
    const otPct = mixTotal > 0 ? (mix.oneTime / mixTotal) * 100 : 0;

    const mm: Record<string, { r: number; e: number }> = {};
    for (const r of filteredIn) { const k = pMonth(r.date); if (k) { if (!mm[k]) mm[k] = { r: 0, e: 0 }; mm[k].r += r.amount; } }
    for (const r of filteredOut) { const k = pMonth(r.date); if (k) { if (!mm[k]) mm[k] = { r: 0, e: 0 }; mm[k].e += r.amount; } }
    const monthly = Object.entries(mm).sort((a, b) => a[0].localeCompare(b[0])).map(([k, v]) => ({ month: mLabel(k), revenue: v.r, expenses: v.e, net: v.r - v.e }));

    const ec: Record<string, number> = {};
    for (const r of filteredOut) ec[r.category] = (ec[r.category] || 0) + r.amount;
    const eb = Object.entries(ec).filter(e => e[1] > 0).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value, pct: tE > 0 ? ((value / tE) * 100).toFixed(1) : "0" }));

    const avp = calculateActualVsPlan(filteredIn, PROJECTIONS_SEED).map(r => ({ ...r, monthLabel: mLabel(r.month) }));
    const ytdActual = avp.reduce((s, r) => s + r.actual, 0);
    const ytdPlan = avp.reduce((s, r) => s + r.plan, 0);
    const ytdVar = ytdPlan > 0 ? ((ytdActual - ytdPlan) / ytdPlan) * 100 : 0;

    return { tR, tE, net, burn, cash, runway, mrr, pendingTotal, pendingCount, aging, top5, mix, recPct, otPct, monthly, eb, avp, ytdActual, ytdPlan, ytdVar };
  }, [filteredIn, filteredOut, accounts, fx]);

  const cashIsZero = accounts.every(a => a.balanceNative === 0);

  const runwayDisplay = (() => {
    if (cashIsZero) return { value: "Set balances", color: "hsl(220,15%,50%)", sub: "Open Cash Position" };
    if (overview.runway === null) return { value: "∞", color: "hsl(160,80%,40%)", sub: "No burn" };
    const r = overview.runway;
    const color = r > 6 ? "hsl(160,80%,40%)" : r >= 3 ? "hsl(36,90%,53%)" : "hsl(350,75%,50%)";
    return { value: r.toFixed(1) + " mo", color, sub: "At current burn" };
  })();

  // ── Transactions tab ──────────────────────────────────────────────────────
  const allTxCategories = useMemo(() => {
    const set = new Set<string>();
    MONEY_IN_SEED.forEach(r => set.add(r.category));
    MONEY_OUT_SEED.forEach(r => set.add(r.category));
    return ["All", ...Array.from(set).sort()];
  }, []);

  type Tx = {
    type: "Income" | "Expense"; date: string; party: string; venture: string; category: string;
    description: string; amount: number; status: string; paidBy: string; notes: string;
  };

  const transactions: Tx[] = useMemo(() => {
    const inTx: Tx[] = filteredIn.map(r => ({
      type: "Income", date: r.date, party: r.client, venture: r.venture, category: r.category,
      description: r.service, amount: r.amount, status: r.status, paidBy: "—", notes: r.notes,
    }));
    const outTx: Tx[] = filteredOut.map(r => ({
      type: "Expense", date: r.date, party: r.vendor, venture: r.venture, category: r.category,
      description: r.description, amount: r.amount, status: r.status, paidBy: r.paidBy, notes: r.notes,
    }));
    let merged = [...inTx, ...outTx];
    if (txType !== "All") merged = merged.filter(t => t.type === txType);
    if (txStatus !== "All") merged = merged.filter(t => t.status === txStatus);
    if (txCategory !== "All") merged = merged.filter(t => t.category === txCategory);
    if (txFrom) merged = merged.filter(t => t.date >= txFrom);
    if (txTo) merged = merged.filter(t => t.date <= txTo);
    if (txSearch.trim()) {
      const q = txSearch.toLowerCase();
      merged = merged.filter(t => t.party.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    merged.sort((a, b) => {
      let cmp = 0;
      if (txSort === "date") cmp = a.date.localeCompare(b.date);
      else if (txSort === "amount") cmp = a.amount - b.amount;
      else cmp = a.status.localeCompare(b.status);
      return txSortDir === "asc" ? cmp : -cmp;
    });
    return merged;
  }, [filteredIn, filteredOut, txType, txStatus, txCategory, txFrom, txTo, txSearch, txSort, txSortDir]);

  function toggleSort(col: "date" | "amount" | "status") {
    if (txSort === col) setTxSortDir(d => d === "asc" ? "desc" : "asc");
    else { setTxSort(col); setTxSortDir("desc"); }
  }

  // ── Cash position helpers ─────────────────────────────────────────────────
  const cashKpis = useMemo(() => {
    const totalEgp = calculateCashOnHand(accounts, fx);
    const business = accounts
      .filter(a => ["Business Bank", "USD Account", "Savings", "Physical Cash"].includes(a.accountType) && a.owner !== "Bassel Personal")
      .reduce((s, a) => s + (a.currency === "USD" ? a.balanceNative * fx.usdEgp : a.currency === "EUR" ? a.balanceNative * fx.eurEgp : a.balanceNative), 0);
    const personal = accounts
      .filter(a => a.accountType === "Personal Bank")
      .reduce((s, a) => s + (a.currency === "USD" ? a.balanceNative * fx.usdEgp : a.currency === "EUR" ? a.balanceNative * fx.eurEgp : a.balanceNative), 0);
    const usdNative = accounts.filter(a => a.currency === "USD").reduce((s, a) => s + a.balanceNative, 0);
    return { totalEgp, business, personal, usdNative };
  }, [accounts, fx]);

  function balanceEgp(a: CashAccount) {
    if (a.currency === "USD") return a.balanceNative * fx.usdEgp;
    if (a.currency === "EUR") return a.balanceNative * fx.eurEgp;
    return a.balanceNative;
  }

  function startBalanceEdit(idx: number) { setEditingBalanceIdx(idx); setBalanceEditValue(String(accounts[idx].balanceNative)); }
  function saveBalanceEdit() {
    if (editingBalanceIdx === null) return;
    const v = parseFloat(balanceEditValue) || 0;
    setAccounts(accounts.map((a, i) => i === editingBalanceIdx ? { ...a, balanceNative: v, lastUpdated: todayStr } : a));
    setEditingBalanceIdx(null);
  }
  function addAccount() {
    if (!accountForm.accountName.trim()) return;
    setAccounts([...accounts, { ...accountForm, balanceNative: Number(accountForm.balanceNative) || 0 }]);
    setAccountForm({ accountName: "", accountType: "Business Bank", owner: "Wasla Ventures", currency: "EGP", balanceNative: 0, lastUpdated: todayStr, bankLocation: "", notes: "" });
    setAddAccountModal(false);
  }

  // Capital tracker
  const basselPaid = MONEY_OUT_SEED.filter(r => r.paidBy === "Bassel Personal").reduce((s, r) => s + r.amount, 0);
  const basselRemaining = BASSEL_COMMITMENT - basselPaid;

  // Projections
  const projData = useMemo(() => {
    const inByMonth: Record<string, number> = {};
    const outByMonth: Record<string, number> = {};
    MONEY_IN_SEED.forEach(r => { const k = r.date.slice(0, 7); inByMonth[k] = (inByMonth[k] || 0) + r.amount; });
    MONEY_OUT_SEED.forEach(r => { const k = r.date.slice(0, 7); outByMonth[k] = (outByMonth[k] || 0) + r.amount; });
    return PROJECTIONS_SEED.map(p => {
      const revActual = inByMonth[p.month] || 0;
      const burnActual = outByMonth[p.month] || 0;
      const revVar = p.revenuePlan > 0 ? ((revActual - p.revenuePlan) / p.revenuePlan) * 100 : 0;
      const burnVar = p.burnPlan > 0 ? ((burnActual - p.burnPlan) / p.burnPlan) * 100 : 0;
      return {
        month: p.month, monthLabel: mLabel(p.month),
        revenuePlan: p.revenuePlan, revenueActual: revActual, revVar,
        burnPlan: p.burnPlan, burnActual: burnActual, burnVar,
      };
    });
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Finance</h1>
          <p className="text-[11px] text-muted-foreground/60 mt-1">Synced from: Wasla Ventures Master Google Sheet · Last synced: {todayStr}</p>
        </div>
        {page === "engine" && (
          <Select value={ventureFilter} onValueChange={setVentureFilter}>
            <SelectTrigger className="w-[200px] h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {allVentures.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="flex gap-0 border-b border-border">
        {[{ id: "engine", l: "Engine" }, { id: "subscriptions", l: "Subscriptions" }].map(p => (
          <button key={p.id} onClick={() => setPage(p.id as any)} className={`px-4 py-2 text-[12px] font-semibold transition-colors border-b-2 ${page === p.id ? "text-secondary border-secondary" : "text-muted-foreground border-transparent hover:text-foreground"}`}>
            {p.l}
          </button>
        ))}
      </div>

      {page === "engine" && (
      <div className="flex gap-0 border-b border-border">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 text-[11px] font-medium transition-colors border-b-2 ${tab === t.id ? "text-secondary border-secondary" : "text-muted-foreground border-transparent hover:text-foreground"}`}>
            {t.l}
          </button>
        ))}
      </div>
      )}

      {page === "engine" && (<>


      {/* ─── OVERVIEW ─────────────────────────────────────────────────────── */}
      {tab === "overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2.5">
            <KPI label="Total Revenue" value={fmtE(overview.tR)} sub={`${filteredIn.length} txns`} color="hsl(220,95%,47%)" prefix="EGP " />
            <KPI label="Total Expenses" value={fmtE(overview.tE)} sub={`${filteredOut.length} items`} color="hsl(350,75%,50%)" prefix="EGP " />
            <KPI label="Net Position" value={fmtE(overview.net)} color={overview.net >= 0 ? "hsl(160,80%,40%)" : "hsl(350,75%,50%)"} prefix="EGP " />
            <KPI label="Monthly Burn" value={fmtE(overview.burn)} sub="3mo avg" color="hsl(350,75%,50%)" prefix="EGP " />
            <div className="bg-card rounded-xl p-4 border border-border relative overflow-hidden">
              <div className="absolute top-0 left-0 w-[3px] h-full" style={{ background: runwayDisplay.color }} />
              <div className="text-[9px] text-muted-foreground/50 font-bold uppercase tracking-wide mb-1">Runway</div>
              <div className="text-xl font-bold tracking-tight" style={{ color: cashIsZero ? "hsl(220,15%,50%)" : "hsl(var(--foreground))" }}>{runwayDisplay.value}</div>
              {cashIsZero ? (
                <button onClick={() => setTab("cash")} className="text-[10px] text-secondary hover:underline mt-0.5">Open Cash Position</button>
              ) : <div className="text-[10px] text-muted-foreground/50 mt-0.5">{runwayDisplay.sub}</div>}
            </div>
            <KPI label="MRR" value={fmtE(overview.mrr)} sub="Monthly Recurring" color="hsl(168,100%,42%)" prefix="EGP " />
            <KPI label="Pending Revenue" value={fmtE(overview.pendingTotal)} sub={`${overview.pendingCount} invoices`} color="hsl(36,90%,53%)" prefix="EGP " />
          </div>

          <div className="grid lg:grid-cols-3 gap-3">
            {/* Invoice Aging */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-xs font-semibold text-foreground mb-0.5">Invoice Aging</div>
              <div className="text-[10px] text-muted-foreground/50 mb-3">Pending invoices by age</div>
              <div className="space-y-2">
                {[
                  { l: "0-30 days", b: overview.aging.thirtyDays, c: "hsl(160,80%,40%)" },
                  { l: "31-60 days", b: overview.aging.sixtyDays, c: "hsl(36,90%,53%)" },
                  { l: "60+ days", b: overview.aging.sixtyPlusDays, c: overview.aging.sixtyPlusDays.count > 0 ? "hsl(350,75%,50%)" : "hsl(220,15%,38%)" },
                ].map(row => (
                  <div key={row.l} className="flex items-center justify-between text-[11px] py-1.5 border-b border-border/30 last:border-0">
                    <span className="text-muted-foreground">{row.l}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground/60">{row.b.count} inv</span>
                      <span className="font-semibold" style={{ color: row.c }}>{fmtF(row.b.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 5 Clients */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-xs font-semibold text-foreground mb-0.5">Top 5 Clients</div>
              <div className="text-[10px] text-muted-foreground/50 mb-3">Revenue concentration</div>
              <div className="space-y-2">
                {overview.top5.map((c, i) => (
                  <div key={c.client}>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold text-foreground truncate">{c.client}</span>
                      <span className="text-muted-foreground/60 text-[10px]">{c.percentage.toFixed(0)}% · {fmtF(c.total)}</span>
                    </div>
                    <div className="h-1 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${c.percentage}%`, background: PC[i % PC.length] }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recurring vs One-Time */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-xs font-semibold text-foreground mb-0.5">Revenue Mix</div>
              <div className="text-[10px] text-muted-foreground/50 mb-3">Recurring vs One-Time</div>
              <div className="h-3 rounded-full overflow-hidden flex bg-muted">
                <div className="h-full" style={{ width: `${overview.recPct}%`, background: "hsl(168,100%,42%)" }} />
                <div className="h-full" style={{ width: `${overview.otPct}%`, background: "hsl(220,95%,47%)" }} />
              </div>
              <div className="mt-3 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm" style={{ background: "hsl(168,100%,42%)" }} />Recurring</span>
                  <span className="text-muted-foreground">{fmtF(overview.mix.recurring)} ({overview.recPct.toFixed(0)}%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm" style={{ background: "hsl(220,95%,47%)" }} />One-Time</span>
                  <span className="text-muted-foreground">{fmtF(overview.mix.oneTime)} ({overview.otPct.toFixed(0)}%)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[5fr_3fr] gap-3">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-xs font-semibold text-foreground mb-0.5">Revenue vs Expenses</div>
              <div className="text-[10px] text-muted-foreground/50 mb-3">Monthly</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={overview.monthly} barGap={2} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(220,15%,38%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "hsl(220,15%,38%)" }} axisLine={false} tickLine={false} tickFormatter={v => (v / 1000).toFixed(0) + "K"} />
                  <Tooltip content={<ChartTip />} />
                  <Bar dataKey="revenue" name="Revenue" fill="hsl(220,95%,47%)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="rgba(240,64,96,.45)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-xs font-semibold text-foreground mb-0.5">Expense Split</div>
              <div className="text-[10px] text-muted-foreground/50 mb-3">By category</div>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={overview.eb} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={62} paddingAngle={3} strokeWidth={0}>
                    {overview.eb.map((_, i) => <Cell key={i} fill={PC[i % PC.length]} />)}
                  </Pie>
                  <Tooltip content={<ChartTip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-2 gap-y-1 justify-center mt-1">
                {overview.eb.map((e, i) => (
                  <div key={i} className="flex items-center gap-1 text-[9px] text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-sm" style={{ background: PC[i % PC.length] }} />
                    {e.name} {e.pct}%
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">SaaS subscriptions <span className="text-muted-foreground/60">({activeSubs.length} active)</span></span>
                <button onClick={() => setPage("subscriptions")} className="font-semibold text-foreground hover:text-secondary">{fmtF(subsMonthlySpend)}<span className="text-muted-foreground/60 font-normal"> / mo</span></button>
              </div>
            </div>
          </div>

          {/* Actual vs Plan */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs font-semibold text-foreground mb-0.5">Actual vs Plan</div>
            <div className="text-[10px] text-muted-foreground/50 mb-3">FY26 revenue plan vs actual</div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={overview.avp}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" vertical={false} />
                <XAxis dataKey="monthLabel" tick={{ fontSize: 10, fill: "hsl(220,15%,38%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "hsl(220,15%,38%)" }} axisLine={false} tickLine={false} tickFormatter={v => (v / 1000).toFixed(0) + "K"} />
                <Tooltip content={<ChartTip />} />
                <Line type="monotone" dataKey="actual" name="Actual" stroke="hsl(220,95%,47%)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="plan" name="Plan" stroke="hsl(220,95%,67%)" strokeDasharray="4 4" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-6 mt-3 text-[11px]">
              <div><span className="text-muted-foreground/60">YTD Actual: </span><span className="font-semibold text-foreground">{fmtF(overview.ytdActual)}</span></div>
              <div><span className="text-muted-foreground/60">YTD Plan: </span><span className="font-semibold text-foreground">{fmtF(overview.ytdPlan)}</span></div>
              <div><span className="text-muted-foreground/60">Variance: </span><span className="font-semibold" style={{ color: overview.ytdVar >= 0 ? "hsl(160,80%,40%)" : "hsl(350,75%,50%)" }}>{overview.ytdVar >= 0 ? "+" : ""}{overview.ytdVar.toFixed(1)}%</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TRANSACTIONS ────────────────────────────────────────────────── */}
      {tab === "transactions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground/60">Source: Wasla Ventures Master · Money In + Money Out · Read-only</p>
            <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "hsl(220,15%,38%,0.18)", color: "hsl(220,15%,70%)" }}>Read-only · Edit in Google Sheet</span>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 flex flex-wrap items-center gap-2">
            <Select value={txType} onValueChange={setTxType}>
              <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="All">All Types</SelectItem><SelectItem value="Income">Income</SelectItem><SelectItem value="Expense">Expense</SelectItem></SelectContent>
            </Select>
            <Select value={txStatus} onValueChange={setTxStatus}>
              <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["All", "Paid", "50% Paid", "Pending", "Overdue"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={txCategory} onValueChange={setTxCategory}>
              <SelectTrigger className="w-[160px] h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{allTxCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Input type="date" value={txFrom} onChange={e => setTxFrom(e.target.value)} className="h-8 text-xs w-[140px]" placeholder="From" />
            <Input type="date" value={txTo} onChange={e => setTxTo(e.target.value)} className="h-8 text-xs w-[140px]" placeholder="To" />
            <Input value={txSearch} onChange={e => setTxSearch(e.target.value)} placeholder="Search client/vendor/desc" className="h-8 text-xs flex-1 min-w-[180px]" />
            <div className="text-[10px] text-muted-foreground ml-auto">{transactions.length} results</div>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-border">
                    {[
                      { k: "date", l: "Date", sort: true }, { k: "type", l: "Type" }, { k: "party", l: "Client / Vendor" },
                      { k: "venture", l: "Venture" }, { k: "category", l: "Category" }, { k: "desc", l: "Description" },
                      { k: "amount", l: "Amount", sort: true }, { k: "status", l: "Status", sort: true }, { k: "paidBy", l: "Paid By" }, { k: "notes", l: "Notes" },
                    ].map(h => (
                      <th key={h.k} className="text-left p-2 font-semibold text-muted-foreground/50 text-[9px] uppercase tracking-wide">
                        {h.sort ? (
                          <button onClick={() => toggleSort(h.k as any)} className="hover:text-foreground">
                            {h.l} {txSort === h.k && (txSortDir === "asc" ? "↑" : "↓")}
                          </button>
                        ) : h.l}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, txLimit).map((t, i) => (
                    <tr key={i} className="border-b border-border/30 relative">
                      <td className="p-0"><div className="w-[3px] h-full absolute left-0 top-0 bottom-0" style={{ background: t.type === "Income" ? "hsl(160,80%,40%)" : "hsl(350,75%,50%)" }} /></td>
                      <td className="p-2 pl-3 text-muted-foreground/50">{t.date}</td>
                      <td className="p-2"><span className="text-[9px] font-semibold px-1.5 py-0.5 rounded" style={{ background: t.type === "Income" ? "hsl(160,80%,40%,0.13)" : "hsl(350,75%,50%,0.13)", color: t.type === "Income" ? "hsl(160,80%,40%)" : "hsl(350,75%,50%)" }}>{t.type}</span></td>
                      <td className="p-2 font-semibold text-foreground">{t.party}</td>
                      <td className="p-2 text-muted-foreground">{t.venture}</td>
                      <td className="p-2 text-muted-foreground">{t.category}</td>
                      <td className="p-2 text-muted-foreground">{t.description}</td>
                      <td className="p-2 font-semibold" style={{ color: t.type === "Income" ? "hsl(160,80%,40%)" : "hsl(350,75%,50%)" }}>{t.type === "Expense" ? "-" : ""}{fmtF(t.amount)}</td>
                      <td className="p-2"><StatusBadge status={t.status} /></td>
                      <td className="p-2 text-muted-foreground">{t.paidBy}</td>
                      <td className="p-2 text-muted-foreground/60 max-w-[180px] truncate">{t.notes || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {transactions.length > txLimit && (
              <div className="p-3 border-t border-border flex justify-center">
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setTxLimit(l => l + 50)}>Load more ({transactions.length - txLimit} remaining)</Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── SALARIES (unchanged behavior) ──────────────────────────────── */}
      {tab === "salaries" && (() => {
        const totalMonthly = salaries.reduce((s, r) => s + r.monthlySalary, 0);
        const totalAnnual = totalMonthly * 12;
        const paid = salaries.filter(s => s.monthlySalary > 0).length;

        function startEdit(idx: number) { setEditingIdx(idx); setEditValue(String(salaries[idx].monthlySalary)); }
        function saveEdit() {
          if (editingIdx === null) return;
          const v = parseInt(editValue) || 0;
          setSalaries(salaries.map((s, i) => i === editingIdx ? { ...s, monthlySalary: v } : s));
          setEditingIdx(null);
        }
        function addSalary() {
          if (!salaryForm.name.trim()) return;
          const initials = salaryForm.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
          const colors = ["hsl(220,95%,47%)", "hsl(168,100%,42%)", "hsl(160,80%,40%)", "hsl(250,60%,60%)", "hsl(36,90%,53%)", "hsl(330,80%,60%)"];
          setSalaries([...salaries, {
            name: salaryForm.name, role: salaryForm.role, dept: salaryForm.dept,
            monthlySalary: parseInt(salaryForm.monthlySalary) || 0,
            equity: salaryForm.equity, venture: salaryForm.venture, initials, color: colors[salaries.length % colors.length],
          }]);
          setSalaryForm({ name: "", role: "", dept: "Engineering", monthlySalary: "", equity: "—", venture: "Wasla Solutions" });
          setAddSalaryModal(false);
        }
        function confirmRemove() {
          if (!pendingDelete) return;
          setSalaries(salaries.filter((_, i) => i !== pendingDelete.idx));
          setPendingDelete(null);
        }

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2.5">
              <KPI label="Monthly Payroll" value={fmtE(totalMonthly)} sub={`${paid} salaried members`} color="hsl(220,95%,47%)" prefix="EGP " />
              <KPI label="Annual Payroll" value={fmtE(totalAnnual)} sub="Projected" color="hsl(168,100%,42%)" prefix="EGP " />
              <KPI label="Team Size" value={String(salaries.length)} sub={`${salaries.filter(s => s.equity !== "—").length} with equity`} color="hsl(250,60%,60%)" />
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs font-semibold text-foreground">Salary Register</div>
                  <div className="text-[10px] text-muted-foreground/50">Click the pencil icon to edit salaries inline</div>
                </div>
                <Button size="sm" className="h-7 text-xs gap-1.5" onClick={() => setAddSalaryModal(true)}>
                  <Plus className="w-3 h-3" /> Add Member
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-border">
                      {["", "Name", "Role", "Venture", "Monthly Salary", "Annual", "Equity", ""].map((h, hi) => (
                        <th key={hi} className="text-left p-2 font-semibold text-muted-foreground/50 text-[9px] uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {salaries.map((s, i) => (
                      <tr key={i} className="border-b border-border/30">
                        <td className="p-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: `${s.color}22`, border: `1.5px solid ${s.color}55`, color: s.color }}>
                            {s.initials}
                          </div>
                        </td>
                        <td className="p-2 font-semibold text-foreground">{s.name}</td>
                        <td className="p-2 text-muted-foreground">{s.role}</td>
                        <td className="p-2">
                          <span className="text-[9px] font-semibold px-2 py-0.5 rounded" style={{ background: "hsl(168,100%,42%,0.12)", color: "hsl(168,100%,42%)" }}>{s.venture}</span>
                        </td>
                        <td className="p-2">
                          {editingIdx === i ? (
                            <div className="flex items-center gap-1">
                              <Input value={editValue} onChange={e => setEditValue(e.target.value)} className="h-7 w-24 text-xs" type="number" autoFocus onKeyDown={e => e.key === "Enter" && saveEdit()} />
                              <button onClick={saveEdit} className="p-1 rounded hover:bg-muted"><Check className="w-3 h-3" style={{ color: "hsl(160,80%,40%)" }} /></button>
                              <button onClick={() => setEditingIdx(null)} className="p-1 rounded hover:bg-muted"><X className="w-3 h-3 text-muted-foreground" /></button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-foreground">{s.monthlySalary > 0 ? fmtF(s.monthlySalary) : "—"}</span>
                              <button onClick={() => startEdit(i)} className="p-1 rounded hover:bg-muted opacity-50 hover:opacity-100"><Pencil className="w-3 h-3 text-muted-foreground" /></button>
                            </div>
                          )}
                        </td>
                        <td className="p-2 text-muted-foreground">{s.monthlySalary > 0 ? fmtF(s.monthlySalary * 12) : "—"}</td>
                        <td className="p-2">
                          {s.equity !== "—" ? (
                            <span className="text-[9px] font-semibold px-2 py-0.5 rounded" style={{ background: "hsl(220,95%,47%,0.12)", color: "hsl(220,95%,47%)" }}>{s.equity}</span>
                          ) : <span className="text-muted-foreground">—</span>}
                        </td>
                        <td className="p-2">
                          <button onClick={() => setPendingDelete({ idx: i, name: s.name })} className="p-1 rounded hover:bg-muted opacity-40 hover:opacity-100">
                            <Trash2 className="w-3 h-3 text-muted-foreground" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-border">
                      <td colSpan={4} className="p-2 text-right font-bold text-muted-foreground text-[11px]">TOTAL</td>
                      <td className="p-2 font-bold text-[13px]" style={{ color: "hsl(220,95%,47%)" }}>{fmtF(totalMonthly)}</td>
                      <td className="p-2 font-bold text-[13px]" style={{ color: "hsl(168,100%,42%)" }}>{fmtF(totalAnnual)}</td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <Dialog open={addSalaryModal} onOpenChange={setAddSalaryModal}>
              <DialogContent className="sm:max-w-[420px] bg-card border-border">
                <DialogHeader><DialogTitle>Add Team Member Salary</DialogTitle></DialogHeader>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Full Name *</label><Input value={salaryForm.name} onChange={e => setSalaryForm({ ...salaryForm, name: e.target.value })} className="h-8 text-xs" /></div>
                  <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Role</label><Input value={salaryForm.role} onChange={e => setSalaryForm({ ...salaryForm, role: e.target.value })} className="h-8 text-xs" /></div>
                  <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Monthly Salary</label><Input value={salaryForm.monthlySalary} onChange={e => setSalaryForm({ ...salaryForm, monthlySalary: e.target.value })} className="h-8 text-xs" type="number" /></div>
                  <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Equity</label><Input value={salaryForm.equity} onChange={e => setSalaryForm({ ...salaryForm, equity: e.target.value })} className="h-8 text-xs" /></div>
                  <div className="space-y-1 col-span-2"><label className="text-[10px] text-muted-foreground font-medium">Venture / Subsidiary</label><Input value={salaryForm.venture} onChange={e => setSalaryForm({ ...salaryForm, venture: e.target.value })} className="h-8 text-xs" /></div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setAddSalaryModal(false)} className="text-xs h-8">Cancel</Button>
                  <Button onClick={addSalary} disabled={!salaryForm.name.trim()} className="text-xs h-8">Add</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={!!pendingDelete} onOpenChange={() => setPendingDelete(null)}>
              <DialogContent className="sm:max-w-[380px] bg-card border-border">
                <DialogHeader>
                  <DialogTitle>Remove Team Member</DialogTitle>
                  <DialogDescription>Are you sure you want to remove <strong>{pendingDelete?.name}</strong> from the salary register?</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setPendingDelete(null)} className="text-xs h-8">Cancel</Button>
                  <Button variant="destructive" onClick={confirmRemove} className="text-xs h-8">Remove</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );
      })()}

      {/* ─── CASH POSITION ───────────────────────────────────────────────── */}
      {tab === "cash" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground/60">Source: Wasla Ventures Master · Cash Position · Read-only</p>
            <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "hsl(220,15%,38%,0.18)", color: "hsl(220,15%,70%)" }}>Read-only · Edit in Google Sheet</span>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs font-semibold text-foreground mb-0.5">Exchange Rates</div>
            <div className="text-[10px] text-muted-foreground/50 mb-3">Used to convert balances to EGP</div>
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground font-medium">USD to EGP</label>
                <Input type="number" value={fx.usdEgp} onChange={e => setFx({ ...fx, usdEgp: parseFloat(e.target.value) || 0, lastUpdated: todayStr })} className="h-8 w-32 text-xs" step="0.01" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground font-medium">EUR to EGP</label>
                <Input type="number" value={fx.eurEgp} onChange={e => setFx({ ...fx, eurEgp: parseFloat(e.target.value) || 0, lastUpdated: todayStr })} className="h-8 w-32 text-xs" step="0.01" />
              </div>
              <div className="text-[10px] text-muted-foreground/60 ml-auto">Last Updated: {fx.lastUpdated}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            <KPI label="Total Cash (EGP)" value={fmtE(cashKpis.totalEgp)} sub="All accounts" color="hsl(160,80%,40%)" prefix="EGP " />
            <KPI label="Business Accounts" value={fmtE(cashKpis.business)} sub="Wasla-owned" color="hsl(220,95%,47%)" prefix="EGP " />
            <KPI label="Personal Accounts" value={fmtE(cashKpis.personal)} sub="Founder funds" color="hsl(250,60%,60%)" prefix="EGP " />
            <KPI label="USD Holdings" value={cashKpis.usdNative.toLocaleString()} sub="Native USD" color="hsl(168,100%,42%)" prefix="$" />
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs font-semibold text-foreground">Accounts</div>
                <div className="text-[10px] text-muted-foreground/50">Click a balance cell to edit inline</div>
              </div>
              <Button size="sm" className="h-7 text-xs gap-1.5" onClick={() => setAddAccountModal(true)}>
                <Plus className="w-3 h-3" /> Add Account
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-border">
                    {["Account Name", "Type", "Owner", "Currency", "Balance (Native)", "Balance (EGP)", "Last Updated", "Bank / Location", "Notes"].map(h => (
                      <th key={h} className="text-left p-2 font-semibold text-muted-foreground/50 text-[9px] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((a, i) => (
                    <tr key={i} className="border-b border-border/30">
                      <td className="p-2 font-semibold text-foreground">{a.accountName}</td>
                      <td className="p-2 text-muted-foreground">{a.accountType}</td>
                      <td className="p-2 text-muted-foreground">{a.owner}</td>
                      <td className="p-2 text-muted-foreground">{a.currency}</td>
                      <td className="p-2">
                        {editingBalanceIdx === i ? (
                          <div className="flex items-center gap-1">
                            <Input value={balanceEditValue} onChange={e => setBalanceEditValue(e.target.value)} className="h-7 w-28 text-xs" type="number" autoFocus onKeyDown={e => e.key === "Enter" && saveBalanceEdit()} />
                            <button onClick={saveBalanceEdit} className="p-1 rounded hover:bg-muted"><Check className="w-3 h-3" style={{ color: "hsl(160,80%,40%)" }} /></button>
                            <button onClick={() => setEditingBalanceIdx(null)} className="p-1 rounded hover:bg-muted"><X className="w-3 h-3 text-muted-foreground" /></button>
                          </div>
                        ) : (
                          <button onClick={() => startBalanceEdit(i)} className="font-semibold text-foreground hover:text-secondary">
                            {a.currency} {a.balanceNative.toLocaleString()}
                          </button>
                        )}
                      </td>
                      <td className="p-2 font-semibold text-foreground">{fmtF(balanceEgp(a))}</td>
                      <td className="p-2 text-muted-foreground/60">{a.lastUpdated}</td>
                      <td className="p-2 text-muted-foreground">{a.bankLocation || "—"}</td>
                      <td className="p-2 text-muted-foreground/60 max-w-[200px] truncate">{a.notes || "—"}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border">
                    <td colSpan={5} className="p-2 text-right font-bold text-muted-foreground text-[11px]">TOTAL (EGP)</td>
                    <td className="p-2 font-bold text-[13px]" style={{ color: "hsl(160,80%,40%)" }}>{fmtF(cashKpis.totalEgp)}</td>
                    <td colSpan={3}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs font-semibold text-foreground mb-0.5">Capital Contribution Tracker</div>
            <div className="text-[10px] text-muted-foreground/50 mb-3">Full details on Cap Table tab (Network page)</div>
            <div className="space-y-2 text-[12px]">
              <div className="flex items-center justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">Paid by Bassel Personal (from Money Out)</span>
                <span className="font-semibold text-foreground">{fmtF(basselPaid)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">Bassel Committed</span>
                <span className="font-semibold text-foreground">{fmtF(BASSEL_COMMITMENT)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Remaining Commitment</span>
                <span className="font-semibold" style={{ color: basselRemaining > 0 ? "hsl(36,90%,53%)" : "hsl(160,80%,40%)" }}>{fmtF(basselRemaining)}</span>
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground/60 mt-3 italic">
              These numbers flow from Money Out entries marked Paid By = Bassel Personal. To edit commitments, visit Cap Table on the Network page.
            </div>
          </div>

          <Dialog open={addAccountModal} onOpenChange={setAddAccountModal}>
            <DialogContent className="sm:max-w-[480px] bg-card border-border">
              <DialogHeader><DialogTitle>Add Cash Account</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 col-span-2"><label className="text-[10px] text-muted-foreground font-medium">Account Name *</label><Input value={accountForm.accountName} onChange={e => setAccountForm({ ...accountForm, accountName: e.target.value })} className="h-8 text-xs" /></div>
                <div className="space-y-1">
                  <label className="text-[10px] text-muted-foreground font-medium">Type</label>
                  <Select value={accountForm.accountType} onValueChange={v => setAccountForm({ ...accountForm, accountType: v })}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{["Business Bank", "Personal Bank", "Physical Cash", "Savings", "USD Account", "Other"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Owner</label><Input value={accountForm.owner} onChange={e => setAccountForm({ ...accountForm, owner: e.target.value })} className="h-8 text-xs" /></div>
                <div className="space-y-1">
                  <label className="text-[10px] text-muted-foreground font-medium">Currency</label>
                  <Select value={accountForm.currency} onValueChange={v => setAccountForm({ ...accountForm, currency: v })}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{["EGP", "USD", "EUR"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Balance (Native)</label><Input type="number" value={accountForm.balanceNative} onChange={e => setAccountForm({ ...accountForm, balanceNative: parseFloat(e.target.value) || 0 })} className="h-8 text-xs" /></div>
                <div className="space-y-1 col-span-2"><label className="text-[10px] text-muted-foreground font-medium">Bank / Location</label><Input value={accountForm.bankLocation} onChange={e => setAccountForm({ ...accountForm, bankLocation: e.target.value })} className="h-8 text-xs" /></div>
                <div className="space-y-1 col-span-2"><label className="text-[10px] text-muted-foreground font-medium">Notes</label><Input value={accountForm.notes} onChange={e => setAccountForm({ ...accountForm, notes: e.target.value })} className="h-8 text-xs" /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddAccountModal(false)} className="text-xs h-8">Cancel</Button>
                <Button onClick={addAccount} disabled={!accountForm.accountName.trim()} className="text-xs h-8">Add Account</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* ─── PROJECTIONS ─────────────────────────────────────────────────── */}
      {tab === "projections" && (
        <div className="space-y-4">
          <div className="bg-muted/40 border border-border rounded-lg p-3 text-[11px] text-muted-foreground">
            Projections from Wasla Ventures Master spreadsheet (Consolidated tab and Total Cost Summary tab). To edit these numbers, update the sheet.
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <KPI label="FY26 Revenue Plan" value={fmtE(FY26_REVENUE_PLAN)} sub="Full year target" color="hsl(220,95%,47%)" prefix="EGP " />
            <KPI label="FY26 Burn Plan" value={fmtE(FY26_BURN_PLAN)} sub="Projected outflow" color="hsl(350,75%,50%)" prefix="EGP " />
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs font-semibold text-foreground mb-0.5">Monthly Plan vs Actual</div>
            <div className="text-[10px] text-muted-foreground/50 mb-3">FY26</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={projData} barGap={1} barSize={9}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" vertical={false} />
                <XAxis dataKey="monthLabel" tick={{ fontSize: 10, fill: "hsl(220,15%,38%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "hsl(220,15%,38%)" }} axisLine={false} tickLine={false} tickFormatter={v => (v / 1000).toFixed(0) + "K"} />
                <Tooltip content={<ChartTip />} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="revenuePlan" name="Revenue Plan" fill="rgba(38,113,232,0.25)" stroke="hsl(220,95%,47%)" strokeWidth={1} radius={[2, 2, 0, 0]} />
                <Bar dataKey="revenueActual" name="Revenue Actual" fill="hsl(220,95%,47%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="burnPlan" name="Burn Plan" fill="rgba(240,64,96,0.2)" stroke="hsl(350,75%,50%)" strokeWidth={1} radius={[2, 2, 0, 0]} />
                <Bar dataKey="burnActual" name="Burn Actual" fill="hsl(350,75%,50%)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs font-semibold text-foreground mb-3">Plan vs Actual Detail</div>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-border">
                    {["Month", "Revenue Plan", "Revenue Actual", "Rev Variance", "Burn Plan", "Burn Actual", "Burn Variance"].map(h => (
                      <th key={h} className="text-left p-2 font-semibold text-muted-foreground/50 text-[9px] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projData.map(r => (
                    <tr key={r.month} className="border-b border-border/30">
                      <td className="p-2 font-semibold text-foreground">{r.monthLabel}</td>
                      <td className="p-2 text-muted-foreground">{fmtF(r.revenuePlan)}</td>
                      <td className="p-2 text-foreground">{fmtF(r.revenueActual)}</td>
                      <td className="p-2 font-semibold" style={{ color: r.revVar >= 0 ? "hsl(160,80%,40%)" : "hsl(350,75%,50%)" }}>
                        {r.revenueActual === 0 ? "—" : `${r.revVar >= 0 ? "+" : ""}${r.revVar.toFixed(1)}%`}
                      </td>
                      <td className="p-2 text-muted-foreground">{fmtF(r.burnPlan)}</td>
                      <td className="p-2 text-foreground">{fmtF(r.burnActual)}</td>
                      <td className="p-2 font-semibold" style={{ color: r.burnActual === 0 ? "hsl(220,15%,38%)" : r.burnVar <= 0 ? "hsl(160,80%,40%)" : "hsl(350,75%,50%)" }}>
                        {r.burnActual === 0 ? "—" : `${r.burnVar >= 0 ? "+" : ""}${r.burnVar.toFixed(1)}%`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      </>)}

      {page === "subscriptions" && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="border-border p-5">
              <div className="text-xs text-muted-foreground">Total active monthly spend</div>
              <div className="mt-1.5 text-[28px] font-semibold tracking-tight">{egp(subsMonthlySpend)}</div>
              <div className="text-[11px] text-muted-foreground">{activeSubs.length} active subscriptions</div>
            </Card>
            <Card className="border-border p-5">
              <div className="text-xs text-muted-foreground">Projected savings at full migration</div>
              <div className="mt-1.5 text-[28px] font-semibold tracking-tight text-[color:var(--success)]">{egp(subsProjectedSavings)}</div>
              <div className="text-[11px] text-muted-foreground">If every replaced tool is cancelled</div>
            </Card>
          </div>

          <Card className="border-border p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-2.5">Subscription</th>
                  <th className="px-2 py-2.5">Replaced by</th>
                  <th className="px-2 py-2.5">Status</th>
                  <th className="px-2 py-2.5">Cutover date</th>
                  <th className="px-2 py-2.5 text-right">Monthly</th>
                  <th className="px-5 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((s) => {
                  const cancelled = s.status === "Cancelled";
                  return (
                    <tr key={s.id} className={cn("border-b border-border/60 last:border-0 transition", cancelled ? "bg-muted/30 text-muted-foreground" : "hover:bg-muted/40")}>
                      <td className="px-5 py-3 font-medium">{s.name}</td>
                      <td className="px-2 text-xs">{s.replacedBy}</td>
                      <td className="px-2"><span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${SUB_STATUS_STYLES[s.status]}`}>{s.status}</span></td>
                      <td className="px-2 text-xs text-muted-foreground">{s.cutoverDate ?? "—"}</td>
                      <td className="px-2 text-right tabular-nums">{egp(s.monthly)}</td>
                      <td className="px-5 py-2 text-right">
                        <div className="inline-flex gap-1">
                          <Button size="sm" variant="ghost" disabled={s.status !== "Active"} onClick={() => { setSubStatus(s.id, "Cutover"); toast.success(`${s.name} marked Cutover`); }}>Mark cutover</Button>
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" disabled={s.status === "Cancelled"} onClick={() => { setSubStatus(s.id, "Cancelled"); toast.success(`${s.name} cancelled`); }}>Cancel</Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>

          <div className="flex items-start gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-[color:var(--warning)]" />
            <span>
              <b className="text-foreground">Cancellation discipline:</b> do not cancel any subscription until the
              replacing Wasla OS module has been live for at least 30 days with the full team adopting it.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export const Route = createFileRoute("/founder/finance")({ component: Finance });
