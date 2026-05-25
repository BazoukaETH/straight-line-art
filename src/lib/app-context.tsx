import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { roleToUser, workspaces, subscriptionsSeed, type Role, type Subscription, type SubStatus } from "./mock-data";

interface AppCtx {
  role: Role;
  setRole: (r: Role) => void;
  currentUserId: string;
  dark: boolean;
  toggleDark: () => void;
  commandOpen: boolean;
  setCommandOpen: (b: boolean) => void;
  openTaskId: string | null;
  openTask: (id: string | null) => void;
  workspaceId: string;
  setWorkspaceId: (id: string) => void;
  subscriptions: Subscription[];
  setSubStatus: (id: string, status: SubStatus) => void;
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
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(subscriptionsSeed);
  const setSubStatus = (id: string, status: SubStatus) =>
    setSubscriptions((list) => list.map((s) => (s.id === id ? { ...s, status, cutoverDate: status === "Cutover" ? new Date().toISOString().slice(0, 10) : s.cutoverDate } : s)));

  // Hydrate from localStorage after mount (avoid SSR mismatch)
  useEffect(() => {
    setRoleState(readLS<Role>(LS_ROLE, "founder", ["founder", "manager", "member"]));
    setWorkspaceIdState(readLS<string>(LS_WS, workspaces[0].id, workspaces.map(w => w.id)));
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
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Ctx.Provider
      value={{
        role,
        setRole,
        currentUserId: roleToUser[role],
        dark,
        toggleDark: () => setDark((v) => !v),
        commandOpen,
        setCommandOpen,
        openTaskId,
        openTask: setOpenTaskId,
        workspaceId,
        setWorkspaceId,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("AppProvider missing");
  return c;
}
