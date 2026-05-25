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

export interface Space {
  id: string;
  name: string;
  pillar: Pillar;
  members: number;
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
  options?: string[];           // dropdown
  currency?: "EGP" | "USD";     // money
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
  spaceId: string;       // derived from list for back-compat
  listId: string;
  parentId?: string;     // recursive
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
  // legacy checklist (used by some screens)
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
  { id: "moaz",   name: "Moaz Sawy",        initials: "MS", color: "#3B82F6", role: "manager", title: "Development Lead",              pillar: "ventures", online: true },
  { id: "usef",   name: "Usef Shazly",      initials: "US", color: "#8B5CF6", role: "manager", title: "Digital & Design Lead",         pillar: "client",   online: true },
  { id: "ali",    name: "Ali Amir",         initials: "AA", color: "#EC4899", role: "manager", title: "Creative Lead",                 pillar: "client",   online: false },
  { id: "hagry",  name: "Mohamed Hagry",    initials: "MH", color: "#F59E0B", role: "member",  title: "UI / UX Designer",              pillar: "client",   online: true },
  { id: "osama",  name: "Osama Abbas",      initials: "OA", color: "#10B981", role: "member",  title: "E-Commerce & Digital Growth",   pillar: "ventures", online: true },
  { id: "saif",   name: "Saif Nosair",      initials: "SN", color: "#14B8A6", role: "member",  title: "Multimedia Designer",           pillar: "client",   online: false },
];

export const spaces: Space[] = [
  { id: "cairo-capital", name: "Cairo Capital",     pillar: "client",   members: 4 },
  { id: "nile-holdings", name: "Nile Holdings",     pillar: "client",   members: 3 },
  { id: "delta-pharma",  name: "Delta Pharma",      pillar: "client",   members: 3 },
  { id: "sahara-tech",   name: "Sahara Tech",       pillar: "client",   members: 4 },
  { id: "loop",          name: "Loop Commerce",     pillar: "ventures", members: 4 },
  { id: "layer",         name: "Layer Studios",     pillar: "ventures", members: 3 },
  { id: "studio-one",    name: "Studio One",        pillar: "ventures", members: 3 },
  { id: "mirage",        name: "Mirage Media",      pillar: "ventures", members: 2 },
  { id: "finance",       name: "Finance & Accounting", pillar: "internal", members: 2 },
  { id: "hr",            name: "HR & Talent",       pillar: "internal", members: 2 },
  { id: "ops",           name: "Operations",        pillar: "internal", members: 2 },
  { id: "brand",         name: "Brand & Marketing", pillar: "internal", members: 3 },
];

// ============ FOLDERS ============
export const folders: Folder[] = [
  { id: "f-cc-q3",     name: "Q3 Campaign",   spaceId: "cairo-capital" },
  { id: "f-cc-brand",  name: "Brand Refresh", spaceId: "cairo-capital" },
  { id: "f-loop-launch", name: "Launch Week", spaceId: "loop" },
];

// ============ LISTS ============
const ccConceptsCF: CustomField[] = [
  { id: "cf-approval", name: "Approval status", type: "dropdown", options: ["Draft", "Submitted", "Approved", "Rejected"] },
  { id: "cf-budget",   name: "Budget allocated", type: "money", currency: "EGP" },
];

