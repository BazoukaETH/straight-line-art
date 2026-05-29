export interface VentureData {
  id: string;
  name: string;
  color: string;
  stage: string;
  stageColor: string;
  category: string;
  owner: string;
  founded: string;
  metric: string;
  model: string;
  northStar: string;
  next: string;
  risks: string;
  milestones: string[];
  desc: string;
  services: string[];
}

export interface PortfolioItem {
  name: string;
  type: string;
  stake: string;
  invested: string;
  status: string;
  color: string;
  desc: string;
  category: string;
}

export interface VenturePipelineDeal {
  name: string;
  stage: string;
  type: string;
  sector: string;
  color: string;
  size: string;
  stake: string;
  valuation: string;
  source: string;
  notes: string;
  thesis: string;
  owner: string;
  updated: string;
}

export const VENTURES_DATA: VentureData[] = [
  {
    id: "solutions", name: "Wasla Solutions", color: "hsl(220, 95%, 47%)", stage: "Live", category: "Digital Services", stageColor: "hsl(160, 80%, 40%)",
    owner: "Bassel El Aroussy", founded: "Sep 2025", metric: "~1M EGP revenue", model: "Project-based + Retainer",
    northStar: "Monthly Revenue", next: "Onboard 2 new retainer clients", risks: "Capacity constraints with growing pipeline",
    milestones: ["Sep 2025: Launched", "Oct 2025: SMG + PICO delivered", "Nov 2025: ECMF subscription signed", "Feb 2026: 1M EGP milestone"],
    desc: "Founder-led digital execution arm. Builds websites, apps, platforms, and systems. Cash engine of the group.",
    services: ["Product & Platform Dev", "UI/UX & Systems Design", "Growth & Performance", "Digital Leadership"],
  },
  {
    id: "education", name: "Wasla Education", color: "hsl(250, 60%, 60%)", stage: "Building", category: "EdTech", stageColor: "hsl(250, 60%, 60%)",
    owner: "Usef El Shazly", founded: "Q2 2026 Launch", metric: "Platform in dev", model: "Course Subscriptions + Cohorts",
    northStar: "MAU & Paid Subscribers", next: "Complete platform build for Q2 2026 launch", risks: "Launch timeline, content pipeline",
    milestones: ["Q4 2025: Design complete", "Q1 2026: Platform in development", "Q2 2026: Target launch"],
    desc: "Modern learning platform for short, practical courses in business, tech, and creativity. Led by top local experts.",
    services: ["Short-form courses", "Live cohorts", "Certificates", "Ecosystem talent pipeline"],
  },
  {
    id: "tourism", name: "Wasla Tourism", color: "hsl(168, 100%, 42%)", stage: "Early Stage", category: "Travel & Marketplace", stageColor: "hsl(36, 90%, 53%)",
    owner: "Bassel El Aroussy", founded: "Q4 2026 Launch", metric: "Designs + partner talks done", model: "Commission + Featured Listings",
    northStar: "GMV & Active Guides", next: "Finalize tech architecture", risks: "Market adoption, supply-side onboarding",
    milestones: ["Q3 2025: Design prototypes done", "Q4 2025: Partner conversations started", "Q4 2026: Target launch"],
    desc: "AI-powered Egypt travel companion. Verified guides, experiences, accommodations, and real-time recommendations in one platform.",
    services: ["Guided experiences", "Accommodation", "Trip planning", "Local insights"],
  },
  {
    id: "space", name: "Wasla Space", color: "hsl(24, 94%, 53%)", stage: "Discovery", category: "Community", stageColor: "hsl(220, 15%, 38%)",
    owner: "Bassel El Aroussy", founded: "TBD", metric: "Concept stage", model: "Membership + Events + Partnerships",
    northStar: "Members & Events Revenue", next: "Define concept and location", risks: "Physical space cost, timing",
    milestones: ["2026: Concept definition", "2026: Physical location scouting", "Late 2026: Launch"],
    desc: "Physical and virtual talent hub. Coworking, community, and collaboration for builders, designers, and founders in Egypt.",
    services: ["Coworking membership", "Events & workshops", "Talent network", "Product incubation"],
  },
  {
    id: "labs", name: "Wasla Labs", color: "hsl(330, 80%, 60%)", stage: "Concept", category: "R&D", stageColor: "hsl(220, 15%, 38%)",
    owner: "Mohab Metwali", founded: "TBD", metric: "Ideation stage", model: "Internal IP + Future Productization",
    northStar: "Ideas Validated", next: "Define first experiment scope", risks: "Focus dilution, resource allocation",
    milestones: ["2026: Define scope", "2026: First experiment", "2027: First product out of labs"],
    desc: "R&D arm of Wasla. Where new ideas are explored, prototyped, and validated before becoming full ventures.",
    services: ["AI/ML research", "Product experiments", "Technical exploration", "Future venture seeds"],
  },
  {
    id: "bank", name: "Wasla Bank", color: "hsl(160, 80%, 40%)", stage: "Long-term Vision", category: "Fintech", stageColor: "hsl(220, 15%, 38%)",
    owner: "Bassel El Aroussy", founded: "2027+", metric: "Long-term vision", model: "Digital Banking + Super-platform",
    northStar: "Ecosystem Consolidation", next: "Monitor fintech licensing landscape", risks: "Regulatory, capital requirements",
    milestones: ["2027: Fintech feasibility", "2027: Licensing exploration", "2028+: Platform build"],
    desc: "Long-term vision to consolidate the Wasla ecosystem into a digital bank and super-platform serving MEA region.",
    services: ["Personal finance", "Investing", "Payments", "Ecosystem super-app"],
  },
];

