// Egypt & Regional Startup Ecosystem — Market Intel dataset
// Auto-generated from Egypt_Startup_Ecosystem_Data.xlsx (compiled Jun 2026, 19 research streams).
// All figures USD unless noted. See MI_SOURCES for trackers/methodology.

export interface MI_EgyptFunding {
  year: string;
  fundingEquityM: number;
  fundingInclDebtM: number;
  deals: number;
  note: string;
}
export const egyptFunding: MI_EgyptFunding[] = [
  { year: "2018", fundingEquityM: 180, fundingInclDebtM: 180, deals: 95, note: "Low-confidence estimate; no single primary source" },
  { year: "2019", fundingEquityM: 99, fundingInclDebtM: 99, deals: 141, note: "MAGNiTT equity-only; ecosystem still seed-stage" },
  { year: "2020", fundingEquityM: 190, fundingInclDebtM: 190, deals: 150, note: "Pre-boom; fintech-led" },
  { year: "2021", fundingEquityM: 491, fundingInclDebtM: 491, deals: 147, note: "Global boom; +168% YoY; #1 in MENA by deals" },
  { year: "2022", fundingEquityM: 517, fundingInclDebtM: 517, deals: 160, note: "Peak deal count (highest in MENA); growth stalled" },
  { year: "2023", fundingEquityM: 433, fundingInclDebtM: 503, deals: 95, note: "MNT-Halan $400M skews headline; ~$103M ex-Halan" },
  { year: "2024", fundingEquityM: 329, fundingInclDebtM: 334, deals: 78, note: "-21% YoY; March 2024 EGP float; Halan $157.5M again the biggest" },
  { year: "2025", fundingEquityM: 263, fundingInclDebtM: 614, deals: 89, note: "Equity $263M (Wamda) vs record $614M Africa-frame (incl. debt); deal count recovers" },
  { year: "2026 Q1", fundingEquityM: 86, fundingInclDebtM: 190, deals: 12, note: "#3 in MENA / #1 Africa; March geopolitical shock hit the region" },
];

export interface MI_CountryComparison {
  country: string;
  vcM?: number;
  populationM?: number;
  gdpB?: number;
  vcPerCapita?: number;
  vcOfGdp?: number;
  unicorns?: number;
}
export const countryComparison: MI_CountryComparison[] = [
  { country: "Saudi Arabia", vcM: 750, populationM: 33, gdpB: 1100, vcPerCapita: 22.727273, vcOfGdp: 0.000682, unicorns: 2 },
  { country: "UAE", vcM: 613, populationM: 10, gdpB: 510, vcPerCapita: 61.3, vcOfGdp: 0.001202, unicorns: 3 },
  { country: "Turkey", vcM: 1100, populationM: 85, gdpB: 1340, vcPerCapita: 12.941176, vcOfGdp: 0.000821, unicorns: 6 },
  { country: "Egypt", vcM: 329, populationM: 116, gdpB: 380, vcPerCapita: 2.836207, vcOfGdp: 0.000866, unicorns: 1 },
  { country: "Nigeria", vcM: 332, populationM: 223, gdpB: 200, vcPerCapita: 1.488789, vcOfGdp: 0.00166, unicorns: 5 },
  { country: "Kenya", vcM: 400, populationM: 55, gdpB: 110, vcPerCapita: 7.272727, vcOfGdp: 0.003636, unicorns: 1 },
  { country: "South Africa", vcM: 100, populationM: 60, gdpB: 405, vcPerCapita: 1.666667, vcOfGdp: 0.000247, unicorns: 1 },
  { country: "Ghana", vcM: 127, populationM: 34, gdpB: 76, vcPerCapita: 3.735294, vcOfGdp: 0.001671, unicorns: 0 },
  { country: "Morocco", vcM: 85, populationM: 38, gdpB: 150, vcPerCapita: 2.236842, vcOfGdp: 0.000567, unicorns: 0 },
  { country: "Qatar", vcM: 72, populationM: 3, gdpB: 220, vcPerCapita: 24, vcOfGdp: 0.000327, unicorns: 0 },
  { country: "Kuwait", vcM: 25, populationM: 4.9, gdpB: 160, vcPerCapita: 5.102041, vcOfGdp: 0.000156, unicorns: 0 },
  { country: "Tunisia", vcM: 24, populationM: 12.3, gdpB: 50, vcPerCapita: 1.95122, vcOfGdp: 0.00048, unicorns: 0 },
  { country: "Algeria", vcM: 20, populationM: 46, gdpB: 247, vcPerCapita: 0.434783, vcOfGdp: 8.1e-05, unicorns: 0 },
  { country: "Bahrain", vcM: 18, populationM: 1.6, gdpB: 47, vcPerCapita: 11.25, vcOfGdp: 0.000383, unicorns: 0 },
  { country: "Iraq", vcM: 12, populationM: 44, gdpB: 265, vcPerCapita: 0.272727, vcOfGdp: 4.5e-05, unicorns: 0 },
  { country: "Oman", vcM: 8, populationM: 5.2, gdpB: 110, vcPerCapita: 1.538462, vcOfGdp: 7.3e-05, unicorns: 0 },
  { country: "Per capita = VC / population. % of GDP = VC / GDP. Unicorns = tech unicorns based in / from the country (approx)." },
];

export interface MI_BigMarketsTrend {
  market: string;
  y2019?: number;
  y2020?: number;
  y2021?: number;
  y2022?: number;
  y2023?: number;
  y2024?: number;
  y2025?: number;
}
export const bigMarketsTrend: MI_BigMarketsTrend[] = [
  { market: "Saudi Arabia", y2019: 67, y2020: 152, y2021: 575, y2022: 987, y2023: 1383, y2024: 750, y2025: 1720 },
  { market: "UAE", y2019: 250, y2020: 600, y2021: 1165, y2022: 1190, y2023: 691, y2024: 613, y2025: 900 },
  { market: "Turkey", y2019: 100, y2020: 250, y2021: 1400, y2022: 1840, y2023: 497, y2024: 1100, y2025: 589 },
  { market: "Egypt", y2019: 99, y2020: 190, y2021: 491, y2022: 517, y2023: 503, y2024: 329, y2025: 263 },
  { market: "Nigeria", y2019: 700, y2020: 500, y2021: 1700, y2022: 1200, y2023: 468, y2024: 332, y2025: 343 },
  { market: "Kenya", y2019: 500, y2020: 320, y2021: 700, y2022: 1100, y2023: 719, y2024: 400, y2025: 975 },
  { market: "South Africa", y2019: 450, y2020: 350, y2021: 910, y2022: 555, y2023: 548, y2024: 100, y2025: 600 },
  { market: "Turkey 2024 = $1.1B domestic-founded (incl. mega strategic deals reaches ~$2.6B). KSA 2025 equity $1.72B (~$5B incl. Tamara debt)." },
];

export interface MI_MenaVsAfrica {
  year: string;
  menaBEquity: number;
  africaBInclDebt: number;
  note: string;
}
export const menaVsAfrica: MI_MenaVsAfrica[] = [
  { year: "2021", menaBEquity: 2.6, africaBInclDebt: 5.2, note: "Global boom" },
  { year: "2022", menaBEquity: 3.1, africaBInclDebt: 6.5, note: "All-time peak for Africa (Partech)" },
  { year: "2023", menaBEquity: 2.5, africaBInclDebt: 3.5, note: "Funding winter" },
  { year: "2024", menaBEquity: 1.9, africaBInclDebt: 3.2, note: "Trough" },
  { year: "2025", menaBEquity: 3.43, africaBInclDebt: 4.1, note: "Recovery; MENA $7.5B if incl. ~$4B debt (Wamda)" },
];

export interface MI_EgyptSectors {
  sector: string;
  y2024M?: number;
  y2025M?: number;
  y2025Share?: number;
  trendNote?: string;
}
export const egyptSectors: MI_EgyptSectors[] = [
  { sector: "Fintech", y2024M: 237, y2025M: 175, y2025Share: 0.29, trendNote: "Dominant but share falling; payments/lending/BNPL/neobank" },
  { sector: "Proptech", y2024M: 18, y2025M: 120, y2025Share: 0.2, trendNote: "Breakout — Nawy $75M, Africa's largest proptech round" },
  { sector: "AI / SaaS / Deeptech", y2024M: 18, y2025M: 90, y2025Share: 0.15, trendNote: "Rapid rise; Arabic NLP, Widebot, Synapse, Dxwand" },
  { sector: "E-commerce / Q-comm / B2B", y2024M: 23, y2025M: 58, y2025Share: 0.1, trendNote: "Consolidating; MaxAB-Wasoko, Cartona" },
  { sector: "Logistics & Mobility", y2024M: 20, y2025M: 48, y2025Share: 0.08, trendNote: "Bosta, Trella, Sylndr; freight strong" },
  { sector: "Healthtech", y2024M: 13, y2025M: 35, y2025Share: 0.06, trendNote: "Vezeeta, Rology (AI radiology), Yodawy" },
  { sector: "Edtech", y2024M: 10, y2025M: 20, y2025Share: 0.03, trendNote: "Nagwa, Sprints; AI-upskilling the bright spot" },
  { sector: "Agritech / Foodtech", y2024M: 8, y2025M: 18, y2025Share: 0.03, trendNote: "Mozare3, FreshSource; nascent" },
  { sector: "Cleantech / Climate", y2024M: 6, y2025M: 18, y2025Share: 0.03, trendNote: "KarmSolar, Infinity Power; mostly DFI/project finance" },
  { sector: "Gaming / Web3 / Creator", y2024M: 4, y2025M: 8, y2025Share: 0.01, trendNote: "Very nascent; talent/outsourcing market" },
  { sector: "Debt = ~43% of Egypt funding in 2024, ~30% in 2025. Series A avg ~$3.9M (2024). Female-founded ~1.2% of MENA VC." },
];

