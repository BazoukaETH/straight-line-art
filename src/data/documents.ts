export interface DocumentEntry {
  title: string;
  category: string;
  status: string;
  url: string;
  lastUpdated: string;
  notes: string;
}

export const DOCUMENT_SEED: DocumentEntry[] = [
  { title: "Wasla Ventures Shareholder Agreement", category: "Legal", status: "Draft", url: "", lastUpdated: "Feb 2026", notes: "" },
  { title: "F&F Subscription Agreements", category: "Legal", status: "Pending", url: "", lastUpdated: "Feb 2026", notes: "" },
  { title: "Advisory Agreement - Mr. Yasser Hashem", category: "Legal", status: "Active", url: "", lastUpdated: "Jan 2026", notes: "" },
  { title: "IP Assignment Agreements", category: "Legal", status: "Pending", url: "", lastUpdated: "Feb 2026", notes: "" },
  { title: "Cap Table & Structure Document", category: "Financial", status: "Current", url: "", lastUpdated: "Mar 2026", notes: "" },
  { title: "F&F Round Term Sheet", category: "Financial", status: "Current", url: "", lastUpdated: "Feb 2026", notes: "" },
  { title: "Financial Tracking Spreadsheet", category: "Financial", status: "Active", url: "", lastUpdated: "Apr 2026", notes: "" },
  { title: "Wasla Ventures Investment Overview (Pitch Deck)", category: "Operational", status: "Current", url: "", lastUpdated: "Mar 2026", notes: "" },
  { title: "Wasla Solutions SOW Templates", category: "Operational", status: "Active", url: "", lastUpdated: "Feb 2026", notes: "" },
  { title: "Wasla Education Launch Plan", category: "Operational", status: "Draft", url: "", lastUpdated: "Mar 2026", notes: "" },
];

export const DOCUMENT_CATEGORIES = ["Legal", "Financial", "Operational"];
export const DOCUMENT_STATUSES = ["Draft", "Pending", "Active", "Current", "Archived"];
