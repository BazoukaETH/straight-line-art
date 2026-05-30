export interface Investor {
  name: string;
  type: string;
  entity: string;
  whatTheyDo: string;
  email: string;
  phone: string;
  specialty: string;
  relationshipStatus: string;
  lastContact: string;
  preferredComm: string;
  notes: string;
}

export interface CapTableEntry {
  shareholder: string;
  roleCategory: string;
  entity: string;
  ownershipPct: number;
  roundStage: string;
  capitalCommitted: number;
  capitalPaid: number;
  outstanding: number;
  valuationAtEntry: string;
  equityType: string;
  status: string;
  notes: string;
}

export interface AdvisorBoard {
  name: string;
  role: string;
  entity: string;
  terms: string;
  email: string;
  phone: string;
  specialty: string;
  notes: string;
}

export interface Partner {
  name: string;
  type: string;
  relationship: string;
  contact: string;
  email: string;
  phone: string;
  notes: string;
}

export const INVESTOR_SEED: Investor[] = [
  { name: "Bassel El Aroussy", type: "Founder", entity: "Wasla Ventures", whatTheyDo: "Managing Principal at Wasla Ventures. Strategy, business development, capital markets.", email: "bassel@waslaventures.com", phone: "", specialty: "Strategy, BD, capital markets", relationshipStatus: "Active", lastContact: "", preferredComm: "In-person", notes: "" },
  { name: "Hussein Shahbender", type: "Co-founder", entity: "Wasla Ventures", whatTheyDo: "Marketing Lead. Branding and consumer ventures.", email: "", phone: "", specialty: "Marketing, branding", relationshipStatus: "Active", lastContact: "", preferredComm: "In-person", notes: "" },
  { name: "Usef El Shazly", type: "Co-founder", entity: "Wasla Ventures", whatTheyDo: "Digital Lead. Design, digital strategy, product.", email: "", phone: "", specialty: "Design, digital, product", relationshipStatus: "Active", lastContact: "", preferredComm: "In-person", notes: "" },
  { name: "Aly Gohar", type: "F&F Investor", entity: "Wasla Ventures", whatTheyDo: "", email: "", phone: "", specialty: "", relationshipStatus: "Active", lastContact: "", preferredComm: "WhatsApp", notes: "" },
  { name: "Hassan Gohar", type: "F&F Investor", entity: "Wasla Ventures", whatTheyDo: "", email: "", phone: "", specialty: "", relationshipStatus: "Active", lastContact: "", preferredComm: "WhatsApp", notes: "" },
  { name: "Kareem Hashem", type: "F&F Investor", entity: "Wasla Ventures", whatTheyDo: "", email: "", phone: "", specialty: "", relationshipStatus: "Active", lastContact: "", preferredComm: "WhatsApp", notes: "" },
  { name: "Maurice Ghattas", type: "F&F Investor", entity: "Wasla Ventures", whatTheyDo: "", email: "", phone: "", specialty: "", relationshipStatus: "Active", lastContact: "", preferredComm: "WhatsApp", notes: "" },
  { name: "Aly Serafy", type: "F&F Investor", entity: "Wasla Ventures", whatTheyDo: "", email: "", phone: "", specialty: "", relationshipStatus: "Active", lastContact: "", preferredComm: "WhatsApp", notes: "" },
  { name: "Hassan Salama", type: "F&F Investor", entity: "Wasla Ventures", whatTheyDo: "", email: "", phone: "", specialty: "", relationshipStatus: "Warm", lastContact: "", preferredComm: "WhatsApp", notes: "" },
  { name: "Hemy", type: "F&F Investor", entity: "Wasla Ventures", whatTheyDo: "", email: "", phone: "", specialty: "", relationshipStatus: "Warm", lastContact: "", preferredComm: "WhatsApp", notes: "Allocation and commitment pending finalization." },
];