export interface MI_TopEgyptianStartups {
  company: string;
  sector: string;
  raisedM: number;
  valuationNote: string;
  keyBackers: string;
  status: string;
}
export const topEgyptianStartups: MI_TopEgyptianStartups[] = [
  { company: "MNT-Halan", sector: "Fintech super-app", raisedM: 829, valuationNote: "$1.4B (Jun 2026)", keyBackers: "IFC, Apis, DPI, Chimera, Al Ahly", status: "Unicorn" },
  { company: "MaxAB-Wasoko", sector: "B2B e-commerce", raisedM: 230, valuationNote: "$526M post-merger", keyBackers: "Tiger Global, Silver Lake", status: "Active" },
  { company: "Swvl", sector: "Mass transit (listed)", raisedM: 200, valuationNote: "SPAC $1.5B then collapse", keyBackers: "NASDAQ", status: "Listed" },
  { company: "Paymob", sector: "Payments infra", raisedM: 90, valuationNote: "Soonicorn", keyBackers: "PayPal Ventures, Kora, A15", status: "Active" },
  { company: "Nawy", sector: "Proptech", raisedM: 75, valuationNote: "Africa's #1 proptech", keyBackers: "Partech, e&, Shorooq", status: "Active" },
  { company: "Khazna", sector: "Fintech super-app", raisedM: 63, valuationNote: "KSA bank-licence push", keyBackers: "Quona, Global Ventures", status: "Active" },
  { company: "Vezeeta", sector: "Healthtech", raisedM: 63, valuationNote: "7 MENA markets", keyBackers: "STV, Gulf Capital", status: "Active" },
  { company: "Trella", sector: "Freight logistics", raisedM: 56, valuationNote: "—", keyBackers: "Maersk Growth, Raed, YC", status: "Active" },
  { company: "Breadfast", sector: "Q-commerce", raisedM: 60, valuationNote: "~$403M valuation", keyBackers: "Mubadala, SBI, IFC, EBRD", status: "Active" },
  { company: "MoneyFellows", sector: "Digital savings (ROSCA)", raisedM: 50, valuationNote: "8.5M users", keyBackers: "Partech, CommerzVentures", status: "Active" },
  { company: "Lucky", sector: "Consumer credit", raisedM: 48, valuationNote: "$23M Series B '26", keyBackers: "Disruptech, OneStop", status: "Active" },
  { company: "Thndr", sector: "Retail investing", raisedM: 38, valuationNote: "4M+ users", keyBackers: "Prosus, Tiger, YC, BECO", status: "Active" },
  { company: "Bosta", sector: "Last-mile logistics", raisedM: 35, valuationNote: "EGX IPO targeted '26", keyBackers: "Raed, YC, Axian", status: "Active" },
  { company: "Brimore", sector: "Social commerce", raisedM: 29, valuationNote: "—", keyBackers: "IFC, Endure, Algebra", status: "Active" },
  { company: "Capiter", sector: "B2B e-commerce", raisedM: 33, valuationNote: "Fraud allegations", keyBackers: "Quona, MSA, Shorooq", status: "Defunct" },
  { company: "valU", sector: "Fintech / BNPL", raisedM: 91, valuationNote: "EGX-listed (EFG spin-out, ~$530M)", keyBackers: "EFG / Saudi / NBE", status: "Listed" },
  { company: "Telda", sector: "Consumer neobank", raisedM: 20, valuationNote: "Sequoia's 1st MENA deal", keyBackers: "Sequoia, GFC, Block", status: "Active" },
  { company: "Sylndr", sector: "Used-car marketplace", raisedM: 27, valuationNote: "—", keyBackers: "DPI/Nclude, Algebra", status: "Active" },
  { company: "Fawry", sector: "Payments (listed)", raisedM: 46, valuationNote: "~$600M mkt cap", keyBackers: "EGX since 2019", status: "Listed" },
  { company: "Dopay", sector: "Payroll fintech", raisedM: 31, valuationNote: "—", keyBackers: "—", status: "Active" },
];

export interface MI_StartupRoster80 {
  company: string;
  subSector: string;
  whatItDoes: string;
  funding: string;
  status: string;
  group: string;
}
export const startupRoster80: MI_StartupRoster80[] = [
  { company: "MNT-Halan", subSector: "Super-app", whatItDoes: "Lending, payments, e-commerce, logistics for unbanked", funding: "$829M", status: "Unicorn", group: "FINTECH" },
  { company: "Fawry", subSector: "Payments", whatItDoes: "Omnichannel payments network, 50K+ touchpoints", funding: "IPO", status: "Listed", group: "FINTECH" },
  { company: "Paymob", subSector: "Payments infra", whatItDoes: "Gateway / merchant acquiring for SMEs", funding: "~$90M", status: "Active", group: "FINTECH" },
  { company: "valU", subSector: "BNPL", whatItDoes: "Embedded consumer finance at checkout", funding: "$91M", status: "Listed", group: "FINTECH" },
  { company: "MoneyFellows", subSector: "Savings", whatItDoes: "Digitized rotating savings circles (ROSCA)", funding: "~$50M", status: "Active", group: "FINTECH" },
  { company: "Khazna", subSector: "Neobank", whatItDoes: "Wallet + earned-wage access for blue-collar", funding: "~$63M", status: "Active", group: "FINTECH" },
  { company: "Telda", subSector: "Neobank", whatItDoes: "Consumer banking app, IBAN, cashback", funding: "~$20M", status: "Active", group: "FINTECH" },
  { company: "Sympl", subSector: "BNPL", whatItDoes: "BNPL for e-commerce checkout", funding: "~$6M", status: "Active", group: "FINTECH" },
  { company: "Kashat", subSector: "Nano-lending", whatItDoes: "Mobile micro-loans, sub-$50 tickets", funding: "~$6M", status: "Active", group: "FINTECH" },
  { company: "Blnk", subSector: "Credit-as-a-service", whatItDoes: "API-first merchant credit layer", funding: "~$5M", status: "Active", group: "FINTECH" },
  { company: "Sahl", subSector: "Bill payments", whatItDoes: "Bill aggregation super-app, 12M+ users", funding: "~$6M", status: "Active", group: "FINTECH" },
  { company: "Dopay", subSector: "Payroll", whatItDoes: "Payroll digitization for cash workers", funding: "~$31M", status: "Active", group: "FINTECH" },
  { company: "Connect Money", subSector: "Embedded finance", whatItDoes: "White-label banking APIs", funding: "~$3M", status: "Active", group: "FINTECH" },
  { company: "Flend", subSector: "P2P lending", whatItDoes: "SME lending marketplace (sandbox)", funding: "~$1M", status: "Early", group: "FINTECH" },
  { company: "Qardy", subSector: "Gig credit", whatItDoes: "Micro-lending for gig workers", funding: "~$1M", status: "Seed", group: "FINTECH" },
  { company: "Kiwe", subSector: "Social payments", whatItDoes: "CBE-approved social P2P payments", funding: "~$1M", status: "Seed", group: "FINTECH" },
  { company: "NowPay", subSector: "Earned-wage", whatItDoes: "Salary advances for employees", funding: "~$23M", status: "Active", group: "FINTECH" },
  { company: "Thndr", subSector: "Investing", whatItDoes: "Retail stock & fund trading app", funding: "$38M", status: "Active", group: "WEALTH / INSURTECH" },
  { company: "Amenli", subSector: "Insurtech", whatItDoes: "Digital insurance marketplace", funding: "~$5M", status: "Active", group: "WEALTH / INSURTECH" },
  { company: "Azimut Egypt", subSector: "WealthTech", whatItDoes: "Digital investment funds platform", funding: "Parent", status: "Active", group: "WEALTH / INSURTECH" },
  { company: "Bokra", subSector: "Savings", whatItDoes: "Micro-savings & sukuk investment", funding: "~$2M", status: "Seed", group: "WEALTH / INSURTECH" },
  { company: "MaxAB-Wasoko", subSector: "B2B e-com", whatItDoes: "FMCG distribution, 450K+ merchants", funding: "$230M", status: "Active", group: "B2B COMMERCE" },
  { company: "Cartona", subSector: "B2B marketplace", whatItDoes: "Asset-light retailer-supplier marketplace", funding: "~$14M", status: "Active", group: "B2B COMMERCE" },
  { company: "Brimore", subSector: "Social commerce", whatItDoes: "Brand-to-consumer via women resellers", funding: "$29M", status: "Active", group: "B2B COMMERCE" },
  { company: "Taager", subSector: "Dropshipping", whatItDoes: "Backend for online resellers", funding: "~$19M", status: "Active", group: "B2B COMMERCE" },
  { company: "OneOrder", subSector: "HoReCa supply", whatItDoes: "F&B procurement for restaurants", funding: "$6.5M", status: "Active", group: "B2B COMMERCE" },
  { company: "Fatura", subSector: "B2B market", whatItDoes: "Links manufacturers to micro-retailers", funding: "~$3M", status: "Active", group: "B2B COMMERCE" },
  { company: "Capiter", subSector: "B2B e-com", whatItDoes: "FMCG marketplace (collapsed 2022)", funding: "$33M", status: "Defunct", group: "B2B COMMERCE" },
  { company: "Bosta", subSector: "Last-mile", whatItDoes: "Tech-enabled e-commerce delivery", funding: "~$35M", status: "Active", group: "LOGISTICS & MOBILITY" },
  { company: "Mylerz", subSector: "Fulfilment", whatItDoes: "E-commerce fulfilment + delivery", funding: "~$20M", status: "Active", group: "LOGISTICS & MOBILITY" },
  { company: "Trella", subSector: "Freight", whatItDoes: "Digital road-freight marketplace", funding: "$56M", status: "Active", group: "LOGISTICS & MOBILITY" },
  { company: "Sylndr", subSector: "Auto-tech", whatItDoes: "Used-car marketplace + financing", funding: "~$27M", status: "Active", group: "LOGISTICS & MOBILITY" },
  { company: "Swvl", subSector: "Transit", whatItDoes: "Mass-transit bus booking (listed)", funding: "$167M", status: "Listed", group: "LOGISTICS & MOBILITY" },
  { company: "ShipBlu", subSector: "Fulfilment", whatItDoes: "SME e-commerce delivery (YC)", funding: "~$8M", status: "Active", group: "LOGISTICS & MOBILITY" },
  { company: "Voo", subSector: "Micro-mobility", whatItDoes: "E-scooter rentals", funding: "~$3M", status: "Active", group: "LOGISTICS & MOBILITY" },
  { company: "Breadfast", subSector: "Q-commerce", whatItDoes: "30-min groceries + bakery, dark stores", funding: "~$60M", status: "Active", group: "Q-COMMERCE & FOOD" },
  { company: "Rabbit", subSector: "Q-commerce", whatItDoes: "15-min grocery via dark stores", funding: "~$64M", status: "Active", group: "Q-COMMERCE & FOOD" },
  { company: "Appetito", subSector: "Grocery", whatItDoes: "On-demand grocery delivery", funding: "~$5M", status: "Active", group: "Q-COMMERCE & FOOD" },
  { company: "Vezeeta", subSector: "Booking", whatItDoes: "Doctor discovery & teleconsult, 7 markets", funding: "$63M", status: "Active", group: "HEALTHTECH" },
  { company: "Rology", subSector: "AI radiology", whatItDoes: "AI-assisted teleradiology", funding: "n/a", status: "Active", group: "HEALTHTECH" },
  { company: "Yodawy", subSector: "Pharma", whatItDoes: "Pharmacy benefits + e-pharmacy", funding: "~$10M", status: "Active", group: "HEALTHTECH" },
  { company: "Chefaa", subSector: "E-pharmacy", whatItDoes: "Chronic medication management", funding: "~$5M", status: "Active", group: "HEALTHTECH" },
  { company: "Shezlong", subSector: "Mental health", whatItDoes: "Online therapy, 500+ therapists", funding: "~$3M", status: "Active", group: "HEALTHTECH" },
  { company: "Esaal", subSector: "Teleconsult", whatItDoes: "Ask-a-doctor text/video", funding: "~$2M", status: "Active", group: "HEALTHTECH" },
  { company: "Nagwa", subSector: "K-12", whatItDoes: "Digital curriculum, 70M+ students", funding: "~$20M", status: "Active", group: "EDTECH" },
  { company: "iSchool", subSector: "STEM kids", whatItDoes: "Coding/robotics for ages 6-18", funding: "~$5M", status: "Active", group: "EDTECH" },
  { company: "Sprints", subSector: "Bootcamp", whatItDoes: "Coding bootcamp + job placement", funding: "~$3M", status: "Active", group: "EDTECH" },
  { company: "Almentor", subSector: "Learning", whatItDoes: "Largest Arabic online learning library", funding: "~$7M", status: "Active", group: "EDTECH" },
  { company: "Orcas", subSector: "AI tutoring", whatItDoes: "Adaptive K-12 tutoring in Arabic", funding: "~$3M", status: "Active", group: "EDTECH" },
  { company: "Career 180", subSector: "Careers", whatItDoes: "Job board + career guidance", funding: "~$2M", status: "Active", group: "EDTECH" },
  { company: "Nawy", subSector: "Marketplace", whatItDoes: "AI real-estate marketplace + fractional", funding: "$75M", status: "Active", group: "PROPTECH" },
  { company: "Aqarmap", subSector: "Listings", whatItDoes: "Property listings + data analytics", funding: "~$10M", status: "Active", group: "PROPTECH" },
  { company: "SAKneen", subSector: "Affordable housing", whatItDoes: "Middle-income housing marketplace", funding: "~$3M", status: "Seed", group: "PROPTECH" },
  { company: "Partment", subSector: "Fractional", whatItDoes: "Fractional real-estate ownership", funding: "~$2M", status: "Seed", group: "PROPTECH" },
  { company: "Mozare3", subSector: "Agri-fintech", whatItDoes: "Loans + market access for smallholders", funding: "7-fig", status: "Active", group: "AGRITECH / FOODTECH" },
  { company: "FreshSource", subSector: "Produce", whatItDoes: "Farm-to-HoReCa fresh produce sourcing", funding: "~$3M", status: "Active", group: "AGRITECH / FOODTECH" },
  { company: "Nule", subSector: "Food-as-medicine", whatItDoes: "Nutrition-focused meal delivery", funding: "~$2M", status: "Seed", group: "AGRITECH / FOODTECH" },
  { company: "Instabug (Luciq)", subSector: "Dev tools", whatItDoes: "Mobile bug & performance SDK; rebranded Luciq 2025", funding: "~$7M", status: "Active", group: "AI / SAAS / DEEPTECH" },
  { company: "InfiniLink", subSector: "Semiconductors", whatItDoes: "Chip IP — acquired by GlobalFoundries", funding: "exit", status: "Exited", group: "AI / SAAS / DEEPTECH" },
  { company: "Dxwand", subSector: "Arabic AI", whatItDoes: "Enterprise Arabic NLP / voice agents", funding: "~$5M", status: "Active", group: "AI / SAAS / DEEPTECH" },
  { company: "Widebot", subSector: "Arabic LLM", whatItDoes: "Arabic conversational AI platform", funding: "$3M", status: "Active", group: "AI / SAAS / DEEPTECH" },
  { company: "Synapse Analytics", subSector: "Data/ML", whatItDoes: "Enterprise data & ML platform", funding: "$2M", status: "Active", group: "AI / SAAS / DEEPTECH" },
  { company: "Convertedin", subSector: "Marketing OS", whatItDoes: "AI ad automation for e-commerce", funding: "~$3M", status: "Active", group: "AI / SAAS / DEEPTECH" },
  { company: "Robusta", subSector: "DevOps", whatItDoes: "SRE / Kubernetes automation", funding: "~$3M", status: "Active", group: "AI / SAAS / DEEPTECH" },
  { company: "Nanovate", subSector: "Voice AI", whatItDoes: "22-dialect Arabic voice agents", funding: "$1M", status: "Seed", group: "AI / SAAS / DEEPTECH" },
  { company: "Wuilt", subSector: "No-code", whatItDoes: "Website + store builder for SMEs", funding: "~$2M", status: "Active", group: "AI / SAAS / DEEPTECH" },
  { company: "Sinai.ai", subSector: "AI edtech", whatItDoes: "AI-native interactive books (2024)", funding: "$1.45M", status: "Seed", group: "AI / SAAS / DEEPTECH" },
  { company: "Infinity Power", subSector: "Renewables", whatItDoes: "Solar + wind at scale (Lekela)", funding: "JV", status: "Active", group: "CLIMATE / CLEANTECH" },
  { company: "KarmSolar", subSector: "Solar", whatItDoes: "C&I solar + energy management", funding: "$25M", status: "Active", group: "CLIMATE / CLEANTECH" },
  { company: "Shamsina", subSector: "Rooftop solar", whatItDoes: "Residential solar install marketplace", funding: "~$2M", status: "Seed", group: "CLIMATE / CLEANTECH" },
  { company: "Bekia", subSector: "Recycling", whatItDoes: "Reverse-logistics recycling app", funding: "~$3M", status: "Active", group: "CLIMATE / CLEANTECH" },
  { company: "DAWAR", subSector: "Recycling", whatItDoes: "Digitized recyclable-waste tracking (2026)", funding: "6-fig", status: "Seed", group: "CLIMATE / CLEANTECH" },
  { company: "Pravica", subSector: "Web3", whatItDoes: "Decentralized comms + storage", funding: "~$2M", status: "Active", group: "GAMING / WEB3" },
  { company: "YoumPlay", subSector: "Gaming", whatItDoes: "Arabic gaming platform & content", funding: "~$1M", status: "Seed", group: "GAMING / WEB3" },
];

