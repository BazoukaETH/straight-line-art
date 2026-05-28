import { useCallback, useEffect, useState } from "react";

export type RecentKind = "task" | "list" | "folder" | "space" | "channel";
export interface RecentItem {
  kind: RecentKind;
  id: string;
  label: string;
  parent?: string;
  href: string;
  at: number;
}

const KEY = "wasla.recents";
const MAX = 5;
type Listener = () => void;
const listeners = new Set<Listener>();

function read(): RecentItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function write(v: RecentItem[]) {
  localStorage.setItem(KEY, JSON.stringify(v));
  listeners.forEach((l) => l());
}

export function pushRecent(item: Omit<RecentItem, "at">) {
  const cur = read().filter((r) => !(r.kind === item.kind && r.id === item.id));
  const next = [{ ...item, at: Date.now() }, ...cur].slice(0, MAX);
  write(next);
}

export function useRecents() {
  const [items, setItems] = useState<RecentItem[]>(() => read());
  useEffect(() => {
    const l = () => setItems(read());
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  const clear = useCallback(() => write([]), []);
  return { recents: items, clear };
}