export const lists: List[] = [
  // Cairo Capital — Q3 Campaign
  { id: "l-cc-discovery",  name: "Discovery",   spaceId: "cairo-capital", folderId: "f-cc-q3" },
  { id: "l-cc-design",     name: "Design",      spaceId: "cairo-capital", folderId: "f-cc-q3" },
  { id: "l-cc-dev",        name: "Development", spaceId: "cairo-capital", folderId: "f-cc-q3" },
  { id: "l-cc-launch",     name: "Launch",      spaceId: "cairo-capital", folderId: "f-cc-q3" },
  // Cairo Capital — Brand Refresh
  { id: "l-cc-research",   name: "Research",    spaceId: "cairo-capital", folderId: "f-cc-brand" },
  { id: "l-cc-concepts",   name: "Concepts",    spaceId: "cairo-capital", folderId: "f-cc-brand", customFields: ccConceptsCF },
  { id: "l-cc-final",      name: "Final",       spaceId: "cairo-capital", folderId: "f-cc-brand" },
  // Cairo Capital — direct under space
  { id: "l-cc-retainer",   name: "Ongoing Retainer", spaceId: "cairo-capital" },
  { id: "l-cc-inbox",      name: "Inbox",       spaceId: "cairo-capital" },
  // Other spaces — one default list each
  { id: "l-nile-default",  name: "Tasks",       spaceId: "nile-holdings" },
  { id: "l-delta-default", name: "Tasks",       spaceId: "delta-pharma" },
  { id: "l-sahara-default",name: "Tasks",       spaceId: "sahara-tech" },
  { id: "l-loop-launch-mkt",  name: "Marketing", spaceId: "loop", folderId: "f-loop-launch" },
  { id: "l-loop-launch-eng",  name: "Engineering", spaceId: "loop", folderId: "f-loop-launch" },
  { id: "l-loop-ongoing",  name: "Ongoing",     spaceId: "loop" },
  { id: "l-layer-default", name: "Tasks",       spaceId: "layer" },
  { id: "l-studio-default",name: "Tasks",       spaceId: "studio-one" },
  { id: "l-mirage-default",name: "Tasks",       spaceId: "mirage" },
  { id: "l-finance-default",name: "Tasks",      spaceId: "finance" },
  { id: "l-hr-default",    name: "Tasks",       spaceId: "hr" },
  { id: "l-ops-default",   name: "Tasks",       spaceId: "ops" },
  { id: "l-brand-default", name: "Tasks",       spaceId: "brand" },
];

const STATUSES: Status[] = ["Backlog", "To Do", "In Progress", "In Review", "Blocked", "Done"];
const PRIORITIES: Priority[] = ["urgent", "high", "normal", "normal", "normal", "low"];

function pick<T>(arr: T[], i: number) { return arr[i % arr.length]; }
function dueOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

