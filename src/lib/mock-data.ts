export type Role = "founder" | "manager" | "member";
export type Pillar = "client" | "ventures" | "internal";
export type Status = "Backlog" | "To Do" | "In Progress" | "In Review" | "Blocked" | "Done";
export type Priority = "urgent" | "high" | "normal" | "low";

export interface Member {
  id: string;
  name: string;
  initials: string;
  color: string;
  role: Role;
  title: string;
  pillar: Pillar;
  online?: boolean;
  orgFounder?: boolean;
}

export interface Workspace { id: string; name: string; comingSoon?: boolean }

export const organization = { id: "wasla-ventures", name: "Wasla Ventures" };

export const workspaces: Workspace[] = [
  { id: "wasla-solutions", name: "Wasla Solutions" },
  { id: "paperwork-studio", name: "Paperwork Studio", comingSoon: true },
];

export interface SpaceProfile {
  // common
  ownerId?: string;
  status?: "active" | "paused" | "churned" | "pilot";
  health?: "green" | "yellow" | "red";
  notes?: string;
  links?: { label: string; url: string }[];

  // client-only
  type?: "retainer" | "project" | "one-time";
  startDate?: string;
  contractValue?: number;
  currency?: "EGP" | "USD";
  renewalDate?: string;
  industry?: string;
  contacts?: {
    id: string;
    name: string;
    role: string;
    email?: string;
    phone?: string;
    primary?: boolean;
  }[];

  // venture-only
  stage?: string;
  mrr?: number;
  progress?: { label: string; value: string }[];
  investors?: { name: string; status: string }[];
  partners?: { name: string; role: string }[];

  // internal-only
  purpose?: string;
}

export interface Space {
  id: string;
  name: string;
  pillar: Pillar;
  members: number;
  /** If set, space is only visible to this user id. */
  ownerId?: string;
  profile?: SpaceProfile;
}


export interface Folder {
  id: string;
  name: string;
  spaceId: string;
}

export type CustomFieldType = "text" | "number" | "date" | "dropdown" | "money";
export interface CustomField {
  id: string;
  name: string;
  type: CustomFieldType;
  options?: string[];
  currency?: "EGP" | "USD";
}

export interface List {
  id: string;
  name: string;
  spaceId: string;
  folderId?: string;
  customFields?: CustomField[];
}

export interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  spaceId: string;
  listId: string;
  parentId?: string;
  assigneeId: string;
  due: string;
  startDate?: string;
  description?: string;
  comments?: { id: string; authorId: string; body: string; at: string }[];
  watchers?: string[];
  tags?: string[];
  attachments?: { id: string; name: string; kind: string }[];
  dependencies?: { blocks: string[]; blockedBy: string[] };
  customFieldValues?: Record<string, string | number>;
  createdAt?: string;
  subtasks?: { id: string; title: string; done: boolean }[];
}

export interface TaskTemplate {
  id: string;
  name: string;
  description?: string;
  fields?: { label: string; placeholder: string }[];
  subtasks?: string[];
  tags?: string[];
}

export interface BodEod {
  id: string;
  memberId: string;
  date: string;
  bod?: { ship: string; blockers?: string };
  eod?: { shipped: string; blockedTomorrow?: string };
}

export const members: Member[] = [
  { id: "bassel", name: "Bassel Aroussy",  initials: "BA", color: "#0B2545", role: "founder", title: "Founder & CEO",                 pillar: "ventures", online: true, orgFounder: true },
  { id: "moaz",   name: "Moaz Sawy",        initials: "MS", color: "#3B82F6", role: "manager", title: "Build & Tech Lead",             pillar: "ventures", online: true },
  { id: "usef",   name: "Usef Shazly",      initials: "US", color: "#8B5CF6", role: "manager", title: "Design Lead",                   pillar: "client",   online: true },
  { id: "ali",    name: "Ali Amir",         initials: "AA", color: "#EC4899", role: "manager", title: "Creative Direction",            pillar: "client",   online: false },
  { id: "hagry",  name: "Mohamed Hagry",    initials: "MH", color: "#F59E0B", role: "member",  title: "UI / UX Designer",              pillar: "client",   online: true },
  { id: "osama",  name: "Osama Abbas",      initials: "OA", color: "#10B981", role: "member",  title: "E-Commerce & Performance",      pillar: "ventures", online: true },
  { id: "saif",   name: "Saif Nosair",      initials: "SN", color: "#14B8A6", role: "member",  title: "Multimedia & Motion",           pillar: "client",   online: false },
];