export interface MI_MegaDealsExits {
  company: string;
  country: string;
  sector: string;
  event: string;
  size: string;
  year: string;
}
export const megaDealsExits: MI_MegaDealsExits[] = [
  { company: "MNT-Halan", country: "Egypt", sector: "Fintech", event: "Growth round (Al Ahly Capital) → $1.4B val", size: "$1.4B val", year: "2026" },
  { company: "valU", country: "Egypt", sector: "Fintech/BNPL", event: "EGX listing, +852% debut", size: "~$370M cap", year: "2025" },
  { company: "Bosta", country: "Egypt", sector: "Logistics", event: "Secondary exit, 75% IRR", size: "undisclosed", year: "2026" },
  { company: "InfiniLink", country: "Egypt", sector: "Deeptech", event: "Acquired by GlobalFoundries", size: "~400% return", year: "2025" },
  { company: "Breadfast", country: "Egypt", sector: "Q-commerce", event: "Pre-Series C (Mubadala)", size: "$50M", year: "2026" },
  { company: "Tamara", country: "Saudi Arabia", sector: "Fintech/BNPL", event: "Asset-backed facility", size: "$2.4B*", year: "2025" },
  { company: "TruKKer", country: "UAE", sector: "Logistics", event: "ADCB securitisation", size: "$300M*", year: "2026" },
  { company: "Ninja", country: "Saudi Arabia", sector: "Q-commerce", event: "Growth round", size: "~$250M", year: "2025" },
  { company: "Stitch", country: "Saudi Arabia", sector: "Fintech infra", event: "Series A (a16z's 1st GCC bet)", size: "$25M", year: "2026" },
  { company: "Tabby", country: "UAE", sector: "Fintech/BNPL", event: "Series D→E ($3.3B→$4.5B val)", size: "$200M", year: "2023" },
  { company: "Foodics", country: "Saudi Arabia", sector: "SaaS", event: "Series C", size: "$170M", year: "2023" },
  { company: "MNT-Halan", country: "Egypt", sector: "Fintech", event: "Growth + Turkey M&A", size: "$157.5M", year: "2024" },
  { company: "HALA", country: "Saudi Arabia", sector: "Fintech", event: "Series B", size: "$157M", year: "2025" },
  { company: "Salla", country: "Saudi Arabia", sector: "E-commerce SaaS", event: "Pre-IPO", size: "$130M", year: "2025" },
  { company: "Yassir", country: "Algeria", sector: "Super-app", event: "Series B", size: "$150M", year: "2022" },
  { company: "Nawy", country: "Egypt", sector: "Proptech", event: "Series A + debt", size: "$75M", year: "2025" },
  { company: "Paymob", country: "Egypt", sector: "Payments", event: "Series B (extended)", size: "$72M", year: "2024" },
  { company: "MNT-Halan", country: "Egypt", sector: "Fintech", event: "Unicorn round", size: "$400M", year: "2023" },
  { company: "InstaDeep", country: "Tunisia", sector: "AI", event: "Acquired by BioNTech", size: "~$682M", year: "2023" },
  { company: "Trendyol Go", country: "Turkey", sector: "Q-commerce", event: "Uber buys 85%", size: "$700M", year: "2025" },
  { company: "Hepsiburada", country: "Turkey", sector: "E-commerce", event: "Kaspi buys 65%", size: "$1.1B", year: "2024" },
  { company: "Dream Games", country: "Turkey", sector: "Gaming", event: "CVC buyout (25% stake)", size: "$5B val", year: "2025" },
  { company: "Expensya", country: "Tunisia", sector: "SaaS", event: "Acquired by Medius", size: "> $100M", year: "2023" },
];

