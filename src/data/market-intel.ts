export interface MacroIndicator {
  label: string;
  value: string;
  source: string;
  date: string;
  detail?: string;
}

export interface RateHistoryEntry {
  date: string;
  rate: string;
  change: string;
}

export interface FundingRound {
  company: string;
  amount: string;
  stage: string;
  sector: string;
  leadInvestor: string;
  date: string;
}

export interface VCEntry {
  fund: string;
  stageFocus: string;
  sectorFocus: string;
  ticketSize: string;
  hq: string;
  website: string;
}

export interface VCTarget {
  name: string;
  fund: string;
  connectionType: string;
  status: string;
  lastInteraction: string;
  email: string;
  phone: string;
  notes: string;
}

export interface IndustrySignal {
  label: string;
  value: string;
  detail: string;
}

export interface RegulatoryUpdate {
  title: string;
  date: string;
  description: string;
}

export interface NewsItem {
  headline: string;
  source: string;
  date: string;
  category: string;
  summary: string;
}

export const MACRO_INDICATORS: MacroIndicator[] = [
  { label: "EGP/USD", value: "50.85", source: "CBE", date: "Apr 2026" },
  { label: "EGP/EUR", value: "55.20", source: "CBE", date: "Apr 2026" },
  { label: "CBE Deposit Rate", value: "20.0%", source: "CBE", date: "Dec 2025", detail: "-100bps" },
  { label: "CBE Lending Rate", value: "21.0%", source: "CBE", date: "Dec 2025", detail: "High cost-of-funds" },
  { label: "1Y Treasury Bill", value: "26.7%", source: "CBE", date: "Feb 2026" },
  { label: "CPI Inflation", value: "12.3% YoY", source: "CAPMAS", date: "Mar 2026", detail: "Target: 5-9% Q4 2026" },
  { label: "EGX 30", value: "33,500", source: "EGX", date: "Apr 2026", detail: "+8.2% YTD" },
  { label: "EGX 70", value: "8,200", source: "EGX", date: "Apr 2026", detail: "+5.1% YTD" },
  { label: "Gold (EGP/g)", value: "5,450", source: "Market", date: "Apr 2026" },
];

export const RATE_HISTORY: RateHistoryEntry[] = [
  { date: "Dec 2025", rate: "20.00%", change: "-100 bps cut" },
  { date: "Mar 2024", rate: "27.75%", change: "+200 bps hike" },
  { date: "Dec 2023", rate: "19.25%", change: "No change" },
  { date: "Aug 2023", rate: "19.25%", change: "+100 bps hike" },
  { date: "Dec 2022", rate: "16.25%", change: "+300 bps hike" },
];

export const FUNDING_ROUNDS: FundingRound[] = [
  { company: "Paymob", amount: "$22M", stage: "Series C", sector: "Fintech", leadInvestor: "FMO", date: "Mar 2026" },
  { company: "Breadfast", amount: "$15M", stage: "Series B", sector: "E-commerce", leadInvestor: "Delivery Hero Ventures", date: "Feb 2026" },
  { company: "Lucky", amount: "$8M", stage: "Series A", sector: "Fintech", leadInvestor: "CLEO Capital", date: "Jan 2026" },
  { company: "Halan", amount: "$100M", stage: "Series C", sector: "Super-app", leadInvestor: "Chimera Abu Dhabi", date: "Dec 2025" },
  { company: "Khazna", amount: "$5M", stage: "Series A", sector: "Fintech", leadInvestor: "Algebra Ventures", date: "Nov 2025" },
  { company: "Salla", amount: "$10M", stage: "Series A", sector: "SaaS / E-commerce", leadInvestor: "STV", date: "Oct 2025" },
];