// ============ SPACES ============
export const spaces: Space[] = [
  // Client Work
  { id: "smg", name: "SMG", pillar: "client", members: 5, profile: {
    ownerId: "bassel",
    type: "retainer",
    status: "active",
    health: "green",
    startDate: "2025-09-01",
    contractValue: 240000,
    currency: "EGP",
    renewalDate: "2026-09-01",
    industry: "Holding / Automotive",
    contacts: [
      { id: "c-smg-1", name: "Ahmed Salah", role: "Group Marketing Director", email: "ahmed.salah@smg-eg.com", primary: true },
      { id: "c-smg-2", name: "Mariam Saber", role: "Liqui Moly Brand Lead", email: "mariam@smg-eg.com" },
    ],
    links: [
      { label: "Drive folder", url: "https://drive.google.com/drive/folders/SMG-PLACEHOLDER" },
      { label: "Contract", url: "https://drive.google.com/file/d/SMG-CONTRACT-PLACEHOLDER" },
    ],
    notes: "Multi-project holding. Decision-maker is Ahmed. Mariam owns Liqui Moly day-to-day. Prefers WhatsApp for quick approvals.",
  } },
  { id: "ejb",       name: "EJB",       pillar: "client",   members: 3 },
  { id: "clutch",    name: "Clutch",    pillar: "client",   members: 2 },
  { id: "mw",        name: "MW",        pillar: "client",   members: 2 },
  { id: "leads",     name: "Leads",     pillar: "client",   members: 1 },
  { id: "proposals", name: "Proposals", pillar: "client",   members: 2 },
  { id: "archived",  name: "Archived",  pillar: "client",   members: 0 },
  // Wasla Ventures
  { id: "tourism", name: "Wasla Tourism", pillar: "ventures", members: 4, profile: {
    ownerId: "bassel",
    status: "pilot",
    health: "green",
    stage: "Pre-launch · Fundraising",
    mrr: 0,
    progress: [
      { label: "Investor deck", value: "v3 circulated" },
      { label: "Data room", value: "60% complete" },
      { label: "Providers", value: "12 / 50" },
    ],
    investors: [
      { name: "Hassan Salama", status: "Committed F&F" },
      { name: "Sovereign Mandate", status: "In conversation" },
    ],
    partners: [
      { name: "Zaki Hashem", role: "Legal advisor" },
    ],
    links: [
      { label: "Investor deck v3", url: "https://drive.google.com/file/d/TOURISM-DECK-PLACEHOLDER" },
      { label: "Data room", url: "https://drive.google.com/drive/folders/TOURISM-DATAROOM-PLACEHOLDER" },
    ],
    notes: "Multi-vertical tourism platform: ticketing + accommodation + mobility + experiences. Friends & family round in flight.",
  } },
  { id: "hix",       name: "HIX",             pillar: "ventures", members: 4 },
  { id: "wasla-os",  name: "Wasla OS",        pillar: "ventures", members: 3 },
  { id: "agriwasla", name: "AgriWasla",       pillar: "ventures", members: 2 },
  { id: "wasla-edu", name: "Wasla Education", pillar: "ventures", members: 1 },
  { id: "wasla-labs",name: "Wasla Labs",      pillar: "ventures", members: 2 },
  { id: "firewood",  name: "Firewood Egypt",  pillar: "ventures", members: 1 },
  // Wasla Internal
  { id: "marketing", name: "Marketing & Growth",   pillar: "internal", members: 3 },
  { id: "operations", name: "Operations", pillar: "internal", members: 3, profile: {
    ownerId: "bassel",
    status: "active",
    purpose: "Run the operating spine of Wasla Ventures: hiring, finance, legal, HQ, tools.",
    notes: "Cross-cutting. Touches every other space.",
  } },
  { id: "fundraise", name: "Fundraise & Strategy",  pillar: "internal", members: 2 },
  { id: "personal-bassel", name: "Personal — Bassel", pillar: "internal", members: 1, ownerId: "bassel" },
];


// ============ FOLDERS ============
export const folders: Folder[] = [
  // SMG multi-project
  { id: "f-smg-liqui",   name: "Liqui Moly Marketing",  spaceId: "smg" },
  { id: "f-smg-corp",    name: "Corporate Holding Site", spaceId: "smg" },
  { id: "f-smg-subs",    name: "Subsidiary Sites",       spaceId: "smg" },
  { id: "f-smg-porsche", name: "Porsche Drive Platform", spaceId: "smg" },
];

// ============ LISTS ============
const hixProductCF: CustomField[] = [
  { id: "cf-approval", name: "Approval status",  type: "dropdown", options: ["Draft", "Submitted", "Approved", "Rejected"] },
  { id: "cf-budget",   name: "Budget allocated", type: "money", currency: "EGP" },
];

export const lists: List[] = [
  // SMG folders
  { id: "l-smg-liqui",   name: "Tasks", spaceId: "smg", folderId: "f-smg-liqui" },
  { id: "l-smg-corp",    name: "Tasks", spaceId: "smg", folderId: "f-smg-corp" },
  { id: "l-smg-subs",    name: "Tasks", spaceId: "smg", folderId: "f-smg-subs" },
  { id: "l-smg-porsche", name: "Tasks", spaceId: "smg", folderId: "f-smg-porsche" },
  // Client direct lists
  { id: "l-ejb",     name: "Tasks", spaceId: "ejb" },
  { id: "l-clutch",  name: "Tasks", spaceId: "clutch" },
  { id: "l-mw",      name: "Tasks", spaceId: "mw" },
  { id: "l-leads",   name: "Prospects", spaceId: "leads" },
  { id: "l-proposals", name: "In flight", spaceId: "proposals" },
  { id: "l-archived",  name: "Archive", spaceId: "archived" },

  // Wasla Tourism
  { id: "l-tour-build",      name: "Build & Tech",            spaceId: "tourism" },
  { id: "l-tour-partners",   name: "Partnerships & Providers", spaceId: "tourism" },
  { id: "l-tour-raise",      name: "Fundraise",                spaceId: "tourism" },
  { id: "l-tour-marketing",  name: "Launch Marketing",         spaceId: "tourism" },
  { id: "l-tour-concierge",  name: "Concierge & Premium",      spaceId: "tourism" },
  { id: "l-tour-gov",        name: "Strategic & Government",   spaceId: "tourism" },

  // HIX
  { id: "l-hix-product",  name: "Product & Manufacturing", spaceId: "hix", customFields: hixProductCF },
  { id: "l-hix-brand",    name: "Brand & Creative",        spaceId: "hix" },
  { id: "l-hix-d2c",      name: "Online & D2C",            spaceId: "hix" },
  { id: "l-hix-launch",   name: "Launch & Marketing",      spaceId: "hix" },
  { id: "l-hix-ops",      name: "Ops & Legal",             spaceId: "hix" },

  // Wasla OS
  { id: "l-os-build",   name: "Build & Tech",       spaceId: "wasla-os" },
  { id: "l-os-roadmap", name: "Roadmap & Product",  spaceId: "wasla-os" },
  { id: "l-os-agents",  name: "AI Agents",          spaceId: "wasla-os" },

  // AgriWasla
  { id: "l-agri-build", name: "Build & Product",        spaceId: "agriwasla" },
  { id: "l-agri-ops",   name: "Operations & Investors", spaceId: "agriwasla" },

  // Single-list ventures
  { id: "l-edu-all",      name: "All Tasks", spaceId: "wasla-edu" },
  { id: "l-labs-all",     name: "All Tasks", spaceId: "wasla-labs" },
  { id: "l-firewood-all", name: "All Tasks", spaceId: "firewood" },

  // Marketing & Growth
  { id: "l-mkt-brand", name: "Wasla Brand",              spaceId: "marketing" },
  { id: "l-mkt-perf",  name: "Performance Marketing Lab", spaceId: "marketing" },
  { id: "l-mkt-content", name: "Content Pipeline",        spaceId: "marketing" },

  // Operations
  { id: "l-ops-hiring", name: "Hiring",               spaceId: "operations" },
  { id: "l-ops-finance",name: "Finance",              spaceId: "operations" },
  { id: "l-ops-legal",  name: "Legal",                spaceId: "operations" },
  { id: "l-ops-tools",  name: "Tools & Subscriptions",spaceId: "operations" },
  { id: "l-ops-hq",     name: "HQ Setup",             spaceId: "operations" },

  // Fundraise & Strategy
  { id: "l-fund-tourism", name: "Tourism Raise",     spaceId: "fundraise" },
  { id: "l-fund-sov",     name: "Sovereign Mandate", spaceId: "fundraise" },
  { id: "l-fund-updates", name: "Investor Updates",  spaceId: "fundraise" },

  // Personal — Bassel
  { id: "l-personal-exec",     name: "My Exec List", spaceId: "personal-bassel" },
  { id: "l-personal-decisions",name: "Decisions",    spaceId: "personal-bassel" },
  { id: "l-personal-followups",name: "Follow-ups",   spaceId: "personal-bassel" },
  { id: "l-personal-lovable",  name: "Lovable Lab",  spaceId: "personal-bassel" },
];