export interface MI_LatestRounds2026 {
  date: string;
  company: string;
  country: string;
  sector: string;
  stage: string;
  amount: string;
  investorsNote: string;
}
export const latestRounds2026: MI_LatestRounds2026[] = [
  { date: "Jun 2026", company: "MNT-Halan", country: "Egypt", sector: "Fintech", stage: "Growth", amount: "→$1.4B val", investorsNote: "Al Ahly Capital-led; IPO signaled" },
  { date: "Jun 2026", company: "DAWAR", country: "Egypt", sector: "Cleantech", stage: "Seed", amount: "6-fig", investorsNote: "GlobalCorp, Tawasoa, CIB" },
  { date: "May 2026", company: "TruKKer", country: "UAE", sector: "Logistics", stage: "Debt", amount: "$300M", investorsNote: "ADCB securitisation" },
  { date: "May 2026", company: "Stitch", country: "Saudi Arabia", sector: "Fintech infra", stage: "Series A", amount: "$25M", investorsNote: "a16z (first GCC bet)" },
  { date: "May 2026", company: "Bosta (exit)", country: "Egypt", sector: "Logistics", stage: "Secondary", amount: "undisclosed", investorsNote: "Beltone VC + Citadel, 75% IRR" },
  { date: "Apr 2026", company: "Comfi", country: "UAE", sector: "B2B BNPL", stage: "Pre-Series A", amount: "$65M", investorsNote: "Iliad, Yango, Raw Ventures" },
  { date: "Apr 2026", company: "Sinai.ai", country: "Egypt", sector: "AI edtech", stage: "Pre-seed", amount: "$1.45M", investorsNote: "KAUST, DisrupTech, Maza" },
  { date: "Apr 2026", company: "Lucky", country: "Egypt", sector: "Fintech", stage: "Series B", amount: "$23M", investorsNote: "Disruptech, OneStop" },
  { date: "Feb 2026", company: "Breadfast", country: "Egypt", sector: "Q-commerce", stage: "Pre-Series C", amount: "$50M", investorsNote: "Mubadala, Olayan, SBI" },
  { date: "Jan 2026", company: "valU", country: "Egypt", sector: "Fintech", stage: "Debt", amount: "$64M", investorsNote: "National Bank of Egypt" },
  { date: "Jan 2026", company: "NowPay", country: "Egypt", sector: "Fintech", stage: "Strategic", amount: "$20M", investorsNote: "Strategic (undisclosed)" },
  { date: "Sep 2025", company: "Tamara", country: "Saudi Arabia", sector: "Fintech", stage: "Debt", amount: "$2.4B", investorsNote: "Goldman, Citi, Apollo" },
  { date: "Aug 2025", company: "Breadfast", country: "Egypt", sector: "Q-commerce", stage: "Series B2", amount: "$10M", investorsNote: "EBRD" },
  { date: "Aug 2025", company: "onebank", country: "Egypt", sector: "Digital bank", stage: "Licence", amount: "—", investorsNote: "First CBE digital-bank licence" },
  { date: "May 2025", company: "Nawy", country: "Egypt", sector: "Proptech", stage: "Series A+debt", amount: "$75M", investorsNote: "Partech, e&, Shorooq" },
  { date: "May 2025", company: "Thndr", country: "Egypt", sector: "WealthTech", stage: "Expansion", amount: "$15.7M", investorsNote: "Prosus, YC, BECO" },
  { date: "May 2025", company: "Sylndr", country: "Egypt", sector: "Auto-tech", stage: "Series A", amount: "$15.7M", investorsNote: "DPI/Nclude, Algebra" },
  { date: "May 2025", company: "MoneyFellows", country: "Egypt", sector: "Fintech", stage: "Pre-Series C", amount: "$13M", investorsNote: "Al Mada, Nclude" },
];

export interface MI_Unicorns {
  company: string;
  country: string;
  sector: string;
  valuationB: number | string;
  note: string;
}
export const unicorns: MI_Unicorns[] = [
  { company: "Trendyol", country: "Turkey", sector: "E-commerce", valuationB: 15, note: "Alibaba-backed; Uber bought 85% of Trendyol Go" },
  { company: "Dream Games", country: "Turkey", sector: "Gaming", valuationB: 5, note: "Royal Match; CVC buyout 2025" },
  { company: "Tabby", country: "UAE/KSA", sector: "Fintech/BNPL", valuationB: 4.5, note: "Largest MENA fintech by valuation" },
  { company: "Flutterwave", country: "Nigeria", sector: "Fintech", valuationB: 3, note: "No new raise since 2022" },
  { company: "OPay", country: "Nigeria", sector: "Fintech", valuationB: 2.7, note: "Opera-backed super-app" },
  { company: "Wave", country: "Senegal", sector: "Mobile money", valuationB: 1.7, note: "$137M debt round 2025" },
  { company: "TymeBank", country: "South Africa", sector: "Digital bank", valuationB: 1.5, note: "Nubank-led Series D 2024" },
  { company: "Andela", country: "Nigeria", sector: "Talent", valuationB: 1.5, note: "No update since 2021" },
  { company: "MNT-Halan", country: "Egypt", sector: "Fintech", valuationB: 1.4, note: "Egypt's first unicorn; $1.4B Jun 2026" },
  { company: "Moniepoint", country: "Nigeria", sector: "Fintech", valuationB: 1, note: "Visa investment Jan 2025" },
  { company: "Interswitch", country: "Nigeria", sector: "Fintech", valuationB: 1, note: "Unchanged since 2019" },
  { company: "Tamara", country: "Saudi Arabia", sector: "Fintech", valuationB: 1, note: "First Saudi fintech unicorn" },
  { company: "InstaDeep", country: "Tunisia", sector: "AI", valuationB: "exit", note: "Sold to BioNTech ~$682M (2023)" },
];

export interface MI_Investors {
  investor: string;
  typeHq: string;
  stage: string;
  fundSizeAum: string;
  notableEgyptBets: string;
  group: string;
}
export const investors: MI_Investors[] = [
  { investor: "Algebra Ventures ★", typeHq: "VC · Cairo", stage: "Seed–Series A", fundSizeAum: "$90M Fund II", notableEgyptBets: "MNT-Halan, Sylndr, Breadfast", group: "EGYPT-BASED VCS" },
  { investor: "Sawari Ventures", typeHq: "VC · Cairo", stage: "Early–growth", fundSizeAum: "n/a", notableEgyptBets: "Fawry, Instabug, Nafham", group: "EGYPT-BASED VCS" },
  { investor: "A15 ★", typeHq: "VC + builder · Cairo", stage: "Seed–Series B", fundSizeAum: "n/a (43 cos)", notableEgyptBets: "Paymob, Swvl, MaxAB", group: "EGYPT-BASED VCS" },
  { investor: "Disruptech ★", typeHq: "Fintech VC · Cairo", stage: "Pre-seed–A", fundSizeAum: "$25M", notableEgyptBets: "Khazna, Lucky, MoneyFellows", group: "EGYPT-BASED VCS" },
  { investor: "DPI VC (ex-Nclude) ★", typeHq: "Fintech VC · Cairo", stage: "Seed–Series A", fundSizeAum: "$105M", notableEgyptBets: "Paymob, Khazna, Partment", group: "EGYPT-BASED VCS" },
  { investor: "Endure Capital", typeHq: "VC · Cairo", stage: "Seed–Series A", fundSizeAum: "$85M", notableEgyptBets: "MaxAB, Breadfast, Careem", group: "EGYPT-BASED VCS" },
  { investor: "Beltone VC", typeHq: "VC · Cairo (new '23)", stage: "Pre-seed–seed", fundSizeAum: "$50M+$5M debt", notableEgyptBets: "Bluworks; PE platform 2026", group: "EGYPT-BASED VCS" },
  { investor: "Camel Ventures", typeHq: "Venture debt · Cairo", stage: "Early", fundSizeAum: "n/a", notableEgyptBets: "Fintech debt specialist", group: "EGYPT-BASED VCS" },
  { investor: "Foundation Ventures", typeHq: "VC · Cairo", stage: "Early–growth", fundSizeAum: "$25M", notableEgyptBets: "MSMEDA-backed", group: "EGYPT-BASED VCS" },
  { investor: "P1 Ventures", typeHq: "Pan-African · Cairo", stage: "Seed–Series A", fundSizeAum: "$35M Fund II", notableEgyptBets: "MSMEDA-backed", group: "EGYPT-BASED VCS" },
  { investor: "Acasia Ventures", typeHq: "VC · Cairo", stage: "Pre-seed–A", fundSizeAum: "n/a", notableEgyptBets: "MEA early-stage", group: "EGYPT-BASED VCS" },
  { investor: "Shorooq Partners ★", typeHq: "VC · Abu Dhabi", stage: "Seed–Series B", fundSizeAum: "$100M AI fund", notableEgyptBets: "Nawy + 9 deals 2025", group: "GCC / REGIONAL" },
  { investor: "Global Ventures", typeHq: "VC · Dubai", stage: "Seed–Series B", fundSizeAum: "n/a", notableEgyptBets: "Paymob, Khazna (via Nclude)", group: "GCC / REGIONAL" },
  { investor: "Lorax Capital ★", typeHq: "PE/growth · Cairo", stage: "Growth–PE", fundSizeAum: "$450M+", notableEgyptBets: "MNT-Halan $157.5M round", group: "GCC / REGIONAL" },
  { investor: "Raed Ventures", typeHq: "VC · Riyadh", stage: "Seed–Series A", fundSizeAum: "n/a", notableEgyptBets: "Regional incl. Egypt", group: "GCC / REGIONAL" },
  { investor: "Sanabil (PIF)", typeHq: "VC/FoF · Riyadh", stage: "Seed–growth", fundSizeAum: "n/a", notableEgyptBets: "Sanabil Accelerator", group: "GCC / REGIONAL" },
  { investor: "e& Capital", typeHq: "CVC · Abu Dhabi", stage: "Series A–growth", fundSizeAum: "$250M", notableEgyptBets: "Telecom/fintech", group: "GCC / REGIONAL" },
  { investor: "MEVP/BY Venture", typeHq: "VC · Dubai", stage: "Seed–growth", fundSizeAum: "$300M+", notableEgyptBets: "MENA incl. Egypt", group: "GCC / REGIONAL" },
  { investor: "Prosus / Naspers", typeHq: "CVC · Amsterdam", stage: "Series B+", fundSizeAum: "n/a", notableEgyptBets: "qeen.ai, historical Egypt", group: "GCC / REGIONAL" },
  { investor: "Chimera (Abu Dhabi)", typeHq: "Asset mgr", stage: "Multi-asset", fundSizeAum: "$50B AUM", notableEgyptBets: "MNT-Halan 2023 round", group: "GCC / REGIONAL" },
  { investor: "IFC ★", typeHq: "DFI · Washington", stage: "All stages", fundSizeAum: "—", notableEgyptBets: "MNT-Halan $40M, Algebra LP", group: "DFIS" },
  { investor: "EBRD ★", typeHq: "DFI · London", stage: "Seed–growth", fundSizeAum: "—", notableEgyptBets: "Led Paymob $72M", group: "DFIS" },
  { investor: "BII (UK)", typeHq: "DFI · London", stage: "All stages", fundSizeAum: "—", notableEgyptBets: "$707M Egypt portfolio", group: "DFIS" },
  { investor: "Proparco", typeHq: "DFI · Paris", stage: "Early–growth", fundSizeAum: "—", notableEgyptBets: "LP in Disruptech", group: "DFIS" },
  { investor: "FMO", typeHq: "DFI · The Hague", stage: "Growth", fundSizeAum: "—", notableEgyptBets: "Paymob Series B", group: "DFIS" },
  { investor: "Flat6Labs / F6 Ventures ★", typeHq: "Accelerator+VC", stage: "Pre-seed–seed", fundSizeAum: "$90M AUM", notableEgyptBets: "Swvl, Elves, Eventtus", group: "ACCELERATORS / ANGELS / BANKS" },
  { investor: "Falak Startups", typeHq: "Accelerator", stage: "Seed", fundSizeAum: "EGP 2M ticket", notableEgyptBets: "Sector-agnostic", group: "ACCELERATORS / ANGELS / BANKS" },
  { investor: "AUC Venture Lab", typeHq: "Univ. accelerator", stage: "Pre-seed", fundSizeAum: "—", notableEgyptBets: "375+ cos, $356M alumni $", group: "ACCELERATORS / ANGELS / BANKS" },
  { investor: "Cairo Angels", typeHq: "Angel network", stage: "Pre-seed–seed", fundSizeAum: "—", notableEgyptBets: "Co-invests w/ Flat6Labs", group: "ACCELERATORS / ANGELS / BANKS" },
  { investor: "500 Global MENA", typeHq: "Micro-VC", stage: "Pre-seed–seed", fundSizeAum: "—", notableEgyptBets: "ITIDA partnership", group: "ACCELERATORS / ANGELS / BANKS" },
  { investor: "CIB / Banque Misr / NBE", typeHq: "Bank LPs / debt", stage: "LP + debt", fundSizeAum: "—", notableEgyptBets: "Anchored Nclude; debt to scale-ups", group: "ACCELERATORS / ANGELS / BANKS" },
];

