import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { bodEod } from "./mock-data";

export type CheckinPhase = "bod" | "eod";

export interface CheckinEntry {
  id: string;
  memberId: string;
  date: string; // YYYY-MM-DD
  phase: CheckinPhase;
  text: string;
  blockers: string;
}

interface CheckinsCtx {
  entries: CheckinEntry[];
  submitCheckin: (entry: Omit<CheckinEntry, "id"> & { id?: string }) => CheckinEntry;
  updateCheckin: (id: string, patch: Partial<CheckinEntry>) => void;
  getCheckin: (memberId: string, date: string, phase: CheckinPhase) => CheckinEntry | undefined;
}

const STORAGE_KEY = "wasla.checkins";

function seedFromBodEod(): CheckinEntry[] {
  const out: CheckinEntry[] = [];
  for (const b of bodEod) {
    if (b.bod) {
      out.push({
        id: `${b.id}-bod`,
        memberId: b.memberId,
        date: b.date,
        phase: "bod",
        text: b.bod.ship,
        blockers: b.bod.blockers ?? "",
      });
    }
    if (b.eod) {
      out.push({
        id: `${b.id}-eod`,
        memberId: b.memberId,
        date: b.date,
        phase: "eod",
        text: b.eod.shipped,
        blockers: b.eod.blockedTomorrow ?? "",
      });
    }
  }
  return out;
}

const Ctx = createContext<CheckinsCtx | null>(null);

let nextId = 1;
const genId = () => `chk-${Date.now()}-${++nextId}`;

export function CheckinsProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<CheckinEntry[]>(() => seedFromBodEod());
  const [hydrated, setHydrated] = useState(false);

  // Rehydrate from localStorage on client
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CheckinEntry[];
        if (Array.isArray(parsed)) setEntries(parsed);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // Persist
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      /* ignore */
    }
  }, [entries, hydrated]);

  const submitCheckin = useCallback((input: Omit<CheckinEntry, "id"> & { id?: string }): CheckinEntry => {
    const existing = entries.find(
      (e) => e.memberId === input.memberId && e.date === input.date && e.phase === input.phase,
    );
    if (existing) {
      const updated: CheckinEntry = { ...existing, text: input.text, blockers: input.blockers };
      setEntries((cur) => cur.map((e) => (e.id === existing.id ? updated : e)));
      return updated;
    }
    const entry: CheckinEntry = {
      id: input.id ?? genId(),
      memberId: input.memberId,
      date: input.date,
      phase: input.phase,
      text: input.text,
      blockers: input.blockers,
    };
    setEntries((cur) => [entry, ...cur]);
    return entry;
  }, [entries]);

  const updateCheckin = useCallback((id: string, patch: Partial<CheckinEntry>) => {
    setEntries((cur) => cur.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }, []);

  const getCheckin = useCallback(
    (memberId: string, date: string, phase: CheckinPhase) =>
      entries.find((e) => e.memberId === memberId && e.date === date && e.phase === phase),
    [entries],
  );

  const value = useMemo<CheckinsCtx>(
    () => ({ entries, submitCheckin, updateCheckin, getCheckin }),
    [entries, submitCheckin, updateCheckin, getCheckin],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCheckins() {
  const c = useContext(Ctx);
  if (!c) throw new Error("CheckinsProvider missing");
  return c;
}

/** Get Cairo-local date string (YYYY-MM-DD) and hour (0-23). */
export function cairoNow(date: Date = new Date()): { dateStr: string; hour: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const dateStr = `${get("year")}-${get("month")}-${get("day")}`;
  const hour = parseInt(get("hour"), 10) || 0;
  return { dateStr, hour };
}
