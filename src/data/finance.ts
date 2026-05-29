export interface MoneyInEntry {
  date: string;
  client: string;
  venture: string;
  category: string;
  service: string;
  amount: number;
  currency: string;
  taxRate: string;
  paymentMethod: string;
  status: string;
  projectHandoff: string;
  invoiceNumber: string;
  recurring: string;
  notes: string;
}

export interface MoneyOutEntry {
  date: string;
  category: string;
  venture: string;
  description: string;
  vendor: string;
  amount: number;
  currency: string;
  taxRate: string;
  paymentMethod: string;
  status: string;
  paidBy: string;
  notes: string;
}

// Backwards-compat aliases (legacy field names removed; pages migrate to new fields)
export type IncomeEntry = MoneyInEntry;
export type ExpenseEntry = MoneyOutEntry;

export const MONEY_IN_SEED: MoneyInEntry[] = [
  { date: "2025-09-15", client: "SMG Automotive", venture: "Wasla Solutions", category: "Website", service: "Framer Website", amount: 300000, currency: "EGP", taxRate: "14%", paymentMethod: "Bank Transfer", status: "Paid", projectHandoff: "Yes", invoiceNumber: "", recurring: "No", notes: "SMG & Scania" },
  { date: "2025-10-01", client: "PICO Engineering", venture: "Wasla Solutions", category: "Website", service: "Framer Website", amount: 200000, currency: "EGP", taxRate: "14%", paymentMethod: "Cheque", status: "Paid", projectHandoff: "Yes", invoiceNumber: "", recurring: "No", notes: "" },
  { date: "2025-10-15", client: "Cairo Capital", venture: "Wasla Solutions", category: "Web Development", service: "Web Development", amount: 150000, currency: "EGP", taxRate: "14%", paymentMethod: "Bank Transfer", status: "50% Paid", projectHandoff: "Pending", invoiceNumber: "", recurring: "No", notes: "" },
  { date: "2025-10-15", client: "Sports Alliance", venture: "Wasla Solutions", category: "Website", service: "Framer Website", amount: 25000, currency: "EGP", taxRate: "14%", paymentMethod: "Bank Transfer", status: "Pending", projectHandoff: "Yes", invoiceNumber: "", recurring: "No", notes: "" },
  { date: "2025-11-01", client: "ECMF", venture: "Wasla Solutions", category: "Subscriptions", service: "Subscriptions", amount: 120000, currency: "EGP", taxRate: "0%", paymentMethod: "Bank Transfer", status: "Paid", projectHandoff: "Yes", invoiceNumber: "", recurring: "Yes", notes: "Google Emails 2025 full year" },
  { date: "2025-11-25", client: "Ekhdem", venture: "Wasla Solutions", category: "App Development", service: "App Development", amount: 15000, currency: "EGP", taxRate: "14%", paymentMethod: "Bank Transfer", status: "Paid", projectHandoff: "Pending", invoiceNumber: "", recurring: "No", notes: "" },
  { date: "2026-01-15", client: "Hiba Abdo", venture: "Wasla Solutions", category: "Web Development", service: "Web Development", amount: 90000, currency: "EGP", taxRate: "14%", paymentMethod: "Bank Transfer", status: "Pending", projectHandoff: "Pending", invoiceNumber: "", recurring: "No", notes: "" },
  { date: "2026-01-26", client: "ECMF", venture: "Wasla Solutions", category: "Subscriptions", service: "Subscriptions", amount: 45000, currency: "EGP", taxRate: "0%", paymentMethod: "Bank Transfer", status: "Paid", projectHandoff: "Yes", invoiceNumber: "", recurring: "Yes", notes: "Google Emails January 2026 till March 2026" },
  { date: "2026-02-10", client: "MW Fashion", venture: "Wasla Solutions", category: "Web Development", service: "Web Development", amount: 75000, currency: "EGP", taxRate: "14%", paymentMethod: "Bank Transfer", status: "50% Paid", projectHandoff: "Pending", invoiceNumber: "", recurring: "No", notes: "" },
  { date: "2026-02-25", client: "EJB", venture: "Wasla Solutions", category: "App Development", service: "App Development", amount: 100000, currency: "EGP", taxRate: "14%", paymentMethod: "Bank Transfer", status: "50% Paid", projectHandoff: "Pending", invoiceNumber: "", recurring: "No", notes: "" },
  { date: "2026-03-03", client: "Baraka Cosmetics", venture: "Wasla Solutions", category: "Website", service: "Website + E-Store", amount: 60000, currency: "EGP", taxRate: "14%", paymentMethod: "Bank Transfer", status: "Pending", projectHandoff: "Pending", invoiceNumber: "", recurring: "No", notes: "" },
  { date: "2026-03-05", client: "Plus One", venture: "Wasla Solutions", category: "UI/UX Design", service: "Ui/UX Full Platform", amount: 60000, currency: "EGP", taxRate: "14%", paymentMethod: "Bank Transfer", status: "50% Paid", projectHandoff: "Pending", invoiceNumber: "", recurring: "No", notes: "" },
  { date: "2026-03-08", client: "Bling & Beyond", venture: "Wasla Solutions", category: "E-commerce", service: "Shopify Store", amount: 75000, currency: "EGP", taxRate: "14%", paymentMethod: "Bank Transfer", status: "Pending", projectHandoff: "Pending", invoiceNumber: "", recurring: "No", notes: "" },
];