export interface MI_Government {
  initiative: string;
  date: string;
  detail: string;
}
export const government: MI_Government[] = [
  { initiative: "National Startup Charter", date: "Feb 2026", detail: "Legal startup definition (<=7 yrs); 5-day classification via VC/accelerator nomination; 90-day liquidation. Targets: 5,000 startups, 500,000 jobs, $1B over 5 years." },
  { initiative: "Law 6/2025 (tax)", date: "Mar 2025", detail: "Turnover <= EGP 20M: exemptions on stamp duty, incorporation fees, capital gains on fixed assets, and dividend tax." },
  { initiative: "MSMEDA Fund-of-Funds", date: "2021-25", detail: "~$35M+ committed across 11+ VC funds (World Bank-backed); unified VC reporting standard launched 2025 (Visible.vc)." },
  { initiative: "Ras El Hekma / ADQ", date: "2024", detail: "Abu Dhabi $35B ($24B new + $11B deposit conversion) — largest FDI in Egypt's history; enabled the March-2024 float." },
  { initiative: "CBE InstaPay / IPN", date: "2022-25", detail: "Instant payment rail; 16M users, ~EGP 2.4T transacted; fees introduced Apr 2025." },
  { initiative: "Meeza national cards", date: "2025", detail: "43.5M cards issued; 55.5M e-wallets; Apple Pay live since Dec 2024." },
  { initiative: "onebank (digital bank)", date: "Aug 2025", detail: "Banque Misr's Misr Digital Innovation wins Egypt's first CBE digital-bank licence." },
  { initiative: "FRA RegLab / Decrees", date: "2024", detail: "Decree 163/2024 (sandbox for non-bank fintech); Decree 57/2024 (robo-advisory)." },
  { initiative: "National AI Strategy", date: "2025-30", detail: "Targets 250+ AI startups, 30K specialists, 7.7% ICT share of GDP; National Council for AI; KARNAK Arabic LLM." },
  { initiative: "ICT 2030 / ITIDA", date: "2022-26", detail: "Digital Egypt; $4.8B IT/digital exports in 2025 (target $9B '26); applied-tech schools; IBM/Microsoft talent deals; Silicon Waha tech parks." },
  { initiative: "IMF EFF program", date: "2022-26", detail: "$8B+ facility; 6 reviews completed by Feb 2026; FX float; RSF added; SOE divestment lagging (9 of 35)." },
  { initiative: "Golden License / Investment Law", date: "2017-25", detail: "100% foreign ownership in most sectors; Golden License single-approval (44 issued by Jan 2025). ESOP treatment still legally ambiguous." },
];

export interface MI_Timeline {
  year: string;
  category: string;
  milestone: string;
  detail: string;
}
export const timeline: MI_Timeline[] = [
  { year: "2008", category: "Company", milestone: "Fawry founded", detail: "Egypt's first e-payments network (Ashraf Sabry)" },
  { year: "2015", category: "Funding", milestone: "Algebra Ventures + Paymob", detail: "First institutional tech VC ($40M); Paymob founded" },
  { year: "2016", category: "Macro", milestone: "EGP first float", detail: "Pound -50% (8.8->18); IMF $12B; startups look cheap to foreign VCs" },
  { year: "2017", category: "Company", milestone: "Swvl founded", detail: "Mass-transit app; later a $1.5B SPAC story" },
  { year: "2019", category: "Exit", milestone: "Fawry IPO", detail: "Africa's first fintech listing on EGX; +31% day one" },
  { year: "2019", category: "Policy", milestone: "CBE fintech sandbox", detail: "First regulatory sandbox opens" },
  { year: "2020", category: "Policy", milestone: "Fawry crosses $1B; Banking Law 194", detail: "First listed Egyptian tech unicorn; digital-bank legal basis" },
  { year: "2021", category: "Funding", milestone: "Record year $491M", detail: "+168% YoY, 147 deals; Sequoia/Tiger/PayPal arrive" },
  { year: "2022", category: "Funding", milestone: "Peak deals $517M", detail: "160 deals (#1 MENA); Nclude $85M fund launches" },
  { year: "2022", category: "Exit", milestone: "Swvl SPAC $1.5B", detail: "Lists on NASDAQ, then -95%" },
  { year: "2023", category: "Funding", milestone: "MNT-Halan first unicorn", detail: "$400M at $1B+; Egypt's & Africa's first 2023 unicorn" },
  { year: "2023", category: "Exit", milestone: "InstaDeep -> BioNTech", detail: "~$682M; Africa's largest tech exit (Tunisia)" },
  { year: "2023", category: "Macro", milestone: "Saudi overtakes UAE", detail: "KSA becomes MENA #1 venture market" },
  { year: "2024", category: "Macro", milestone: "March float / crash", detail: "EGP -40%+ to ~50; IMF expanded to $8B; Ras El Hekma $35B" },
  { year: "2024", category: "Exit", milestone: "MaxAB-Wasoko merger", detail: "Africa's largest tech merger; 450K+ merchants" },
  { year: "2024", category: "Macro", milestone: "Funding trough", detail: "H1 -75% YoY (~$86M)" },
  { year: "2025", category: "Policy", milestone: "National AI Strategy", detail: "2025-30: 7.7% GDP from AI, 250 startups" },
  { year: "2025", category: "Funding", milestone: "Nawy $75M", detail: "Africa's largest proptech round; deals recover to 89" },
  { year: "2025", category: "Exit", milestone: "valU EGX listing", detail: "+852% debut, ~$370M cap" },
  { year: "2025", category: "Policy", milestone: "onebank digital-bank licence", detail: "First CBE digital-bank licence (Banque Misr)" },
  { year: "2025", category: "Exit", milestone: "InfiniLink -> GlobalFoundries", detail: "Rare deeptech/chip exit; ~400% return for Egypt Ventures" },
  { year: "2026", category: "Policy", milestone: "National Startup Charter", detail: "Legal definition, tax simplification, $1B / 500K-jobs target" },
  { year: "2026", category: "Funding", milestone: "MNT-Halan $1.4B", detail: "Al Ahly Capital-led; IPO signaled within 12-18 months" },
  { year: "2026", category: "Macro", milestone: "Geopolitical funding shock", detail: "MENA -85% in March, then rebounds" },
];

export interface MI_NotablePeople {
  name: string;
  role: string;
  note: string;
}
export const notablePeople: MI_NotablePeople[] = [
  { name: "Mounir Nakhla", role: "Founder & CEO, MNT-Halan", note: "Built Egypt's first unicorn; ex-Tasaheel microfinance" },
  { name: "Ashraf Sabry", role: "Founder & CEO, Fawry", note: "Led Africa's first fintech IPO (2019)" },
  { name: "Islam Shawky", role: "Co-founder & CEO, Paymob", note: "AUC dorm room to MENA's top merchant-payments platform" },
  { name: "Mostafa El Beltagy", role: "Co-founder & CEO, Nawy", note: "Ex-Vodafone; Africa's largest proptech" },
  { name: "Ahmad Hammouda", role: "Co-founder & CEO, Thndr", note: "Ex-GM Uber Egypt; 4M+ users investing" },
  { name: "Omar Saleh", role: "Co-founder & CEO, Khazna", note: "Stanford MBA; super-app for 17M+ underbanked" },
  { name: "Belal El-Megharbel", role: "Co-founder & CEO, MaxAB", note: "Ex-Careem; Egypt's largest B2B retail network" },
  { name: "Mostafa Kandil", role: "Co-founder & CEO, Swvl", note: "2017 transit app to $1.5B NASDAQ SPAC" },
  { name: "Karim Beguir", role: "Co-founder & CEO, InstaDeep (TN)", note: "$2,000 to a ~$682M BioNTech exit" },
  { name: "Ahmed El Alfi", role: "Chairman, Sawari / Flat6Labs", note: "Built MENA's largest accelerator network" },
  { name: "Hany Al-Sonbaty", role: "Managing Partner, Sawari", note: "Ran Egypt's first FRA-regulated VC funds" },
  { name: "Ziad Mokhtar", role: "ex-MP, Algebra Ventures", note: "Backed MNT-Halan, Khazna, Yodawy; now oliv.finance" },
];

export interface MI_OutlookScenarios {
  metric: string;
  bull?: string;
  base?: string;
  bear?: string;
}
export const outlookScenarios: MI_OutlookScenarios[] = [
  { metric: "Annual VC + debt", bull: "$700-900M", base: "$400-550M", bear: "$150-250M" },
  { metric: "Key driver", bull: "MNT-Halan IPO; 2-3 digital-bank licences; Charter activates co-investment; Gaza resolved; GCC M&A wave", base: "Steady fintech/proptech; 1-2 exits; Charter partial; macro stable", bear: "Re-devaluation (>55/USD); Red Sea crisis; IMF delay; HQ flight accelerates" },
  { metric: "New unicorns", bull: "+2 (Nawy, Paymob or Khazna)", base: "+1 (Nawy approaching)", bear: "0; MNT-Halan questioned" },
  { metric: "Exits", bull: "MNT-Halan IPO + 2-3 M&A", base: "1 M&A; an EGX attempt", bear: "No IPOs; 1 distressed sale" },
  { metric: "EGP / USD", bull: "~44-46", base: "~47-50", bear: "~55-60" },
  { metric: "Watch list: MNT-Halan IPO timing; CBE digital-bank licences; Suez Canal revenue recovery; Charter implementation; EGP rate; Nawy next round; Paymob KSA/Pakistan licences; Gulf M&A pipeline; AI-services export revenue; tech brain-drain data." },
];