// Hand-curated tasks across the new structure
type Seed = { id?: string; title: string; listId: string; assigneeId: string; status?: Status; priority?: Priority; due?: number; parentId?: string; tags?: string[] };
const SEEDS: Seed[] = [
  // Cairo Capital > Q3 Campaign > Discovery
  { title: "Stakeholder interviews — Cairo Capital execs", listId: "l-cc-discovery", assigneeId: "usef", status: "In Progress", priority: "high", due: 2 },
  { title: "Audit current site analytics",               listId: "l-cc-discovery", assigneeId: "osama", status: "Done", priority: "normal", due: -7 },
  { title: "Competitor landscape — boutique investors",  listId: "l-cc-discovery", assigneeId: "ali",  status: "To Do",    priority: "normal", due: 5 },
  { title: "Brief: Q3 Campaign positioning",             listId: "l-cc-discovery", assigneeId: "usef", status: "In Review", priority: "high", due: 1 },

  // Cairo Capital > Q3 Campaign > Design — has subtask depth
  { title: "Design landing hero v2",                     listId: "l-cc-design", assigneeId: "hagry", status: "In Progress", priority: "urgent", due: 1, id: "T-CD-HERO" },
  {   title: "Collect references",                        listId: "l-cc-design", assigneeId: "hagry", status: "Done",      priority: "normal", due: -3, parentId: "T-CD-HERO" },
  {   title: "Draft hero option A",                       listId: "l-cc-design", assigneeId: "hagry", status: "In Progress", priority: "high", due: 0, parentId: "T-CD-HERO", id: "T-CD-HERO-A" },
  {     title: "Type-lockup exploration",                 listId: "l-cc-design", assigneeId: "hagry", status: "In Progress", priority: "normal", due: 0, parentId: "T-CD-HERO-A" },
  {     title: "Color study (navy/cream)",                listId: "l-cc-design", assigneeId: "saif",  status: "To Do",      priority: "low", due: 1, parentId: "T-CD-HERO-A" },
  {   title: "Draft hero option B",                       listId: "l-cc-design", assigneeId: "saif",  status: "To Do",       priority: "normal", due: 2, parentId: "T-CD-HERO" },
  {   title: "Founder review",                            listId: "l-cc-design", assigneeId: "bassel", status: "To Do",      priority: "high", due: 3, parentId: "T-CD-HERO" },

  { title: "Mobile breakpoints pass",                    listId: "l-cc-design", assigneeId: "hagry", status: "Backlog", priority: "normal", due: 6 },
  { title: "Iconography refresh",                        listId: "l-cc-design", assigneeId: "ali",   status: "To Do",   priority: "low",    due: 8 },
  { title: "Pitch deck templates",                       listId: "l-cc-design", assigneeId: "saif",  status: "Blocked", priority: "high",   due: -1 },

  // Cairo Capital > Q3 Campaign > Development
  { title: "Set up Next.js project",                     listId: "l-cc-dev", assigneeId: "moaz",  status: "Done",        priority: "normal", due: -5, id: "T-CD-DEV1" },
  { title: "Implement hero component",                   listId: "l-cc-dev", assigneeId: "moaz",  status: "Blocked",     priority: "high",   due: 2, id: "T-CD-DEV2" },
  { title: "Wire CMS for case studies",                  listId: "l-cc-dev", assigneeId: "moaz",  status: "To Do",       priority: "normal", due: 4 },
  { title: "Analytics + SEO baseline",                   listId: "l-cc-dev", assigneeId: "osama", status: "To Do",       priority: "normal", due: 6 },

  // Cairo Capital > Q3 Campaign > Launch
  { title: "Press kit prep",                             listId: "l-cc-launch", assigneeId: "ali",   status: "Backlog",  priority: "normal", due: 12, id: "T-CD-LAUNCH1" },
  { title: "Schedule LinkedIn rollout",                  listId: "l-cc-launch", assigneeId: "osama", status: "Backlog",  priority: "normal", due: 14 },
  { title: "Founder announcement video",                 listId: "l-cc-launch", assigneeId: "saif",  status: "Backlog",  priority: "high",   due: 10 },

  // Cairo Capital > Brand Refresh > Research
  { title: "Brand audit — existing assets",              listId: "l-cc-research", assigneeId: "ali",   status: "Done",     priority: "normal", due: -10 },
  { title: "Stakeholder brand survey",                   listId: "l-cc-research", assigneeId: "usef",  status: "Done",     priority: "normal", due: -8 },

  // Cairo Capital > Brand Refresh > Concepts (custom fields list)
  { title: "Concept A — Heritage",                       listId: "l-cc-concepts", assigneeId: "ali",   status: "In Review", priority: "high", due: 2 },
  { title: "Concept B — Modern Navy",                    listId: "l-cc-concepts", assigneeId: "hagry", status: "In Progress", priority: "high", due: 3 },
  { title: "Concept C — Cairo Skyline",                  listId: "l-cc-concepts", assigneeId: "saif",  status: "To Do",       priority: "normal", due: 5 },

  // Cairo Capital > Brand Refresh > Final
  { title: "Final logo lockups",                         listId: "l-cc-final", assigneeId: "hagry", status: "Backlog", priority: "high", due: 18 },

  // Cairo Capital > Ongoing Retainer
  { title: "Weekly status note",                         listId: "l-cc-retainer", assigneeId: "usef",  status: "In Progress", priority: "normal", due: 0 },
  { title: "Monthly performance report",                 listId: "l-cc-retainer", assigneeId: "osama", status: "To Do",        priority: "normal", due: 4 },
  { title: "Quarterly portfolio review prep",            listId: "l-cc-retainer", assigneeId: "bassel", status: "To Do",       priority: "high",   due: 9 },

  // Cairo Capital > Inbox
  { title: "Triage incoming client email — pricing",     listId: "l-cc-inbox",    assigneeId: "usef",  status: "To Do",   priority: "normal", due: 0 },

  // Loop Commerce > Launch Week > Marketing
  { title: "Marketing site copy v2",                     listId: "l-loop-launch-mkt", assigneeId: "osama", status: "In Progress", priority: "urgent", due: 1, id: "T-LP-COPY" },
  {   title: "Hero headline options",                     listId: "l-loop-launch-mkt", assigneeId: "osama", status: "Done", priority: "high", due: -1, parentId: "T-LP-COPY" },
  {   title: "Feature section rewrite",                   listId: "l-loop-launch-mkt", assigneeId: "osama", status: "In Progress", priority: "high", due: 0, parentId: "T-LP-COPY" },
  { title: "Launch teaser video",                        listId: "l-loop-launch-mkt", assigneeId: "saif",  status: "In Review", priority: "high", due: 2 },
  { title: "LinkedIn + Twitter schedule",                listId: "l-loop-launch-mkt", assigneeId: "osama", status: "To Do", priority: "normal", due: 3 },
  { title: "Press outreach list",                        listId: "l-loop-launch-mkt", assigneeId: "ali",   status: "To Do", priority: "normal", due: 4 },

  // Loop Commerce > Launch Week > Engineering
  { title: "Deploy v2 to staging",                       listId: "l-loop-launch-eng", assigneeId: "moaz", status: "In Progress", priority: "urgent", due: 0, id: "T-LP-DEPLOY" },
  { title: "Set up cohort analytics",                    listId: "l-loop-launch-eng", assigneeId: "moaz", status: "To Do",       priority: "high",   due: 2 },
  { title: "Fix iOS auth redirect",                      listId: "l-loop-launch-eng", assigneeId: "moaz", status: "Blocked",     priority: "urgent", due: -1 },
  { title: "Load test checkout",                         listId: "l-loop-launch-eng", assigneeId: "moaz", status: "To Do",       priority: "high",   due: 3 },

  // Loop Commerce > Ongoing
  { title: "Weekly product sync notes",                  listId: "l-loop-ongoing", assigneeId: "bassel", status: "Done",     priority: "normal", due: -2 },
  { title: "Plan v3 roadmap",                            listId: "l-loop-ongoing", assigneeId: "bassel", status: "Backlog",  priority: "normal", due: 20 },

  // Other client spaces
  { title: "Nile Holdings — quarterly creative refresh", listId: "l-nile-default", assigneeId: "ali",  status: "In Progress", priority: "normal", due: 6 },
  { title: "Nile Holdings — review investor deck",       listId: "l-nile-default", assigneeId: "bassel", status: "To Do",     priority: "high",   due: 3 },
  { title: "Delta Pharma — pricing table redesign",      listId: "l-delta-default", assigneeId: "hagry", status: "In Review", priority: "normal", due: 1 },
  { title: "Delta Pharma — legal NDA review",            listId: "l-delta-default", assigneeId: "usef",  status: "Blocked",   priority: "high",   due: -2 },
  { title: "Sahara Tech — brand kit handoff",            listId: "l-sahara-default", assigneeId: "ali",  status: "Done",      priority: "normal", due: -4 },
  { title: "Sahara Tech — QA mobile bottom tabs",        listId: "l-sahara-default", assigneeId: "moaz", status: "To Do",     priority: "high",   due: 5 },

  // Ventures
  { title: "Layer Studios — Q3 roadmap review",          listId: "l-layer-default", assigneeId: "bassel", status: "In Progress", priority: "normal", due: 2 },
  { title: "Layer Studios — 1:1 cadence",                listId: "l-layer-default", assigneeId: "moaz",   status: "To Do",       priority: "low",    due: 7 },
  { title: "Studio One — launch teaser cut",             listId: "l-studio-default",assigneeId: "saif",   status: "In Progress", priority: "high",   due: 3 },
  { title: "Studio One — beta invite list",              listId: "l-studio-default",assigneeId: "osama",  status: "To Do",       priority: "normal", due: 6 },
  { title: "Mirage Media — Q3 campaign brief",           listId: "l-mirage-default",assigneeId: "ali",    status: "To Do",       priority: "normal", due: 4 },

  // Internal
  { title: "Reconcile Stripe payouts — April",           listId: "l-finance-default", assigneeId: "bassel", status: "In Review", priority: "high", due: 1 },
  { title: "Renew SaaS contracts — May",                 listId: "l-finance-default", assigneeId: "bassel", status: "To Do",     priority: "normal", due: 6 },
  { title: "April invoice batch review (EGP)",           listId: "l-finance-default", assigneeId: "usef",   status: "In Progress", priority: "high", due: 0 },
  { title: "Hiring sync with recruiters",                listId: "l-hr-default", assigneeId: "bassel", status: "To Do",       priority: "normal", due: 2 },
  { title: "UI designer portfolio shortlist",            listId: "l-hr-default", assigneeId: "ali",    status: "In Review",   priority: "normal", due: 3 },
  { title: "Audit Drive folder permissions",             listId: "l-ops-default", assigneeId: "osama", status: "To Do",       priority: "low",    due: 5 },
  { title: "Wire Slack into Drive notifications",        listId: "l-ops-default", assigneeId: "moaz",  status: "Backlog",     priority: "low",    due: 14 },
  { title: "Publish updated Wasla brand guidelines",     listId: "l-brand-default", assigneeId: "hagry", status: "In Progress", priority: "high", due: 2 },
  { title: "Blog: the founder operating system",         listId: "l-brand-default", assigneeId: "usef",  status: "To Do",       priority: "normal", due: 7 },
  { title: "Send Thursday founder digest",               listId: "l-brand-default", assigneeId: "bassel", status: "To Do",      priority: "normal", due: 3 },
];

