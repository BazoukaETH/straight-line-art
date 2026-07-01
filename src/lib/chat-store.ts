import type { Message } from "./mock-data";

const LS_PROMOTED = "wasla.chat.promoted";
const LS_DISCUSSED = "wasla.tasks.discussedIn";
const LS_EXTRAS = "wasla.chat.extras";
const LS_CHSETTINGS = "wasla.chat.channelSettings";
const LS_THREAD_READ = "wasla.chat.threadRead";

export type PromotedMap = Record<string, { taskId: string; taskTitle: string }>;
export type DiscussedMap = Record<string, { channelId: string; messageId: string; at: string }[]>;
export type ExtrasMap = Record<string, Message[]>;
export type ChannelSettingsMap = Record<string, { postTaskUpdates?: boolean }>;

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export function readPromoted(): PromotedMap {
  if (typeof window === "undefined") return {};
  return safeParse<PromotedMap>(localStorage.getItem(LS_PROMOTED), {});
}
export function writePromoted(map: PromotedMap) {
  localStorage.setItem(LS_PROMOTED, JSON.stringify(map));
  window.dispatchEvent(new Event("wasla.chat.changed"));
}
export function setPromoted(messageId: string, taskId: string, taskTitle: string) {
  const m = readPromoted();
  m[messageId] = { taskId, taskTitle };
  writePromoted(m);
}

export function readDiscussed(): DiscussedMap {
  if (typeof window === "undefined") return {};
  return safeParse<DiscussedMap>(localStorage.getItem(LS_DISCUSSED), {});
}
export function writeDiscussed(map: DiscussedMap) {
  localStorage.setItem(LS_DISCUSSED, JSON.stringify(map));
  window.dispatchEvent(new Event("wasla.chat.changed"));
}
export function addDiscussed(taskId: string, channelId: string, messageId: string) {
  const m = readDiscussed();
  const list = m[taskId] ?? [];
  list.push({ channelId, messageId, at: new Date().toISOString() });
  m[taskId] = list;
  writeDiscussed(m);
}

export function readExtras(channelId: string): Message[] {
  if (typeof window === "undefined") return [];
  const m = safeParse<ExtrasMap>(localStorage.getItem(LS_EXTRAS), {});
  return m[channelId] ?? [];
}
export function pushExtra(channelId: string, msg: Message) {
  const all = safeParse<ExtrasMap>(localStorage.getItem(LS_EXTRAS), {});
  all[channelId] = [...(all[channelId] ?? []), msg];
  localStorage.setItem(LS_EXTRAS, JSON.stringify(all));
  window.dispatchEvent(new Event("wasla.chat.changed"));
}

export function readChannelSettings(): ChannelSettingsMap {
  if (typeof window === "undefined") return {};
  return safeParse<ChannelSettingsMap>(localStorage.getItem(LS_CHSETTINGS), {});
}
export function writeChannelSetting(channelId: string, patch: Partial<{ postTaskUpdates: boolean }>) {
  const all = readChannelSettings();
  all[channelId] = { ...all[channelId], ...patch };
  localStorage.setItem(LS_CHSETTINGS, JSON.stringify(all));
  window.dispatchEvent(new Event("wasla.chat.changed"));
}

const SEED_DISCUSSED: DiscussedMap = {
  "T-SMG-COMP":  [{ channelId: "client-smg",        messageId: "m2", at: "2026-05-25T08:11:00Z" }],
  "T-TOUR-ACCOM":[{ channelId: "ventures-tourism",  messageId: "t1", at: "2026-05-25T09:00:00Z" }],
};

export function seedDiscussedOnce() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(LS_DISCUSSED)) {
    localStorage.setItem(LS_DISCUSSED, JSON.stringify(SEED_DISCUSSED));
  }
}

export type ThreadReadMap = Record<string, string>; // parentMessageId -> ISO lastReadAt
export function readThreadRead(): ThreadReadMap {
  if (typeof window === "undefined") return {};
  return safeParse<ThreadReadMap>(localStorage.getItem(LS_THREAD_READ), {});
}
export function markThreadRead(parentMessageId: string) {
  const m = readThreadRead();
  m[parentMessageId] = new Date().toISOString();
  localStorage.setItem(LS_THREAD_READ, JSON.stringify(m));
  window.dispatchEvent(new Event("wasla.chat.changed"));
}
