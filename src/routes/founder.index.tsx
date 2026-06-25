import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { VENTURES_DATA, PORTFOLIO_DATA, VENTURE_PIPELINE_SEED } from "@/data/ventures";
import { INCOME_DATA, EXPENSE_DATA, CLIENT_PIPELINE, TEAM_DATA, fmtCurrency, MONEY_IN_SEED, MONEY_OUT_SEED, CASH_ACCOUNTS_SEED, EXCHANGE_RATES_SEED } from "@/data/finance";
import { calculateMonthlyBurn, calculateCashOnHand, calculateRunway, calculateMRR, calculateInvoiceAging, calculateClientConcentration } from "@/lib/finance-calculations";
import { CLIENT_DIRECTORY_SEED } from "@/data/clients";
import { useTasks } from "@/lib/tasks-store";
import { useHiring } from "@/contexts/HiringContext";
import { members, bodEod } from "@/lib/mock-data";
import { AlertTriangle, Clock, Rocket, Briefcase, Users, DollarSign, Target, ArrowUpRight, ArrowDownRight, Activity, Wallet, Flame, Repeat, CheckCircle2, UserCheck, ListChecks, ClipboardList, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/founder/")({ component: CommandCenter });


const ChartTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-muted p-2 rounded-lg border border-border text-[11px]">
      <div className="font-semibold text-muted-foreground/50 text-[10px] mb-1">{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-1.5 mt-0.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground/60">{p.name}:</span>
          <span className="font-semibold text-foreground">EGP {Math.round(p.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

const StageBadge = ({ stage, color }: { stage: string; color: string }) => (
  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wide uppercase" style={{ background: `${color}22`, color }}>{stage}</span>
);

function CommandCenter() {
  const metrics = useMemo(() => {
    const totalRevenue = INCOME_DATA.reduce((s, r) => s + r.amount, 0);
    const totalExpenses = EXPENSE_DATA.reduce((s, r) => s + r.amount, 0);
    const net = totalRevenue - totalExpenses;
    const pendingRevenue = INCOME_DATA.filter(r => r.status === "Pending").reduce((s, r) => s + r.amount, 0);
    const paidRevenue = INCOME_DATA.filter(r => r.status === "Paid").reduce((s, r) => s + r.amount, 0);
    const liveVentures = VENTURES_DATA.filter(v => ["Live", "Building"].includes(v.stage)).length;
    const totalVentures = VENTURES_DATA.length;
    const portfolioCount = PORTFOLIO_DATA.length;
    const pipelineDeals = VENTURE_PIPELINE_SEED.length;
    const activePipelineDeals = CLIENT_PIPELINE.reduce((s, c) => s + c.deals, 0);
    const pipelineValue = CLIENT_PIPELINE.reduce((s, c) => s + c.value, 0);
    const burnRate = totalExpenses / 7;

    const monthMap = new Map<string, { revenue: number; expenses: number }>();
    INCOME_DATA.forEach(r => {
      const m = r.date.slice(0, 7);
      const e = monthMap.get(m) || { revenue: 0, expenses: 0 };
      e.revenue += r.amount;
      monthMap.set(m, e);
    });
    EXPENSE_DATA.forEach(r => {
      const m = r.date.slice(0, 7);
      const e = monthMap.get(m) || { revenue: 0, expenses: 0 };
      e.expenses += r.amount;
      monthMap.set(m, e);
    });
    const monthlyData = Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => ({
        month: new Date(+k.slice(0, 4), +k.slice(5, 7) - 1).toLocaleDateString("en", { month: "short", year: "2-digit" }),
        revenue: v.revenue,
        expenses: v.expenses,
        profit: v.revenue - v.expenses,
      }));

    const catMap = new Map<string, number>();
    EXPENSE_DATA.forEach(r => catMap.set(r.category, (catMap.get(r.category) || 0) + r.amount));
    const expenseBreakdown = Array.from(catMap.entries())
      .sort(([, a], [, b]) => b - a)
      .map(([name, value], i) => ({
        name,
        value,
        color: ["hsl(220,95%,47%)", "hsl(168,100%,42%)", "hsl(36,90%,53%)", "hsl(250,60%,60%)", "hsl(350,75%,50%)", "hsl(160,80%,40%)"][i % 6],
      }));

    const ventureRevMap = new Map<string, number>();
    INCOME_DATA.forEach(r => ventureRevMap.set(r.venture, (ventureRevMap.get(r.venture) || 0) + r.amount));
    const revenueByVenture = Array.from(ventureRevMap.entries()).map(([name, value]) => ({ name, value }));

    const attentionItems = INCOME_DATA
      .filter(r => r.status === "Pending")
      .map(r => ({ client: r.client, amount: r.amount, service: r.service, date: r.date }));

    const monthlyBurn = calculateMonthlyBurn(MONEY_OUT_SEED);
    const cashOnHand = calculateCashOnHand(CASH_ACCOUNTS_SEED, EXCHANGE_RATES_SEED);
    const runway = calculateRunway(cashOnHand, monthlyBurn);
    const mrr = calculateMRR(MONEY_IN_SEED);
    const invoiceAging = calculateInvoiceAging(MONEY_IN_SEED);
    const topClients = calculateClientConcentration(MONEY_IN_SEED);

    const sortedMonths = Array.from(monthMap.keys()).sort();
    const lastMonth = sortedMonths[sortedMonths.length - 1];
    const prevMonth = sortedMonths[sortedMonths.length - 2];
    const lastBurn = lastMonth ? monthMap.get(lastMonth)!.expenses : 0;
    const prevBurn = prevMonth ? monthMap.get(prevMonth)!.expenses : 0;
    const burnTrend = prevBurn > 0 ? ((lastBurn - prevBurn) / prevBurn) * 100 : null;

    return {
      totalRevenue, totalExpenses, net, pendingRevenue, paidRevenue,
      liveVentures, totalVentures, portfolioCount, pipelineDeals,
      activePipelineDeals, pipelineValue, burnRate,
      monthlyData, expenseBreakdown, revenueByVenture, attentionItems,
      monthlyBurn, cashOnHand, runway, mrr, invoiceAging, topClients, burnTrend,
    };
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="px-6 py-6 space-y-5">
      <div>
        <h1 className="text-[22px] font-bold text-foreground tracking-tight">{greeting}, Bassel</h1>
        <p className="text-xs text-muted-foreground mt-1">Wasla Ventures · Portfolio Command Center</p>
        <p className="text-[11px] text-muted-foreground/70 mt-0.5">
          {metrics.monthlyBurn > 0 && metrics.runway !== null && metrics.cashOnHand > 0
            ? `Burning EGP ${metrics.monthlyBurn.toLocaleString()}/mo. ${metrics.runway.toFixed(1)} months of runway.`
            : "Configure Cash Position to see runway."}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {(() => {
          const runwayColor =
            metrics.runway === null || metrics.cashOnHand === 0 ? "hsl(220,15%,45%)" :
            metrics.runway > 6 ? "hsl(160,80%,40%)" :
            metrics.runway >= 3 ? "hsl(36,90%,53%)" :
            "hsl(350,75%,50%)";
          const runwayValue =
            metrics.cashOnHand === 0 ? "Set balances" :
            metrics.runway === null ? "∞" :
            `${metrics.runway.toFixed(1)} months`;
          const cashValue = metrics.cashOnHand === 0 ? "Set balances" : `EGP ${fmtCurrency(metrics.cashOnHand)}`;
          const burnTrendNode = metrics.burnTrend !== null ? (
            <span className="text-[9px] font-semibold flex items-center gap-0.5" style={{ color: metrics.burnTrend > 0 ? "hsl(350,75%,50%)" : "hsl(160,80%,40%)" }}>
              {metrics.burnTrend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(metrics.burnTrend).toFixed(0)}%
            </span>
          ) : null;

          const kpis = [
            { icon: Wallet, label: "Cash on Hand", value: cashValue, sub: "Across all accounts", color: "hsl(220,95%,47%)", trend: null as React.ReactNode },
            { icon: Activity, label: "Runway", value: runwayValue, sub: "At current burn rate", color: runwayColor, trend: null },
            { icon: Flame, label: "Monthly Burn", value: `EGP ${fmtCurrency(metrics.monthlyBurn)}`, sub: "3-month average", color: "hsl(350,75%,50%)", trend: burnTrendNode },
            { icon: Repeat, label: "MRR", value: `EGP ${fmtCurrency(metrics.mrr)}`, sub: "Monthly recurring", color: "hsl(168,100%,42%)", trend: null },
            { icon: Rocket, label: "Active Ventures", value: `${metrics.liveVentures}`, sub: `${metrics.totalVentures} total`, color: "hsl(250,60%,60%)", trend: null },
            { icon: Target, label: "Pipeline Value", value: `EGP ${fmtCurrency(metrics.pipelineValue)}`, sub: `${metrics.activePipelineDeals} active deals`, color: "hsl(36,90%,53%)", trend: null },
          ];
          return kpis.map((kpi) => (
            <div key={kpi.label}>
              <div className="bg-card rounded-xl p-3.5 border border-border relative overflow-hidden group hover:border-secondary/30 transition-colors h-full">
                <div className="absolute top-0 left-0 w-[3px] h-full" style={{ background: kpi.color }} />
                <div className="flex items-center gap-1.5 mb-2">
                  <kpi.icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <div className="text-[9px] text-muted-foreground/60 font-bold uppercase tracking-wide">{kpi.label}</div>
                </div>
                <div className="text-lg font-bold tracking-tight leading-tight" style={{ color: kpi.label === "Runway" ? kpi.color : "hsl(var(--foreground))" }}>{kpi.value}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] text-muted-foreground/50">{kpi.sub}</span>
                  {kpi.trend}
                </div>
              </div>
            </div>
          ));
        })()}
      </div>

      <div className="grid lg:grid-cols-[5fr_3fr] gap-3">
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-0.5">
            <div className="text-xs font-semibold text-foreground">Revenue vs Expenses</div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[9px] text-muted-foreground"><span className="w-2 h-2 rounded-sm" style={{ background: "hsl(220,95%,47%)" }} />Revenue</span>
              <span className="flex items-center gap-1 text-[9px] text-muted-foreground"><span className="w-2 h-2 rounded-sm" style={{ background: "rgba(240,64,96,.45)" }} />Expenses</span>
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground/50 mb-3">Monthly consolidated — all ventures</div>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.monthlyData} barGap={3} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.03)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(220,15%,38%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "hsl(220,15%,38%)" }} axisLine={false} tickLine={false} tickFormatter={v => (v / 1000).toFixed(0) + "K"} />
                <Tooltip content={<ChartTip />} />
                <Bar dataKey="revenue" name="Revenue" fill="hsl(220,95%,47%)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="rgba(240,64,96,.45)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-0.5">
            <AlertTriangle className="w-3.5 h-3.5" style={{ color: "hsl(36,90%,53%)" }} />
            <div className="text-xs font-semibold text-foreground">Attention Required</div>
          </div>
          <div className="text-[10px] text-muted-foreground/50 mb-3">Founder alerts · pending invoices · risks</div>
          {(() => {
            const alerts: { tone: "red" | "amber"; text: string }[] = [];
            if (metrics.runway !== null && metrics.cashOnHand > 0 && metrics.runway < 4) {
              alerts.push({ tone: "red", text: `Runway ${metrics.runway.toFixed(1)} months — secure revenue or reduce burn` });
            }
            if (metrics.invoiceAging.sixtyPlusDays.count > 0) {
              alerts.push({ tone: "red", text: `${metrics.invoiceAging.sixtyPlusDays.count} invoices overdue 60+ days — EGP ${fmtCurrency(metrics.invoiceAging.sixtyPlusDays.total)}` });
            }
            if (metrics.topClients[0] && metrics.topClients[0].percentage > 40) {
              alerts.push({ tone: "amber", text: `${metrics.topClients[0].client} = ${metrics.topClients[0].percentage.toFixed(0)}% of revenue — concentration risk` });
            }
            const hasAny = alerts.length > 0 || metrics.attentionItems.length > 0;
            const toneColor = (t: "red" | "amber") => t === "red" ? "hsl(350,75%,50%)" : "hsl(36,90%,53%)";
            return (
              <div className="space-y-2">
                {alerts.map((a, i) => (
                  <div key={`a-${i}`} className="bg-muted rounded-lg p-2.5 flex items-center gap-1.5" style={{ border: `1px solid ${toneColor(a.tone)}33`, borderLeft: `3px solid ${toneColor(a.tone)}` }}>
                    <AlertTriangle className="w-3 h-3 shrink-0" style={{ color: toneColor(a.tone) }} />
                    <span className="text-[11px] text-foreground">{a.text}</span>
                  </div>
                ))}
                {metrics.attentionItems.map((item, i) => (
                  <div key={i} className="bg-muted rounded-lg p-2.5" style={{ border: "1px solid hsl(36,90%,53%,0.2)" }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className="w-3 h-3" style={{ color: "hsl(36,90%,53%)" }} />
                      <span className="text-[11px] font-semibold text-foreground">{item.client}</span>
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded ml-auto" style={{ background: "hsl(36,90%,53%,0.13)", color: "hsl(36,90%,53%)" }}>Pending</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground">EGP {item.amount.toLocaleString()} · {item.service}</div>
                  </div>
                ))}
                {!hasAny && (
                  <div className="bg-muted rounded-lg p-2.5 flex items-center gap-1.5" style={{ border: "1px solid hsl(160,80%,40%,0.25)", borderLeft: "3px solid hsl(160,80%,40%)" }}>
                    <CheckCircle2 className="w-3 h-3 shrink-0" style={{ color: "hsl(160,80%,40%)" }} />
                    <span className="text-[11px] text-foreground">All systems stable</span>
                  </div>
                )}
              </div>
            );
          })()}

          {(() => {
            const basselPaid = EXPENSE_DATA.filter(r => r.paidBy === "Bassel Personal").reduce((s, r) => s + r.amount, 0);
            return (
              <div className="mt-3 bg-muted rounded-lg p-2.5" style={{ border: "1px solid hsl(250,60%,60%,0.2)" }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <DollarSign className="w-3 h-3" style={{ color: "hsl(250,60%,60%)" }} />
                  <span className="text-[11px] font-semibold text-foreground">Capital Contributed</span>
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded ml-auto" style={{ background: "hsl(250,60%,60%,0.13)", color: "hsl(250,60%,60%)" }}>Bassel</span>
                </div>
                <div className="text-[10px] text-muted-foreground">EGP {basselPaid.toLocaleString()} paid by Bassel Personal</div>
              </div>
            );
          })()}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-0.5">
            <Rocket className="w-3.5 h-3.5" style={{ color: "hsl(168,100%,42%)" }} />
            <div className="text-xs font-semibold text-foreground">Venture Health</div>
          </div>
          <div className="text-[10px] text-muted-foreground/50 mb-3">{VENTURES_DATA.length} ventures · {metrics.liveVentures} active</div>
          {VENTURES_DATA.map((v, i) => (
            <div key={i} className="flex items-center gap-2.5 py-1.5" style={{ borderBottom: i < VENTURES_DATA.length - 1 ? '1px solid hsl(220,25%,16%)' : 'none' }}>
              <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: v.color }} />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-foreground truncate">{v.name}</div>
                <div className="text-[9px] text-muted-foreground">{v.metric}</div>
              </div>
              <StageBadge stage={v.stage} color={v.stageColor} />
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-0.5">
            <Activity className="w-3.5 h-3.5" style={{ color: "hsl(220,95%,47%)" }} />
            <div className="text-xs font-semibold text-foreground">Client Pipeline</div>
          </div>
          <div className="text-[10px] text-muted-foreground/50 mb-3">{metrics.activePipelineDeals} deals · EGP {fmtCurrency(metrics.pipelineValue)} total value</div>
          <div className="space-y-1.5">
            {CLIENT_PIPELINE.map((stage, i) => {
              const maxDeals = Math.max(...CLIENT_PIPELINE.map(s => s.deals));
              const pct = maxDeals > 0 ? (stage.deals / maxDeals) * 100 : 0;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-medium text-foreground">{stage.stage}</span>
                    <span className="text-[10px] text-muted-foreground">{stage.deals} · EGP {fmtCurrency(stage.value)}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: stage.color }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3" style={{ borderTop: '1px solid hsl(220,25%,16%)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-3 h-3" style={{ color: "hsl(250,60%,60%)" }} />
              <span className="text-[10px] font-semibold text-foreground">Venture Pipeline</span>
            </div>
            {VENTURE_PIPELINE_SEED.map((deal, i) => (
              <div key={i} className="flex items-center gap-2 py-1" style={{ borderBottom: i < VENTURE_PIPELINE_SEED.length - 1 ? '1px solid hsl(220,25%,16%)' : 'none' }}>
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: deal.color }} />
                <span className="text-[10px] text-foreground flex-1 truncate">{deal.name}</span>
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded" style={{ background: `hsl(36,90%,53%,0.13)`, color: "hsl(36,90%,53%)" }}>{deal.stage}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-0.5">
            <DollarSign className="w-3.5 h-3.5" style={{ color: "hsl(350,75%,50%)" }} />
            <div className="text-xs font-semibold text-foreground">Expense Breakdown</div>
          </div>
          <div className="text-[10px] text-muted-foreground/50 mb-2">By category</div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={100} height={100}>
              <PieChart>
                <Pie data={metrics.expenseBreakdown} dataKey="value" cx="50%" cy="50%" innerRadius={28} outerRadius={44} strokeWidth={0}>
                  {metrics.expenseBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1">
              {metrics.expenseBreakdown.map((cat, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: cat.color }} />
                  <span className="text-[10px] text-foreground flex-1">{cat.name}</span>
                  <span className="text-[10px] font-semibold text-muted-foreground">{fmtCurrency(cat.value)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3" style={{ borderTop: '1px solid hsl(220,25%,16%)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-3 h-3" style={{ color: "hsl(168,100%,42%)" }} />
              <span className="text-[10px] font-semibold text-foreground">Portfolio & Holdings</span>
              <span className="text-[9px] text-muted-foreground ml-auto">{PORTFOLIO_DATA.length} positions</span>
            </div>
            {PORTFOLIO_DATA.map((p, i) => (
              <div key={i} className="flex items-center gap-2 py-1" style={{ borderBottom: i < PORTFOLIO_DATA.length - 1 ? '1px solid hsl(220,25%,16%)' : 'none' }}>
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: p.color }} />
                <span className="text-[10px] text-foreground flex-1 truncate">{p.name}</span>
                <span className="text-[10px] font-semibold" style={{ color: p.color }}>{p.stake}</span>
                <StageBadge stage={p.status} color={p.status === "Active" || p.status === "Confirmed" ? "hsl(160,80%,40%)" : "hsl(36,90%,53%)"} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[4fr_3fr_3fr] gap-3">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-xs font-semibold text-foreground mb-0.5">Profit Trend</div>
          <div className="text-[10px] text-muted-foreground/50 mb-3">Monthly net position (Revenue − Expenses)</div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={metrics.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.03)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: "hsl(220,15%,38%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "hsl(220,15%,38%)" }} axisLine={false} tickLine={false} tickFormatter={v => (v / 1000).toFixed(0) + "K"} />
              <Tooltip content={<ChartTip />} />
              <defs>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160,80%,40%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(160,80%,40%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="profit" name="Net Profit" fill="url(#profitGrad)" stroke="hsl(160,80%,40%)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-0.5">
            <Users className="w-3.5 h-3.5" style={{ color: "hsl(220,95%,47%)" }} />
            <div className="text-xs font-semibold text-foreground">Team</div>
          </div>
          <div className="text-[10px] text-muted-foreground/50 mb-3">{TEAM_DATA.length} people across {new Set(TEAM_DATA.map(t => t.dept)).size} departments</div>
          {Array.from(new Set(TEAM_DATA.map(t => t.dept))).map(dept => {
            const members = TEAM_DATA.filter(t => t.dept === dept);
            return (
              <div key={dept} className="mb-2.5">
                <div className="text-[9px] text-muted-foreground/50 uppercase tracking-wide font-semibold mb-1">{dept}</div>
                <div className="flex flex-wrap gap-1">
                  {members.map(p => (
                    <div key={p.name} className="flex items-center gap-1.5 bg-muted px-2 py-1 rounded-full">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold" style={{ background: `${p.color}33`, border: `1px solid ${p.color}66`, color: p.color }}>{p.initials}</div>
                      <span className="text-[10px] text-foreground">{p.name.split(" ")[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-xs font-semibold text-foreground mb-3">Key Metrics</div>
          <div className="space-y-2.5">
            {[
              { label: "Monthly Burn Rate", value: `EGP ${fmtCurrency(Math.round(metrics.burnRate))}`, sub: "Average across 7 months", color: "hsl(350,75%,50%)" },
              { label: "Revenue Collected", value: `EGP ${fmtCurrency(metrics.paidRevenue)}`, sub: `${Math.round((metrics.paidRevenue / metrics.totalRevenue) * 100)}% of total`, color: "hsl(160,80%,40%)" },
              { label: "Portfolio Positions", value: String(metrics.portfolioCount), sub: `${VENTURE_PIPELINE_SEED.length} in pipeline`, color: "hsl(168,100%,42%)" },
              { label: "Client Win Rate", value: `${Math.round((CLIENT_PIPELINE.find(s => s.stage === "Won")?.deals || 0) / metrics.activePipelineDeals * 100)}%`, sub: `${CLIENT_PIPELINE.find(s => s.stage === "Won")?.deals || 0} of ${metrics.activePipelineDeals} deals`, color: "hsl(220,95%,47%)" },
            ].map((stat, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-1 h-8 rounded-full mt-0.5" style={{ background: stat.color }} />
                <div>
                  <div className="text-[9px] text-muted-foreground/50 uppercase tracking-wide font-semibold">{stat.label}</div>
                  <div className="text-sm font-bold text-foreground">{stat.value}</div>
                  <div className="text-[9px] text-muted-foreground/50">{stat.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
