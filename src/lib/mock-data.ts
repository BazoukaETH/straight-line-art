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

export interface Workspace {
  id: string;
  name: string;
  comingSoon?: boolean;
}

export const organization = {
  id: "wasla-ventures",
  name: "Wasla Ventures",
};

export const workspaces: Workspace[] = [
  { id: "wasla-solutions", name: "Wasla Solutions" },
  { id: "paperwork-studio", name: "Paperwork Studio", comingSoon: true },
];

export interface Space {
  id: string;
  name: string;
  pillar: Pillar;
  members: number;
}

export interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  spaceId: string;
  assigneeId: string;
  due: string;
  description?: string;
  subtasks?: { id: string; title: string; done: boolean }[];
  comments?: { id: string; authorId: string; body: string; at: string }[];
  watchers?: string[];
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
  { id: "moaz",   name: "Moaz Sawy",        initials: "MS", color: "#3B82F6", role: "manager", title: "Development Lead",              pillar: "ventures", online: true },
  { id: "usef",   name: "Usef Shazly",      initials: "US", color: "#8B5CF6", role: "manager", title: "Digital & Design Lead",         pillar: "client",   online: true },
  { id: "ali",    name: "Ali Amir",         initials: "AA", color: "#EC4899", role: "manager", title: "Creative Lead",                 pillar: "client",   online: false },
  { id: "hagry",  name: "Mohamed Hagry",    initials: "MH", color: "#F59E0B", role: "member",  title: "UI / UX Designer",              pillar: "client",   online: true },
  { id: "osama",  name: "Osama Abbas",      initials: "OA", color: "#10B981", role: "member",  title: "E-Commerce & Digital Growth",   pillar: "ventures", online: true },
  { id: "saif",   name: "Saif Nosair",      initials: "SN", color: "#14B8A6", role: "member",  title: "Multimedia Designer",           pillar: "client",   online: false },
];

export const spaces: Space[] = [
  // Client Work
  { id: "cairo-capital", name: "Cairo Capital",     pillar: "client",   members: 4 },
  { id: "nile-holdings", name: "Nile Holdings",     pillar: "client",   members: 3 },
  { id: "delta-pharma",  name: "Delta Pharma",      pillar: "client",   members: 3 },
  { id: "sahara-tech",   name: "Sahara Tech",       pillar: "client",   members: 4 },
  // Ventures
  { id: "loop",          name: "Loop Commerce",     pillar: "ventures", members: 4 },
  { id: "layer",         name: "Layer Studios",     pillar: "ventures", members: 3 },
  { id: "studio-one",    name: "Studio One",        pillar: "ventures", members: 3 },
  { id: "mirage",        name: "Mirage Media",      pillar: "ventures", members: 2 },
  // Internal
  { id: "finance",       name: "Finance & Accounting", pillar: "internal", members: 2 },
  { id: "hr",            name: "HR & Talent",       pillar: "internal", members: 2 },
  { id: "ops",           name: "Operations",        pillar: "internal", members: 2 },
  { id: "brand",         name: "Brand & Marketing", pillar: "internal", members: 3 },
];

const STATUSES: Status[] = ["Backlog", "To Do", "In Progress", "In Review", "Blocked", "Done"];
const PRIORITIES: Priority[] = ["urgent", "high", "normal", "normal", "normal", "low"];
const SAMPLE_TITLES = [
  "Refresh Cairo Capital landing hero",
  "Review April invoice batch — EGP",
  "Draft Loop Commerce onboarding v2",
  "Design Delta Pharma pricing table",
  "Fix Sahara Tech auth redirect on iOS",
  "Prepare May board deck for Wasla Ventures",
  "Coordinate Nile Holdings launch creative",
  "Write blog post: the founder operating system",
  "Schedule 1:1s for Layer Studios squad",
  "Reconcile Stripe payouts — April",
  "Edit voiceover for Loop Commerce teaser",
  "Refactor task slide-over component",
  "Publish updated Wasla brand guidelines",
  "Run hiring sync with recruiters",
  "Audit Drive folder permissions",
  "Plan Cairo Capital weekly status note",
  "Set up cohort analytics for Loop",
  "Send Thursday founder digest",
  "Renew SaaS contracts — May",
  "Review UI designer portfolios shortlist",
  "Sync with legal on Delta Pharma NDA",
  "Compile EOD silence report",
  "Draft Q3 OKRs for Wasla Internal",
  "Wire Slack into Drive notifications",
  "QA mobile bottom tab bar on iOS",
  "Mirage Media Q3 roadmap review",
  "Studio One launch teaser cut",
  "Brand kit handoff for Sahara Tech",
];