// Build tasks with derived fields
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
    description:
      "Tighten composition, push the CTA priority, and align with the Wasla brand refresh. Coordinate with design on copy length and ensure mobile breakpoints feel calm.",
    comments: i % 4 === 0 ? [
      { id: `c-${i}-1`, authorId: "moaz",   body: "Looks good — can we push the CTA up?", at: "2026-05-24T10:12:00Z" },
      { id: `c-${i}-2`, authorId: "hagry",  body: "Adding the new tagline now.",          at: "2026-05-24T11:03:00Z" },
      { id: `c-${i}-3`, authorId: "bassel", body: "Love the direction. Ship by Thursday.", at: "2026-05-24T14:45:00Z" },
    ] : [],
    watchers: i % 3 === 0 ? ["bassel", "moaz"] : ["bassel"],
    tags: s.tags ?? (i % 5 === 0 ? ["launch"] : i % 5 === 1 ? ["design"] : i % 5 === 2 ? ["urgent"] : []),
    attachments: [],
    dependencies: { blocks: [], blockedBy: [] },
    customFieldValues: {},
    createdAt: dueOffset(-30 + (i % 30)),
  };
});

// Wire dependencies
function addDep(blocker: string, blocked: string) {
  const a = tasks.find((t) => t.id === blocker);
  const b = tasks.find((t) => t.id === blocked);
  if (!a || !b) return;
  a.dependencies = a.dependencies ?? { blocks: [], blockedBy: [] };
  b.dependencies = b.dependencies ?? { blocks: [], blockedBy: [] };
  a.dependencies.blocks.push(blocked);
  b.dependencies.blockedBy.push(blocker);
}
addDep("T-CD-HERO", "T-CD-DEV2");        // hero blocks dev hero impl
addDep("T-CD-DEV1", "T-CD-DEV2");        // setup blocks impl
addDep("T-CD-HERO", "T-CD-LAUNCH1");     // hero blocks press kit
addDep("T-LP-COPY", "T-LP-DEPLOY");      // copy blocks deploy
addDep("T-CD-HERO-A", "T-CD-HERO");      // option A blocks parent decision (illustrative)

