import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Key, Users, Shield, Link as LinkIcon, UserCog, Plus, X, Trash2, Send, UserPlus } from "lucide-react";
import {
  useUsers,
  PERMISSION_MATRIX,
  ROLE_META,
  UserRole,
  UserStatus,
  AccessLevel,
} from "@/contexts/UserContext";
import { toast } from "sonner";

const integrations = [
  { name: "Google Sheets", status: "Not connected", description: "Financial data source for P&L, revenue, and cash tracking" },
  { name: "Google Drive",  status: "Not connected", description: "Document storage for proposals, SOWs, invoices, and strategy docs" },
  { name: "ClickUp",       status: "Not connected", description: "Project management - tasks, deadlines, and workload data" },
  { name: "Gmail",         status: "Not connected", description: "Email sending for agent outputs, digests, and notifications" },
];

const ROLES: UserRole[] = ["Founder", "Team", "Investor", "External"];
const STATUSES: UserStatus[] = ["Active", "Invited", "Suspended"];

const SectionHeader = ({ icon: Icon, title, action }: { icon: any; title: string; action?: React.ReactNode }) => (
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "hsl(220,95%,47%,0.12)", border: "1px solid hsl(220,95%,47%,0.2)" }}>
        <Icon className="w-3.5 h-3.5" style={{ color: "hsl(220,95%,47%)" }} />
      </div>
      <h2 className="text-sm font-bold text-foreground">{title}</h2>
    </div>
    {action}
  </div>
);

const statusColors: Record<UserStatus, { bg: string; color: string }> = {
  Active:    { bg: "hsl(160,80%,40%,0.15)", color: "hsl(160,80%,45%)" },
  Invited:   { bg: "hsl(36,90%,53%,0.15)",  color: "hsl(36,90%,55%)" },
  Suspended: { bg: "hsl(0,75%,55%,0.15)",   color: "hsl(0,75%,60%)" },
};

const AccessDot = ({ level }: { level: AccessLevel }) => {
  if (level === "Full") return <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: "hsl(220,95%,47%)", boxShadow: "0 0 6px hsl(220,95%,47%,0.5)" }} title="Full access" />;
  if (level === "Read") return <span className="inline-block w-2.5 h-2.5 rounded-full border" style={{ borderColor: "hsl(215,20%,55%)" }} title="Read only" />;
  if (level === "ComingSoon") return <span className="text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ background: "hsl(36,90%,53%,0.12)", color: "hsl(36,90%,55%)" }}>Soon</span>;
  return <span className="text-muted-foreground/40 text-xs">-</span>;
};

