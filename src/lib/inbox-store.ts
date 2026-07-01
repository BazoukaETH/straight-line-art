import { useEffect, useState } from "react";

const LS_INBOX = "wasla.inbox.state";
const EVENT = "wasla.inbox.changed";

export type InboxItemState = { read?: boolean; done?: boolean };
export type InboxStateMap = Record<string, InboxItemState>;

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export function readInboxState(): InboxStateMap {
  if (typeof window === "undefined") return {};
  return safeParse<InboxStateMap>(localStorage.getItem(LS_INBOX), {});
}

function writeInboxState(map: InboxStateMap) {
  localStorage.setItem(LS_INBOX, JSON.stringify(map));
  window.dispatchEvent(new Event(EVENT));
}

export function markRead(id: string) {
  const m = readInboxState();
  m[id] = { ...m[id], read: true };
  writeInboxState(m);
}

export function markAllRead(ids: string[]) {
  const m = readInboxState();
  for (const id of ids) m[id] = { ...m[id], read: true };
  writeInboxState(m);
}

export function markDone(id: string) {
  const m = readInboxState();
  m[id] = { ...m[id], read: true, done: true };
  writeInboxState(m);
}

export function useInboxStorage() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    window.addEventListener("storage", bump);
    window.addEventListener(EVENT, bump);
    return () => {
      window.removeEventListener("storage", bump);
      window.removeEventListener(EVENT, bump);
    };
  }, []);
  return tick;
}
