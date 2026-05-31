import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "Founder" | "Team" | "Investor" | "External";
export type UserStatus = "Active" | "Invited" | "Suspended";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  twoFA: boolean;
  status: UserStatus;
  lastActive: string;
  invited: string;
  additionalEmails?: string[];
  phone?: string;
  position?: string;
  notes?: string;
  isHiringManager?: boolean;
}

const SEED_USERS: AppUser[] = [
  { id: "u1", name: "Bassel El Aroussy", email: "bassel@waslaventures.com", role: "Founder", twoFA: true, status: "Active", lastActive: "Today", invited: "",
    phone: "+20 100 000 0001", position: "Co-Founder & CEO", notes: "Leads strategy, fundraising, and ecosystem direction.", isHiringManager: true },
  { id: "u2", name: "Moaz El Sawy", email: "moaz@waslaventures.com", role: "Founder", twoFA: false, status: "Active", lastActive: "Today", invited: "",
    phone: "+20 100 000 0002", position: "Co-Founder & COO", notes: "Operations, finance oversight, and venture execution.", isHiringManager: true },
  { id: "u3", name: "Youssef El Shazly", email: "youssef@waslaventures.com", role: "Team", twoFA: false, status: "Active", lastActive: "", invited: "",
    phone: "+20 100 000 0003", position: "Head of Product", notes: "Owns product roadmap across active ventures.", isHiringManager: true },
  { id: "u4", name: "Hussein Shahbender", email: "hussein@waslaventures.com", role: "Team", twoFA: false, status: "Active", lastActive: "", invited: "",
    phone: "+20 100 000 0004", position: "Engineering Lead", notes: "Tech architecture and engineering hiring." },
  { id: "u5", name: "Mohamed El Hagry", email: "hagry@waslaventures.com", role: "Team", twoFA: false, status: "Active", lastActive: "", invited: "",
    phone: "+20 100 000 0005", position: "Design Lead", notes: "Brand, product design, and creative direction." },
  { id: "u6", name: "Ali Amir", email: "ali@waslaventures.com", role: "Team", twoFA: false, status: "Active", lastActive: "", invited: "",
    phone: "+20 100 000 0006", position: "Growth & Marketing", notes: "Performance marketing and partnerships." },
  { id: "u7", name: "Saif Nosair", email: "saif@waslaventures.com", role: "Team", twoFA: false, status: "Active", lastActive: "", invited: "",
    phone: "+20 100 000 0007", position: "Business Development", notes: "Client pipeline and venture partnerships." },
  { id: "u8", name: "Ahmed Nehad", email: "nehad@waslaventures.com", role: "Team", twoFA: false, status: "Active", lastActive: "", invited: "",
    phone: "+20 100 000 0008", position: "Finance & Operations", notes: "Accounting, salaries, and operational reporting." },
];

interface UserContextValue {
  users: AppUser[];
  currentUserId: string;
  currentUser: AppUser;
  setCurrentUserId: (id: string) => void;
  addUser: (u: Omit<AppUser, "id">) => string;
  updateUser: (id: string, patch: Partial<AppUser>) => void;
  removeUser: (id: string) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<AppUser[]>(SEED_USERS);
  const [currentUserId, setCurrentUserId] = useState<string>("u1");

  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  const addUser: UserContextValue["addUser"] = (u) => {
    const id = `u${Date.now()}${Math.floor(Math.random() * 1000)}`;
    setUsers(prev => [...prev, { ...u, id }]);
    return id;
  };

  const updateUser: UserContextValue["updateUser"] = (id, patch) =>
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...patch } : u)));

  const removeUser: UserContextValue["removeUser"] = (id) =>
    setUsers(prev => prev.filter(u => u.id !== id));

  return (
    <UserContext.Provider value={{ users, currentUserId, currentUser, setCurrentUserId, addUser, updateUser, removeUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUsers must be used within UserProvider");
  return ctx;
};

// Permissions matrix
export type AccessLevel = "Full" | "Read" | "ComingSoon" | "No";

export const PERMISSION_MATRIX: { section: string; page: string; access: Record<UserRole, AccessLevel> }[] = [
  { section: "Corporate Portal", page: "Overview", access: { Founder: "Full", Team: "Read", Investor: "Read", External: "Read" } },
  { section: "Corporate Portal", page: "Ecosystem", access: { Founder: "Full", Team: "Read", Investor: "Read", External: "Read" } },
  { section: "Corporate Portal", page: "Direction", access: { Founder: "Full", Team: "Read", Investor: "Read", External: "Read" } },
  { section: "Corporate Portal", page: "Updates", access: { Founder: "Full", Team: "Read", Investor: "Read", External: "Read" } },
  { section: "Corporate Portal", page: "Documents (portal)", access: { Founder: "Full", Team: "Read", Investor: "Read", External: "Read" } },
  { section: "Corporate Portal", page: "Corporate Admin", access: { Founder: "Full", Team: "No", Investor: "No", External: "No" } },
  { section: "Founder Dashboard", page: "Command Center", access: { Founder: "Full", Team: "ComingSoon", Investor: "No", External: "No" } },
  { section: "Founder Dashboard", page: "Ventures", access: { Founder: "Full", Team: "ComingSoon", Investor: "No", External: "No" } },
  { section: "Founder Dashboard", page: "Pipeline", access: { Founder: "Full", Team: "ComingSoon", Investor: "No", External: "No" } },
  { section: "Founder Dashboard", page: "Finance", access: { Founder: "Full", Team: "No", Investor: "No", External: "No" } },
  { section: "Founder Dashboard", page: "Team", access: { Founder: "Full", Team: "ComingSoon", Investor: "No", External: "No" } },
  { section: "Founder Dashboard", page: "Network", access: { Founder: "Full", Team: "No", Investor: "No", External: "No" } },
  { section: "Founder Dashboard", page: "Market Intel", access: { Founder: "Full", Team: "ComingSoon", Investor: "No", External: "No" } },
  { section: "Founder Dashboard", page: "Initiatives", access: { Founder: "Full", Team: "No", Investor: "No", External: "No" } },
  { section: "Founder Dashboard", page: "AI Agents", access: { Founder: "Full", Team: "No", Investor: "No", External: "No" } },
  { section: "Founder Dashboard", page: "Documents (internal)", access: { Founder: "Full", Team: "No", Investor: "No", External: "No" } },
  { section: "Founder Dashboard", page: "Settings", access: { Founder: "Full", Team: "No", Investor: "No", External: "No" } },
];

export const ROLE_META: Record<UserRole, { description: string; color: string; bg: string }> = {
  Founder:  { description: "Full dashboard + corporate portal admin",        color: "hsl(220,95%,47%)", bg: "hsl(220,95%,47%,0.12)" },
  Team:     { description: "Corporate portal + restricted dashboard (soon)", color: "hsl(160,80%,40%)", bg: "hsl(160,80%,40%,0.12)" },
  Investor: { description: "Corporate portal + investor dashboard (soon)",   color: "hsl(250,60%,60%)", bg: "hsl(250,60%,60%,0.12)" },
  External: { description: "Corporate portal only",                          color: "hsl(215,20%,55%)", bg: "hsl(220,15%,38%,0.15)" },
};