export const MONEY_OUT_SEED: MoneyOutEntry[] = [
  { date: "2025-07-30", category: "Salaries", venture: "Wasla Solutions", description: "July Salary", vendor: "Usef Shazly", amount: 60000, currency: "EGP", taxRate: "0%", paymentMethod: "Cash", status: "Paid", paidBy: "Bassel Personal", notes: "" },
  { date: "2025-08-30", category: "Salaries", venture: "Wasla Solutions", description: "August Salary", vendor: "Usef Shazly", amount: 60000, currency: "EGP", taxRate: "0%", paymentMethod: "Cash", status: "Paid", paidBy: "Bassel Personal", notes: "" },
  { date: "2025-09-30", category: "Salaries", venture: "Wasla Solutions", description: "September Salary", vendor: "Usef Shazly", amount: 60000, currency: "EGP", taxRate: "0%", paymentMethod: "Bank Transfer", status: "Paid", paidBy: "Company Bank", notes: "" },
  { date: "2025-09-30", category: "Salaries", venture: "Wasla Solutions", description: "September Salary", vendor: "Moaz Sawy", amount: 30000, currency: "EGP", taxRate: "0%", paymentMethod: "Bank Transfer", status: "Paid", paidBy: "Company Bank", notes: "" },
  { date: "2025-09-30", category: "Salaries", venture: "Wasla Solutions", description: "September Salary", vendor: "Mohamed Hagry", amount: 20000, currency: "EGP", taxRate: "0%", paymentMethod: "Bank Transfer", status: "Paid", paidBy: "Company Bank", notes: "" },
  { date: "2025-10-30", category: "Salaries", venture: "Wasla Solutions", description: "October Salary", vendor: "Usef Shazly", amount: 60000, currency: "EGP", taxRate: "0%", paymentMethod: "Bank Transfer", status: "Paid", paidBy: "Company Bank", notes: "" },
  { date: "2025-10-30", category: "Salaries", venture: "Wasla Solutions", description: "October Salary", vendor: "Moaz Sawy", amount: 30000, currency: "EGP", taxRate: "0%", paymentMethod: "Bank Transfer", status: "Paid", paidBy: "Company Bank", notes: "" },
  { date: "2025-10-30", category: "Salaries", venture: "Wasla Solutions", description: "October Salary", vendor: "Mohamed Hagry", amount: 20000, currency: "EGP", taxRate: "0%", paymentMethod: "Bank Transfer", status: "Paid", paidBy: "Company Bank", notes: "" },
  { date: "2025-10-30", category: "Freelancers", venture: "Wasla Solutions", description: "Website Translation", vendor: "Merna Wagih", amount: 8000, currency: "EGP", taxRate: "0%", paymentMethod: "Bank Transfer", status: "Paid", paidBy: "Company Bank", notes: "" },
  { date: "2025-11-30", category: "Salaries", venture: "Wasla Solutions", description: "November Salary", vendor: "Usef Shazly", amount: 60000, currency: "EGP", taxRate: "0%", paymentMethod: "Bank Transfer", status: "Paid", paidBy: "Company Bank", notes: "" },
  { date: "2025-11-30", category: "Salaries", venture: "Wasla Solutions", description: "November Salary", vendor: "Moaz Sawy", amount: 30000, currency: "EGP", taxRate: "0%", paymentMethod: "Bank Transfer", status: "Paid", paidBy: "Company Bank", notes: "" },
  { date: "2025-11-30", category: "Salaries", venture: "Wasla Solutions", description: "November Salary", vendor: "Mohamed Hagry", amount: 20000, currency: "EGP", taxRate: "0%", paymentMethod: "Bank Transfer", status: "Paid", paidBy: "Company Bank", notes: "" },
  { date: "2025-11-30", category: "Hardware", venture: "Wasla Solutions", description: "MacBook Air M1", vendor: "Tradeline", amount: 30000, currency: "EGP", taxRate: "0%", paymentMethod: "Cash", status: "Paid", paidBy: "Bassel Personal", notes: "" },
  { date: "2025-12-30", category: "Salaries", venture: "Wasla Solutions", description: "December Salary", vendor: "Usef Shazly", amount: 60000, currency: "EGP", taxRate: "0%", paymentMethod: "Bank Transfer", status: "Paid", paidBy: "Company Bank", notes: "" },
  { date: "2025-12-30", category: "Salaries", venture: "Wasla Solutions", description: "December Salary", vendor: "Moaz Sawy", amount: 30000, currency: "EGP", taxRate: "0%", paymentMethod: "Bank Transfer", status: "Paid", paidBy: "Company Bank", notes: "" },
  { date: "2025-12-30", category: "Salaries", venture: "Wasla Solutions", description: "December Salary", vendor: "Mohamed Hagry", amount: 20000, currency: "EGP", taxRate: "0%", paymentMethod: "Bank Transfer", status: "Paid", paidBy: "Company Bank", notes: "" },
  { date: "2025-12-30", category: "Freelancers", venture: "Wasla Solutions", description: "Website Assistance", vendor: "Mohamed Yazan", amount: 10000, currency: "EGP", taxRate: "0%", paymentMethod: "Bank Transfer", status: "Paid", paidBy: "Company Bank", notes: "" },
  { date: "2026-01-10", category: "Subscriptions", venture: "Wasla Solutions", description: "Figma Fees (Moaz)", vendor: "Moaz Sawy", amount: 6000, currency: "EGP", taxRate: "0%", paymentMethod: "Bank Transfer", status: "Paid", paidBy: "Company Bank", notes: "" },
  { date: "2026-01-27", category: "Salaries", venture: "Wasla Solutions", description: "January Salary", vendor: "Usef Shazly", amount: 60000, currency: "EGP", taxRate: "0%", paymentMethod: "Bank Transfer", status: "Paid", paidBy: "Company Bank", notes: "" },
  { date: "2026-01-27", category: "Salaries", venture: "Wasla Solutions", description: "January Fees", vendor: "Moaz Sawy", amount: 30000, currency: "EGP", taxRate: "0%", paymentMethod: "Bank Transfer", status: "Paid", paidBy: "Company Bank", notes: "" },
  { date: "2026-01-27", category: "Salaries", venture: "Wasla Solutions", description: "January Fees", vendor: "Mohamed Hagry", amount: 20000, currency: "EGP", taxRate: "0%", paymentMethod: "Bank Transfer", status: "Paid", paidBy: "Company Bank", notes: "" },
  { date: "2026-01-28", category: "Fees", venture: "Wasla Ventures", description: "Legal Accountant Fees (Oct25-Jan26)", vendor: "Wael Khalil", amount: 22000, currency: "EGP", taxRate: "0%", paymentMethod: "Bank Transfer", status: "Paid", paidBy: "Bassel Personal", notes: "" },
  { date: "2026-02-03", category: "Subscriptions", venture: "Wasla Solutions", description: "ECMF Emails Dec/Jan", vendor: "Google Domains", amount: 30000, currency: "EGP", taxRate: "0%", paymentMethod: "Bank Transfer", status: "Paid", paidBy: "Bassel Personal", notes: "" },
  { date: "2026-02-08", category: "Subscriptions", venture: "Wasla Solutions", description: "Figma / Framer", vendor: "Moaz Sawy", amount: 6850, currency: "EGP", taxRate: "0%", paymentMethod: "Bank Transfer", status: "Paid", paidBy: "Bassel Personal", notes: "" },
  { date: "2026-02-10", category: "Subscriptions", venture: "Wasla Ventures", description: "Wasla Ventures Domain", vendor: "Moaz Sawy", amount: 1000, currency: "EGP", taxRate: "0%", paymentMethod: "Bank Transfer", status: "Paid", paidBy: "Company Bank", notes: "" },
  { date: "2026-02-28", category: "Salaries", venture: "Wasla Solutions", description: "February Salary", vendor: "Usef Shazly", amount: 60000, currency: "EGP", taxRate: "0%", paymentMethod: "Bank Transfer", status: "Paid", paidBy: "Company Bank", notes: "" },
  { date: "2026-03-01", category: "Salaries", venture: "Wasla Solutions", description: "February Salary", vendor: "Moaz Sawy", amount: 30000, currency: "EGP", taxRate: "0%", paymentMethod: "Bank Transfer", status: "Paid", paidBy: "Company Bank", notes: "" },
  { date: "2026-03-02", category: "Salaries", venture: "Wasla Solutions", description: "February Salary", vendor: "Mohamed Hagry", amount: 20000, currency: "EGP", taxRate: "0%", paymentMethod: "Bank Transfer", status: "Paid", paidBy: "Company Bank", notes: "" },
];

