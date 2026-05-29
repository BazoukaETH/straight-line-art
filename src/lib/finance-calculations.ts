import { MoneyInEntry, MoneyOutEntry, CashAccount, ExchangeRates, MonthlyProjection } from "@/data/finance";

export function calculateMonthlyBurn(expenses: MoneyOutEntry[]): number {
  const monthTotals: Record<string, number> = {};
  for (const e of expenses) {
    const month = e.date.slice(0, 7);
    monthTotals[month] = (monthTotals[month] || 0) + e.amount;
  }
  const sortedMonths = Object.keys(monthTotals).sort().reverse();
  const lastThree = sortedMonths.slice(0, 3);
  if (lastThree.length === 0) return 0;
  const sum = lastThree.reduce((s, m) => s + monthTotals[m], 0);
  return Math.round(sum / lastThree.length);
}

export function calculateCashOnHand(accounts: CashAccount[], fx: ExchangeRates): number {
  return accounts.reduce((total, acc) => {
    if (acc.currency === "USD") return total + acc.balanceNative * fx.usdEgp;
    if (acc.currency === "EUR") return total + acc.balanceNative * fx.eurEgp;
    return total + acc.balanceNative;
  }, 0);
}

export function calculateRunway(cashOnHand: number, monthlyBurn: number): number | null {
  if (monthlyBurn <= 0) return null;
  return cashOnHand / monthlyBurn;
}

export function calculateMRR(income: MoneyInEntry[]): number {
  const recurring = income.filter(i => i.recurring === "Yes");
  if (recurring.length === 0) return 0;
  const monthTotals: Record<string, number> = {};
  for (const r of recurring) {
    const month = r.date.slice(0, 7);
    monthTotals[month] = (monthTotals[month] || 0) + r.amount;
  }
  const months = Object.keys(monthTotals);
  if (months.length === 0) return 0;
  const sum = Object.values(monthTotals).reduce((s, v) => s + v, 0);
  return Math.round(sum / months.length);
}

export interface InvoiceAgingBuckets {
  thirtyDays: { count: number; total: number };
  sixtyDays: { count: number; total: number };
  sixtyPlusDays: { count: number; total: number };
}

export function calculateInvoiceAging(income: MoneyInEntry[], today: Date = new Date()): InvoiceAgingBuckets {
  const pending = income.filter(i => i.status === "Pending" || i.status === "50% Paid");
  const buckets: InvoiceAgingBuckets = {
    thirtyDays: { count: 0, total: 0 },
    sixtyDays: { count: 0, total: 0 },
    sixtyPlusDays: { count: 0, total: 0 },
  };
  for (const inv of pending) {
    const invDate = new Date(inv.date);
    const ageDays = Math.floor((today.getTime() - invDate.getTime()) / (1000 * 60 * 60 * 24));
    const amt = inv.status === "50% Paid" ? inv.amount / 2 : inv.amount;
    if (ageDays <= 30) { buckets.thirtyDays.count++; buckets.thirtyDays.total += amt; }
    else if (ageDays <= 60) { buckets.sixtyDays.count++; buckets.sixtyDays.total += amt; }
    else { buckets.sixtyPlusDays.count++; buckets.sixtyPlusDays.total += amt; }
  }
  return buckets;
}

export interface ClientConcentration {
  client: string;
  total: number;
  percentage: number;
}

export function calculateClientConcentration(income: MoneyInEntry[]): ClientConcentration[] {
  const clientTotals: Record<string, number> = {};
  for (const i of income) {
    clientTotals[i.client] = (clientTotals[i.client] || 0) + i.amount;
  }
  const grandTotal = Object.values(clientTotals).reduce((s, v) => s + v, 0);
  return Object.entries(clientTotals)
    .map(([client, total]) => ({ client, total, percentage: grandTotal > 0 ? (total / grandTotal) * 100 : 0 }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
}

export interface ActualVsPlanRow {
  month: string;
  actual: number;
  plan: number;
  variance: number;
}

export function calculateActualVsPlan(income: MoneyInEntry[], projections: MonthlyProjection[]): ActualVsPlanRow[] {
  const actualByMonth: Record<string, number> = {};
  for (const i of income) {
    const month = i.date.slice(0, 7);
    actualByMonth[month] = (actualByMonth[month] || 0) + i.amount;
  }
  return projections.map(p => {
    const actual = actualByMonth[p.month] || 0;
    const variance = p.revenuePlan > 0 ? ((actual - p.revenuePlan) / p.revenuePlan) * 100 : 0;
    return { month: p.month, actual, plan: p.revenuePlan, variance };
  });
}

export function calculateRecurringVsOneTime(income: MoneyInEntry[]): { recurring: number; oneTime: number } {
  let recurring = 0;
  let oneTime = 0;
  for (const i of income) {
    if (i.recurring === "Yes") recurring += i.amount;
    else oneTime += i.amount;
  }
  return { recurring, oneTime };
}
