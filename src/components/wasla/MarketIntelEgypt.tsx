import { useState, type ReactNode } from "react";
import {
  ComposedChart, Bar, Line, LineChart, BarChart, XAxis, YAxis, Tooltip, Legend,
  CartesianGrid, ResponsiveContainer, Cell,
} from "recharts";
import {
  egyptFunding, countryComparison, bigMarketsTrend, menaVsAfrica, egyptSectors,
  topEgyptianStartups, startupRoster80, megaDealsExits, latestRounds2026, unicorns,
  investors, government, timeline, notablePeople, outlookScenarios, sources,
  regionalMatrix, topRegionalStartups, regionalDealsMore,
  yearExplorer, exitsIpos, rankingsTam, ecosystemTalent,
} from "@/data/market-intel-egypt";

const C = ["#185FA5", "#1D9E75", "#BA7517", "#534AB7", "#D4537E", "#D85A30", "#639922", "#0F6E56"];
const GRID = "#88888833";

function Panel({ title, subtitle, children, className = "" }: { title: string; subtitle?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`bg-card border border-border rounded-xl p-4 ${className}`}>
      <div className="text-xs font-semibold text-foreground">{title}</div>
      {subtitle ? <div className="text-[10px] text-muted-foreground/60 mt-0.5 mb-3">{subtitle}</div> : <div className="mb-3" />}
      {children}
    </div>
  );
}