const STATUSES: Status[] = ["Backlog", "To Do", "In Progress", "In Review", "Blocked", "Done"];
const PRIORITIES: Priority[] = ["urgent", "high", "normal", "normal", "normal", "low"];

function pick<T>(arr: T[], i: number) { return arr[i % arr.length]; }
function dueOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

type Seed = { id?: string; title: string; listId: string; assigneeId: string; status?: Status; priority?: Priority; due?: number; parentId?: string; tags?: string[] };

const SEEDS: Seed[] = [
  // ============ SMG > Liqui Moly ============
  { title: "Brief intake from SMG — Liqui Moly scope & objectives", listId: "l-smg-liqui", assigneeId: "bassel", status: "In Progress", priority: "urgent", due: 1 },
  { title: "Competitive & category landscape research", listId: "l-smg-liqui", assigneeId: "usef", status: "In Progress", priority: "high", due: 3, id: "T-SMG-COMP" },
  {   title: "Map top 5 lubricant brands in Egypt",       listId: "l-smg-liqui", assigneeId: "usef", status: "In Progress", priority: "high", due: 2, parentId: "T-SMG-COMP" },
  {   title: "Pull category share data from Nielsen",     listId: "l-smg-liqui", assigneeId: "usef", status: "To Do", priority: "normal", due: 4, parentId: "T-SMG-COMP" },
  { title: "Define proposal scope & deliverables",         listId: "l-smg-liqui", assigneeId: "bassel", status: "In Progress", priority: "high", due: 4 },
  { title: "Pricing & commercial model",                   listId: "l-smg-liqui", assigneeId: "bassel", status: "To Do", priority: "high", due: 6 },
  { title: "Draft proposal document",                      listId: "l-smg-liqui", assigneeId: "usef", status: "To Do", priority: "high", due: 8 },
  { title: "Internal review & sign-off",                   listId: "l-smg-liqui", assigneeId: "bassel", status: "To Do", priority: "normal", due: 10 },
  { title: "Send proposal to SMG",                         listId: "l-smg-liqui", assigneeId: "bassel", status: "To Do", priority: "normal", due: 12 },
  { title: "Follow-up cadence & negotiation",              listId: "l-smg-liqui", assigneeId: "bassel", status: "To Do", priority: "normal", due: 14 },
  { title: "Contract signature & kick-off plan",           listId: "l-smg-liqui", assigneeId: "bassel", status: "To Do", priority: "normal", due: 18 },
  { title: "Liqui Moly — Digital Marketing",               listId: "l-smg-liqui", assigneeId: "osama", status: "In Progress", priority: "high", due: 5 },

  // ============ SMG > Corporate Holding Site ============
  { title: "Corporate Holding Site",                       listId: "l-smg-corp", assigneeId: "moaz", status: "In Review", priority: "high", due: 2, id: "T-SMG-CORP" },
  {   title: "Backend architecture & API design",          listId: "l-smg-corp", assigneeId: "moaz", status: "Done", priority: "high", due: -10, parentId: "T-SMG-CORP" },
  {   title: "Frontend build",                             listId: "l-smg-corp", assigneeId: "moaz", status: "Done", priority: "high", due: -5, parentId: "T-SMG-CORP" },
  {   title: "QA pass",                                    listId: "l-smg-corp", assigneeId: "moaz", status: "In Review", priority: "high", due: 1, parentId: "T-SMG-CORP" },
  { title: "SMG corporate holding site — delivered & live",listId: "l-smg-corp", assigneeId: "moaz", status: "Done", priority: "low", due: -2 },
  { title: "Post-launch maintenance & change requests",    listId: "l-smg-corp", assigneeId: "moaz", status: "To Do", priority: "low", due: 7 },

  // ============ SMG > Subsidiaries ============
  { title: "Subsidiaries / Verticals",                                    listId: "l-smg-subs", assigneeId: "moaz", status: "In Progress", priority: "high", due: 8 },
  { title: "SMG subsidiaries / verticals sites — delivered",              listId: "l-smg-subs", assigneeId: "moaz", status: "Done", priority: "low", due: -15 },

  // ============ SMG > Porsche ============
  { title: "Porsche Drive + Platform",                                    listId: "l-smg-porsche", assigneeId: "moaz", status: "In Progress", priority: "high", due: 10 },

  // ============ EJB ============
  { title: "Mobile Application", listId: "l-ejb", assigneeId: "moaz", status: "In Progress", priority: "high", due: 5, id: "T-EJB-MOB" },
  {   title: "Auth and registration flow", listId: "l-ejb", assigneeId: "hagry", status: "In Progress", priority: "high", due: 3, parentId: "T-EJB-MOB", id: "T-EJB-AUTH" },
  {   title: "Member directory",           listId: "l-ejb", assigneeId: "hagry", status: "To Do", priority: "normal", due: 7, parentId: "T-EJB-MOB" },
  {   title: "Push notifications",         listId: "l-ejb", assigneeId: "hagry", status: "To Do", priority: "normal", due: 9, parentId: "T-EJB-MOB" },
  { title: "Corporate Website",   listId: "l-ejb", assigneeId: "hagry", status: "In Progress", priority: "high", due: 6 },
  { title: "Admin Dashboard",     listId: "l-ejb", assigneeId: "moaz",  status: "To Do",       priority: "high", due: 12 },
  { title: "Ability for members to register then admin accepts", listId: "l-ejb", assigneeId: "moaz", status: "Blocked", priority: "high", due: 8, id: "T-EJB-REG" },

  // ============ Clutch ============
  { title: "Website", listId: "l-clutch", assigneeId: "hagry", status: "In Progress", priority: "high", due: 4 },

  // ============ MW ============
  { title: "Framer Website", listId: "l-mw", assigneeId: "saif", status: "In Progress", priority: "normal", due: 6 },

  // ============ Leads ============
  { title: "Yehia Shazly — 2 corporate websites (his factory)",      listId: "l-leads", assigneeId: "bassel", status: "To Do", priority: "high",   due: 3 },
  { title: "Mansour (Yasmine Hafez referral)",                       listId: "l-leads", assigneeId: "bassel", status: "To Do", priority: "normal", due: 5 },
  { title: "Aly El Garahy",                                          listId: "l-leads", assigneeId: "bassel", status: "To Do", priority: "normal", due: 7 },
  { title: "Fatima Ragab — Restaurant bill payment solution",        listId: "l-leads", assigneeId: "bassel", status: "To Do", priority: "normal", due: 9 },

  // ============ Wasla Tourism > Build & Tech ============
  { title: "Set up war room dev environment",                  listId: "l-tour-build", assigneeId: "moaz",   status: "In Progress", priority: "urgent", due: 1 },
  { title: "Define multi-vertical platform architecture",      listId: "l-tour-build", assigneeId: "moaz",   status: "In Progress", priority: "urgent", due: 4 },
  { title: "Build owned ticketing layer (white-label core)",   listId: "l-tour-build", assigneeId: "moaz",   status: "To Do",       priority: "high",   due: 14 },

  // ============ Wasla Tourism > Partnerships ============
  { title: "Onboard accommodation providers across 10 cities", listId: "l-tour-partners", assigneeId: "bassel", status: "In Progress", priority: "urgent", due: 10, id: "T-TOUR-ACCOM" },
  {   title: "Cairo (12/15)",         listId: "l-tour-partners", parentId: "T-TOUR-ACCOM", assigneeId: "bassel", status: "In Progress", priority: "high",   due: 5 },
  {   title: "Alexandria (8/10)",     listId: "l-tour-partners", parentId: "T-TOUR-ACCOM", assigneeId: "bassel", status: "In Progress", priority: "high",   due: 6 },
  {   title: "Sharm El Sheikh (10/10)",listId: "l-tour-partners", parentId: "T-TOUR-ACCOM", assigneeId: "bassel", status: "Done",       priority: "high",   due: -2 },
  {   title: "Hurghada",              listId: "l-tour-partners", parentId: "T-TOUR-ACCOM", assigneeId: "bassel", status: "To Do",       priority: "high",   due: 8 },
  {   title: "Luxor",                 listId: "l-tour-partners", parentId: "T-TOUR-ACCOM", assigneeId: "bassel", status: "To Do",       priority: "normal", due: 10 },
  {   title: "Aswan",                 listId: "l-tour-partners", parentId: "T-TOUR-ACCOM", assigneeId: "bassel", status: "To Do",       priority: "normal", due: 12 },
  {   title: "Marsa Alam",            listId: "l-tour-partners", parentId: "T-TOUR-ACCOM", assigneeId: "bassel", status: "To Do",       priority: "normal", due: 14 },
  { title: "Onboard mobility partners (drivers, taxis, limos, train)", listId: "l-tour-partners", assigneeId: "bassel", status: "In Progress", priority: "high", due: 9 },
  { title: "Onboard experience partners and tour guides",              listId: "l-tour-partners", assigneeId: "bassel", status: "To Do",       priority: "high", due: 12 },

  // ============ Wasla Tourism > Fundraise ============
  { title: "Finalize Tourism investor deck",                                       listId: "l-tour-raise", assigneeId: "bassel", status: "In Review",   priority: "urgent", due: 2 },
  { title: "Build Tourism data room",                                              listId: "l-tour-raise", assigneeId: "bassel", status: "In Progress", priority: "urgent", due: 7 },
  { title: "Legal prep with Zaki Hashem (term sheet, SHA, founding docs)",         listId: "l-tour-raise", assigneeId: "bassel", status: "In Progress", priority: "high",   due: 10 },

  // ============ HIX > Product & Manufacturing ============
  { title: "FSM Cosmetics — product brief execution",  listId: "l-hix-product", assigneeId: "usef",   status: "In Progress", priority: "urgent", due: 4 },
  { title: "Validate formula direction with FSM",       listId: "l-hix-product", assigneeId: "bassel", status: "To Do",       priority: "high",   due: 9 },

  // ============ HIX > Brand & Creative ============
  { title: "Develop HIX brand identity and guidelines", listId: "l-hix-brand", assigneeId: "usef", status: "In Progress", priority: "urgent", due: 5 },
  { title: "Packaging design — print-ready",            listId: "l-hix-brand", assigneeId: "ali",  status: "To Do",       priority: "high",   due: 14 },

  // ============ HIX > Online & D2C ============
  { title: "Build HIX D2C Shopify store",               listId: "l-hix-d2c", assigneeId: "moaz", status: "To Do", priority: "high", due: 18 },

  // ============ HIX > Ops & Legal ============
  { title: "Finalize HIX founding team equity and legal",listId: "l-hix-ops", assigneeId: "bassel", status: "In Progress", priority: "urgent", due: 6 },

  // ============ Wasla OS > Build & Tech ============
  { title: "Wasla OS infrastructure setup",             listId: "l-os-build", assigneeId: "moaz", status: "In Progress", priority: "high",  due: 3 },
  { title: "ClickUp API integration as task layer",     listId: "l-os-build", assigneeId: "moaz", status: "To Do",       priority: "normal",due: 9 },

  // ============ Wasla OS > Roadmap ============
  { title: "Wasla OS V1 scope and 16-week roadmap",     listId: "l-os-roadmap", assigneeId: "bassel", status: "In Review", priority: "high", due: 1 },

  // ============ AgriWasla — placeholders ============
  { title: "AgriWasla product design active",           listId: "l-agri-build", assigneeId: "hagry",  status: "In Progress", priority: "high",   due: 8 },
  { title: "Investor conversations — AgriWasla",        listId: "l-agri-ops",   assigneeId: "bassel", status: "In Progress", priority: "normal", due: 6 },

  // ============ Internal > Operations > Hiring ============
  { title: "Invite team to Wasla OS as Members",        listId: "l-ops-hiring", assigneeId: "bassel", status: "In Progress", priority: "urgent", due: 2 },

  // ============ Internal > Operations > Finance ============
  { title: "Weekly Wasla Ventures Master Sheet update", listId: "l-ops-finance", assigneeId: "bassel", status: "In Progress", priority: "normal", due: 1, tags: ["recurring"] },
  { title: "Refine assumptions and projections for investor updates", listId: "l-ops-finance", assigneeId: "bassel", status: "To Do", priority: "high", due: 7 },

  // ============ Internal > Operations > Tools & Subscriptions ============
  { title: "Audit all SaaS subscriptions and create renewal tracker", listId: "l-ops-tools", assigneeId: "bassel", status: "In Progress", priority: "normal", due: 5 },

  // ============ Internal > Operations > Legal ============
  { title: "Track open legal matters with Zaki Hashem", listId: "l-ops-legal", assigneeId: "bassel", status: "In Progress", priority: "high", due: 4 },

  // ============ Internal > Operations > HQ Setup ============
  { title: "Office buildout completion",                listId: "l-ops-hq", assigneeId: "bassel", status: "In Progress", priority: "high", due: 10 },
  { title: "Hardware procurement (Mac Mini M4 fleet, hold Mac Studio for M5)", listId: "l-ops-hq", assigneeId: "bassel", status: "In Progress", priority: "high", due: 7 },
  { title: "Network and UPS install (Ubiquiti or Omada, UPS per station)",     listId: "l-ops-hq", assigneeId: "moaz",   status: "To Do",       priority: "high", due: 12 },

  // ============ Fundraise & Strategy > Investor Updates ============
  { title: "Q1 2026 friends & family investor update", listId: "l-fund-updates", assigneeId: "bassel", status: "To Do", priority: "high", due: 8 },

  // ============ Fundraise > Sovereign ============
  { title: "Refine and circulate Sovereign CIM",       listId: "l-fund-sov", assigneeId: "bassel", status: "In Progress", priority: "high", due: 5 },

  // ============ Marketing & Growth > Performance Lab ============
  { title: "Set up shared ad accounts (Meta, TikTok, Google) under master billing", listId: "l-mkt-perf", assigneeId: "osama", status: "In Progress", priority: "high", due: 6 },
  { title: "Osama — performance marketing skill build", listId: "l-mkt-perf", assigneeId: "osama", status: "In Progress", priority: "normal", due: 0, tags: ["recurring"] },

  // ============ Marketing & Growth > Wasla Brand ============
  { title: "Founder content strategy and cadence",      listId: "l-mkt-brand", assigneeId: "bassel", status: "To Do", priority: "normal", due: 10 },

  // ============ Personal — Bassel > Decisions ============
  { title: "Decide: payment aggregation Tier 2 launch timing", listId: "l-personal-decisions", assigneeId: "bassel", status: "To Do", priority: "normal", due: 5 },
  { title: "Decide: formalize Paperwork agency relationship",  listId: "l-personal-decisions", assigneeId: "bassel", status: "To Do", priority: "normal", due: 7 },
];