export const VC_DIRECTORY: VCEntry[] = [
  { fund: "Algebra Ventures", stageFocus: "Series A-B", sectorFocus: "Fintech, SaaS, Logistics", ticketSize: "$1-5M", hq: "Cairo", website: "algebraventures.com" },
  { fund: "Sawari Ventures", stageFocus: "Series A-B", sectorFocus: "Tech, Education, Healthcare", ticketSize: "$1-10M", hq: "Cairo", website: "sawariventures.com" },
  { fund: "A15", stageFocus: "Pre-seed to A", sectorFocus: "Consumer Tech, E-commerce", ticketSize: "$100K-2M", hq: "Cairo", website: "a15.com" },
  { fund: "Flat6Labs", stageFocus: "Pre-seed", sectorFocus: "Multi-sector", ticketSize: "$50-100K", hq: "Cairo", website: "flat6labs.com" },
  { fund: "500 Global", stageFocus: "Seed", sectorFocus: "Multi-sector", ticketSize: "$50-150K", hq: "San Francisco", website: "500.co" },
  { fund: "Disruptech Ventures", stageFocus: "Seed to A", sectorFocus: "Fintech", ticketSize: "$250K-2M", hq: "Cairo", website: "disruptechventures.com" },
  { fund: "Acasia Ventures", stageFocus: "Pre-seed", sectorFocus: "Tech, Climate", ticketSize: "$50-200K", hq: "Cairo", website: "acasia.vc" },
  { fund: "Launch Africa", stageFocus: "Pre-seed to Seed", sectorFocus: "Multi-sector", ticketSize: "$25-100K", hq: "Mauritius", website: "launchafrica.vc" },
  { fund: "P1 Ventures", stageFocus: "Seed to A", sectorFocus: "Marketplace, SaaS", ticketSize: "$100K-1M", hq: "Cairo", website: "p1ventures.com" },
  { fund: "Endure Capital", stageFocus: "Seed to A", sectorFocus: "MENA Tech", ticketSize: "$100K-500K", hq: "Cairo", website: "endurecapital.com" },
  { fund: "STV", stageFocus: "Series A-C", sectorFocus: "Tech, Consumer", ticketSize: "$5-30M", hq: "Riyadh", website: "stv.vc" },
  { fund: "Global Ventures", stageFocus: "Series A-B", sectorFocus: "Tech, Climate", ticketSize: "$1-5M", hq: "Dubai", website: "globalventures.vc" },
];

export const INDUSTRY_SIGNALS: IndustrySignal[] = [
  { label: "MEA Digital & ICT Economy", value: "500B+", detail: "+10% CAGR" },
  { label: "Egypt Internet Penetration", value: "72%", detail: "~80M users" },
  { label: "Egypt Mobile Penetration", value: "95%", detail: "~100M subscriptions" },
  { label: "Egypt E-commerce Market", value: "$9B", detail: "+25% YoY growth" },
  { label: "Egypt Startup Ecosystem Rank", value: "#3 in Africa", detail: "Behind Nigeria, South Africa" },
  { label: "Egypt Tech Workforce", value: "300K+", detail: "Growing 15% annually" },
];

export const REGULATORY_UPDATES: RegulatoryUpdate[] = [
  { title: "Egypt Fintech Licensing Framework", date: "Mar 2026", description: "FRA published updated guidelines for digital payment service providers. New licensing categories for e-wallets and lending platforms." },
  { title: "Data Protection Law Enforcement", date: "Feb 2026", description: "Egypt Data Protection Authority began enforcement of the Personal Data Protection Law No. 151. Companies given 6-month compliance window." },
  { title: "Free Zone Digital Companies", date: "Jan 2026", description: "New provisions allowing digital-only companies to register in Egyptian free zones with reduced capital requirements." },
];

export const NEWS_FEED: NewsItem[] = [
  { headline: "Egypt targets $10B in FDI for tech sector by 2027", source: "Enterprise", date: "Apr 2026", category: "Policy", summary: "Government announces new incentives package for tech companies establishing regional HQs in Egypt." },
  { headline: "Paymob expands to Saudi Arabia after $22M raise", source: "TechCrunch", date: "Mar 2026", category: "Funding", summary: "Egyptian fintech Paymob launches Saudi operations, targeting 50K merchants in first year." },
  { headline: "EGX launches technology sector index", source: "Reuters", date: "Mar 2026", category: "Markets", summary: "Egyptian Exchange introduces EGX Tech 20 index tracking top technology listings." },
  { headline: "Egypt startup ecosystem raises $500M+ in 2025", source: "Wamda", date: "Feb 2026", category: "Ecosystem", summary: "Record year for Egyptian startups with 120+ deals closed, led by fintech and e-commerce." },
  { headline: "CBE cuts rates by 100bps, signals further easing", source: "Bloomberg", date: "Dec 2025", category: "Macro", summary: "Central Bank of Egypt reduces deposit rate to 20%, first cut in cycle. Market expects further cuts in 2026." },
  { headline: "Google opens AI research lab in Cairo", source: "The Verge", date: "Nov 2025", category: "Tech", summary: "Google establishes dedicated AI and ML research facility in Cairo, hiring 50+ researchers." },
];
