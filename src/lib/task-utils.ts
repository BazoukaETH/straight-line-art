import { members, type Member, type Priority } from "./mock-data";

// ============ Natural-language parsing ============
export interface ParsedSmart {
  cleanTitle: string;
  assigneeId?: string;
  due?: Date;
  tags: string[];
  priority?: Priority;
  // raw matches for highlighting
  matches: { text: string; kind: "assignee" | "date" | "tag" | "priority"; start: number; end: number }[];
}

const PRIORITY_MAP: Record<string, Priority> = {
  urgent: "urgent", high: "high", normal: "normal", med: "normal", medium: "normal", low: "low",
};

function findMember(handle: string): Member | undefined {
  const q = handle.toLowerCase();
  return members.find((m) => m.id.startsWith(q) || m.name.toLowerCase().split(" ")[0].startsWith(q) || m.name.toLowerCase().replace(/\s/g, "").startsWith(q));
}

const MONTHS = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
const WEEKDAYS = ["sun","mon","tue","wed","thu","fri","sat"];

function parseDate(text: string): Date | undefined {
  const t = text.toLowerCase().trim();
  const now = new Date(); now.setHours(17, 0, 0, 0);
  if (t === "today") return now;
  if (t === "tomorrow" || t === "tmrw") { const d = new Date(now); d.setDate(d.getDate() + 1); return d; }
  if (t === "yesterday") { const d = new Date(now); d.setDate(d.getDate() - 1); return d; }
  // "in N days"
  const m1 = t.match(/^in\s+(\d+)\s+days?$/);
  if (m1) { const d = new Date(now); d.setDate(d.getDate() + parseInt(m1[1])); return d; }
  // "next monday"
  const m2 = t.match(/^next\s+(sun|mon|tue|wed|thu|fri|sat)/);
  if (m2) {
    const target = WEEKDAYS.indexOf(m2[1]);
    const d = new Date(now);
    const cur = d.getDay();
    let diff = (target - cur + 7) % 7;
    if (diff === 0) diff = 7;
    diff += 7;
    d.setDate(d.getDate() + diff);
    return d;
  }
  // bare weekday
  const wIdx = WEEKDAYS.findIndex((w) => t === w || t.startsWith(w));
  if (wIdx >= 0) {
    const d = new Date(now);
    const diff = (wIdx - d.getDay() + 7) % 7 || 7;
    d.setDate(d.getDate() + diff);
    return d;
  }
  // "may 28" / "28 may"
  const m3 = t.match(/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{1,2})$/);
  if (m3) { const d = new Date(now.getFullYear(), MONTHS.indexOf(m3[1]), parseInt(m3[2]), 17); return d; }
  const m4 = t.match(/^(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/);
  if (m4) { const d = new Date(now.getFullYear(), MONTHS.indexOf(m4[2]), parseInt(m4[1]), 17); return d; }
  return undefined;
}

const DATE_PHRASE_RE = /\b(today|tomorrow|tmrw|yesterday|in\s+\d+\s+days?|next\s+(?:sun|mon|tue|wed|thu|fri|sat)\w*|(?:sun|mon|tue|wed|thu|fri|sat)\w*|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}|\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*)\b/gi;

export function parseSmartInput(raw: string): ParsedSmart {
  const matches: ParsedSmart["matches"] = [];
  let title = raw;
  let assigneeId: string | undefined;
  let due: Date | undefined;
  let priority: Priority | undefined;
  const tags: string[] = [];

  // @mentions
  title = title.replace(/@(\w+)/g, (full, name, off: number) => {
    const m = findMember(name);
    if (m) {
      assigneeId = m.id;
      matches.push({ text: full, kind: "assignee", start: off, end: off + full.length });
      return "";
    }
    return full;
  });
  // #tags
  title = title.replace(/#(\w+)/g, (full, tag, off: number) => {
    tags.push(String(tag).toLowerCase());
    matches.push({ text: full, kind: "tag", start: off, end: off + full.length });
    return "";
  });
  // !priority
  title = title.replace(/!(urgent|high|normal|low|medium|med)\b/gi, (full, p, off: number) => {
    priority = PRIORITY_MAP[String(p).toLowerCase()];
    matches.push({ text: full, kind: "priority", start: off, end: off + full.length });
    return "";
  });
  // dates
  title = title.replace(DATE_PHRASE_RE, (full, _g, off: number) => {
    const parsed = parseDate(full);
    if (parsed) {
      due = parsed;
      matches.push({ text: full, kind: "date", start: off, end: off + full.length });
      return "";
    }
    return full;
  });
  return {
    cleanTitle: title.replace(/\s{2,}/g, " ").trim(),
    assigneeId, due, priority, tags, matches,
  };
}

// ============ Tree helpers ============
import type { Task } from "./mock-data";
export function getChildren(tasks: Task[], parentId: string | undefined): Task[] {
  return tasks.filter((t) => t.parentId === parentId);
}
export function getDescendantIds(tasks: Task[], id: string): string[] {
  const out: string[] = [];
  const queue = [id];
  while (queue.length) {
    const cur = queue.shift()!;
    for (const t of tasks) if (t.parentId === cur) { out.push(t.id); queue.push(t.id); }
  }
  return out;
}
export function getAncestors(tasks: Task[], id: string): Task[] {
  const out: Task[] = [];
  let cur = tasks.find((t) => t.id === id);
  while (cur?.parentId) {
    const p = tasks.find((t) => t.id === cur!.parentId);
    if (!p) break;
    out.unshift(p);
    cur = p;
  }
  return out;
}

// ============ Date helpers ============
export function relativeDue(iso: string): { label: string; tone: "overdue" | "today" | "soon" | "normal" } {
  const due = new Date(iso);
  const now = new Date();
  const diff = Math.round((due.getTime() - now.getTime()) / 86400000);
  if (diff < 0) return { label: `Overdue ${Math.abs(diff)}d`, tone: "overdue" };
  if (diff === 0) return { label: "Today", tone: "today" };
  if (diff === 1) return { label: "Tomorrow", tone: "soon" };
  if (diff < 7) return { label: due.toLocaleDateString("en-US", { weekday: "short" }), tone: "soon" };
  return { label: due.toLocaleDateString("en-US", { month: "short", day: "numeric" }), tone: "normal" };
}