export interface MI_Sources {
  category: string;
  sources: string;
}
export const sources: MI_Sources[] = [
  { category: "Funding trackers", sources: "MAGNiTT; Partech Africa; Wamda; Disrupt Africa; Africa: The Big Deal; KPMG Türkiye; Lucidity Insights; StartupBlink/Startup Genome" },
  { category: "News / press", sources: "TechCabal; TechCrunch; MENAbytes; Forbes Middle East; Arab News; Enterprise/EnterpriseAM; Rest of World; Disrupt Africa; Launchbase Africa; The Startup Scene; fwdstart.me; entARABI" },
  { category: "Egypt data / official", sources: "Central Bank of Egypt; ITIDA; MCIT; FRA; MSMEDA; Ministry of International Cooperation; SIS; DataReportal; Startup.gov.eg" },
  { category: "Macro / finance", sources: "IMF; World Bank; PwC; PIIE; Standard Chartered, EFG Hermes & Al Ahly Pharos (EGP forecasts); CBInsights; Crunchbase" },
  { category: "Legal / policy", sources: "Clyde & Co; Mondaq; EY; ICLG Fintech; Chambers & Partners; Lexology; UNCTAD; US State Dept Investment Climate" },
  { category: "Note", sources: "Full per-figure source links are embedded in the underlying research dossiers. Where trackers conflict, both values and the methodology gap are noted." },
];

export interface MI_RegionalMatrix {
  country: string;
  y2019?: number;
  y2020?: number;
  y2021?: number;
  y2022?: number;
  y2023?: number;
  y2024?: number;
  y2025?: number;
  y26Q1?: number;
  deals25?: number;
  confidence?: string;
}
export const regionalMatrix: MI_RegionalMatrix[] = [
  { country: "Saudi Arabia", y2019: 148, y2020: 152, y2021: 563, y2022: 987, y2023: 1380, y2024: 750, y2025: 1720, y26Q1: 157, deals25: 257, confidence: "High" },
  { country: "UAE", y2019: 659, y2020: 723, y2021: 1960, y2022: 1190, y2023: 644, y2024: 767, y2025: 1410, y26Q1: 626, deals25: 231, confidence: "High" },
  { country: "Turkey", y2019: 280, y2020: 190, y2021: 3500, y2022: 739, y2023: 722, y2024: 1100, y2025: 640, y26Q1: 110, deals25: 200, confidence: "Med" },
  { country: "Egypt", y2019: 99, y2020: 190, y2021: 491, y2022: 517, y2023: 503, y2024: 329, y2025: 263, y26Q1: 86, deals25: 89, confidence: "High" },
  { country: "Nigeria", y2019: 307, y2020: 307, y2021: 1800, y2022: 976, y2023: 468, y2024: 520, y2025: 572, y26Q1: 78, deals25: 102, confidence: "High" },
  { country: "Kenya", y2019: 304, y2020: 305, y2021: 571, y2022: 722, y2023: 335, y2024: 390, y2025: 542, y26Q1: 94, deals25: 91, confidence: "High" },
  { country: "South Africa", y2019: 259, y2020: 215, y2021: 832, y2022: 870, y2023: 548, y2024: 459, y2025: 620, y26Q1: 157, deals25: 70, confidence: "High" },
  { country: "Morocco", y2019: 25, y2020: 20, y2021: 45, y2022: 70, y2023: 65, y2024: 55, y2025: 80, y26Q1: 23, deals25: 20, confidence: "Med" },
  { country: "Ghana", y2019: 50, y2020: 45, y2021: 95, y2022: 130, y2023: 70, y2024: 102, y2025: 90, y26Q1: 12, deals25: 23, confidence: "Med" },
  { country: "Qatar", y2019: 18, y2020: 15, y2021: 30, y2022: 40, y2023: 22, y2024: 35, y2025: 45, y26Q1: 8, deals25: 15, confidence: "Low" },
  { country: "Kuwait", y2019: 12, y2020: 10, y2021: 20, y2022: 28, y2023: 18, y2024: 25, y2025: 30, y26Q1: 5, deals25: 12, confidence: "Low" },
  { country: "Tunisia", y2019: 20, y2020: 18, y2021: 35, y2022: 40, y2023: 28, y2024: 13, y2025: 20, y26Q1: 3, deals25: 10, confidence: "Med" },
  { country: "Algeria", y2019: 5, y2020: 4, y2021: 8, y2022: 10, y2023: 8, y2024: 7, y2025: 10, y26Q1: 2, deals25: 5, confidence: "Low" },
  { country: "Bahrain", y2019: 10, y2020: 8, y2021: 18, y2022: 25, y2023: 15, y2024: 20, y2025: 28, y26Q1: 22, deals25: 12, confidence: "Low" },
  { country: "Iraq", y2019: 3, y2020: 2, y2021: 5, y2022: 8, y2023: 6, y2024: 8, y2025: 12, y26Q1: 4, deals25: 5, confidence: "Low" },
  { country: "Oman", y2019: 8, y2020: 6, y2021: 12, y2022: 22, y2023: 18, y2024: 42, y2025: 35, y26Q1: 5, deals25: 12, confidence: "Low" },
  { country: "MENA cells MAGNiTT-style equity; African peers Partech-style; Egypt on its commonly-cited series. Frames vary; compare like-for-like." },
];

export interface MI_MenaMomentum {
  month: string;
  menaM: number | string;
  deals: number | string;
}
export const menaMomentum: MI_MenaMomentum[] = [
  { month: "Jan 2025", menaM: 863, deals: 63 },
  { month: "Feb 2025", menaM: 494, deals: 58 },
  { month: "Mar 2025", menaM: 128, deals: 28 },
  { month: "Apr 2025", menaM: 228, deals: 40 },
  { month: "May 2025", menaM: 289, deals: 45 },
  { month: "Jun 2025", menaM: 52, deals: 37 },
  { month: "Jul 2025", menaM: 783, deals: 60 },
  { month: "Aug 2025", menaM: 338, deals: 47 },
  { month: "Sep 2025", menaM: 3500, deals: 74 },
  { month: "Oct 2025", menaM: 785, deals: 50 },
  { month: "Nov 2025", menaM: 228, deals: 35 },
  { month: "Dec 2025", menaM: 172, deals: 44 },
  { month: "Jan 2026", menaM: 563, deals: 59 },
  { month: "Feb 2026", menaM: 327, deals: 40 },
  { month: "Mar 2026", menaM: 48, deals: 17 },
  { month: "MENA 2025 by sector ($M)", menaM: 150, deals: 27 },
  { month: "Sector", menaM: "$M", deals: "Share" },
  { month: "Fintech", menaM: 4400, deals: 0.59 },
  { month: "Proptech", menaM: 1000, deals: 0.13 },
  { month: "E-commerce", menaM: 373, deals: 0.05 },
  { month: "AI/Deeptech", menaM: 350, deals: 0.05 },
  { month: "Logistics", menaM: 220, deals: 0.03 },
  { month: "Healthtech", menaM: 180, deals: 0.02 },
  { month: "SaaS", menaM: 150, deals: 0.02 },
  { month: "Edtech", menaM: 80, deals: 0.01 },
  { month: "Cleantech", menaM: 60, deals: 0.01 },
];

export interface MI_EgyptGranular {
  sector: string;
  y2024M?: number | string;
  y2025M?: number | string;
  y2025Share?: number | string;
}
export const egyptGranular: MI_EgyptGranular[] = [
  { sector: "Fintech", y2024M: 145, y2025M: 110, y2025Share: 0.36 },
  { sector: "Proptech", y2024M: 10, y2025M: 80, y2025Share: 0.26 },
  { sector: "AI/SaaS", y2024M: 15, y2025M: 30, y2025Share: 0.1 },
  { sector: "E-com/B2B", y2024M: 35, y2025M: 30, y2025Share: 0.1 },
  { sector: "Logistics", y2024M: 25, y2025M: 25, y2025Share: 0.08 },
  { sector: "Healthtech", y2024M: 20, y2025M: 25, y2025Share: 0.08 },
  { sector: "Cleantech", y2024M: 5, y2025M: 12, y2025Share: 0.04 },
  { sector: "Edtech", y2024M: 10, y2025M: 8, y2025Share: 0.03 },
  { sector: "Deal size by stage (2024)" },
  { sector: "Stage", y2024M: "Avg $M", y2025M: "Median $M", y2025Share: "Deals" },
  { sector: "Pre-seed/Angel", y2024M: 0.4, y2025M: 0.25, y2025Share: 25 },
  { sector: "Seed", y2024M: 1.5, y2025M: 1, y2025Share: 30 },
  { sector: "Series A", y2024M: 10, y2025M: 8, y2025Share: 12 },
  { sector: "Series B+", y2024M: 80, y2025M: 50, y2025Share: 4 },
  { sector: "Ecosystem size & diversity" },
  { sector: "Metric", y2024M: "Value" },
  { sector: "Active startups (VC-tracked)", y2024M: "~2,041 (MAGNiTT)" },
  { sector: "Active startups (broad)", y2024M: "~8,073 (Tracxn)" },
  { sector: "Cairo global rank (StartupBlink)", y2024M: "#90 · #1 North Africa" },
  { sector: "Fintech companies", y2024M: "~170-267" },
  { sector: "Active VCs / funds", y2024M: "~30-45" },
  { sector: "Tech jobs (est.)", y2024M: "~50,000-75,000" },
  { sector: "Ecosystem value (exits+val)", y2024M: "~$8.3B" },
  { sector: "Female-only-founded share (MENA)", y2024M: "1.2% (2024), from ~5.1% (2019)" },
  { sector: "Local investor growth (H1 2024)", y2024M: "+82% YoY (count)" },
  { sector: "Foreign share of largest tickets", y2024M: "Dominant by USD value" },
];