export const PORTFOLIO_DATA: PortfolioItem[] = [
  {
    name: "Paperwork Studio", type: "Stake", stake: "25%", invested: "0 EGP", status: "Active", color: "hsl(220, 95%, 47%)",
    desc: "Creative & branding agency. Sister company. Strategic partnership — design collaboration on all major projects.",
    category: "Creative & Branding",
  },
  {
    name: "Myfitnessbag", type: "Investment", stake: "15–25%", invested: "150–250K EGP", status: "Negotiating", color: "hsl(36, 90%, 53%)",
    desc: "Health & wellness platform, 3 years operating. Joining consortium acquiring 40–60%. Capital investment pending final terms.",
    category: "Health & Wellness",
  },
  {
    name: "Equitie", type: "Strategic", stake: "$10K equity", invested: "$10K USD", status: "Confirmed", color: "hsl(160, 80%, 40%)",
    desc: "Private markets access platform. Strategic holding secured directly with founders. Passive investment aligned with fintech vision.",
    category: "Fintech / Investing",
  },
];

export const VENTURE_PIPELINE_SEED: VenturePipelineDeal[] = [
  {
    name: "Myfitnessbag", stage: "Negotiating", type: "Investment", sector: "Health & Wellness", color: "hsl(36, 90%, 53%)",
    size: "150-250K EGP", stake: "15-25%", valuation: "~1M EGP", source: "Direct intro",
    notes: "3 years operating, financially healthy. Joining consortium acquiring 40-60%. Terms being finalized.",
    owner: "Bassel El Aroussy", updated: "Feb 2026", thesis: "Complement Wasla ecosystem with health vertical. Strong existing ops.",
  },
  {
    name: "Owl Research", stage: "Exploring", type: "JV / Partnership", sector: "Data & Media", color: "hsl(220, 95%, 47%)",
    size: "TBD", stake: "TBD", valuation: "TBD", source: "Network",
    notes: "Data platform with economic data infographics. Exploring potential JV or partnership structure.",
    owner: "Bassel El Aroussy", updated: "Apr 2026", thesis: "Aligns with Wasla data and content strategy. Potential to co-build data distribution layer.",
  },
  {
    name: "Vuze", stage: "Exploring", type: "JV / Partnership", sector: "Creator Economy", color: "hsl(168, 100%, 42%)",
    size: "TBD", stake: "TBD", valuation: "TBD", source: "Network",
    notes: "UGC platform connecting campaign managers with creators for paid collaborations and sales. Exploring JV or co-build.",
    owner: "Bassel El Aroussy", updated: "Apr 2026", thesis: "Creator infrastructure play. Could integrate with Wasla marketing and content services.",
  },
  {
    name: "Egypt F&B Brand", stage: "Watching", type: "Acquisition", sector: "Consumer / F&B", color: "hsl(220, 15%, 38%)",
    size: "TBD", stake: "Majority", valuation: "TBD", source: "Inbound inquiry",
    notes: "Early stage sourcing. No financials reviewed yet. Assessing market position and brand value.",
    owner: "Bassel El Aroussy", updated: "Feb 2026", thesis: "Consumer brand with existing distribution could be scaled via digital.",
  },
];

export const STAGE_OPTS = ["Watching", "Exploring", "Negotiating", "Committed", "Passed"];

export const STAGE_COLORS: Record<string, string> = {
  "Sourcing": "hsl(220, 15%, 38%)",
  "Exploring": "hsl(220, 95%, 47%)",
  "Negotiating": "hsl(36, 90%, 53%)",
  "Due Diligence": "hsl(250, 60%, 60%)",
  "Closed": "hsl(160, 80%, 40%)",
  "Passed": "hsl(350, 75%, 50%)",
};

export const DEAL_COLORS = [
  "hsl(220, 95%, 47%)", "hsl(168, 100%, 42%)", "hsl(36, 90%, 53%)", "hsl(250, 60%, 60%)",
  "hsl(350, 75%, 50%)", "hsl(160, 80%, 40%)", "hsl(239, 84%, 67%)", "hsl(330, 80%, 60%)",
];
