export interface Initiative {
  title: string;
  owner: string;
  targetDate: string;
  status: string;
  priority: string;
  venture: string;
  blockers: string;
  notes: string;
}

export interface DecisionLogEntry {
  date: string;
  decision: string;
  rationale: string;
  madeBy: string;
}

export const INITIATIVE_SEED: Initiative[] = [
  { title: "Close F&F Investment Round", owner: "Bassel El Aroussy", targetDate: "Q2 2026", status: "In Progress", priority: "High", venture: "Wasla Ventures", blockers: "Hemy allocation pending", notes: "5 confirmed investors. 1 pending. Target: 2M EGP total." },
  { title: "Wasla Education Platform Launch", owner: "Usef El Shazly", targetDate: "Q2 2026", status: "In Progress", priority: "High", venture: "Wasla Education", blockers: "Content pipeline needs acceleration", notes: "Platform in development. Design complete. Led by Usef." },
  { title: "Wasla Tourism Build and Soft Launch", owner: "Bassel El Aroussy", targetDate: "Q1/Q2 2027", status: "Not Started", priority: "Medium", venture: "Wasla Tourism", blockers: "", notes: "Designs and prototypes done. Partnership talks completed. Tech architecture next." },
  { title: "Secure Maadi Office", owner: "Bassel El Aroussy", targetDate: "Jun 2026", status: "In Progress", priority: "High", venture: "Wasla Ventures", blockers: "", notes: "Physical office before June. Location scouting in Maadi area." },
  { title: "Finalize Myfitnessbag Investment", owner: "Bassel El Aroussy", targetDate: "Q2 2026", status: "In Progress", priority: "Medium", venture: "Wasla Ventures", blockers: "Terms under negotiation", notes: "Consortium deal. 15-25% stake for 150-250K EGP." },
];

export const DECISION_LOG_SEED: DecisionLogEntry[] = [
  { date: "Feb 2026", decision: "Set F&F round at 30M EGP implied valuation", rationale: "Based on revenue traction, team, and roadmap. 300K EGP per 1% equity.", madeBy: "Bassel El Aroussy" },
  { date: "Jan 2026", decision: "Split Pipeline into Client Projects and Sales Pipeline", rationale: "Different workflows. Confirmed work needs delivery tracking. Sales needs funnel management.", madeBy: "Bassel El Aroussy" },
  { date: "Sep 2025", decision: "Launch Wasla Solutions as first revenue-generating arm", rationale: "Validate execution model before building platforms. Services fund product development.", madeBy: "Bassel El Aroussy" },
];

export const INITIATIVE_STATUSES = ["Not Started", "In Progress", "Blocked", "Complete"];
export const INITIATIVE_PRIORITIES = ["High", "Medium", "Low"];
