import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Plus, X, Save, Trash2 } from "lucide-react";
import { useUsers, ROLE_META, UserRole, UserStatus, AppUser } from "@/contexts/UserContext";
import { toast } from "sonner";

const ROLES: UserRole[] = ["Founder", "Team", "Investor", "External"];
const STATUSES: UserStatus[] = ["Active", "Invited", "Suspended"];

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full bg-background border border-border rounded-lg px-3 py-2 text-[12px] text-foreground outline-none focus:border-primary transition-colors";

const UserProfile = () => {
  const { id } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();
  const { users, updateUser, removeUser } = useUsers();
  const user = users.find(u => u.id === id);

  const [form, setForm] = useState<AppUser | null>(user || null);

  useEffect(() => {
    if (user) setForm(user);
  }, [user]);

  if (!user || !form) {
    return (
      <div className="space-y-4">
        <Link to="/founder/settings" className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Settings
        </Link>
        <div className="bg-card border border-border rounded-xl p-6 text-center text-[12px] text-muted-foreground">
          User not found.
        </div>
      </div>
    );
  }

  const meta = ROLE_META[form.role];
  const additional = form.additionalEmails || [];

  const setField = <K extends keyof AppUser>(k: K, v: AppUser[K]) => setForm({ ...form, [k]: v });

  const updateAdditional = (idx: number, v: string) => {
    const next = [...additional];
    next[idx] = v;
    setField("additionalEmails", next);
  };
  const addAdditional = () => setField("additionalEmails", [...additional, ""]);
  const removeAdditional = (idx: number) => setField("additionalEmails", additional.filter((_, i) => i !== idx));

  const save = () => {
    const cleaned = { ...form, additionalEmails: (form.additionalEmails || []).map(e => e.trim()).filter(Boolean) };
    updateUser(form.id, cleaned);
    toast.success("Profile saved");
  };

  const handleRemove = () => {
    if (confirm(`Remove ${form.name}?`)) {
      removeUser(form.id);
      toast.success(`${form.name} removed`);
      navigate({ to: "/founder/settings" as never });
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Link to="/founder/settings" className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Settings
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-[18px] font-bold"
            style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}33` }}
          >
            {form.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "?"}
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-foreground tracking-tight">{form.name || "Untitled User"}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: meta.bg, color: meta.color }}>{form.role}</span>
              <span className="text-[10px] text-muted-foreground">{form.status}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRemove}
            className="text-[11px] font-semibold px-3 py-2 rounded-lg border border-border hover:border-destructive/50 transition-colors flex items-center gap-1.5"
            style={{ color: "hsl(0,75%,60%)" }}
          >
            <Trash2 className="w-3.5 h-3.5" /> Remove
          </button>
          <button
            onClick={save}
            className="text-[11px] font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            style={{ background: "hsl(220,95%,47%)", color: "white" }}
          >
            <Save className="w-3.5 h-3.5" /> Save Changes
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <Field label="Full Name">
          <input className={inputCls} value={form.name} onChange={e => setField("name", e.target.value)} />
        </Field>

        <Field label="Primary Email">
          <input type="email" className={inputCls} value={form.email} onChange={e => setField("email", e.target.value)} placeholder="user@example.com" />
        </Field>

        <Field label="Additional Emails">
          <div className="space-y-2">
            {additional.map((em, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="email" className={inputCls} value={em} onChange={e => updateAdditional(i, e.target.value)} placeholder="other@example.com" />
                <button onClick={() => removeAdditional(i)} className="p-2 rounded-lg border border-border hover:border-destructive/50 transition-colors" style={{ color: "hsl(0,75%,60%)" }}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button onClick={addAdditional} className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors">
              <Plus className="w-3 h-3" /> Add another email
            </button>
          </div>
        </Field>

        <Field label="Phone Number">
          <input type="tel" className={inputCls} value={form.phone || ""} onChange={e => setField("phone", e.target.value)} placeholder="+20 ..." />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Role">
            <select className={inputCls} value={form.role} onChange={e => setField("role", e.target.value as UserRole)}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select className={inputCls} value={form.status} onChange={e => setField("status", e.target.value as UserStatus)}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Position / Relationship to Wasla">
          <input className={inputCls} value={form.position || ""} onChange={e => setField("position", e.target.value)} placeholder="e.g. Co-founder & CEO, Brand Designer, Angel Investor" />
        </Field>

        <Field label="Notes">
          <textarea
            className={`${inputCls} resize-none`}
            rows={4}
            value={form.notes || ""}
            onChange={e => setField("notes", e.target.value)}
            placeholder="Internal notes, context, history…"
          />
        </Field>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/founder/settings/users/$id")({ component: UserProfile });