const SettingsPage = () => {
  const { users, addUser, updateUser, removeUser } = useUsers();
  const navigate = useNavigate();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("Team");
  const [inviteMessage, setInviteMessage] = useState("");

  const handleAddBlank = () => {
    const id = addUser({
      name: "New User",
      email: "",
      role: "Team",
      twoFA: false,
      status: "Active",
      lastActive: "",
      invited: "",
    });
    navigate({ to: `/founder/settings/users/${id}` as never });
  };

  const roleCounts = useMemo(() => {
    const counts: Record<UserRole, number> = { Founder: 0, Team: 0, Investor: 0, External: 0 };
    users.forEach(u => { counts[u.role]++; });
    return counts;
  }, [users]);

  const sendInvite = () => {
    if (!inviteEmail.trim()) {
      toast.error("Email is required");
      return;
    }
    addUser({
      name: inviteEmail.split("@")[0],
      email: inviteEmail.trim(),
      role: inviteRole,
      twoFA: false,
      status: "Invited",
      lastActive: "",
      invited: new Date().toISOString().slice(0, 10),
    });
    toast.success(`Invite sent to ${inviteEmail}`);
    setInviteEmail("");
    setInviteRole("Team");
    setInviteMessage("");
    setInviteOpen(false);
  };

  const grouped = useMemo(() => {
    const m = new Map<string, typeof PERMISSION_MATRIX>();
    PERMISSION_MATRIX.forEach(row => {
      if (!m.has(row.section)) m.set(row.section, []);
      m.get(row.section)!.push(row);
    });
    return Array.from(m.entries());
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[22px] font-bold text-foreground tracking-tight">Settings</h1>
        <p className="text-xs text-muted-foreground mt-1">Roles, users, permissions, and integrations</p>
      </div>

      {/* Role Overview */}
      <div>
        <SectionHeader icon={UserCog} title="Role Overview" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {ROLES.map(role => {
            const meta = ROLE_META[role];
            return (
              <div key={role} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-2 h-2 rounded-full" style={{ background: meta.color, boxShadow: `0 0 6px ${meta.color}` }} />
                  <h3 className="text-[12px] font-bold text-foreground">{role}</h3>
                </div>
                <div className="text-[18px] font-bold text-foreground tracking-tight">{roleCounts[role]}</div>
                <div className="text-[9px] uppercase tracking-wide text-muted-foreground/60 mb-2">users</div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{meta.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Users Table */}
      <div>
        <SectionHeader
          icon={Users}
          title={`Users (${users.length})`}
          action={
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddBlank}
                className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors border border-border hover:border-primary/50 text-foreground"
              >
                <UserPlus className="w-3 h-3" /> Add User
              </button>
              <button
                onClick={() => setInviteOpen(true)}
                className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                style={{ background: "hsl(220,95%,47%)", color: "white" }}
              >
                <Plus className="w-3 h-3" /> Invite User
              </button>
            </div>
          }
        />
        <div className="bg-card border border-border rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-[11px] min-w-[900px]">
            <thead>
              <tr className="border-b border-border">
                {["Name", "Email", "Role", "Hiring Mgr", "2FA", "Status", "Last Active", "Invited", "Actions"].map(h => (
                  <th key={h} className="text-left p-3 font-semibold text-muted-foreground/50 text-[9px] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const sc = statusColors[u.status];
                const meta = ROLE_META[u.role];
                const show2FA = u.role === "Founder" || u.role === "Team";
                return (
                  <tr key={u.id} className="border-b border-border/30 last:border-0">
                    <td className="p-3 font-semibold text-foreground">
                      <Link to={`/founder/settings/users/${u.id}`} className="hover:underline hover:text-primary transition-colors">
                        {u.name}
                      </Link>
                    </td>
                    <td className="p-3 text-muted-foreground">{u.email || <span className="text-muted-foreground/40">-</span>}</td>
                    <td className="p-3">
                      <select
                        value={u.role}
                        onChange={(e) => updateUser(u.id, { role: e.target.value as UserRole })}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-transparent border-0 outline-none cursor-pointer"
                        style={{ background: meta.bg, color: meta.color }}
                      >
                        {ROLES.map(r => <option key={r} value={r} className="bg-card text-foreground">{r}</option>)}
                      </select>
                    </td>
                    <td className="p-3">
                      {u.role === "Team" ? (
                        <button
                          onClick={() => updateUser(u.id, { isHiringManager: !u.isHiringManager })}
                          className="relative inline-flex items-center w-8 h-4 rounded-full transition-colors"
                          style={{ background: u.isHiringManager ? "hsl(160,80%,40%)" : "hsl(220,15%,38%,0.4)" }}
                          title="Toggle Hiring Manager"
                        >
                          <span className="inline-block w-3 h-3 bg-white rounded-full transition-transform" style={{ transform: u.isHiringManager ? "translateX(18px)" : "translateX(2px)" }} />
                        </button>
                      ) : u.role === "Founder" ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: "hsl(160,80%,40%,0.15)", color: "hsl(160,80%,45%)" }}>Auto</span>
                      ) : (
                        <span className="text-muted-foreground/30 text-[10px]">n/a</span>
                      )}
                    </td>
                    <td className="p-3">
                      {show2FA ? (
                        <button
                          onClick={() => updateUser(u.id, { twoFA: !u.twoFA })}
                          className="relative inline-flex items-center w-8 h-4 rounded-full transition-colors"
                          style={{ background: u.twoFA ? "hsl(160,80%,40%)" : "hsl(220,15%,38%,0.4)" }}
                          title="Toggle 2FA"
                        >
                          <span className="inline-block w-3 h-3 bg-white rounded-full transition-transform" style={{ transform: u.twoFA ? "translateX(18px)" : "translateX(2px)" }} />
                        </button>
                      ) : (
                        <span className="text-muted-foreground/30 text-[10px]">n/a</span>
                      )}
                    </td>
                    <td className="p-3">
                      <select
                        value={u.status}
                        onChange={(e) => updateUser(u.id, { status: e.target.value as UserStatus })}
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-transparent border-0 outline-none cursor-pointer"
                        style={{ background: sc.bg, color: sc.color }}
                      >
                        {STATUSES.map(s => <option key={s} value={s} className="bg-card text-foreground">{s}</option>)}
                      </select>
                    </td>
                    <td className="p-3 text-muted-foreground">{u.lastActive || <span className="text-muted-foreground/40">-</span>}</td>
                    <td className="p-3 text-muted-foreground">{u.invited || <span className="text-muted-foreground/40">-</span>}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {u.status === "Invited" && (
                          <button
                            onClick={() => toast.success(`Invite resent to ${u.email || u.name}`)}
                            className="text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                            title="Resend invite"
                          >
                            <Send className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm(`Remove ${u.name}?`)) {
                              removeUser(u.id);
                              toast.success(`${u.name} removed`);
                            }
                          }}
                          className="text-[10px] transition-colors hover:text-foreground"
                          style={{ color: "hsl(0,75%,60%)" }}
                          title="Remove user"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div>
        <SectionHeader icon={Shield} title="Permissions Matrix" />
        <div className="bg-card border border-border rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-[11px] min-w-[600px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-semibold text-muted-foreground/50 text-[9px] uppercase tracking-wide">Page</th>
                {ROLES.map(r => (
                  <th key={r} className="text-center p-3 font-semibold text-muted-foreground/50 text-[9px] uppercase tracking-wide">{r}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grouped.map(([section, rows]) => (
                <>
                  <tr key={section} className="bg-background/40">
                    <td colSpan={5} className="px-3 py-2 text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground/70">{section}</td>
                  </tr>
                  {rows.map(row => (
                    <tr key={row.page} className="border-b border-border/30 last:border-0">
                      <td className="p-3 font-medium text-foreground">{row.page}</td>
                      {ROLES.map(r => (
                        <td key={r} className="p-3 text-center"><AccessDot level={row.access[r]} /></td>
                      ))}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
          <div className="border-t border-border px-3 py-2 flex items-center gap-4 text-[9px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><AccessDot level="Full" /> Full access</span>
            <span className="flex items-center gap-1.5"><AccessDot level="Read" /> Read only</span>
            <span className="flex items-center gap-1.5"><AccessDot level="ComingSoon" /> Coming soon</span>
            <span className="flex items-center gap-1.5"><AccessDot level="No" /> No access</span>
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div>
        <SectionHeader icon={LinkIcon} title="Integrations" />
        <div className="grid sm:grid-cols-2 gap-2.5">
          {integrations.map((int) => (
            <div key={int.name} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-[12px] font-bold text-foreground">{int.name}</h3>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: "hsl(220,15%,38%,0.15)", color: "hsl(215,20%,55%)" }}>
                  {int.status}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">{int.description}</p>
              <button className="mt-3 text-[10px] font-semibold transition-colors" style={{ color: "hsl(220,95%,47%)" }}>Connect →</button>
            </div>
          ))}
        </div>
      </div>

      {/* API Keys */}
      <div>
        <SectionHeader icon={Key} title="API Keys" />
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-[11px] text-muted-foreground">No API keys configured yet. Keys will be needed for ClickUp, Google, and AI agent integrations.</p>
        </div>
      </div>

      {/* Invite Modal */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setInviteOpen(false)}>
          <div className="bg-card border border-border rounded-xl p-5 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground">Invite User</h3>
              <button onClick={() => setInviteOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Email *</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[11px] text-foreground outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Role *</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[11px] text-foreground outline-none focus:border-primary"
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Personal message (optional)</label>
                <textarea
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  rows={3}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[11px] text-foreground outline-none focus:border-primary resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setInviteOpen(false)} className="text-[11px] font-semibold px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                  Cancel
                </button>
                <button onClick={sendInvite} className="text-[11px] font-bold px-4 py-2 rounded-lg transition-colors" style={{ background: "hsl(220,95%,47%)", color: "white" }}>
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const Route = createFileRoute("/founder/settings")({ component: SettingsPage });