// Wire some custom field values for Concepts list
tasks.filter((t) => t.listId === "l-cc-concepts").forEach((t, i) => {
  t.customFieldValues = {
    "cf-approval": ["Draft", "Submitted", "Approved"][i] ?? "Draft",
    "cf-budget":   [25000, 40000, 18000][i] ?? 20000,
  };
});

// ============ TEMPLATES ============
export const taskTemplates: TaskTemplate[] = [
  {
    id: "tpl-onboard",
    name: "New client onboarding",
    description: "Standard checklist for spinning up a new client engagement.",
    subtasks: ["Kickoff call", "Signed SOW", "Drive folder setup", "Add to CRM"],
    tags: ["onboarding"],
  },
  {
    id: "tpl-campaign",
    name: "Marketing campaign brief",
    description: "Use for any new campaign across Wasla Ventures.",
    subtasks: ["Goals", "Audience", "Channels", "KPIs", "Timeline"],
    tags: ["marketing"],
  },
  {
    id: "tpl-bug",
    name: "Bug report",
    description: "Standard template for engineering bug intake.",
    fields: [
      { label: "Steps to reproduce", placeholder: "1. … 2. …" },
      { label: "Expected",           placeholder: "What should happen?" },
      { label: "Actual",             placeholder: "What actually happens?" },
    ],
    tags: ["bug"],
  },
];