export const tasks: Task[] = SEEDS.map((s, i) => {
  const list = lists.find((l) => l.id === s.listId)!;
  return {
    id: s.id ?? `T-${1000 + i}`,
    title: s.title,
    status: s.status ?? pick(STATUSES, i),
    priority: s.priority ?? pick(PRIORITIES, i),
    spaceId: list.spaceId,
    listId: s.listId,
    parentId: s.parentId,
    assigneeId: s.assigneeId,
    due: dueOffset(s.due ?? ((i * 3) % 14) - 4),
    startDate: dueOffset((s.due ?? 0) - 3),
    description: "Coordinated through Wasla OS. See linked thread for context, deliverables and approval owners.",
    comments: [],
    watchers: ["bassel"],
    tags: s.tags ?? [],
    attachments: [],
    dependencies: { blocks: [], blockedBy: [] },
    customFieldValues: {},
    createdAt: dueOffset(-30 + (i % 30)),
  };
});

function addDep(blocker: string, blocked: string) {
  const a = tasks.find((t) => t.id === blocker);
  const b = tasks.find((t) => t.id === blocked);
  if (!a || !b) return;
  a.dependencies = a.dependencies ?? { blocks: [], blockedBy: [] };
  b.dependencies = b.dependencies ?? { blocks: [], blockedBy: [] };
  a.dependencies.blocks.push(blocked);
  b.dependencies.blockedBy.push(blocker);
}
addDep("T-EJB-AUTH", "T-EJB-REG");