function pick<T>(arr: T[], i: number) { return arr[i % arr.length]; }

function dueOffset(i: number): string {
  const d = new Date();
  d.setDate(d.getDate() + ((i * 7) % 21) - 5);
  return d.toISOString();
}

export const tasks: Task[] = Array.from({ length: 48 }, (_, i) => {
  const space = pick(spaces, i);
  const assignee = pick(members, i + 1);
  return {
    id: `T-${1000 + i}`,
    title: pick(SAMPLE_TITLES, i),
    status: pick(STATUSES, i),
    priority: pick(PRIORITIES, i),
    spaceId: space.id,
    assigneeId: assignee.id,
    due: dueOffset(i),
    description:
      "Tighten composition, push the CTA priority, and align with the Wasla brand refresh. Coordinate with design on copy length and ensure mobile breakpoints feel calm.",
    subtasks: [
      { id: `${i}-1`, title: "Collect references", done: true },
      { id: `${i}-2`, title: "Draft v1", done: i % 3 === 0 },
      { id: `${i}-3`, title: "Review with team", done: false },
    ],
    comments: [
      { id: "c1", authorId: "moaz",  body: "Looks good — can we push the CTA up?", at: "2026-05-24T10:12:00Z" },
      { id: "c2", authorId: "hagry", body: "Adding the new tagline now.",          at: "2026-05-24T11:03:00Z" },
      { id: "c3", authorId: "bassel", body: "Love the direction. Ship by Thursday.", at: "2026-05-24T14:45:00Z" },
    ],
    watchers: ["bassel", "moaz"],
    tags: ["launch", space.id],
  };
});

export interface Channel {
  id: string;
  name: string;
  pillar: Pillar;
  unread?: number;
}

export const channels: Channel[] = [
  { id: "client-cairo-capital", name: "client-cairo-capital", pillar: "client", unread: 2 },
  { id: "client-nile-holdings", name: "client-nile-holdings", pillar: "client" },
  { id: "client-delta-pharma",  name: "client-delta-pharma",  pillar: "client" },
  { id: "client-sahara-tech",   name: "client-sahara-tech",   pillar: "client", unread: 1 },
  { id: "loop-commerce",        name: "loop-commerce",        pillar: "ventures", unread: 5 },
  { id: "loop-marketing",       name: "loop-marketing",       pillar: "ventures" },
  { id: "layer-studios",        name: "layer-studios",        pillar: "ventures" },
  { id: "internal-finance",     name: "internal-finance",     pillar: "internal" },
  { id: "internal-hr",          name: "internal-hr",          pillar: "internal" },
  { id: "internal-ops",         name: "internal-ops",         pillar: "internal" },
];

export interface Message {
  id: string;
  authorId: string;
  body: string;
  at: string;
  kind?: "text" | "voice" | "image" | "task";
  taskId?: string;
  replies?: number;
  reactions?: { emoji: string; count: number }[];
}