// ============ CHANNELS / MESSAGES ============
export interface Channel { id: string; name: string; pillar: Pillar; unread?: number }
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
    { id: "m5", authorId: "usef",   body: "Linking the launch task here:", at: "2026-05-25T08:25:00Z", kind: "task", taskId: tasks[0].id },
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

export interface InboxItem { id: string; source: "chat" | "task" | "system"; preview: string; at: string; unread: boolean; fromId?: string }
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

export interface Venture { id: string; name: string; status: "Active" | "Pilot" | "Paused"; mrr: number; metricLabel: string; metricValue: number; growthMoM: number; source: string; spark: number[] }
function spark(seed: number, n = 30): number[] {
  return Array.from({ length: n }, (_, i) => Math.round(50 + Math.sin((i + seed) / 3) * 18 + (i / 2) + seed));
}
export const ventures: Venture[] = [
  { id: "loop",       name: "Loop Commerce",                 status: "Active", mrr: 120_000, metricLabel: "Active users",  metricValue: 8_400, growthMoM: 18, source: "Loop Commerce Metrics / Summary!B2",   spark: spark(2) },
  { id: "layer",      name: "Layer Studios",                 status: "Active", mrr:  95_000, metricLabel: "Projects",      metricValue: 12,    growthMoM:  5, source: "Layer Studios Metrics / Summary!B2",   spark: spark(8) },
  { id: "studio-one", name: "Studio One",                    status: "Pilot",  mrr:  35_000, metricLabel: "Subscribers",   metricValue: 2_100, growthMoM: 24, source: "Studio One Metrics / Summary!B2",      spark: spark(5) },
  { id: "mirage",     name: "Mirage Media (Joint Venture)",  status: "Active", mrr:  60_000, metricLabel: "Campaigns",     metricValue: 7,     growthMoM:  9, source: "Mirage Media Metrics / Summary!B2",    spark: spark(11) },
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

export const pillarMeta: Record<Pillar, { label: string; color: string }> = {
  client:   { label: "Client Work",      color: "#3B82F6" },
  ventures: { label: "Wasla Ventures",   color: "#8B5CF6" },
  internal: { label: "Wasla Internal",   color: "#10B981" },
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