// Sample custom field values on HIX Product list
tasks.filter((t) => t.listId === "l-hix-product").forEach((t, i) => {
  t.customFieldValues = {
    "cf-approval": ["Submitted", "Draft"][i] ?? "Draft",
    "cf-budget":   [180000, 60000][i] ?? 50000,
  };
});

// ============ TEMPLATES ============
export const taskTemplates: TaskTemplate[] = [
  {
    id: "tpl-onboard", name: "New client onboarding",
    description: "Standard checklist for spinning up a new Wasla Solutions client engagement.",
    subtasks: ["Kickoff call", "Signed SOW", "Drive folder setup", "Add to CRM"], tags: ["onboarding"],
  },
  {
    id: "tpl-campaign", name: "Marketing campaign brief",
    description: "Use for any new campaign across Wasla Ventures.",
    subtasks: ["Goals", "Audience", "Channels", "KPIs", "Timeline"], tags: ["marketing"],
  },
  {
    id: "tpl-bug", name: "Bug report",
    description: "Standard template for engineering bug intake.",
    fields: [
      { label: "Steps to reproduce", placeholder: "1. … 2. …" },
      { label: "Expected",           placeholder: "What should happen?" },
      { label: "Actual",             placeholder: "What actually happens?" },
    ], tags: ["bug"],
  },
];

