export interface HiringRole {
  title: string;
  venture: string;
  department: string;
  priority: string;
  status: string;
  notes: string;
}

export const HIRING_SEED: HiringRole[] = [
  { title: "Senior Backend Developer", venture: "Wasla Solutions", department: "Engineering", priority: "High", status: "Open", notes: "Needed for scaling platform work and API integrations. Node.js / Python preferred." },
];

export const HIRING_STATUSES = ["Open", "Sourcing", "Interviewing", "Offer", "Filled"];
export const HIRING_PRIORITIES = ["High", "Medium", "Low"];