export interface MI_TopRegionalStartups {
  company: string;
  country: string;
  sector: string;
  raised: string;
  note: string;
}
export const topRegionalStartups: MI_TopRegionalStartups[] = [
  { company: "Tabby", country: "UAE/KSA", sector: "BNPL/Fintech", raised: "~$700M+", note: "MENA's leading BNPL at $4.5B; exploring IPO" },
  { company: "Tamara", country: "Saudi Arabia", sector: "BNPL/Fintech", raised: "~$900M+", note: "First Saudi consumer-finance licence; $2.4B debt facility 2025" },
  { company: "Trendyol", country: "Turkey", sector: "E-commerce", raised: "~$1.9B", note: "Turkey's largest startup (~$16.5B)" },
  { company: "Dream Games", country: "Turkey", sector: "Gaming", raised: "~$2.5B+", note: "Royal Match; $5B via CVC deal 2025" },
  { company: "Getir", country: "Turkey", sector: "Q-commerce", raised: "~$1.8B", note: "Q-commerce pioneer; down-round from $11.8B peak" },
  { company: "Insider", country: "Turkey", sector: "SaaS/MarTech", raised: "~$320M", note: "Sequoia-backed; 1,200+ brand customers" },
  { company: "Ninja", country: "Saudi Arabia", sector: "Q-commerce", raised: "~$284M", note: "Fastest-ever Saudi unicorn ($1.5B)" },
  { company: "Foodics", country: "Saudi Arabia", sector: "Restaurant SaaS", raised: "~$170M", note: "Leading F&B tech across MENA" },
  { company: "Lean Technologies", country: "Saudi Arabia", sector: "Open banking", raised: "~$100M+", note: "MENA's leading A2A payments API" },
  { company: "Salla", country: "Saudi Arabia", sector: "E-commerce SaaS", raised: "~$130M", note: "No-code storefronts; 50K+ merchants" },
  { company: "Floward", country: "Kuwait/KSA", sector: "D2C gifting", raised: "~$186M", note: "Gifting marketplace across 9+ countries" },
  { company: "Sary", country: "Saudi Arabia", sector: "B2B commerce", raised: "~$112M", note: "Wholesale marketplace; merged with SILQ 2025" },
  { company: "Hala", country: "Saudi Arabia", sector: "Embedded finance", raised: "~$250M+", note: "SME accounts + POS; $157M Series B 2025" },
  { company: "Kitopi", country: "UAE", sector: "Cloud kitchens", raised: "~$415M+", note: "SoftBank-backed; $1.55B valuation" },
  { company: "Flutterwave", country: "Nigeria", sector: "Fintech", raised: "~$475M", note: "Africa's largest payments co ($3B); IPO-prep" },
  { company: "Moniepoint", country: "Nigeria", sector: "Fintech", raised: "~$310M", note: "Africa's newest unicorn (2024)" },
  { company: "Wave", country: "Senegal", sector: "Mobile money", raised: "~$290M", note: "Lowest-cost mobile money; $1.7B" },
  { company: "M-KOPA", country: "Kenya", sector: "Fintech/Climate", raised: "~$400M+", note: "PAYG solar + finance; first profit 2025; 4M+ customers" },
  { company: "Yassir", country: "Algeria", sector: "Super-app", raised: "~$200M", note: "Algeria's breakout; ride-hailing + fintech, 6 countries" },
  { company: "InstaDeep", country: "Tunisia", sector: "AI", raised: "~$100M pre-exit", note: "Acquired by BioNTech for ~$682M (2023)" },
];

export interface MI_RegionalDealsMore {
  company: string;
  country: string;
  sector: string;
  stage: string;
  amount: string;
  year: string;
}
export const regionalDealsMore: MI_RegionalDealsMore[] = [
  { company: "Tamara", country: "Saudi Arabia", sector: "BNPL/Fintech", stage: "Asset-backed facility", amount: "$2,400M*", year: "2025" },
  { company: "Lendo", country: "Saudi Arabia", sector: "SME lending", stage: "Warehouse + Murabaha", amount: "$740M*", year: "2025" },
  { company: "TruKKer", country: "UAE", sector: "Logistics", stage: "Debt securitisation", amount: "$300M*", year: "2026" },
  { company: "Ninja", country: "Saudi Arabia", sector: "Q-commerce", stage: "Pre-IPO", amount: "$250M", year: "2025" },
  { company: "Tyme Group", country: "South Africa", sector: "Digital bank", stage: "Series D", amount: "$250M", year: "2024" },
  { company: "Mal", country: "Saudi Arabia", sector: "Fintech", stage: "Seed", amount: "$230M", year: "2026" },
  { company: "Moniepoint", country: "Nigeria", sector: "Fintech", stage: "Series C add-on", amount: "~$200M", year: "2025" },
  { company: "Floward", country: "Kuwait", sector: "D2C gifting", stage: "Growth (total)", amount: "~$186M", year: "2024" },
  { company: "Property Finder", country: "UAE", sector: "Proptech", stage: "Growth", amount: "$170M", year: "2026" },
  { company: "Foodics", country: "Saudi Arabia", sector: "SaaS", stage: "Series C", amount: "$170M", year: "2023" },
  { company: "M-KOPA", country: "Kenya", sector: "Fintech/Climate", stage: "Series F", amount: "$166M", year: "2025" },
  { company: "Tabby", country: "UAE", sector: "BNPL", stage: "Series E", amount: "$160M", year: "2025" },
  { company: "Hala", country: "Saudi Arabia", sector: "Embedded finance", stage: "Series B", amount: "$157M", year: "2025" },
  { company: "LemFi", country: "Nigeria", sector: "Remittance", stage: "Series B ext.", amount: "$134M", year: "2025" },
  { company: "Salla", country: "Saudi Arabia", sector: "E-commerce SaaS", stage: "Pre-IPO", amount: "$130M", year: "2025" },
  { company: "Erad", country: "Saudi Arabia", sector: "Embedded finance", stage: "Credit facility", amount: "$125M", year: "2025" },
  { company: "Grand Games", country: "Turkey", sector: "Gaming", stage: "Series B", amount: "$70M", year: "2025" },
  { company: "Lean Technologies", country: "Saudi Arabia", sector: "Open banking", stage: "Series B", amount: "$67.5M", year: "2024" },
  { company: "Naked Insurance", country: "South Africa", sector: "Insurtech", stage: "Series B+", amount: "$38M", year: "2025" },
  { company: "Nala", country: "Tanzania", sector: "Remittance", stage: "Credit facility", amount: "$50M", year: "2026" },
  { company: "Stitch", country: "Saudi Arabia", sector: "Fintech infra", stage: "Series A", amount: "$25M", year: "2026" },
  { company: "Chari", country: "Morocco", sector: "B2B e-commerce", stage: "Series A", amount: "~$20M", year: "2024" },
  { company: "Bfree", country: "Nigeria", sector: "Debt-recovery tech", stage: "Growth", amount: "$10M", year: "2026" },
  { company: "Dream Games", country: "Turkey", sector: "Gaming", stage: "PE round (CVC)", amount: "$2,500M", year: "2025" },
];

export interface MI_EgyptHistory201418 {
  year: string;
  egyptMEst?: string;
  deals?: string;
  note?: string;
}
export const egyptHistory201418: MI_EgyptHistory201418[] = [
  { year: "2014", egyptMEst: "~15-25", deals: "~15-20", note: "Pre-systematic tracking; sub-$2M seed rounds (Vezeeta Series A $1.4M)" },
  { year: "2015", egyptMEst: "~25-35", deals: "~20-30", note: "Mostly seed; Instabug, Yaoota; Flat6Labs/V-Lab anchor" },
  { year: "2016", egyptMEst: "~35-50", deals: "~30-40", note: "Nov 2016 EGP float halves USD valuations; fintech ~$18M disclosed" },
  { year: "2017", egyptMEst: "~45-80", deals: "~45-55", note: "Swvl founded; Halan seed; Egypt ~15% of MENA deals" },
  { year: "2018", egyptMEst: "~70-190", deals: "~65-80", note: "Swvl ~$30M (largest ever); Vezeeta $12M Series C; Egypt #2 MENA by deal count" },
  { year: "Ecosystem origins (pre-2015)" },
  { year: "Year", egyptMEst: "Milestone", note: "Detail" },
  { year: "2008", egyptMEst: "Fawry founded", note: "Egypt's first e-payments network" },
  { year: "2010", egyptMEst: "Sawari Ventures founded", note: "Egypt's first dedicated early-stage VC (El Alfi + Al-Sonbaty)" },
  { year: "2010", egyptMEst: "Bey2ollak founded", note: "Crowd-sourced traffic app" },
  { year: "2011", egyptMEst: "Flat6Labs launched", note: "MENA's first regional seed accelerator (by Sawari)" },
  { year: "2011", egyptMEst: "Revolution", note: "Capital flight short-term, but ignites youth entrepreneurship" },
  { year: "2012", egyptMEst: "Vezeeta founded", note: "Doctor booking / health platform" },
  { year: "2013", egyptMEst: "Instabug founded", note: "Joined Flat6Labs, then Y Combinator (2016)" },
  { year: "2013", egyptMEst: "GrEEK Campus opens", note: "Cairo's flagship tech co-working hub (Nov 2013)" },
  { year: "2013", egyptMEst: "AUC Venture Lab", note: "Egypt's first university startup incubator" },
  { year: "Key early rounds 2014-2019" },
  { year: "Year", egyptMEst: "Company", deals: "Round", note: "Amount / lead" },
  { year: "2014", egyptMEst: "Vezeeta", deals: "Series A", note: "$1.4M · Silicon Badia" },
  { year: "2016", egyptMEst: "Instabug", deals: "Seed ext.", note: "$1.7M · Accel / YC" },
  { year: "2016", egyptMEst: "Vezeeta", deals: "Series B", note: "~$5M · BECO, Vostok" },
  { year: "2017", egyptMEst: "Swvl", deals: "Series A", note: "$8M · BECO, Silicon Badia" },
  { year: "2017", egyptMEst: "Elmenus", deals: "Series A", note: "$1.5M · Algebra" },
  { year: "2018", egyptMEst: "Vezeeta", deals: "Series C", note: "$12M · STV" },
  { year: "2018", egyptMEst: "Swvl", deals: "Series B", note: "~$30M · BECO" },
  { year: "2019", egyptMEst: "MaxAB", deals: "Seed", note: "$6.2M · BECO, 4DX" },
];

export interface MI_YearExplorer {
  year: string;
  egyptM: string;
  deals: string;
  biggestEgyptRound: string;
  dominantSector: string;
  y1Mena: string;
  y1Africa: string;
  headlineEvent: string;
}
export const yearExplorer: MI_YearExplorer[] = [
  { year: "2015", egyptM: "~30", deals: "~30", biggestEgyptRound: "Yaoota · $2.7M · e-commerce", dominantSector: "E-commerce", y1Mena: "UAE", y1Africa: "Nigeria", headlineEvent: "Flat6Labs & AUC V-Lab anchor seed infrastructure" },
  { year: "2016", egyptM: "~37", deals: "~40", biggestEgyptRound: "Instabug · $1.7M · dev tools", dominantSector: "E-commerce", y1Mena: "UAE", y1Africa: "Nigeria", headlineEvent: "Nov 2016: EGP first float, pound -50% overnight" },
  { year: "2017", egyptM: "~50", deals: "~50", biggestEgyptRound: "Swvl · $0.5M seed · mobility", dominantSector: "E-commerce/edtech", y1Mena: "UAE", y1Africa: "Nigeria", headlineEvent: "Swvl founded with Careem seed; SME Development Law" },
  { year: "2018", egyptM: "~70", deals: "~65", biggestEgyptRound: "Swvl · ~$30M · mobility", dominantSector: "Mobility/fintech", y1Mena: "UAE", y1Africa: "South Africa", headlineEvent: "Swvl closes Egypt's largest-ever round; Vezeeta $12M Series C" },
  { year: "2019", egyptM: "~99", deals: "141", biggestEgyptRound: "Swvl · $42M · mobility", dominantSector: "Mobility/fintech", y1Mena: "UAE", y1Africa: "Nigeria", headlineEvent: "Fawry IPO, Africa's first fintech listing on EGX" },
  { year: "2020", egyptM: "190", deals: "150", biggestEgyptRound: "Fintech seed wave", dominantSector: "Fintech", y1Mena: "UAE", y1Africa: "Nigeria", headlineEvent: "COVID accelerates digital; Fawry crosses $1B market cap" },
  { year: "2021", egyptM: "491", deals: "147", biggestEgyptRound: "MNT-Halan · $120M · fintech", dominantSector: "Fintech", y1Mena: "UAE", y1Africa: "Nigeria", headlineEvent: "Swvl announces $1.5B SPAC; Egypt jumps ~5x" },
  { year: "2022", egyptM: "517", deals: "160", biggestEgyptRound: "Paymob · $50M · fintech", dominantSector: "Fintech", y1Mena: "UAE", y1Africa: "Nigeria", headlineEvent: "Egypt #1 in MENA by deal count; Nclude $85M fund" },
  { year: "2023", egyptM: "503", deals: "95", biggestEgyptRound: "MNT-Halan · $400M · fintech", dominantSector: "Fintech", y1Mena: "Saudi Arabia", y1Africa: "South Africa", headlineEvent: "MNT-Halan first unicorn ($1B); InstaDeep $682M exit" },
  { year: "2024", egyptM: "329", deals: "78", biggestEgyptRound: "MNT-Halan · $157.5M · fintech", dominantSector: "Fintech", y1Mena: "Saudi Arabia", y1Africa: "Nigeria", headlineEvent: "March: EGP crashes 38% to ~50; MaxAB-Wasoko merger" },
  { year: "2025", egyptM: "614", deals: "89", biggestEgyptRound: "Nawy · $75M · proptech", dominantSector: "Fintech/proptech", y1Mena: "Saudi Arabia", y1Africa: "Egypt (top 2)", headlineEvent: "Record $614M; valU listing; InfiniLink exit; digital-bank licence" },
  { year: "2026", egyptM: "~190 YTD", deals: "~20 YTD", biggestEgyptRound: "MNT-Halan -> $1.4B val", dominantSector: "Fintech", y1Mena: "UAE/Saudi", y1Africa: "Egypt/Nigeria", headlineEvent: "National Startup Charter; MNT-Halan $1.4B; March shock" },
];