// ============ CHANNELS / MESSAGES ============
export interface Channel { id: string; name: string; pillar: Pillar; unread?: number; postTaskUpdates?: boolean }
export function channelHomeSpaceId(channelId: string): string {
  return channelId.split("-").slice(1).join("-");
}

export const channels: Channel[] = [
  { id: "client-smg",       name: "smg",       pillar: "client",  unread: 4 },
  { id: "client-ejb",       name: "ejb",       pillar: "client",  unread: 1 },
  { id: "client-clutch",    name: "clutch",    pillar: "client" },
  { id: "client-mw",        name: "mw",        pillar: "client" },
  { id: "client-leads",     name: "leads",     pillar: "client" },
  { id: "tourism",        name: "tourism",   pillar: "ventures", unread: 6 },
  { id: "ventures-hix",     name: "hix",       pillar: "ventures", unread: 2 },
  { id: "ventures-os",      name: "os",        pillar: "ventures" },
  { id: "ventures-agri",    name: "agri",      pillar: "ventures" },
  { id: "internal-ops",     name: "ops",       pillar: "internal" },
  { id: "internal-fundraise",name:"fundraise", pillar: "internal" },
  { id: "internal-marketing",name:"marketing", pillar: "internal" },
];

export interface Message {
  id: string;
  authorId: string;
  body: string;
  at: string;
  kind?: "text" | "voice" | "image" | "task" | "file";
  taskId?: string;
  replies?: number;
  reactions?: { emoji: string; count: number }[];
  /** For image/file kinds: object URL + original filename. */
  fileUrl?: string;
  fileName?: string;
  /** If set, this message is a thread reply to the given parent message id. */
  parentMessageId?: string | null;
}
export const channelMessages: Record<string, Message[]> = {
  "client-smg": [
    { id: "m1", authorId: "bassel", body: "Liqui Moly brief intake call confirmed for Wednesday 11am. Usef joining.", at: "2026-05-25T08:02:00Z" },
    { id: "m2", authorId: "usef",   body: "Pulled the top 5 lubricant brands deck — sharing in #ventures shortly.", at: "2026-05-25T08:11:00Z", reactions: [{ emoji: "🔥", count: 2 }] },
    { id: "m3", authorId: "moaz",   body: "Corporate holding site QA pass in progress, sending checklist EOD.", at: "2026-05-25T08:24:00Z" },
    { id: "m4", authorId: "osama",  body: "Liqui Moly digital — pulled last month's ad spend benchmarks.", at: "2026-05-25T08:40:00Z", kind: "image" },
    { id: "m5", authorId: "bassel", body: "Approved. Push the proposal scope deck to Friday review.", at: "2026-05-25T08:44:00Z", reactions: [{ emoji: "✅", count: 3 }] },
  ],
  "tourism": [
    { id: "t1", authorId: "bassel", body: "Sharm onboarding cleared — 10/10 providers signed. Onto Hurghada next.", at: "2026-05-25T09:00:00Z" },
    { id: "t2", authorId: "moaz",   body: "War-room dev env is up. Architecture doc in Drive.", at: "2026-05-25T09:14:00Z" },
    { id: "t3", authorId: "bassel", body: "Investor deck v3 circulated — feedback by Thursday please.", at: "2026-05-25T09:30:00Z", replies: 4 },
  ],
};

export const dmMessages: Record<string, Message[]> = {
  moaz: [
    { id: "dm-moaz-1", authorId: "moaz",   body: "Pushed the QA build for the holding site — can you spin through the contact form?", at: "2026-05-24T09:12:00Z" },
    { id: "dm-moaz-2", authorId: "bassel", body: "On it. Any known issues on mobile?", at: "2026-05-24T09:18:00Z" },
    { id: "dm-moaz-3", authorId: "moaz",   body: "Safari iOS 17 has a sticky-header glitch on scroll — fix landing tonight.", at: "2026-05-24T09:20:00Z" },
    { id: "dm-moaz-4", authorId: "bassel", body: "Nice. Push the war-room env creds to 1Password when you get a sec.", at: "2026-05-24T09:34:00Z" },
    { id: "dm-moaz-5", authorId: "moaz",   body: "Done ✅ — vault: Wasla / Dev.", at: "2026-05-24T09:41:00Z" },
  ],
  usef: [
    { id: "dm-usef-1", authorId: "usef",   body: "Liqui Moly deck v2 is ready — swapped hero to option B per your note.", at: "2026-05-25T10:02:00Z" },
    { id: "dm-usef-2", authorId: "bassel", body: "Great. Can you make the pricing slide breathe more? Feels dense.", at: "2026-05-25T10:07:00Z" },
    { id: "dm-usef-3", authorId: "usef",   body: "Yep, thinning it to three tiers + a footnote. Also refreshed the Paperwork brand marks.", at: "2026-05-25T10:11:00Z" },
    { id: "dm-usef-4", authorId: "bassel", body: "Perfect. Share both in #client-smg once you're happy.", at: "2026-05-25T10:15:00Z" },
  ],
  ali: [
    { id: "dm-ali-1",  authorId: "ali",    body: "Sharm providers all countersigned. Uploading to Drive under Tourism/Contracts.", at: "2026-05-25T11:20:00Z" },
    { id: "dm-ali-2",  authorId: "bassel", body: "Amazing — start Hurghada outreach this week?", at: "2026-05-25T11:24:00Z" },
    { id: "dm-ali-3",  authorId: "ali",    body: "Yes, I have 6 warm intros lined up. Kicking off Wednesday.", at: "2026-05-25T11:27:00Z" },
    { id: "dm-ali-4",  authorId: "bassel", body: "Loop me on the first call.", at: "2026-05-25T11:29:00Z" },
    { id: "dm-ali-5",  authorId: "ali",    body: "Will do 👍", at: "2026-05-25T11:30:00Z" },
  ],
  hagry: [
    { id: "dm-hagry-1", authorId: "hagry",  body: "May P&L close is done — sending the pack tonight.", at: "2026-05-25T14:05:00Z" },
    { id: "dm-hagry-2", authorId: "bassel", body: "Anything unusual on burn?", at: "2026-05-25T14:08:00Z" },
    { id: "dm-hagry-3", authorId: "hagry",  body: "Down 6% vs April — subscription cutovers finally hitting.", at: "2026-05-25T14:10:00Z" },
    { id: "dm-hagry-4", authorId: "bassel", body: "Beautiful. Let's chat runway in tomorrow's stand-up.", at: "2026-05-25T14:12:00Z" },
  ],
};

