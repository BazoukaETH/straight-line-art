export type Role = "founder" | "manager" | "member";
export type Pillar = "client" | "ventures" | "internal";
export type Status = "Backlog" | "To Do" | "In Progress" | "In Review" | "Blocked" | "Done";
export type Priority = "urgent" | "high" | "normal" | "low";

export interface Member {
  id: string;
  name: string;
  initials: string;
  role: Role;
  title: string;
  pillar: Pillar;
  online?: boolean;
}

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
  due: string; // ISO
  description?: string;
  subtasks?: { id: string; title: string; done: boolean }[];
  comments?: { id: string; authorId: string; body: string; at: string }[];
  watchers?: string[];
  tags?: string[];
}

export interface BodEod {
  id: string;
  memberId: string;
  date: string; // YYYY-MM-DD
  bod?: { ship: string; blockers?: string };
  eod?: { shipped: string; blockedTomorrow?: string };
}

export const members: Member[] = [
  { id: "bassel", name: "Bassel Hatoum", initials: "BH", role: "founder", title: "Founder & CEO", pillar: "ventures", online: true },
  { id: "moaz", name: "Moaz Tarek", initials: "MT", role: "manager", title: "Head of Engineering", pillar: "ventures", online: true },
  { id: "lina", name: "Lina Khoury", initials: "LK", role: "manager", title: "Client Lead", pillar: "client", online: true },
  { id: "omar", name: "Omar Saleh", initials: "OS", role: "member", title: "Designer", pillar: "client" },
  { id: "yara", name: "Yara Mansour", initials: "YM", role: "member", title: "Marketing", pillar: "ventures", online: true },
  { id: "tarek", name: "Tarek Hadid", initials: "TH", role: "member", title: "Finance Ops", pillar: "internal" },
  { id: "noor", name: "Noor Abbas", initials: "NA", role: "member", title: "People Ops", pillar: "internal", online: true },
];

export const spaces: Space[] = [
  { id: "acme", name: "Acme", pillar: "client", members: 4 },
  { id: "globex", name: "Globex", pillar: "client", members: 3 },
  { id: "vx", name: "Venture X", pillar: "ventures", members: 5 },
  { id: "vy", name: "Venture Y", pillar: "ventures", members: 3 },
  { id: "finance", name: "Finance", pillar: "internal", members: 2 },
  { id: "hr", name: "HR", pillar: "internal", members: 2 },
];