export const channelMessages: Record<string, Message[]> = {
  "loop-commerce": [
    { id: "m1", authorId: "bassel", body: "Morning team — kicking off Loop launch week. BODs in please.", at: "2026-05-25T08:02:00Z" },
    { id: "m2", authorId: "osama",  body: "On it. Pushing the marketing site copy by 11.", at: "2026-05-25T08:04:00Z", reactions: [{ emoji: "🔥", count: 3 }] },
    { id: "m3", authorId: "moaz",   body: "Voice note", at: "2026-05-25T08:10:00Z", kind: "voice" },
    { id: "m4", authorId: "hagry",  body: "Hero option B mock attached.", at: "2026-05-25T08:21:00Z", kind: "image" },
    { id: "m5", authorId: "usef",   body: "Linking the launch task here:", at: "2026-05-25T08:25:00Z", kind: "task", taskId: "T-1000" },
    { id: "m6", authorId: "osama",  body: "@bassel quick approval on tagline?", at: "2026-05-25T08:40:00Z", replies: 3 },
    { id: "m7", authorId: "bassel", body: "Approved. Ship it.", at: "2026-05-25T08:44:00Z", reactions: [{ emoji: "✅", count: 4 }] },
    { id: "m8", authorId: "moaz",   body: "Deploying to staging in 10.", at: "2026-05-25T08:55:00Z" },
  ],
  "client-cairo-capital": [
    { id: "a1", authorId: "usef",  body: "Cairo Capital weekly sync notes in Drive.", at: "2026-05-25T09:00:00Z" },
    { id: "a2", authorId: "hagry", body: "Updated the brand deck.", at: "2026-05-25T09:14:00Z", reactions: [{ emoji: "👏", count: 2 }] },
    { id: "a3", authorId: "ali",   body: "New CI direction attached, looks great.", at: "2026-05-25T09:30:00Z" },
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
        bod: { ship: "Ship Loop marketing updates and review April invoices.", blockers: d % 5 === 0 ? "Waiting on legal review" : "" },
        eod: d === 0 ? undefined : { shipped: "Closed 4 tasks, reviewed 2 PRs.", blockedTomorrow: "" },
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
}
export const inboxItems: InboxItem[] = [
  { id: "i1", source: "chat",   preview: "@bassel quick approval on the Loop tagline?",  at: "2026-05-25T08:40:00Z", unread: true, fromId: "osama" },
  { id: "i2", source: "task",   preview: "Moaz assigned you 'Review board deck'",         at: "2026-05-25T08:30:00Z", unread: true, fromId: "moaz" },
  { id: "i3", source: "system", preview: "Saif hasn't submitted BOD today",               at: "2026-05-25T09:05:00Z", unread: true },
  { id: "i4", source: "chat",   preview: "Usef: notes in Cairo Capital Drive folder",     at: "2026-05-25T07:55:00Z", unread: false, fromId: "usef" },
  { id: "i5", source: "task",   preview: "Hagry marked 'Hero refresh' In Review",         at: "2026-05-24T18:11:00Z", unread: false, fromId: "hagry" },
];

export const files = [
  { id: "f1", name: "Wasla — Brand Guidelines v3.pdf",    modified: "2d ago", ownerId: "hagry",  kind: "pdf" },
  { id: "f2", name: "Loop Commerce Launch Plan.gdoc",     modified: "1d ago", ownerId: "bassel", kind: "doc" },
  { id: "f3", name: "Q3 Forecast — EGP.gsheet",           modified: "4h ago", ownerId: "bassel", kind: "sheet" },
  { id: "f4", name: "Board deck — May 2026.pptx",         modified: "3d ago", ownerId: "bassel", kind: "slide" },
  { id: "f5", name: "Cairo Capital hero A.png",           modified: "5h ago", ownerId: "hagry",  kind: "image" },
  { id: "f6", name: "Cairo Capital hero B.png",           modified: "5h ago", ownerId: "hagry",  kind: "image" },
  { id: "f7", name: "Delta Pharma contract.pdf",          modified: "1w ago", ownerId: "usef",   kind: "pdf" },
  { id: "f8", name: "Onboarding playbook.gdoc",           modified: "2w ago", ownerId: "ali",    kind: "doc" },
];

// ---- Subscriptions (Org-level) ----
export type SubStatus = "Active" | "Cutover" | "Cancelled";
export interface Subscription {
  id: string;
  name: string;
  replacedBy: string;     // phase label
  status: SubStatus;
  cutoverDate?: string;
  monthly: number;        // EGP
}
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

// ---- Ventures KPI (Financial dashboard) ----
export interface Venture {
  id: string;
  name: string;
  status: "Active" | "Pilot" | "Paused";
  mrr: number;     // EGP
  metricLabel: string;
  metricValue: number;
  growthMoM: number;     // %
  source: string;
  spark: number[];       // 30 points
}
function spark(seed: number, n = 30): number[] {
  return Array.from({ length: n }, (_, i) => Math.round(50 + Math.sin((i + seed) / 3) * 18 + (i / 2) + seed));
}
export const ventures: Venture[] = [
  { id: "loop",       name: "Loop Commerce",                 status: "Active", mrr: 120_000, metricLabel: "Active users",  metricValue: 8_400, growthMoM: 18, source: "Loop Commerce Metrics / Summary!B2",   spark: spark(2) },
  { id: "layer",      name: "Layer Studios",                 status: "Active", mrr:  95_000, metricLabel: "Projects",      metricValue: 12,    growthMoM:  5, source: "Layer Studios Metrics / Summary!B2",   spark: spark(8) },
  { id: "studio-one", name: "Studio One",                    status: "Pilot",  mrr:  35_000, metricLabel: "Subscribers",   metricValue: 2_100, growthMoM: 24, source: "Studio One Metrics / Summary!B2",      spark: spark(5) },
  { id: "mirage",     name: "Mirage Media (Joint Venture)",  status: "Active", mrr:  60_000, metricLabel: "Campaigns",     metricValue: 7,     growthMoM:  9, source: "Mirage Media Metrics / Summary!B2",    spark: spark(11) },
];

// ---- Financial mocks ----
export const financialMetrics = {
  cash:   { value: 4_250_000, trend: "+6% MoM",      source: "Wasla Finance Master / Cash!B2"    },
  runway: { value: 14,        trend: "stable",       source: "Wasla Finance Master / Runway!B2"  },
  mrr:    { value: 380_000,   trend: "+12% MoM",     source: "Wasla Finance Master / Revenue!B2" },
  burn:   { value: 295_000,   trend: "-3% MoM",      source: "Wasla Finance Master / Burn!B2"    },
};

// Revenue by workspace, last 12 months (EGP, thousands shown directly)
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

// EGP formatter
export function egp(n: number): string {
  return `EGP ${new Intl.NumberFormat("en-US").format(n)}`;
}

// Daily activity for sparklines (tasks shipped per day, last 14 days)
export function dailyShipped(seed: number, n = 14): { d: number; v: number }[] {
  return Array.from({ length: n }, (_, i) => ({
    d: i,
    v: Math.max(0, Math.round(4 + Math.sin((i + seed) / 2) * 2 + ((i + seed) % 4))),
  }));
}


export function memberById(id: string) { return members.find(m => m.id === id) ?? members[0]; }
export function spaceById(id: string) { return spaces.find(s => s.id === id) ?? spaces[0]; }
export function taskById(id: string) { return tasks.find(t => t.id === id); }

export const pillarMeta: Record<Pillar, { label: string; color: string }> = {
  client:   { label: "Client Work",      color: "#3B82F6" },
  ventures: { label: "Wasla Ventures",   color: "#8B5CF6" },
  internal: { label: "Wasla Internal",   color: "#10B981" },
};

// Role simulation: which member each role views as
export const roleToUser: Record<Role, string> = {
  founder: "bassel",
  manager: "usef",
  member:  "hagry",
};

// Cairo-localized date formatter — "Mon, 25 May 2026"
export function formatCairoDate(d: Date | string = new Date()): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Cairo",
  }).format(date);
}