function dayStr(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
}
export const bodEod: BodEod[] = (() => {
  const out: BodEod[] = [];
  for (const m of members) {
    for (let d = 0; d < 14; d++) {
      const skip = (m.id === "saif" && d % 4 === 0) || (m.id === "ali" && d === 2);
      if (skip) continue;
      out.push({
        id: `${m.id}-${d}`,
        memberId: m.id,
        date: dayStr(d),
        bod: { ship: "Push SMG proposal track and Tourism onboarding.", blockers: d % 5 === 0 ? "Waiting on Zaki Hashem" : "" },
        eod: d === 0 ? undefined : { shipped: "Closed 3 tasks, reviewed 2 decks.", blockedTomorrow: "" },
      });
    }
  }
  return out;
})();

export interface InboxItem {
  id: string;
  source: "chat" | "task" | "system";
  preview: string;
  at: string;
  unread: boolean;
  fromId?: string;
  taskId?: string;
  channelId?: string;
  messageId?: string;
}
export const inboxItems: InboxItem[] = [
  { id: "i1", source: "chat",   preview: "@bassel — approve Liqui Moly proposal scope?",   at: "2026-05-25T08:40:00Z", unread: true, fromId: "usef", channelId: "client-smg", messageId: "m2" },
  { id: "i2", source: "task",   preview: "Moaz assigned you 'QA pass — SMG corporate site'",at: "2026-05-25T08:30:00Z", unread: true, fromId: "moaz", taskId: "T-SMG-CORP" },
  { id: "i3", source: "system", preview: "Saif hasn't submitted BOD today",                 at: "2026-05-25T09:05:00Z", unread: true },
  { id: "i4", source: "chat",   preview: "Osama: Liqui Moly ad spend benchmarks shared",    at: "2026-05-25T07:55:00Z", unread: false, fromId: "osama", channelId: "client-smg", messageId: "m4" },
  { id: "i5", source: "task",   preview: "Hagry moved 'Corporate Website (EJB)' to In Progress", at: "2026-05-24T18:11:00Z", unread: false, fromId: "hagry", taskId: "T-SMG-CORP" },
  { id: "i6", source: "task",   preview: "Bassel commented on 'Investor deck' — @bassel can you review?", at: "2026-05-25T10:15:00Z", unread: true, fromId: "bassel", taskId: "T-SMG-COMP" },
  { id: "i7", source: "chat",   preview: "Moaz mentioned you in #tourism — 'war room dev env is up'", at: "2026-05-25T09:14:00Z", unread: true, fromId: "moaz", channelId: "tourism", messageId: "t2" },
  { id: "i8", source: "task",   preview: "Task you watch moved: 'Onboard accommodation providers' → In Progress", at: "2026-05-24T14:00:00Z", unread: false, fromId: "bassel", taskId: "T-TOUR-ACCOM" },
];


export const files = [
  { id: "f1", name: "Wasla Ventures — Master Sheet.gsheet",         modified: "today",  ownerId: "bassel", kind: "sheet" },
  { id: "f2", name: "Wasla Tourism — Investor Deck v3.pdf",         modified: "1d ago", ownerId: "bassel", kind: "pdf" },
  { id: "f3", name: "HIX — Brand Identity WIP.fig",                 modified: "4h ago", ownerId: "usef",   kind: "image" },
  { id: "f4", name: "SMG — Liqui Moly Proposal (draft).gdoc",       modified: "2d ago", ownerId: "bassel", kind: "doc" },
  { id: "f5", name: "EJB Mobile App — Auth flow.png",               modified: "5h ago", ownerId: "hagry",  kind: "image" },
  { id: "f6", name: "Sovereign Mandate CIM.pdf",                    modified: "3d ago", ownerId: "bassel", kind: "pdf" },
  { id: "f7", name: "Tourism Providers — Tracker.gsheet",           modified: "1d ago", ownerId: "bassel", kind: "sheet" },
  { id: "f8", name: "Wasla OS — V1 Roadmap.gdoc",                   modified: "1w ago", ownerId: "moaz",   kind: "doc" },
];

export type SubStatus = "Active" | "Cutover" | "Cancelled";
export interface Subscription { id: string; name: string; replacedBy: string; status: SubStatus; cutoverDate?: string; monthly: number }
export const subscriptionsSeed: Subscription[] = [
  { id: "s1", name: "ClickUp",       replacedBy: "Phase 1 (Tasks)",      status: "Active", monthly: 1500 },
  { id: "s2", name: "Slack",         replacedBy: "Phase 1.5 (Chat)",     status: "Active", monthly: 1200 },
  { id: "s3", name: "Notion",        replacedBy: "Phase 3 (Docs)",       status: "Active", monthly: 800  },
  { id: "s4", name: "Loom",          replacedBy: "Phase 5 (Recordings)", status: "Active", monthly: 600  },
  { id: "s5", name: "Calendly",      replacedBy: "Phase 6 (Scheduling)", status: "Active", monthly: 500  },
  { id: "s6", name: "Typeform",      replacedBy: "Phase 7 (Forms)",      status: "Active", monthly: 900  },
  { id: "s7", name: "HubSpot Free",  replacedBy: "Phase 8 (CRM)",        status: "Active", monthly: 0    },
  { id: "s8", name: "BambooHR",      replacedBy: "Phase 9 (HR)",         status: "Active", monthly: 1800 },
];