// Backwards-compat aliases
export const INCOME_DATA = MONEY_IN_SEED;
export const EXPENSE_DATA = MONEY_OUT_SEED;

export interface CashAccount {
  accountName: string;
  accountType: string;
  owner: string;
  currency: string;
  balanceNative: number;
  lastUpdated: string;
  bankLocation: string;
  notes: string;
}

export interface ExchangeRates {
  usdEgp: number;
  eurEgp: number;
  lastUpdated: string;
}

export const EXCHANGE_RATES_SEED: ExchangeRates = {
  usdEgp: 50.85,
  eurEgp: 55.20,
  lastUpdated: "2026-04-16",
};

export const CASH_ACCOUNTS_SEED: CashAccount[] = [
  { accountName: "Wasla Ventures Business Account", accountType: "Business Bank", owner: "Wasla Ventures", currency: "EGP", balanceNative: 0, lastUpdated: "2026-04-16", bankLocation: "CIB / NBE / Other", notes: "Main operating account" },
  { accountName: "Wasla Solutions Operating", accountType: "Business Bank", owner: "Wasla Solutions", currency: "EGP", balanceNative: 0, lastUpdated: "2026-04-16", bankLocation: "", notes: "Solutions revenue deposits" },
  { accountName: "USD Reserve Account", accountType: "USD Account", owner: "Wasla Ventures", currency: "USD", balanceNative: 0, lastUpdated: "2026-04-16", bankLocation: "", notes: "Foreign currency reserve" },
  { accountName: "Bassel Personal - CIB", accountType: "Personal Bank", owner: "Bassel Personal", currency: "EGP", balanceNative: 0, lastUpdated: "2026-04-16", bankLocation: "CIB", notes: "Personal funds, tracks capital contributions" },
  { accountName: "Physical Cash (Office)", accountType: "Physical Cash", owner: "Wasla Ventures", currency: "EGP", balanceNative: 0, lastUpdated: "2026-04-16", bankLocation: "Office", notes: "Petty cash" },
];

