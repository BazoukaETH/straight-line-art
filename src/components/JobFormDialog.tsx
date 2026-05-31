import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { toast } from "sonner";
import {
  JOB_DEPARTMENTS, VENTURES_FOR_JOBS, WORK_TYPES, EMPLOYMENT_TYPES,
  type Job, type JobStatus, type WorkType, type EmploymentType,
} from "@/data/jobs";

export interface JobFormValues {
  title: string;
  department: string;
  venture: string;
  workType: WorkType;
  location: string;
  employmentType: EmploymentType;
  aboutRole: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  salaryRange: string;
  status: JobStatus;
  isPublic: boolean;
}

const empty: JobFormValues = {
  title: "", department: "Engineering", venture: "Wasla Solutions", workType: "On-site",
  location: "", employmentType: "Full-time", aboutRole: "", responsibilities: [],
  requirements: [], niceToHave: [], salaryRange: "", status: "Draft", isPublic: true,
};

export function jobToForm(j: Job): JobFormValues {
  return {
    title: j.title, department: j.department, venture: j.venture, workType: j.workType,
    location: j.location, employmentType: j.employmentType, aboutRole: j.aboutRole,
    responsibilities: [...j.responsibilities], requirements: [...j.requirements],
    niceToHave: [...j.niceToHave], salaryRange: j.salaryRange, status: j.status, isPublic: j.isPublic,
  };
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: JobFormValues | null;
  mode: "create" | "edit";
  onSave: (values: JobFormValues) => void;
}

export default function JobFormDialog({ open, onOpenChange, initial, mode, onSave }: Props) {
  const [form, setForm] = useState<JobFormValues>(initial ?? empty);

  useEffect(() => {
    if (open) setForm(initial ?? empty);
  }, [open, initial]);

  type ListKey = "responsibilities" | "requirements" | "niceToHave";
  const updateList = (key: ListKey, idx: number, val: string) => {
    setForm(p => ({ ...p, [key]: p[key].map((v, i) => (i === idx ? val : v)) }));
  };
  const addListItem = (key: ListKey) => setForm(p => ({ ...p, [key]: [...p[key], ""] }));
  const removeListItem = (key: ListKey, idx: number) => setForm(p => ({ ...p, [key]: p[key].filter((_, i) => i !== idx) }));

  function save() {
    if (!form.title.trim()) { toast.error("Title required"); return; }
    onSave(form);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{mode === "edit" ? "Edit Job" : "Create Job"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Job Title *</label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Department *</label>
              <Select value={form.department} onValueChange={v => setForm({ ...form, department: v })}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{JOB_DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Venture *</label>
              <Select value={form.venture} onValueChange={v => setForm({ ...form, venture: v })}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{VENTURES_FOR_JOBS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Work Type *</label>
              <Select value={form.workType} onValueChange={v => setForm({ ...form, workType: v as WorkType })}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{WORK_TYPES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Location *</label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Employment Type *</label>
              <Select value={form.employmentType} onValueChange={v => setForm({ ...form, employmentType: v as EmploymentType })}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{EMPLOYMENT_TYPES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-1 col-span-2"><label className="text-[10px] text-muted-foreground font-medium">Salary Range</label><Input value={form.salaryRange} onChange={e => setForm({ ...form, salaryRange: e.target.value })} placeholder="e.g. 25K-40K EGP" className="h-8 text-xs" /></div>
          </div>

          <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">About the Role *</label><Textarea value={form.aboutRole} onChange={e => setForm({ ...form, aboutRole: e.target.value })} rows={4} className="text-xs" /></div>

          {(["responsibilities", "requirements", "niceToHave"] as const).map(key => (
            <div key={key} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-muted-foreground font-medium capitalize">{key === "niceToHave" ? "Nice to Have" : key}</label>
                <button type="button" onClick={() => addListItem(key)} className="text-[10px] text-primary hover:underline">+ Add</button>
              </div>
              {form[key].map((v, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <Input value={v} onChange={e => updateList(key, i, e.target.value)} className="h-7 text-xs" />
                  <button type="button" onClick={() => removeListItem(key, i)} className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Status</label>
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v as JobStatus })}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{["Draft", "Active", "Paused"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground font-medium">Public Listing</label>
              <button onClick={() => setForm({ ...form, isPublic: !form.isPublic })} className="h-8 px-3 rounded-md border border-border bg-background text-xs flex items-center gap-2">
                <span className="relative inline-flex items-center w-8 h-4 rounded-full transition-colors" style={{ background: form.isPublic ? "hsl(160,80%,40%)" : "hsl(220,15%,38%,0.4)" }}>
                  <span className="inline-block w-3 h-3 bg-white rounded-full transition-transform" style={{ transform: form.isPublic ? "translateX(18px)" : "translateX(2px)" }} />
                </span>
                {form.isPublic ? "Yes" : "No"}
              </button>
            </div>
          </div>
        </div>
        <DialogFooter className="sticky bottom-0 bg-card pt-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="text-xs h-8">Cancel</Button>
          <Button onClick={save} className="text-xs h-8">{mode === "edit" ? "Save Changes" : "Save Job"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