export interface Venture {
  id: string;
  name: string;
  status: "Active" | "Pilot" | "Paused";
  mrr: number;
  metricLabel: string;
  metricValue: number;
  growthMoM: number;
  source: string;
  spark: number[];
  /** Pre-revenue ventures: progress markers shown instead of revenue. */
  progress?: { label: string; value: string }[];
  stage?: string;
}
function spark(seed: number, n = 30): number[] {
  return Array.from({ length: n }, (_, i) => Math.round(40 + Math.sin((i + seed) / 3) * 10 + (i / 3) + seed));
}
export const ventures: Venture[] = [
  {
    id: "tourism", name: "Wasla Tourism", status: "Pilot", mrr: 0,
    metricLabel: "Providers", metricValue: 12, growthMoM: 0,
    source: "Wasla Finance Master / Tourism!B2", spark: spark(2),
    stage: "Pre-launch · Fundraising",
    progress: [
      { label: "Investor deck", value: "v3 circulated" },
      { label: "Data room",     value: "60% complete" },
      { label: "Providers",     value: "12 / 50" },
    ],
  },
  {
    id: "hix", name: "HIX", status: "Pilot", mrr: 0,
    metricLabel: "Pilot SKUs", metricValue: 1, growthMoM: 0,
    source: "Wasla Finance Master / HIX!B2", spark: spark(5),
    stage: "Pilot · Pre-launch",
    progress: [
      { label: "Manufacturing", value: "FSM brief in progress" },
      { label: "Brand identity",value: "In design" },
      { label: "D2C store",     value: "30%" },
    ],
  },
  {
    id: "wasla-os", name: "Wasla OS", status: "Active", mrr: 0,
    metricLabel: "Phase", metricValue: 1, growthMoM: 0,
    source: "Wasla OS Roadmap / Status!B2", spark: spark(8),
    stage: "Active build",
    progress: [
      { label: "V1 scope",      value: "Locked" },
      { label: "Roadmap",       value: "16 weeks" },
      { label: "Phase 1",       value: "In design" },
    ],
  },
  {
    id: "agriwasla", name: "AgriWasla", status: "Pilot", mrr: 0,
    metricLabel: "Stage", metricValue: 1, growthMoM: 0,
    source: "AgriWasla / Status!B2", spark: spark(11),
    stage: "Build phase",
    progress: [
      { label: "Product design", value: "Active" },
      { label: "Investors",      value: "Conversations ongoing" },
    ],
  },
  {
    id: "wasla-edu", name: "Wasla Education", status: "Pilot", mrr: 0,
    metricLabel: "Stage", metricValue: 0, growthMoM: 0,
    source: "Wasla Education / Status!B2", spark: spark(14),
    stage: "Early stage · Pre-product",
    progress: [{ label: "Status", value: "Pre-product" }],
  },
  {
    id: "wasla-labs", name: "Wasla Labs", status: "Pilot", mrr: 0,
    metricLabel: "Experiments", metricValue: 3, growthMoM: 0,
    source: "Wasla Labs / Status!B2", spark: spark(17),
    stage: "R&D & experimentation",
    progress: [{ label: "Mode", value: "R&D" }, { label: "Live experiments", value: "3" }],
  },
  {
    id: "firewood", name: "Firewood Egypt", status: "Pilot", mrr: 0,
    metricLabel: "Stage", metricValue: 0, growthMoM: 0,
    source: "Firewood Egypt / Status!B2", spark: spark(20),
    stage: "Early stage",
    progress: [{ label: "Status", value: "Early stage" }],
  },
];

export const financialMetrics = {
  cash:   { value: 4_250_000, trend: "+6% MoM",  source: "Wasla Finance Master / Cash!B2"    },
  runway: { value: 14,        trend: "stable",   source: "Wasla Finance Master / Runway!B2"  },
  mrr:    { value: 380_000,   trend: "+12% MoM", source: "Wasla Finance Master / Revenue!B2" },
  burn:   { value: 295_000,   trend: "-3% MoM",  source: "Wasla Finance Master / Burn!B2"    },
};

export const revenueByWorkspace: { month: string; "Wasla Solutions": number; "Paperwork Studio": number }[] = [
  { month: "Jun", "Wasla Solutions": 240_000, "Paperwork Studio": 0 },
  { month: "Jul", "Wasla Solutions": 260_000, "Paperwork Studio": 0 },
  { month: "Aug", "Wasla Solutions": 250_000, "Paperwork Studio": 0 },
  { month: "Sep", "Wasla Solutions": 275_000, "Paperwork Studio": 0 },
  { month: "Oct", "Wasla Solutions": 290_000, "Paperwork Studio": 0 },
  { month: "Nov", "Wasla Solutions": 310_000, "Paperwork Studio": 0 },
  { month: "Dec", "Wasla Solutions": 305_000, "Paperwork Studio": 0 },
  { month: "Jan", "Wasla Solutions": 320_000, "Paperwork Studio": 0 },
  { month: "Feb", "Wasla Solutions": 335_000, "Paperwork Studio": 0 },
  { month: "Mar", "Wasla Solutions": 350_000, "Paperwork Studio": 0 },
  { month: "Apr", "Wasla Solutions": 365_000, "Paperwork Studio": 0 },
  { month: "May", "Wasla Solutions": 380_000, "Paperwork Studio": 0 },
];

export function egp(n: number): string { return `EGP ${new Intl.NumberFormat("en-US").format(n)}` }
export function dailyShipped(seed: number, n = 14): { d: number; v: number }[] {
  return Array.from({ length: n }, (_, i) => ({
    d: i,
    v: Math.max(0, Math.round(4 + Math.sin((i + seed) / 2) * 2 + ((i + seed) % 4))),
  }));
}

export function memberById(id: string) { return members.find(m => m.id === id) ?? members[0] }
export function spaceById(id: string)  { return spaces.find(s => s.id === id) ?? spaces[0] }
export function listById(id: string)   { return lists.find(l => l.id === id) }
export function folderById(id: string) { return folders.find(f => f.id === id) }
export function taskById(id: string)   { return tasks.find(t => t.id === id) }

/** Returns spaces visible to a given user, honoring per-space ownerId visibility. */
export function visibleSpacesFor(userId: string): Space[] {
  return spaces.filter((s) => !s.ownerId || s.ownerId === userId);
}

export const pillarMeta: Record<Pillar, { label: string; color: string }> = {
  client:   { label: "Client Services", color: "#3B82F6" },
  ventures: { label: "Venture Builds",  color: "#8B5CF6" },
  internal: { label: "Internal",        color: "#10B981" },
};

export const roleToUser: Record<Role, string> = {
  founder: "bassel",
  manager: "usef",
  member:  "hagry",
};

export function formatCairoDate(d: Date | string = new Date()): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Cairo",
  }).format(date);
}