export const CAP_TABLE_SEED: Record<string, CapTableEntry[]> = {
  "Wasla Ventures": [
    { shareholder: "Bassel El Aroussy", roleCategory: "Founder", entity: "Wasla Ventures", ownershipPct: 0.55, roundStage: "Founder", capitalCommitted: 1000000, capitalPaid: 300000, outstanding: 700000, valuationAtEntry: "N/A", equityType: "Direct Equity", status: "Confirmed", notes: "Committed 1M EGP. ~300K paid via expenses covered personally. Outstanding 700K." },
    { shareholder: "Hussein Shahbender", roleCategory: "Co-founder", entity: "Wasla Ventures", ownershipPct: 0.15, roundStage: "Core Team", capitalCommitted: 500000, capitalPaid: 40000, outstanding: 460000, valuationAtEntry: "N/A", equityType: "Direct Equity", status: "Confirmed", notes: "Marketing Lead" },
    { shareholder: "Usef El Shazly", roleCategory: "Co-founder", entity: "Wasla Ventures", ownershipPct: 0.10, roundStage: "Core Team", capitalCommitted: 0, capitalPaid: 0, outstanding: 0, valuationAtEntry: "N/A", equityType: "Direct Equity", status: "Confirmed", notes: "Digital Lead - sweat equity" },
    { shareholder: "Moaz El Sawy", roleCategory: "Core Team", entity: "Wasla Ventures", ownershipPct: 0.02, roundStage: "Core Team", capitalCommitted: 0, capitalPaid: 0, outstanding: 0, valuationAtEntry: "N/A", equityType: "Direct Equity", status: "Confirmed", notes: "Development Lead - sweat equity" },
    { shareholder: "Ali El Amir", roleCategory: "Core Team", entity: "Wasla Ventures", ownershipPct: 0.02, roundStage: "Core Team", capitalCommitted: 0, capitalPaid: 0, outstanding: 0, valuationAtEntry: "N/A", equityType: "Direct Equity", status: "Confirmed", notes: "Creative Lead - sweat equity" },
    { shareholder: "Mr. Yasser Hashem", roleCategory: "Advisor", entity: "Wasla Ventures", ownershipPct: 0.02, roundStage: "Advisor", capitalCommitted: 0, capitalPaid: 0, outstanding: 0, valuationAtEntry: "N/A", equityType: "Advisory Grant", status: "Confirmed", notes: "3-year legal services in exchange for 2% equity" },
    { shareholder: "Aly Gohar", roleCategory: "F&F Investor", entity: "Wasla Ventures", ownershipPct: 0.01, roundStage: "F&F", capitalCommitted: 300000, capitalPaid: 300000, outstanding: 0, valuationAtEntry: "30M EGP", equityType: "Direct Equity", status: "Confirmed", notes: "F&F round at 300K per 1%" },
    { shareholder: "Hassan Gohar", roleCategory: "F&F Investor", entity: "Wasla Ventures", ownershipPct: 0.01, roundStage: "F&F", capitalCommitted: 300000, capitalPaid: 300000, outstanding: 0, valuationAtEntry: "30M EGP", equityType: "Direct Equity", status: "Confirmed", notes: "F&F round" },
    { shareholder: "Kareem Hashem", roleCategory: "F&F Investor", entity: "Wasla Ventures", ownershipPct: 0.01, roundStage: "F&F", capitalCommitted: 300000, capitalPaid: 300000, outstanding: 0, valuationAtEntry: "30M EGP", equityType: "Direct Equity", status: "Confirmed", notes: "F&F round" },
    { shareholder: "Maurice Ghattas", roleCategory: "F&F Investor", entity: "Wasla Ventures", ownershipPct: 0.01, roundStage: "F&F", capitalCommitted: 300000, capitalPaid: 300000, outstanding: 0, valuationAtEntry: "30M EGP", equityType: "Direct Equity", status: "Confirmed", notes: "F&F round" },
    { shareholder: "Aly Serafy", roleCategory: "F&F Investor", entity: "Wasla Ventures", ownershipPct: 0.01, roundStage: "F&F", capitalCommitted: 300000, capitalPaid: 300000, outstanding: 0, valuationAtEntry: "30M EGP", equityType: "Direct Equity", status: "Confirmed", notes: "F&F round" },
    { shareholder: "Hassan Salama", roleCategory: "F&F Investor", entity: "Wasla Ventures", ownershipPct: 0.005, roundStage: "F&F", capitalCommitted: 150000, capitalPaid: 0, outstanding: 150000, valuationAtEntry: "30M EGP", equityType: "Direct Equity", status: "Confirmed", notes: "F&F round" },
    { shareholder: "Hemy", roleCategory: "F&F Investor", entity: "Wasla Ventures", ownershipPct: 0.005, roundStage: "F&F", capitalCommitted: 150000, capitalPaid: 0, outstanding: 150000, valuationAtEntry: "30M EGP", equityType: "Direct Equity", status: "Pending", notes: "F&F round - allocation and commitment pending" },
    { shareholder: "Pending Team Allocation", roleCategory: "Reserve", entity: "Wasla Ventures", ownershipPct: 0.035, roundStage: "Reserve", capitalCommitted: 0, capitalPaid: 0, outstanding: 0, valuationAtEntry: "N/A", equityType: "Reserve", status: "Pending", notes: "Reserved for future team members" },
    { shareholder: "HoldCo Reserve", roleCategory: "Reserve", entity: "Wasla Ventures", ownershipPct: 0.015, roundStage: "Reserve", capitalCommitted: 0, capitalPaid: 0, outstanding: 0, valuationAtEntry: "N/A", equityType: "Reserve", status: "Pending", notes: "Holdco flexibility" },
    { shareholder: "ESOP Pool", roleCategory: "ESOP", entity: "Wasla Ventures", ownershipPct: 0.025, roundStage: "Reserve", capitalCommitted: 0, capitalPaid: 0, outstanding: 0, valuationAtEntry: "N/A", equityType: "ESOP", status: "Pending", notes: "Future employee grants" },
  ],
  "Wasla Solutions": [
    { shareholder: "Wasla Ventures", roleCategory: "Parent Holdco", entity: "Wasla Solutions", ownershipPct: 0.90, roundStage: "Founder", capitalCommitted: 0, capitalPaid: 0, outstanding: 0, valuationAtEntry: "N/A", equityType: "Direct Equity", status: "Confirmed", notes: "Parent company holding" },
    { shareholder: "Moaz El Sawy", roleCategory: "Core Team", entity: "Wasla Solutions", ownershipPct: 0.025, roundStage: "Core Team", capitalCommitted: 0, capitalPaid: 0, outstanding: 0, valuationAtEntry: "N/A", equityType: "Direct Equity", status: "Confirmed", notes: "Subsidiary equity" },
    { shareholder: "Usef El Shazly", roleCategory: "Core Team", entity: "Wasla Solutions", ownershipPct: 0.025, roundStage: "Core Team", capitalCommitted: 0, capitalPaid: 0, outstanding: 0, valuationAtEntry: "N/A", equityType: "Direct Equity", status: "Confirmed", notes: "Subsidiary equity" },
    { shareholder: "ESOP Pool", roleCategory: "ESOP", entity: "Wasla Solutions", ownershipPct: 0.05, roundStage: "Reserve", capitalCommitted: 0, capitalPaid: 0, outstanding: 0, valuationAtEntry: "N/A", equityType: "ESOP", status: "Pending", notes: "Future employee grants" },
  ],
  "Wasla Education": [
    { shareholder: "Wasla Ventures", roleCategory: "Parent Holdco", entity: "Wasla Education", ownershipPct: 0.60, roundStage: "Founder", capitalCommitted: 0, capitalPaid: 0, outstanding: 0, valuationAtEntry: "N/A", equityType: "Direct Equity", status: "Confirmed", notes: "Parent company holding" },
    { shareholder: "Usef El Shazly", roleCategory: "Core Team", entity: "Wasla Education", ownershipPct: 0.35, roundStage: "Core Team", capitalCommitted: 0, capitalPaid: 0, outstanding: 0, valuationAtEntry: "N/A", equityType: "Direct Equity", status: "Confirmed", notes: "Leads Wasla Education" },
    { shareholder: "Moaz El Sawy", roleCategory: "Core Team", entity: "Wasla Education", ownershipPct: 0.025, roundStage: "Core Team", capitalCommitted: 0, capitalPaid: 0, outstanding: 0, valuationAtEntry: "N/A", equityType: "Direct Equity", status: "Confirmed", notes: "Subsidiary equity" },
    { shareholder: "ESOP Pool", roleCategory: "ESOP", entity: "Wasla Education", ownershipPct: 0.025, roundStage: "Reserve", capitalCommitted: 0, capitalPaid: 0, outstanding: 0, valuationAtEntry: "N/A", equityType: "ESOP", status: "Pending", notes: "Future employee grants" },
  ],
  "Wasla Tourism": [
    { shareholder: "Wasla Ventures", roleCategory: "Parent Holdco", entity: "Wasla Tourism", ownershipPct: 0.975, roundStage: "Founder", capitalCommitted: 0, capitalPaid: 0, outstanding: 0, valuationAtEntry: "N/A", equityType: "Direct Equity", status: "Confirmed", notes: "Parent company holding" },
    { shareholder: "ESOP Pool", roleCategory: "ESOP", entity: "Wasla Tourism", ownershipPct: 0.025, roundStage: "Reserve", capitalCommitted: 0, capitalPaid: 0, outstanding: 0, valuationAtEntry: "N/A", equityType: "ESOP", status: "Pending", notes: "Future employee grants" },
  ],
  "Wasla Space": [
    { shareholder: "Wasla Ventures", roleCategory: "Parent Holdco", entity: "Wasla Space", ownershipPct: 0.95, roundStage: "Founder", capitalCommitted: 0, capitalPaid: 0, outstanding: 0, valuationAtEntry: "N/A", equityType: "Direct Equity", status: "Confirmed", notes: "Parent company holding" },
    { shareholder: "ESOP Pool", roleCategory: "ESOP", entity: "Wasla Space", ownershipPct: 0.05, roundStage: "Reserve", capitalCommitted: 0, capitalPaid: 0, outstanding: 0, valuationAtEntry: "N/A", equityType: "ESOP", status: "Pending", notes: "Future employee grants" },
  ],
  "Wasla Labs": [
    { shareholder: "Wasla Ventures", roleCategory: "Parent Holdco", entity: "Wasla Labs", ownershipPct: 0.95, roundStage: "Founder", capitalCommitted: 0, capitalPaid: 0, outstanding: 0, valuationAtEntry: "N/A", equityType: "Direct Equity", status: "Confirmed", notes: "Parent company holding" },
    { shareholder: "ESOP Pool", roleCategory: "ESOP", entity: "Wasla Labs", ownershipPct: 0.05, roundStage: "Reserve", capitalCommitted: 0, capitalPaid: 0, outstanding: 0, valuationAtEntry: "N/A", equityType: "ESOP", status: "Pending", notes: "Future employee grants" },
  ],
  "Wasla Bank": [
    { shareholder: "Wasla Ventures", roleCategory: "Parent Holdco", entity: "Wasla Bank", ownershipPct: 0.975, roundStage: "Founder", capitalCommitted: 0, capitalPaid: 0, outstanding: 0, valuationAtEntry: "N/A", equityType: "Direct Equity", status: "Confirmed", notes: "Parent company holding" },
    { shareholder: "ESOP Pool", roleCategory: "ESOP", entity: "Wasla Bank", ownershipPct: 0.025, roundStage: "Reserve", capitalCommitted: 0, capitalPaid: 0, outstanding: 0, valuationAtEntry: "N/A", equityType: "ESOP", status: "Pending", notes: "Future employee grants" },
  ],
  "Paperwork Studio": [
    { shareholder: "Wasla Ventures", roleCategory: "Minority Stake", entity: "Paperwork Studio", ownershipPct: 0.25, roundStage: "Strategic", capitalCommitted: 0, capitalPaid: 0, outstanding: 0, valuationAtEntry: "N/A", equityType: "Direct Equity", status: "Confirmed", notes: "Strategic partnership, no capital outlay" },
    { shareholder: "External Owners", roleCategory: "External", entity: "Paperwork Studio", ownershipPct: 0.75, roundStage: "External", capitalCommitted: 0, capitalPaid: 0, outstanding: 0, valuationAtEntry: "N/A", equityType: "Direct Equity", status: "Confirmed", notes: "Paperwork Studio co-founders and team" },
  ],
};

export const ADVISOR_BOARD_SEED: AdvisorBoard[] = [
  { name: "Mr. Yasser Hashem", role: "Legal Advisor & Board Member", entity: "Wasla Ventures", terms: "2% equity for 3 years of legal services", email: "", phone: "", specialty: "Top tech lawyer in Egypt", notes: "" },
  { name: "Board-level Tech Advisors", role: "Technical Board", entity: "Wasla Ventures", terms: "Two senior developers at board level", email: "", phone: "", specialty: "Strong external technical credibility", notes: "" },
  { name: "Strategic Business Board", role: "Business Board", entity: "Wasla Ventures", terms: "Three high-profile businessmen/investors", email: "", phone: "", specialty: "Strategic direction and network access", notes: "" },
];

export const PARTNER_SEED: Partner[] = [
  { name: "Paperwork Studio", type: "Sister Agency", relationship: "25% stake, creative collaboration", contact: "Ali El Amir", email: "", phone: "", notes: "Creative and branding agency. Close collaboration on all major projects." },
];