export interface MonthlyProjection {
  month: string;
  revenuePlan: number;
  burnPlan: number;
}

export const PROJECTIONS_SEED: MonthlyProjection[] = [
  { month: "2026-01", revenuePlan: 147500, burnPlan: 155000 },
  { month: "2026-02", revenuePlan: 147500, burnPlan: 155000 },
  { month: "2026-03", revenuePlan: 147500, burnPlan: 155000 },
  { month: "2026-04", revenuePlan: 160000, burnPlan: 160000 },
  { month: "2026-05", revenuePlan: 300000, burnPlan: 197500 },
  { month: "2026-06", revenuePlan: 407500, burnPlan: 212500 },
  { month: "2026-07", revenuePlan: 447500, burnPlan: 297500 },
  { month: "2026-08", revenuePlan: 535000, burnPlan: 297500 },
  { month: "2026-09", revenuePlan: 690000, burnPlan: 390000 },
  { month: "2026-10", revenuePlan: 746250, burnPlan: 355000 },
  { month: "2026-11", revenuePlan: 785000, burnPlan: 380000 },
  { month: "2026-12", revenuePlan: 842500, burnPlan: 380000 },
];

export const FY26_REVENUE_PLAN = 5356250;
export const FY26_BURN_PLAN = 3135000;