const STATUSES: Status[] = ["Backlog", "To Do", "In Progress", "In Review", "Blocked", "Done"];
const PRIORITIES: Priority[] = ["urgent", "high", "normal", "normal", "normal", "low"];
const SAMPLE_TITLES = [
  "Ship landing page hero refresh",
  "Review Q3 invoice batch",
  "Draft onboarding playbook v2",
  "Design pricing comparison table",
  "Fix auth redirect bug on iOS",
  "Prepare board deck for May meeting",
  "Coordinate Acme launch creative",
  "Write blog post: founder operating system",
  "Schedule 1:1s for Venture Y squad",
  "Reconcile Stripe payouts April",
  "Edit voiceover for Venture X teaser",
  "Refactor task slide-over component",
  "Publish updated brand guidelines",
  "Run hiring sync with recruiters",
  "Audit Drive folder permissions",
  "Plan Globex weekly status note",
  "Set up cohort analytics dashboard",
  "Send Thursday founder digest",
  "Renew SaaS contracts for May",
  "Review designer portfolios shortlist",
  "Sync with legal on NDA template",
  "Compile EOD silence report",
  "Draft Q3 OKRs for Wasla Internal",
  "Add Slack to Drive notifications",
  "Test mobile bottom tab bar",
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
      "Tighten the hero composition, push the CTA priority, and align with the brand refresh. Coordinate with design on copy length and ensure mobile breakpoints feel calm.",
    subtasks: [
      { id: `${i}-1`, title: "Collect references", done: true },
      { id: `${i}-2`, title: "Draft v1", done: i % 3 === 0 },
      { id: `${i}-3`, title: "Review with team", done: false },
    ],
    comments: [
      { id: "c1", authorId: "moaz", body: "Looks good — can we push the CTA up?", at: "2026-05-24T10:12:00Z" },
      { id: "c2", authorId: "yara", body: "Adding the new tagline now.", at: "2026-05-24T11:03:00Z" },
      { id: "c3", authorId: "bassel", body: "Love the direction. Ship by Friday.", at: "2026-05-24T14:45:00Z" },
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
  { id: "client-acme", name: "client-acme", pillar: "client", unread: 2 },
  { id: "client-globex", name: "client-globex", pillar: "client" },
  { id: "venture-x", name: "venture-x", pillar: "ventures", unread: 5 },
  { id: "venture-x-marketing", name: "venture-x-marketing", pillar: "ventures" },
  { id: "internal-finance", name: "internal-finance", pillar: "internal" },
  { id: "internal-hr", name: "internal-hr", pillar: "internal" },
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
  "venture-x": [
    { id: "m1", authorId: "bassel", body: "Morning team — kicking off launch week. BODs in please.", at: "2026-05-25T08:02:00Z" },
    { id: "m2", authorId: "yara", body: "On it. Pushing the marketing site copy by 11.", at: "2026-05-25T08:04:00Z", reactions: [{ emoji: "🔥", count: 3 }] },
    { id: "m3", authorId: "moaz", body: "Voice note", at: "2026-05-25T08:10:00Z", kind: "voice" },
    { id: "m4", authorId: "omar", body: "Hero option B mock attached.", at: "2026-05-25T08:21:00Z", kind: "image" },
    { id: "m5", authorId: "lina", body: "Linking the launch task here:", at: "2026-05-25T08:25:00Z", kind: "task", taskId: "T-1000" },
    { id: "m6", authorId: "yara", body: "@bassel quick approval on tagline?", at: "2026-05-25T08:40:00Z", replies: 3 },
    { id: "m7", authorId: "bassel", body: "Approved. Ship it.", at: "2026-05-25T08:44:00Z", reactions: [{ emoji: "✅", count: 4 }] },
    { id: "m8", authorId: "moaz", body: "Deploying to staging in 10.", at: "2026-05-25T08:55:00Z" },
  ],
  "client-acme": [
    { id: "a1", authorId: "lina", body: "Acme weekly sync notes in Drive.", at: "2026-05-25T09:00:00Z" },
    { id: "a2", authorId: "omar", body: "Updated the brand deck.", at: "2026-05-25T09:14:00Z", reactions: [{ emoji: "👏", count: 2 }] },
  ],
};

// BOD / EOD seed (last 14 days)
function dayStr(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
}

export const bodEod: BodEod[] = (() => {
  const out: BodEod[] = [];
  for (const m of members) {
    for (let d = 0; d < 14; d++) {
      // deliberately skip a few days for some people
      const skip = (m.id === "tarek" && d % 4 === 0) || (m.id === "omar" && d === 2);
      if (skip) continue;
      out.push({
        id: `${m.id}-${d}`,
        memberId: m.id,
        date: dayStr(d),
        bod: { ship: "Ship marketing site updates and review Q3 invoices.", blockers: d % 5 === 0 ? "Waiting on legal review" : "" },
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
  { id: "i1", source: "chat", preview: "@bassel quick approval on tagline?", at: "2026-05-25T08:40:00Z", unread: true, fromId: "yara" },
  { id: "i2", source: "task", preview: "Moaz assigned you ‘Review board deck’", at: "2026-05-25T08:30:00Z", unread: true, fromId: "moaz" },
  { id: "i3", source: "system", preview: "Tarek hasn’t submitted BOD today", at: "2026-05-25T09:05:00Z", unread: true },
  { id: "i4", source: "chat", preview: "Lina: notes in Drive folder", at: "2026-05-25T07:55:00Z", unread: false, fromId: "lina" },
  { id: "i5", source: "task", preview: "Yara marked ‘Hero refresh’ In Review", at: "2026-05-24T18:11:00Z", unread: false, fromId: "yara" },
];

export const files = [
  { id: "f1", name: "Wasla — Brand Guidelines v3.pdf", modified: "2d ago", ownerId: "omar", kind: "pdf" },
  { id: "f2", name: "Venture X Launch Plan.gdoc", modified: "1d ago", ownerId: "bassel", kind: "doc" },
  { id: "f3", name: "Q3 Forecast.gsheet", modified: "4h ago", ownerId: "tarek", kind: "sheet" },
  { id: "f4", name: "Board deck — May.pptx", modified: "3d ago", ownerId: "bassel", kind: "slide" },
  { id: "f5", name: "Hero option A.png", modified: "5h ago", ownerId: "omar", kind: "image" },
  { id: "f6", name: "Hero option B.png", modified: "5h ago", ownerId: "omar", kind: "image" },
  { id: "f7", name: "Acme contract.pdf", modified: "1w ago", ownerId: "lina", kind: "pdf" },
  { id: "f8", name: "Onboarding playbook.gdoc", modified: "2w ago", ownerId: "noor", kind: "doc" },
];

export function memberById(id: string) { return members.find(m => m.id === id)!; }
export function spaceById(id: string) { return spaces.find(s => s.id === id)!; }
export function taskById(id: string) { return tasks.find(t => t.id === id); }

export const pillarMeta: Record<Pillar, { label: string; color: string; tokenVar: string }> = {
  client: { label: "Client Work", color: "var(--pillar-client)", tokenVar: "pillar-client" },
  ventures: { label: "Wasla Ventures", color: "var(--pillar-ventures)", tokenVar: "pillar-ventures" },
  internal: { label: "Wasla Internal", color: "var(--pillar-internal)", tokenVar: "pillar-internal" },
};
