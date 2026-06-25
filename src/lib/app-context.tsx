import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { roleToUser, workspaces, subscriptionsSeed, type Role, type Subscription, type SubStatus } from "./mock-data";
import { TasksProvider } from "./tasks-store";
import { CheckinsProvider } from "./checkins-store";
import { navigateToTask } from "./nav-bridge";
import { seedDiscussedOnce } from "./chat-store";


type QuickCreateTab = "task" | "subtask" | "list" | "folder" | "space" | "channel" | "template";

interface AppCtx {
  role: Role;
  setRole: (r: Role) => void;
  currentUserId: string;
  dark: boolean;
  toggleDark: () => void;
  commandOpen: boolean;
  setCommandOpen: (b: boolean) => void;
  // task slide-over drill stack
  openTaskId: string | null;
  openTask: (id: string | null) => void;
  drillStack: string[];
  pushDrill: (id: string) => void;
  popDrill: () => void;
  workspaceId: string;
  setWorkspaceId: (id: string) => void;
  subscriptions: Subscription[];
  setSubStatus: (id: string, status: SubStatus) => void;
  // quick create
  quickCreateOpen: boolean;
  setQuickCreateOpen: (b: boolean) => void;
  quickCreateContext: { listId?: string; parentId?: string; tab?: QuickCreateTab; title?: string } | null;
  setQuickCreateContext: (c: AppCtx["quickCreateContext"]) => void;
  openQuickCreate: (c?: AppCtx["quickCreateContext"]) => void;
  // bulk selection
  selectedTaskIds: string[];
  setSelectedTaskIds: (ids: string[]) => void;
  toggleSelectTask: (id: string, shift?: boolean, visibleOrdered?: string[]) => void;
  clearSelection: () => void;
}

const Ctx = createContext<AppCtx | null>(null);

const LS_ROLE = "wasla.role";
const LS_WS = "wasla.workspace";

function readLS<T extends string>(key: string, fallback: T, allowed: readonly T[]): T {
  if (typeof window === "undefined") return fallback;
  const v = window.localStorage.getItem(key);
  return v && (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("founder");
  const [workspaceId, setWorkspaceIdState] = useState<string>(workspaces[0].id);
  const [dark, setDark] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [openTaskId, setOpenTaskIdState] = useState<string | null>(null);
  const [drillStack, setDrillStack] = useState<string[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(subscriptionsSeed);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [quickCreateContext, setQuickCreateContext] = useState<AppCtx["quickCreateContext"]>(null);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [lastSelected, setLastSelected] = useState<string | null>(null);

  const setSubStatus = (id: string, status: SubStatus) =>
    setSubscriptions((list) => list.map((s) => (s.id === id ? { ...s, status, cutoverDate: status === "Cutover" ? new Date().toISOString().slice(0, 10) : s.cutoverDate } : s)));

  const openTask = (id: string | null) => {
    setOpenTaskIdState(id);
    setDrillStack([]);
    if (id) navigateToTask(id);
  };
  const pushDrill = (id: string) => {
    setDrillStack((s) => (openTaskId ? [...s, openTaskId] : s));
    setOpenTaskIdState(id);
    navigateToTask(id);
  };
  const popDrill = () => {
    setDrillStack((s) => {
      if (!s.length) { setOpenTaskIdState(null); return s; }
      const next = [...s];
      const prev = next.pop()!;
      setOpenTaskIdState(prev);
      navigateToTask(prev);
      return next;
    });
  };

  const openQuickCreate = (c?: AppCtx["quickCreateContext"]) => {
    setQuickCreateContext(c ?? null);
    setQuickCreateOpen(true);
  };

  const toggleSelectTask = (id: string, shift?: boolean, visibleOrdered?: string[]) => {
    setSelectedTaskIds((cur) => {
      if (shift && lastSelected && visibleOrdered) {
        const a = visibleOrdered.indexOf(lastSelected);
        const b = visibleOrdered.indexOf(id);
        if (a >= 0 && b >= 0) {
          const [lo, hi] = a < b ? [a, b] : [b, a];
          const range = visibleOrdered.slice(lo, hi + 1);
          const set = new Set([...cur, ...range]);
          return Array.from(set);
        }
      }
      const has = cur.includes(id);
      setLastSelected(id);
      return has ? cur.filter((x) => x !== id) : [...cur, id];
    });
  };
  const clearSelection = () => { setSelectedTaskIds([]); setLastSelected(null); };

  useEffect(() => {
    setRoleState(readLS<Role>(LS_ROLE, "founder", ["founder", "manager", "member"]));
    setWorkspaceIdState(readLS<string>(LS_WS, workspaces[0].id, workspaces.map(w => w.id)));
    seedDiscussedOnce();
  }, []);


  const setRole = (r: Role) => {
    setRoleState(r);
    if (typeof window !== "undefined") window.localStorage.setItem(LS_ROLE, r);
  };
  const setWorkspaceId = (id: string) => {
    setWorkspaceIdState(id);
    if (typeof window !== "undefined") window.localStorage.setItem(LS_WS, id);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((v) => !v);
      }
      if (e.key === "Escape") clearSelection();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Ctx.Provider
      value={{
        role, setRole,
        currentUserId: roleToUser[role],
        dark, toggleDark: () => setDark((v) => !v),
        commandOpen, setCommandOpen,
        openTaskId, openTask, drillStack, pushDrill, popDrill,
        workspaceId, setWorkspaceId,
        subscriptions, setSubStatus,
        quickCreateOpen, setQuickCreateOpen,
        quickCreateContext, setQuickCreateContext, openQuickCreate,
        selectedTaskIds, setSelectedTaskIds, toggleSelectTask, clearSelection,
      }}
    >
      <TasksProvider><CheckinsProvider>{children}</CheckinsProvider></TasksProvider>
    </Ctx.Provider>
  );
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("AppProvider missing");
  return c;
}