function DT({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px]">
        <thead>
          <tr className="border-b border-border">
            {head.map((h, i) => (
              <th key={i} className="text-left p-2 font-semibold text-muted-foreground/50 text-[9px] uppercase tracking-wide whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-border/30 align-top">
              {r.map((c, j) => (
                <td key={j} className={`p-2 ${j === 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Kpi({ label, value, sub, color = C[0] }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-3.5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[3px] h-full" style={{ background: color }} />
      <div className="text-[9px] text-muted-foreground/50 font-bold uppercase tracking-wide mb-1">{label}</div>
      <div className="text-lg font-bold text-foreground tracking-tight">{value}</div>
      {sub && <div className="text-[9px] text-muted-foreground/60 mt-0.5">{sub}</div>}
    </div>
  );
}

const num = (v: unknown) => (typeof v === "number" ? v : 0);
const pct = (v: unknown) => (typeof v === "number" ? `${Math.round(v * 100)}%` : String(v ?? ""));
const e2025 = egyptFunding.find((r) => r.year === "2025");

export function MarketIntelEgypt() {
  const [sec, setSec] = useState<"overview" | "egypt" | "regional" | "capital" | "policy" | "outlook">("overview");
  const sections = [
    { id: "overview" as const, l: "Big Picture" },
    { id: "egypt" as const, l: "Egypt Deep-Dive" },
    { id: "regional" as const, l: "Regional" },
    { id: "capital" as const, l: "Capital & Investors" },
    { id: "policy" as const, l: "Policy & People" },
    { id: "outlook" as const, l: "Outlook" },
  ];

  const engines = ["Saudi Arabia", "UAE", "Turkey", "Egypt"];
  const enginesData = ["2019", "2020", "2021", "2022", "2023", "2024", "2025"].map((y) => {
    const row: Record<string, number | string> = { year: y };
    bigMarketsTrend.filter((m) => engines.includes(m.market)).forEach((m) => {
      row[m.market] = num((m as unknown as Record<string, number>)[`y${y}`]);
    });
    return row;
  });

  const rosterGroups = Array.from(new Set(startupRoster80.map((r) => r.group ?? "Other")));
  const investorGroups = Array.from(new Set(investors.map((r) => r.group ?? "Other")));
  const matrixMax = Math.max(...regionalMatrix.map((r) => num(r.y2025)));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <Kpi label="Egypt 2025 (equity)" value={`$${num(e2025?.fundingEquityM)}M`} sub="MENA-frame · Wamda" color={C[0]} />
        <Kpi label="Egypt 2025 (incl. debt)" value={`$${num(e2025?.fundingInclDebtM)}M`} sub="Africa-frame · record" color={C[1]} />
        <Kpi label="Deals 2025" value={String(num(e2025?.deals))} sub="recovering YoY" color={C[2]} />
        <Kpi label="Egyptian unicorn" value="MNT-Halan" sub="$1.4B (Jun 2026)" color={C[3]} />
      </div>

      <div className="flex gap-0 border-b border-border overflow-x-auto">
        {sections.map((s) => (
          <button key={s.id} onClick={() => setSec(s.id)}
            className={`px-4 py-2 text-[11px] font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap ${sec === s.id ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"}`}>
            {s.l}
          </button>
        ))}
      </div>

      {sec === "overview" && (
        <div className="space-y-4">
          <Panel title="Egypt — annual venture funding, 2018–2026" subtitle="Equity vs debt-inclusive; deal count on the right axis">
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={egyptFunding} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
                <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="l" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar yAxisId="l" dataKey="fundingEquityM" name="Equity $M" fill={C[0]} radius={[3, 3, 0, 0]} />
                <Bar yAxisId="l" dataKey="fundingInclDebtM" name="Incl. debt $M" fill="#9FE1CB" radius={[3, 3, 0, 0]} />
                <Line yAxisId="r" dataKey="deals" name="Deals" stroke={C[2]} strokeWidth={2} dot={{ r: 2 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="MENA vs Africa — total venture ($B)" subtitle="Different trackers & frames; do not add together">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={menaVsAfrica} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
                <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line dataKey="menaBEquity" name="MENA (equity)" stroke={C[0]} strokeWidth={2} dot={{ r: 2 }} />
                <Line dataKey="africaBInclDebt" name="Africa (incl. debt)" stroke={C[3]} strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Year-by-year explorer, 2015–2026" subtitle="Egypt funding, biggest round, dominant sector, regional leaders, headline event">
            <DT head={["Year", "Egypt $M", "Deals", "Biggest Egypt round", "Dominant sector", "#1 MENA", "#1 Africa", "Headline event"]}
              rows={yearExplorer.map((r) => [r.year, r.egyptM, r.deals, r.biggestEgyptRound, r.dominantSector, r.y1Mena, r.y1Africa, r.headlineEvent])} />
          </Panel>
        </div>
      )}

      {sec === "egypt" && (
        <div className="space-y-4">
          <Panel title="Egypt — funding by sector ($M)" subtitle="2024 distorted by MNT-Halan $157.5M; 2025 shows rotation into proptech & AI">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={egyptSectors} margin={{ top: 8, right: 8, left: -12, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
                <XAxis dataKey="sector" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="y2024M" name="2024 $M" fill="#85B7EB" radius={[3, 3, 0, 0]} />
                <Bar dataKey="y2025M" name="2025 $M" fill={C[0]} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Top Egyptian startups by capital raised" subtitle="Cumulative disclosed funding, USD millions">
            <DT head={["Company", "Sector", "Raised $M", "Valuation / note", "Key backers", "Status"]}
              rows={topEgyptianStartups.map((r) => [r.company, r.sector, r.raisedM, r.valuationNote, r.keyBackers, r.status])} />
          </Panel>

          <Panel title="Egypt startup roster — 80+ companies across 12 sectors" subtitle="Rising & emerging companies beyond the top names · ~ = estimated funding">
            {rosterGroups.map((g) => (
              <div key={g} className="mb-3">
                <div className="text-[10px] font-bold uppercase tracking-wide text-accent mb-1">{g}</div>
                <DT head={["Company", "Sub-sector", "What it does", "~Funding", "Status"]}
                  rows={startupRoster80.filter((r) => (r.group ?? "Other") === g).map((r) => [r.company, r.subSector, r.whatItDoes, r.funding, r.status])} />
              </div>
            ))}
          </Panel>
        </div>
      )}

      {sec === "regional" && (
        <div className="space-y-4">
          <Panel title="The four engines — KSA · UAE · Turkey · Egypt ($M)" subtitle="Annual VC by market, 2019–2025">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={enginesData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
                <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                {engines.map((m, i) => <Line key={m} dataKey={m} stroke={C[i]} strokeWidth={2} dot={{ r: 2 }} />)}
              </LineChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Country comparison — venture intensity" subtitle="Latest annual VC; per-capita & %GDP computed. Who punches above weight?">
            <DT head={["Country", "VC $M", "Pop (M)", "GDP $B", "VC / capita $", "VC % GDP", "Unicorns"]}
              rows={countryComparison.map((r) => [r.country, r.vcM, r.populationM, r.gdpB, typeof r.vcPerCapita === "number" ? `$${r.vcPerCapita.toFixed(1)}` : r.vcPerCapita, pct(r.vcOfGdp), r.unicorns])} />
          </Panel>

          <Panel title="Annual venture funding heatmap, 2019–2026 ($M)" subtitle="16 countries; equity-style figures; darker = larger 2025">
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead><tr className="border-b border-border">
                  {["Country", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "26 Q1", "Deals'25", "Conf."].map((h, i) => (
                    <th key={i} className="text-left p-2 font-semibold text-muted-foreground/50 text-[9px] uppercase tracking-wide">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {regionalMatrix.map((r, i) => (
                    <tr key={i} className="border-b border-border/30">
                      <td className="p-2 font-semibold text-foreground">{r.country}</td>
                      {(["y2019", "y2020", "y2021", "y2022", "y2023", "y2024", "y2025", "y26Q1"] as const).map((k) => {
                        const v = num((r as unknown as Record<string, number>)[k]);
                        return <td key={k} className="p-2 text-foreground" style={{ background: `rgba(24,95,165,${Math.min(0.55, v / matrixMax)})` }}>{v || ""}</td>;
                      })}
                      <td className="p-2 text-muted-foreground">{r.deals25}</td>
                      <td className="p-2 text-muted-foreground/60">{r.confidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Innovation ranks & Egypt market sizes (TAM)" subtitle="Global Innovation Index 2025 · StartupBlink 2025">
            <DT head={["Country", "GII '25", "StartupBlink '25"]}
              rows={rankingsTam.filter((r) => r.country).map((r) => [r.country, r.gii25, r.startupblink25])} />
          </Panel>

          <div className="grid md:grid-cols-2 gap-4">
            <Panel title="Top non-Egypt regional startups" subtitle="GCC, Turkey & Africa · ~ = estimated total raised">
              <DT head={["Company", "Country", "Sector", "~Raised", "Note"]}
                rows={topRegionalStartups.map((r) => [r.company, r.country, r.sector, r.raised, r.note])} />
            </Panel>
            <Panel title="Expanded regional deals, 2024–2026" subtitle="Beyond the obvious · * = debt">
              <DT head={["Company", "Country", "Sector", "Stage", "Amount", "Year"]}
                rows={regionalDealsMore.map((r) => [r.company, r.country, r.sector, r.stage, r.amount, r.year])} />
            </Panel>
          </div>
        </div>
      )}

      {sec === "capital" && (
        <div className="space-y-4">
          <Panel title="Most active investors in Egypt" subtitle="★ = most active 2024–2026 · grouped by type">
            {investorGroups.map((g) => (
              <div key={g} className="mb-3">
                <div className="text-[10px] font-bold uppercase tracking-wide text-accent mb-1">{g}</div>
                <DT head={["Investor", "Type / HQ", "Stage", "Fund size / AUM", "Notable Egypt bets"]}
                  rows={investors.filter((r) => (r.group ?? "Other") === g).map((r) => [r.investor, r.typeHq, r.stage, r.fundSizeAum, r.notableEgyptBets])} />
              </div>
            ))}
          </Panel>

          <div className="grid md:grid-cols-2 gap-4">
            <Panel title="Latest rounds — H2 2025 to Jun 2026" subtitle="Egypt-focused; key regional deals included">
              <DT head={["Date", "Company", "Country", "Sector", "Stage", "Amount", "Investors / note"]}
                rows={latestRounds2026.map((r) => [r.date, r.company, r.country, r.sector, r.stage, r.amount, r.investorsNote])} />
            </Panel>
            <Panel title="Landmark rounds & exits, 2022–2026" subtitle="Egypt highlighted · * = debt facility">
              <DT head={["Company", "Country", "Sector", "Event", "Size", "Year"]}
                rows={megaDealsExits.map((r) => [r.company, r.country, r.sector, r.event, r.size, r.year])} />
            </Panel>
          </div>

          <Panel title="Regional unicorns by valuation ($B)" subtitle="Last known valuation">
            <ResponsiveContainer width="100%" height={Math.max(220, unicorns.length * 22)}>
              <BarChart layout="vertical" data={[...unicorns].sort((a, b) => num(b.valuationB) - num(a.valuationB))} margin={{ top: 4, right: 16, left: 60, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="company" tick={{ fontSize: 9 }} width={90} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Bar dataKey="valuationB" name="Valuation $B" radius={[0, 3, 3, 0]}>
                  {unicorns.map((u, i) => <Cell key={i} fill={u.country === "Egypt" ? C[2] : C[0]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </div>
      )}

      {sec === "policy" && (
        <div className="space-y-4">
          <Panel title="The government playbook" subtitle="Reshaping the startup operating environment, 2024–2026">
            <div className="space-y-3">
              {government.map((r, i) => (
                <div key={i} className="border-b border-border/30 pb-2.5 last:border-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] font-semibold text-foreground">{r.initiative}</span>
                    <span className="text-[9px] text-muted-foreground/50">{r.date}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground leading-relaxed">{r.detail}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="How it happened — ecosystem timeline, 2008 → 2026" subtitle="Companies, funding, exits, policy, macro">
            <div className="space-y-2">
              {timeline.map((r, i) => (
                <div key={i} className="flex gap-3 text-[11px]">
                  <span className="font-bold text-foreground w-12 shrink-0">{r.year}</span>
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full h-fit shrink-0" style={{ background: `${C[3]}22`, color: C[3] }}>{r.category}</span>
                  <span><span className="font-semibold text-foreground">{r.milestone}</span> <span className="text-muted-foreground/70">— {r.detail}</span></span>
                </div>
              ))}
            </div>
          </Panel>

          <div className="grid md:grid-cols-2 gap-4">
            <Panel title="The people behind it" subtitle="Founders & investors who built the ecosystem">
              <div className="space-y-2.5">
                {notablePeople.map((r, i) => (
                  <div key={i}>
                    <div className="text-[11px] font-semibold text-foreground">{r.name}</div>
                    <div className="text-[10px] text-muted-foreground">{r.role}</div>
                    <div className="text-[9px] text-muted-foreground/60">{r.note}</div>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel title="Egyptian exits, M&A & IPO pipeline" subtitle="2018–2026 + 2026-27 pipeline">
              <DT head={["Company", "Type", "Outcome", "Year"]}
                rows={exitsIpos.map((r) => [r.company, r.type, r.outcome, r.year])} />
            </Panel>
          </div>
        </div>
      )}

      {sec === "outlook" && (
        <div className="space-y-4">
          <Panel title="Egypt 2027 scenarios" subtitle="Directional projections, not predictions">
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead><tr className="border-b border-border">
                  {["Metric", "Bull", "Base", "Bear"].map((h, i) => (
                    <th key={i} className={`text-left p-2 font-semibold text-[9px] uppercase tracking-wide ${i === 1 ? "text-[#1D9E75]" : i === 3 ? "text-[#A32D2D]" : "text-muted-foreground/50"}`}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {outlookScenarios.map((r, i) => (
                    <tr key={i} className="border-b border-border/30 align-top">
                      <td className="p-2 font-semibold text-foreground">{r.metric}</td>
                      <td className="p-2 text-[#1D9E75]">{r.bull}</td>
                      <td className="p-2 text-muted-foreground">{r.base}</td>
                      <td className="p-2 text-[#A32D2D]">{r.bear}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <div className="grid md:grid-cols-2 gap-4">
            <Panel title="Accelerators, talent, diaspora & women founders" subtitle="Supporting metrics">
              <DT head={["Metric", "Value"]} rows={ecosystemTalent.map((r) => [r.metric, r.value])} />
            </Panel>
            <Panel title="Sources & methodology" subtitle="Primary trackers and references used across the dataset">
              <div className="space-y-2">
                {sources.map((r, i) => (
                  <div key={i}>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-accent">{r.category}</div>
                    <div className="text-[10px] text-muted-foreground leading-relaxed">{r.sources}</div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      )}
    </div>
  );
}