export interface MI_ExitsIpos {
  company: string;
  type?: string;
  outcome?: string;
  year?: string;
}
export const exitsIpos: MI_ExitsIpos[] = [
  { company: "Fawry", type: "IPO · EGX", outcome: "First African fintech IPO; ~$330M day-1 cap", year: "2019" },
  { company: "Swvl", type: "SPAC · NASDAQ", outcome: "$1.5B at listing, then ~95% collapse", year: "2022" },
  { company: "MaxAB + Wasoko", type: "All-stock merger", outcome: "Africa's largest tech merger; $526M combined", year: "2024" },
  { company: "InfiniLink", type: "M&A · GlobalFoundries", outcome: "Deeptech/chip exit; ~400% return (Egypt Ventures)", year: "2025" },
  { company: "valU", type: "Listing · EGX", outcome: "EFG in-kind dividend spin-out; ~$370M debut, ~$530M now; Amazon stake", year: "2025" },
  { company: "Instabug -> Luciq", type: "Rebrand (no exit)", outcome: "Remains independent", year: "2025" },
  { company: "Bosta", type: "Secondary / pre-IPO", outcome: "Beltone VC + Citadel exit at 75% IRR", year: "2026" },
  { company: "IPO pipeline 2026-2027" },
  { company: "Company", type: "Sector", outcome: "Venue", year: "Detail" },
  { company: "Bosta", type: "Logistics", outcome: "EGX", year: "~$170M float; targeted end-2026" },
  { company: "COPAD Pharma", type: "Pharma", outcome: "EGX", year: "20-30% float (largely secondary); Nov 2026" },
  { company: "MNT-Halan", type: "Fintech", outcome: "EGX / regional", year: "Signaled within 12-18 months of late 2025" },
  { company: "EGX pipeline", type: "Mixed", outcome: "EGX", year: "~8 new listings expected in 2026" },
];

export interface MI_RankingsTam {
  country: string;
  gii25: number | string;
  startupblink25: number | string;
}
export const rankingsTam: MI_RankingsTam[] = [
  { country: "UAE", gii25: 30, startupblink25: 15 },
  { country: "Turkey", gii25: 43, startupblink25: 38 },
  { country: "Saudi Arabia", gii25: 46, startupblink25: 28 },
  { country: "Qatar", gii25: 48, startupblink25: 35 },
  { country: "South Africa", gii25: 60, startupblink25: 52 },
  { country: "Morocco", gii25: 57, startupblink25: 88 },
  { country: "Bahrain", gii25: 62, startupblink25: 55 },
  { country: "Oman", gii25: 69, startupblink25: 65 },
  { country: "Kuwait", gii25: 73, startupblink25: 70 },
  { country: "Tunisia", gii25: 76, startupblink25: 90 },
  { country: "Egypt", gii25: 86, startupblink25: 67 },
  { country: "Ghana", gii25: 101, startupblink25: 81 },
  { country: "Kenya", gii25: 102, startupblink25: 58 },
  { country: "Nigeria", gii25: 104, startupblink25: 66 },
  { country: "Algeria", gii25: 115, startupblink25: 105 },
  { country: "Iraq", gii25: "NR", startupblink25: "NR" },
];

export interface MI_EcosystemTalent {
  metric: string;
  value: string;
}
export const ecosystemTalent: MI_EcosystemTalent[] = [
  { metric: "Flat6Labs portfolio", value: "402 companies total; 115 in Egypt" },
  { metric: "AUC Venture Lab", value: "375+ startups; 12,000+ jobs; $356M+ alumni funding" },
  { metric: "Accelerators/incubators (Egypt)", value: "10+ major (Flat6Labs, V-Lab, TIEC, Falak, EFG EV, A15, Plug and Play)" },
  { metric: "Co-working / innovation hubs", value: "30+ in Cairo & Alexandria (GrEEK Campus, Hub251, etc.)" },
  { metric: "Egyptian diaspora", value: "~3.6M abroad (top: KSA, UAE, Kuwait, Qatar)" },
  { metric: "Remittances FY2019/20", value: "~$27.8B" },
  { metric: "Remittances FY2021/22 (peak)", value: "~$31.9B" },
  { metric: "Remittances 2024", value: "$22.7B (7th globally)" },
  { metric: "Remittances 2025", value: "record ~$37.5B" },
  { metric: "Professional developers", value: "125,000+ (Robusta Tech)" },
  { metric: "ICT graduates / year", value: "~60,000 (ITIDA)" },
  { metric: "Engineering graduates / year", value: "~50,000+" },
  { metric: "IT/digital exports 2025", value: "$4.8B (target $9B by 2026)" },
  { metric: "ICT share of GDP", value: "5.8% (2024); target 8% by 2030" },
  { metric: "MENA female-only-founded VC share", value: "1.2% (2024), up from 0.47% (2023), down from ~5.1% (2019)" },
  { metric: "Egypt female-founded H1 2025", value: "~$425K (female-only); ~$23M mixed-gender teams" },
  { metric: "Tiye Angels", value: "Egypt's first women's angel network (est. 2019); first USD investment 2024" },
  { metric: "Notable women-led", value: "Chefaa (Rasha Rady & Doaa Aref), Amenli, Brimore (75K mostly-women sellers)" },
];

export const MI_META: Record<string, { title: string; subtitle: string }> = {
  egyptFunding: { title: "Egypt — Annual Venture Funding", subtitle: "Equity / MENA-frame primary; debt-inclusive (Africa-frame) shown where it diverges" },
  countryComparison: { title: "Country Comparison — venture intensity", subtitle: "Latest annual VC (mostly 2024). Per-capita & %GDP computed. Sort to see who punches above weight." },
  bigMarketsTrend: { title: "Annual VC by market, 2019-2025 ($M)", subtitle: "KSA & UAE equity (MAGNiTT); Turkey domestic (KPMG); Egypt equity; Africa Big Four" },
  menaVsAfrica: { title: "MENA vs Africa — total venture ($B)", subtitle: "Different trackers & frames; do not add together" },
  egyptSectors: { title: "Egypt — Funding by Sector ($M, estimates)", subtitle: "2024 distorted by MNT-Halan $157.5M; 2025 shows rotation into proptech & AI" },
  topEgyptianStartups: { title: "Top Egyptian Startups by capital raised", subtitle: "Cumulative disclosed funding, USD millions" },
  startupRoster80: { title: "Egypt Startup Roster — 80+ companies across 12 sectors", subtitle: "Rising & emerging companies beyond the top names · ~ = estimated funding" },
  megaDealsExits: { title: "Landmark regional rounds & exits, 2022-2026", subtitle: "Egypt highlighted · * = debt facility, not equity" },
  latestRounds2026: { title: "Latest rounds — H2 2025 to Jun 2026 (reverse chronological)", subtitle: "Egypt-focused; key regional deals included" },
  unicorns: { title: "African & relevant regional unicorns / giants", subtitle: "Last known valuation ($B)" },
  investors: { title: "Investors active in Egypt", subtitle: "★ = most active 2024-2026 · grouped by type" },
  government: { title: "Egypt — Government initiatives & policy", subtitle: "Reshaping the startup operating environment, 2024-2026" },
  timeline: { title: "Ecosystem timeline, 2008-2026", subtitle: "Companies, funding, exits, policy, macro" },
  notablePeople: { title: "Notable founders & investors", subtitle: "Who built and bankrolled the ecosystem" },
  outlookScenarios: { title: "Egypt 2027 scenarios", subtitle: "Directional projections, not predictions" },
  sources: { title: "Sources & methodology", subtitle: "Primary trackers and references used across the dataset" },
  regionalMatrix: { title: "Regional VC funding matrix, 2019-2026 ($M)", subtitle: "16 countries; equity-style figures; ~ small markets are estimates" },
  menaMomentum: { title: "MENA & Africa momentum and sector splits", subtitle: "Monthly series, equity-vs-debt, tracker divergence, sector $" },
  egyptGranular: { title: "Egypt — granular metrics", subtitle: "Sector rotation, fintech sub-sector, deal stage, debt/equity, ecosystem, diversity" },
  topRegionalStartups: { title: "Top non-Egypt regional startups to know", subtitle: "GCC, Turkey & Africa · ~ = estimated total raised" },
  regionalDealsMore: { title: "Expanded regional deals, 2024-2026", subtitle: "Beyond the obvious · * = debt" },
  egyptHistory201418: { title: "The early years & origins (2014-2018)", subtitle: "Sparse data; treat pre-2018 as order-of-magnitude estimates" },
  yearExplorer: { title: "Year-by-year explorer, 2015-2026", subtitle: "Egypt funding, biggest round, dominant sector, regional leaders, headline event" },
  exitsIpos: { title: "Egyptian exits, M&A & IPO pipeline", subtitle: "2018-2026 + 2026-27 pipeline" },
  rankingsTam: { title: "Innovation ranks & Egypt market sizes", subtitle: "Global Innovation Index 2025, StartupBlink 2025; Egypt sector TAMs" },
  ecosystemTalent: { title: "Accelerators, talent, diaspora & women founders", subtitle: "Supporting metrics" },
};