export interface SalaryEntry {
  name: string;
  role: string;
  dept: string;
  monthlySalary: number;
  equity: string;
  venture: string;
  initials: string;
  color: string;
}

export const SALARY_DATA_SEED: SalaryEntry[] = [
  { name: "Bassel El Aroussy", role: "Principal", dept: "Leadership", monthlySalary: 0, equity: "55% (WV)", venture: "Wasla Ventures", initials: "BA", color: "hsl(220,95%,47%)" },
  { name: "Usef El Shazly", role: "Digital Lead", dept: "Product & Design", monthlySalary: 60000, equity: "10% (WV) / 35% (Edu)", venture: "Wasla Solutions", initials: "UE", color: "hsl(168,100%,42%)" },
  { name: "Hussein Shahbender", role: "Marketing Lead", dept: "Growth", monthlySalary: 0, equity: "15% (WV)", venture: "Wasla Ventures", initials: "HS", color: "hsl(250,60%,60%)" },
  { name: "Moaz El Sawy", role: "Development Lead", dept: "Engineering", monthlySalary: 30000, equity: "2% (WV) / 2.5% (Sol+Edu)", venture: "Wasla Solutions", initials: "ME", color: "hsl(160,80%,40%)" },
  { name: "Ali El Amir", role: "Creative Lead", dept: "Design", monthlySalary: 0, equity: "2% (WV)", venture: "Wasla Ventures", initials: "AE", color: "hsl(36,90%,53%)" },
  { name: "Mohab Metwali", role: "Engineering & AI Lead", dept: "Engineering", monthlySalary: 0, equity: "1% (direct)", venture: "Wasla Labs", initials: "MM", color: "hsl(330,80%,60%)" },
  { name: "Mohamed Hagry", role: "Product Designer", dept: "Design", monthlySalary: 20000, equity: "—", venture: "Wasla Solutions", initials: "MH", color: "hsl(174,72%,46%)" },
  { name: "Saif Nosair", role: "Visual & Motion Designer", dept: "Design", monthlySalary: 0, equity: "—", venture: "Wasla Solutions", initials: "SN", color: "hsl(24,94%,53%)" },
];

export const CLIENT_PIPELINE = [
  { stage: "Lead", deals: 2, value: 800000, color: "hsl(220,15%,38%)" },
  { stage: "Discovery", deals: 1, value: 400000, color: "hsl(220,95%,47%)" },
  { stage: "Proposal", deals: 2, value: 2180000, color: "hsl(36,90%,53%)" },
  { stage: "Won", deals: 3, value: 660000, color: "hsl(160,80%,40%)" },
];

export const TEAM_DATA = [
  { name: "Bassel El Aroussy", role: "Principal", dept: "Leadership", initials: "BA", color: "hsl(220,95%,47%)" },
  { name: "Usef El Shazly", role: "Digital Lead", dept: "Product & Design", initials: "UE", color: "hsl(168,100%,42%)" },
  { name: "Hussein Shahbender", role: "Marketing Lead", dept: "Growth", initials: "HS", color: "hsl(250,60%,60%)" },
  { name: "Moaz El Sawy", role: "Development Lead", dept: "Engineering", initials: "ME", color: "hsl(160,80%,40%)" },
  { name: "Ali El Amir", role: "Creative Lead", dept: "Design", initials: "AE", color: "hsl(36,90%,53%)" },
  { name: "Mohab Metwali", role: "Engineering & AI Lead", dept: "Engineering", initials: "MM", color: "hsl(330,80%,60%)" },
  { name: "Mohamed Hagry", role: "Product Designer", dept: "Design", initials: "MH", color: "hsl(174,72%,46%)" },
  { name: "Saif Nosair", role: "Visual & Motion Designer", dept: "Design", initials: "SN", color: "hsl(24,94%,53%)" },
];

export const fmtCurrency = (n: number) => {
  if (!n) return "0";
  const a = Math.abs(n);
  if (a >= 1000000) return (n / 1000000).toFixed(2) + "M";
  if (a >= 1000) return (n / 1000).toFixed(0) + "K";
  return String(n);
};
