import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import {
  Plus, Pencil, Trash2, X, Briefcase, CheckCircle, Inbox, Mail, Star, Award,
  Share2, MoreHorizontal, Search, ExternalLink, ChevronRight, LayoutGrid, List, Users, UserPlus, Sparkles,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSalaries } from "@/contexts/SalaryContext";
import { useUsers } from "@/contexts/UserContext";
import { useHiring } from "@/contexts/HiringContext";
import CandidateModal from "@/components/CandidateModal";
import JobFormDialog, { type JobFormValues, jobToForm } from "@/components/JobFormDialog";
import { toast } from "sonner";
import {
  JOB_DEPARTMENTS, VENTURES_FOR_JOBS, WORK_TYPES, EMPLOYMENT_TYPES,
  APPLICANT_STATUSES, APPLICANT_SOURCES, TALENT_POOL_TAGS, sourceColor,
  type Job, type Applicant, type JobStatus, type ApplicantStatus, type WorkType,
  type EmploymentType, type ApplicantSource,
} from "@/data/jobs";

interface TeamMember {
  name: string; role: string; dept: string; initials: string; color: string; equity: string; skills: string[]; bio: string; focus: string;
}
interface Advisor { name: string; role: string; note: string; }

const TEAM_SEED: TeamMember[] = [
  { name: "Bassel El Aroussy", role: "Principal", dept: "Leadership", initials: "BA", color: "hsl(220,95%,47%)", equity: "55% (WV)", skills: ["Strategy", "Business Dev", "Capital Markets", "Partnerships"], bio: "Managing Principal & founder.", focus: "Investor relations, business development, strategy" },
  { name: "Usef El Shazly", role: "Digital Lead", dept: "Product & Design", initials: "UE", color: "hsl(168,100%,42%)", equity: "10% (WV) / 35% (Edu)", skills: ["UI/UX", "Digital Strategy", "Design Systems", "Product"], bio: "Managing Partner & Head of Design.", focus: "Product design, Wasla Education lead" },
  { name: "Hussein Shahbender", role: "Marketing Lead", dept: "Growth", initials: "HS", color: "hsl(250,60%,60%)", equity: "15% (WV)", skills: ["Branding", "Performance Marketing", "Content", "Growth"], bio: "Co-founder & Marketing Lead.", focus: "Brand, marketing strategy, content" },
  { name: "Moaz El Sawy", role: "Development Lead", dept: "Engineering", initials: "ME", color: "hsl(160,80%,40%)", equity: "2% (WV) / 2.5% (Sol+Edu)", skills: ["iOS", "Android", "Full-Stack", "React Native"], bio: "Senior Software Developer.", focus: "Mobile development, full-stack delivery" },
  { name: "Ali El Amir", role: "Creative Lead", dept: "Design", initials: "AE", color: "hsl(36,90%,53%)", equity: "2% (WV)", skills: ["Graphic Design", "Creative Direction", "Branding", "Motion"], bio: "Creative Lead & Creative Director.", focus: "Visual identity, creative direction" },
  { name: "Mohab Metwali", role: "Engineering & AI Lead", dept: "Engineering", initials: "MM", color: "hsl(330,80%,60%)", equity: "1% (direct)", skills: ["AI/ML", "Blockchain", "Data Science", "C++"], bio: "Senior engineer with AI expertise.", focus: "AI integrations, advanced engineering" },
  { name: "Mohamed Hagry", role: "Product Designer", dept: "Design", initials: "MH", color: "hsl(174,72%,46%)", equity: "-", skills: ["Product Design", "Figma", "User Research"], bio: "Digital product designer.", focus: "Product UI design, design system" },
  { name: "Saif Nosair", role: "Visual & Motion Designer", dept: "Design", initials: "SN", color: "hsl(24,94%,53%)", equity: "-", skills: ["Motion Design", "After Effects", "Brand Identity"], bio: "Visual and motion designer.", focus: "Motion graphics, brand videos" },
];

const ADVISORS_SEED: Advisor[] = [
  { name: "Mr. Yasser Hashem", role: "Legal Advisor", note: "Top tech lawyer in Egypt. 2% equity for 3 years of legal services." },
  { name: "Board-level Tech Advisors", role: "Technical Board", note: "Two senior developers acting at board level." },
  { name: "Strategic Business Board", role: "Business Board", note: "Three high-profile businessmen/investors." },
];

const DEPTS = ["Leadership", "Product & Design", "Engineering", "Growth", "Design"];
const DEPT_COLORS = ["hsl(220,95%,47%)", "hsl(168,100%,42%)", "hsl(160,80%,40%)", "hsl(250,60%,60%)", "hsl(36,90%,53%)", "hsl(330,80%,60%)", "hsl(174,72%,46%)", "hsl(24,94%,53%)"];

// Color helpers
const workTypeColor = (w: WorkType) => w === "Remote" ? "hsl(160,80%,40%)" : w === "On-site" ? "hsl(220,95%,47%)" : "hsl(250,60%,60%)";
const jobStatusColor = (s: JobStatus) => s === "Active" ? "hsl(160,80%,40%)" : s === "Paused" ? "hsl(36,90%,53%)" : s === "Draft" ? "hsl(215,20%,55%)" : "hsl(350,75%,50%)";
const applicantStatusColor = (s: ApplicantStatus) => {
  switch (s) {
    case "New": return "hsl(220,95%,47%)";
    case "Reviewing": return "hsl(36,90%,53%)";
    case "Interview": return "hsl(250,60%,60%)";
    case "Offer": return "hsl(160,80%,40%)";
    case "Hired": return "hsl(145,80%,42%)";
    case "Rejected": return "hsl(350,75%,50%)";
  }
};
const ratingColor = (r: number) => r < 3 ? { bg: "hsl(350,75%,50%)", color: "white" } : r === 3 ? { bg: "hsl(36,90%,53%)", color: "hsl(0,0%,12%)" } : { bg: "hsl(160,80%,40%)", color: "white" };

const formatDate = (d: string) => {
  if (!d) return "-";
  try {
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch { return d; }
};
const relativeTime = (d: string) => {
  const diff = (Date.now() - new Date(d).getTime()) / (1000 * 60 * 60 * 24);
  if (diff < 1) return "today";
  if (diff < 7) return `${Math.floor(diff)}d ago`;
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
  if (diff < 365) return `${Math.floor(diff / 30)}mo ago`;
  return `${Math.floor(diff / 365)}y ago`;
};

const KpiCard = ({ icon: Icon, label, value, color }: any) => (
  <div className="bg-card border border-border rounded-xl p-3">
    <div className="flex items-center gap-2 mb-1.5">
      <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: `${color}1f` }}>
        <Icon className="w-3 h-3" style={{ color }} />
      </div>
      <span className="text-[9px] uppercase tracking-wide text-muted-foreground/70 font-semibold">{label}</span>
    </div>
    <div className="text-[18px] font-bold text-foreground tracking-tight">{value}</div>
  </div>
);

const Stars = ({ rating, size = 12, onChange }: { rating: number; size?: number; onChange?: (r: number) => void }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(n => (
      <Star
        key={n}
        style={{ width: size, height: size }}
        className={`${onChange ? "cursor-pointer" : ""} ${n <= rating ? "fill-current" : ""}`}
        color={n <= rating ? "hsl(48,95%,55%)" : "hsl(220,15%,38%)"}
        onClick={() => onChange?.(n)}
      />
    ))}
  </div>
);

const Team = () => {
  const [tab, setTab] = useState<"team" | "hiring">("team");
  const [team, setTeam] = useState<TeamMember[]>(TEAM_SEED);
  const [advisors, setAdvisors] = useState<Advisor[]>(ADVISORS_SEED);
  const [selected, setSelected] = useState<number | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", role: "", dept: "Engineering", skills: "", bio: "", focus: "", equity: "-" });
  const [addAdvisorModal, setAddAdvisorModal] = useState(false);
  const [editAdvisorIdx, setEditAdvisorIdx] = useState<number | null>(null);
  const [advisorForm, setAdvisorForm] = useState({ name: "", role: "", note: "" });
  const { addSalaryEntry } = useSalaries();
  const { currentUser } = useUsers();

  // Hiring permission
  const canEditHiring = currentUser.role === "Founder" || (currentUser.role === "Team" && currentUser.isHiringManager);
  const canSeeHiring = canEditHiring || currentUser.role === "Team";

  // Hiring state (shared via context)
  const { jobs, setJobs, applicants, setApplicants } = useHiring();
  const navigate = useNavigate();
  const [hiringSubTab, setHiringSubTab] = useState<"jobs" | "pipeline" | "pool">("jobs");

  // Job modal
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [jobEditId, setJobEditId] = useState<string | null>(null);
  const [jobInitial, setJobInitial] = useState<JobFormValues | null>(null);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  // Pipeline filters
  const [pipelineSearch, setPipelineSearch] = useState("");
  const [pipelinePosition, setPipelinePosition] = useState<string>("all");
  const [pipelineStatus, setPipelineStatus] = useState<string>("all");
  const [pipelineAppFilter, setPipelineAppFilter] = useState<string>("all");

  // Talent Pool filters
  const [poolSearch, setPoolSearch] = useState("");
  const [poolSource, setPoolSource] = useState<string>("all");
  const [poolStatus, setPoolStatus] = useState<string>("all");
  const [poolTags, setPoolTags] = useState<string[]>([]);
  const [poolSkills, setPoolSkills] = useState<string[]>([]);
  const [poolAvailableOnly, setPoolAvailableOnly] = useState(false);
  const [poolView, setPoolView] = useState<"grid" | "table">("grid");

  // Add to Pool modal
  const emptyPool = {
    firstName: "", lastName: "", email: "", phone: "", linkedin: "", portfolio: "", location: "",
    source: "Outreach" as ApplicantSource, skills: [] as string[], tags: [] as string[],
    notes: "", initialStatus: "Reviewing" as ApplicantStatus, jobId: "",
  };
  const [poolModalOpen, setPoolModalOpen] = useState(false);
  const [poolForm, setPoolForm] = useState(emptyPool);
  const [poolSkillInput, setPoolSkillInput] = useState("");
  const [poolTagInput, setPoolTagInput] = useState("");

  // Candidate modal (uses shared component)
  const [candidateOpen, setCandidateOpen] = useState<string | null>(null);

  // Team helpers
  function resetForm() { setForm({ name: "", role: "", dept: "Engineering", skills: "", bio: "", focus: "", equity: "-" }); }
  function openEditMember(i: number) { const p = team[i]; setForm({ name: p.name, role: p.role, dept: p.dept, skills: p.skills.join(", "), bio: p.bio, focus: p.focus, equity: p.equity }); setEditIdx(i); setAddModal(true); }
  function saveMember() {
    if (!form.name.trim()) return;
    const initials = form.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
    const skills = form.skills.split(",").map(s => s.trim()).filter(Boolean);
    if (editIdx !== null) {
      setTeam(prev => prev.map((p, i) => i === editIdx ? { ...p, name: form.name, role: form.role, dept: form.dept, initials, equity: form.equity, skills, bio: form.bio, focus: form.focus } : p));
    } else {
      const color = DEPT_COLORS[team.length % DEPT_COLORS.length];
      setTeam(prev => [...prev, { name: form.name, role: form.role, dept: form.dept, initials, color, equity: form.equity, skills, bio: form.bio, focus: form.focus }]);
      addSalaryEntry({ name: form.name, role: form.role, dept: form.dept, monthlySalary: 0, equity: "-", venture: "Pending" });
    }
    resetForm(); setEditIdx(null); setAddModal(false);
  }
  function removeMember(i: number) { setTeam(prev => prev.filter((_, idx) => idx !== i)); if (selected === i) setSelected(null); }
  function resetAdvisorForm() { setAdvisorForm({ name: "", role: "", note: "" }); }
  function openEditAdvisor(i: number) { const a = advisors[i]; setAdvisorForm({ name: a.name, role: a.role, note: a.note }); setEditAdvisorIdx(i); setAddAdvisorModal(true); }
  function saveAdvisor() {
    if (!advisorForm.name.trim()) return;
    if (editAdvisorIdx !== null) setAdvisors(prev => prev.map((a, i) => i === editAdvisorIdx ? { ...advisorForm } : a));
    else setAdvisors(prev => [...prev, { ...advisorForm }]);
    resetAdvisorForm(); setEditAdvisorIdx(null); setAddAdvisorModal(false);
  }
  function removeAdvisor(i: number) { setAdvisors(prev => prev.filter((_, idx) => idx !== i)); }

  // KPI calculations
  const kpis = useMemo(() => {
    const total = jobs.length;
    const active = jobs.filter(j => j.status === "Active").length;
    const apps = applicants.length;
    const unread = applicants.filter(a => !a.isRead).length;
    const ratingsAll = applicants.flatMap(a => a.reviews.map(r => r.rating));
    const avg = ratingsAll.length ? (ratingsAll.reduce((s, r) => s + r, 0) / ratingsAll.length).toFixed(1) : "—";
    const hired = applicants.filter(a => a.status === "Hired").length;
    return { total, active, apps, unread, avg, hired };
  }, [jobs, applicants]);

  // Job actions
  function openCreateJob() { setJobInitial(null); setJobEditId(null); setJobModalOpen(true); }
  function openEditJob(j: Job) { setJobInitial(jobToForm(j)); setJobEditId(j.id); setJobModalOpen(true); }
  function saveJob(values: JobFormValues) {
    if (jobEditId) {
      setJobs(prev => prev.map(j => j.id === jobEditId ? { ...j, ...values } : j));
      toast.success("Job updated");
    } else {
      const id = `job-${Date.now()}`;
      const slug = values.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      setJobs(prev => [...prev, { ...values, id, createdAt: new Date().toISOString().slice(0, 10), createdBy: currentUser.name, viewCount: 0, shareLink: `https://waslaventures.com/careers/${slug}` }]);
      toast.success("Job created");
    }
  }
  function deleteJob() {
    if (!jobToDelete) return;
    setJobs(prev => prev.filter(j => j.id !== jobToDelete.id));
    setApplicants(prev => prev.filter(a => a.jobId !== jobToDelete.id));
    toast.success(`${jobToDelete.title} deleted`);
    setJobToDelete(null);
  }
  function copyShareLink(link: string) { navigator.clipboard.writeText(link); toast.success("Copied to clipboard"); }
  function toggleJobStatus(j: Job, status: JobStatus) { setJobs(prev => prev.map(p => p.id === j.id ? { ...p, status } : p)); }
  function togglePublic(j: Job) { setJobs(prev => prev.map(p => p.id === j.id ? { ...p, isPublic: !p.isPublic } : p)); }
  function duplicateJob(j: Job) {
    const id = `job-${Date.now()}`;
    setJobs(prev => [...prev, { ...j, id, title: j.title + " (Copy)", status: "Draft", createdAt: new Date().toISOString().slice(0, 10), viewCount: 0 }]);
    toast.success("Job duplicated");
  }

  function applicantCount(jobId: string) { return applicants.filter(a => a.jobId === jobId).length; }
  function jobOf(jobId: string) { return jobs.find(j => j.id === jobId); }

  // Pipeline filtering
  const filteredApplicants = useMemo(() => {
    return applicants.filter(a => {
      const job = jobOf(a.jobId);
      const matchSearch = !pipelineSearch || `${a.firstName} ${a.lastName} ${a.email} ${job?.title || ""}`.toLowerCase().includes(pipelineSearch.toLowerCase());
      const matchPos = pipelinePosition === "all" || a.jobId === pipelinePosition;
      const matchStatus = pipelineStatus === "all" || a.status === pipelineStatus;
      const matchApp = pipelineAppFilter === "all"
        || (pipelineAppFilter === "unread" && !a.isRead)
        || (pipelineAppFilter === "hasReviews" && a.reviews.length > 0)
        || (pipelineAppFilter === "noReviews" && a.reviews.length === 0);
      return matchSearch && matchPos && matchStatus && matchApp;
    });
  }, [applicants, pipelineSearch, pipelinePosition, pipelineStatus, pipelineAppFilter, jobs]);

  function openCandidate(a: Applicant) {
    if (!a.isRead) {
      setApplicants(prev => prev.map(p => p.id === a.id ? {
        ...p,
        isRead: true,
        activity: [...p.activity, { id: `act-${Date.now()}`, actorName: currentUser.name, action: "opened applicant", timestamp: new Date().toISOString().slice(0, 16).replace("T", " ") }],
      } : p));
    }
    setCandidateOpen(a.id);
  }
  function changeApplicantStatus(id: string, status: ApplicantStatus) {
    setApplicants(prev => prev.map(a => {
      if (a.id !== id) return a;
      if (a.status === status) return a;
      return {
        ...a, status, lastUpdatedAt: new Date().toISOString().slice(0, 10),
        activity: [...a.activity, { id: `act-${Date.now()}`, actorName: currentUser.name, action: `moved to ${status}`, timestamp: new Date().toISOString().slice(0, 16).replace("T", " ") }],
      };
    }));
  }

  // Talent Pool helpers
  const allSkills = (() => { const set = new Set<string>(); applicants.forEach(a => a.skills.forEach(s => set.add(s))); return Array.from(set).sort(); })();

  const filteredPool = applicants.filter(a => {
    const q = poolSearch.toLowerCase();
    const matchSearch = !q || `${a.firstName} ${a.lastName} ${a.email} ${a.skills.join(" ")}`.toLowerCase().includes(q);
    const matchSource = poolSource === "all" || a.source === poolSource;
    const matchStatus = poolStatus === "all" || a.status === poolStatus;
    const matchTags = poolTags.length === 0 || poolTags.every(t => a.tags.includes(t));
    const matchSkills = poolSkills.length === 0 || poolSkills.every(s => a.skills.includes(s));
    const matchAvail = !poolAvailableOnly || (a.tags.includes("available") && a.considerForFutureRoles);
    return matchSearch && matchSource && matchStatus && matchTags && matchSkills && matchAvail;
  });

  const poolKpis = (() => {
    const total = applicants.length;
    const future = applicants.filter(a => a.considerForFutureRoles).length;
    const external = applicants.filter(a => a.source === "Outsourcing Partner" || a.source === "Freelancer").length;
    const skillCounts = new Map<string, number>();
    applicants.forEach(a => a.skills.forEach(s => skillCounts.set(s, (skillCounts.get(s) || 0) + 1)));
    let topSkill = "—"; let topN = 0;
    skillCounts.forEach((n, k) => { if (n > topN) { topN = n; topSkill = `${k}: ${n}`; } });
    return { total, future, external, topSkill };
  })();

  function addPoolSkill() { const v = poolSkillInput.trim(); if (!v) return; if (!poolForm.skills.includes(v)) setPoolForm({ ...poolForm, skills: [...poolForm.skills, v] }); setPoolSkillInput(""); }
  function addPoolTag() { const v = poolTagInput.trim().toLowerCase(); if (!v) return; if (!poolForm.tags.includes(v)) setPoolForm({ ...poolForm, tags: [...poolForm.tags, v] }); setPoolTagInput(""); }

  function savePoolEntry() {
    if (!poolForm.firstName.trim() || !poolForm.lastName.trim() || !poolForm.email.trim()) { toast.error("Name and email required"); return; }
    const ts = new Date().toISOString().slice(0, 16).replace("T", " ");
    const today = new Date().toISOString().slice(0, 10);
    const id = `app-${Date.now()}`;
    const newApp: Applicant = {
      id, firstName: poolForm.firstName, lastName: poolForm.lastName, email: poolForm.email,
      phone: poolForm.phone, linkedin: poolForm.linkedin, portfolio: poolForm.portfolio, location: poolForm.location,
      jobId: poolForm.jobId, cvUrl: "#", coverNote: poolForm.notes, status: poolForm.initialStatus,
      reviews: [], activity: [{ id: `act-${Date.now()}`, actorName: currentUser.name, action: `Added to Talent Pool by ${currentUser.name} via ${poolForm.source}`, timestamp: ts }],
      appliedAt: today, lastUpdatedAt: today, isRead: true,
      tags: poolForm.tags, source: poolForm.source, considerForFutureRoles: true, futureRoleNotes: poolForm.notes, skills: poolForm.skills,
    };
    setApplicants(prev => [...prev, newApp]);
    setPoolModalOpen(false); setPoolForm(emptyPool);
    toast.success("Added to Talent Pool");
  }

  const tabs = [{ id: "team" as const, l: "Current Team" }, { id: "hiring" as const, l: "Hiring" }];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Team</h1>
          <p className="text-xs text-muted-foreground mt-1">{team.length} people across Leadership, Engineering, Design & Growth</p>
        </div>
        {tab === "team" && (
          <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => { resetForm(); setEditIdx(null); setAddModal(true); }}>
            <Plus className="w-3.5 h-3.5" /> Add Member
          </Button>
        )}
      </div>

      <div className="flex gap-0 border-b border-border">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-[11px] font-medium transition-colors border-b-2 ${tab === t.id ? "text-secondary border-secondary" : "text-muted-foreground border-transparent hover:text-foreground"}`}>
            {t.l}
          </button>
        ))}
      </div>

      {/* CURRENT TEAM TAB */}
      {tab === "team" && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {team.map((p, i) => (
              <div key={i} onClick={() => setSelected(selected === i ? null : i)}
                className="bg-card rounded-xl p-4 cursor-pointer transition-all duration-200 group relative"
                style={{ border: `1px solid ${selected === i ? p.color : 'hsl(220,25%,16%)'}` }}>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={e => { e.stopPropagation(); openEditMember(i); }} className="w-6 h-6 rounded-md flex items-center justify-center bg-muted hover:bg-accent transition-colors"><Pencil className="w-3 h-3 text-muted-foreground" /></button>
                  <button onClick={e => { e.stopPropagation(); removeMember(i); }} className="w-6 h-6 rounded-md flex items-center justify-center bg-muted hover:bg-destructive/20 transition-colors"><X className="w-3 h-3 text-muted-foreground" /></button>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ background: `${p.color}22`, border: `2px solid ${p.color}66`, color: p.color }}>{p.initials}</div>
                  <div>
                    <div className="text-xs font-bold text-foreground">{p.name}</div>
                    <div className="text-[10px] font-semibold" style={{ color: p.color }}>{p.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[9px] bg-muted px-2 py-0.5 rounded text-muted-foreground">{p.dept}</span>
                  {p.equity !== "-" && <span className="text-[9px] px-2 py-0.5 rounded" style={{ background: "hsl(220,95%,47%,0.12)", color: "hsl(220,95%,47%)" }}>Equity: {p.equity}</span>}
                </div>
                {selected === i && (
                  <div className="mt-3 pt-3 border-t border-border space-y-2.5">
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{p.bio}</p>
                    <div>
                      <div className="text-[9px] text-muted-foreground/50 uppercase tracking-wide font-semibold mb-1">Skills</div>
                      <div className="flex flex-wrap gap-1">
                        {p.skills.map((s, si) => <span key={si} className="text-[9px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${p.color}18`, color: p.color }}>{s}</span>)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] text-muted-foreground/50 uppercase tracking-wide font-semibold mb-1">Current Focus</div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">{p.focus}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs font-semibold text-foreground mb-0.5">Advisory & Board Support</div>
                <div className="text-[10px] text-muted-foreground/50">Key relationships backing Wasla Ventures</div>
              </div>
              <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" onClick={() => { resetAdvisorForm(); setEditAdvisorIdx(null); setAddAdvisorModal(true); }}>
                <Plus className="w-3 h-3" /> Add Advisor
              </Button>
            </div>
            <div className="grid sm:grid-cols-3 gap-2.5">
              {advisors.map((a, i) => (
                <div key={i} className="bg-muted rounded-lg p-3 group relative">
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditAdvisor(i)} className="w-5 h-5 rounded flex items-center justify-center bg-card hover:bg-accent transition-colors"><Pencil className="w-2.5 h-2.5 text-muted-foreground" /></button>
                    <button onClick={() => removeAdvisor(i)} className="w-5 h-5 rounded flex items-center justify-center bg-card hover:bg-destructive/20 transition-colors"><X className="w-2.5 h-2.5 text-muted-foreground" /></button>
                  </div>
                  <div className="text-[11px] font-semibold text-foreground mb-0.5">{a.name}</div>
                  <div className="text-[9px] font-semibold mb-1.5" style={{ color: "hsl(220,95%,47%)" }}>{a.role}</div>
                  <div className="text-[10px] text-muted-foreground leading-relaxed">{a.note}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* HIRING TAB */}
      {tab === "hiring" && !canSeeHiring && (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <p className="text-[11px] text-muted-foreground">You don't have permission to view the Hiring section.</p>
        </div>
      )}

      {tab === "hiring" && canSeeHiring && (
        <div className="space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            <KpiCard icon={Briefcase} label="Total Jobs" value={kpis.total} color="hsl(220,95%,47%)" />
            <KpiCard icon={CheckCircle} label="Active" value={kpis.active} color="hsl(160,80%,40%)" />
            <KpiCard icon={Inbox} label="Applications" value={kpis.apps} color="hsl(220,95%,47%)" />
            <KpiCard icon={Mail} label="Unread" value={kpis.unread} color="hsl(36,90%,53%)" />
            <KpiCard icon={Star} label="Avg Rating" value={kpis.avg} color="hsl(48,95%,55%)" />
            <KpiCard icon={Award} label="Hired" value={kpis.hired} color="hsl(145,80%,42%)" />
          </div>

          {/* Sub-tabs */}
          <div className="flex gap-0 border-b border-border">
            {[{ id: "jobs" as const, l: "Jobs" }, { id: "pipeline" as const, l: "Pipeline" }, { id: "pool" as const, l: "Talent Pool" }].map(t => (
              <button key={t.id} onClick={() => setHiringSubTab(t.id)}
                className={`px-4 py-2 text-[11px] font-medium transition-colors border-b-2 ${hiringSubTab === t.id ? "text-secondary border-secondary" : "text-muted-foreground border-transparent hover:text-foreground"}`}>
                {t.l}
              </button>
            ))}
          </div>

          {/* JOBS */}
          {hiringSubTab === "jobs" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-foreground">Jobs</div>
                  <div className="text-[10px] text-muted-foreground">{jobs.length} jobs total</div>
                </div>
                {canEditHiring && (
                  <Button size="sm" className="h-8 text-xs gap-1.5" onClick={openCreateJob}>
                    <Plus className="w-3.5 h-3.5" /> Create Job
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {jobs.map(j => {
                  const wt = workTypeColor(j.workType);
                  const sc = jobStatusColor(j.status);
                  return (
                    <div key={j.id} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2.5 hover:border-primary/50 transition-colors">
                      <div className="cursor-pointer flex flex-col gap-2.5" onClick={() => navigate({ to: `/founder/team/jobs/${j.id}` as never })}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-[12px] font-bold text-foreground leading-tight truncate">{j.title}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">{j.venture}</div>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${wt}22`, color: wt }}>{j.workType}</span>
                            {j.status !== "Active" && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>{j.status}</span>}
                          </div>
                        </div>
                        <div className="text-[10px] text-muted-foreground/80 flex flex-wrap gap-x-1.5">
                          <span>{j.location}</span><span>·</span><span>{j.employmentType}</span><span>·</span><span>{relativeTime(j.createdAt)}</span>
                        </div>
                        <div className="border-t border-border/60 pt-2 text-[10px] text-muted-foreground flex items-center justify-between">
                          <span>{j.viewCount} views · {applicantCount(j.id)} applicants</span>
                          <span className="inline-flex items-center gap-1 text-primary font-medium">View candidates <ChevronRight className="w-3 h-3" /></span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {canEditHiring && (
                          <>
                            <Button size="sm" variant="outline" className="h-6 text-[9px] px-2 gap-1" onClick={() => openEditJob(j)}><Pencil className="w-3 h-3" /> Edit</Button>
                            <Button size="sm" variant="outline" className="h-6 text-[9px] px-2 gap-1 border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => setJobToDelete(j)}><Trash2 className="w-3 h-3" /> Delete</Button>
                          </>
                        )}
                        <Button size="sm" variant="outline" className="h-6 text-[9px] px-2 gap-1" onClick={() => copyShareLink(j.shareLink)}><Share2 className="w-3 h-3" /> Share</Button>
                        {canEditHiring && (
                          <div className="relative group">
                            <Button size="sm" variant="outline" className="h-6 w-6 p-0"><MoreHorizontal className="w-3 h-3" /></Button>
                            <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-popover border border-border rounded-lg shadow-lg py-1 z-10 min-w-[140px]">
                              {j.status === "Active" && <button onClick={() => toggleJobStatus(j, "Paused")} className="block w-full text-left px-3 py-1.5 text-[10px] hover:bg-muted text-foreground">Pause</button>}
                              {j.status === "Paused" && <button onClick={() => toggleJobStatus(j, "Active")} className="block w-full text-left px-3 py-1.5 text-[10px] hover:bg-muted text-foreground">Resume</button>}
                              {j.status === "Draft" && <button onClick={() => toggleJobStatus(j, "Active")} className="block w-full text-left px-3 py-1.5 text-[10px] hover:bg-muted text-foreground">Activate</button>}
                              {j.status !== "Closed" && <button onClick={() => toggleJobStatus(j, "Closed")} className="block w-full text-left px-3 py-1.5 text-[10px] hover:bg-muted text-foreground">Close</button>}
                              <button onClick={() => duplicateJob(j)} className="block w-full text-left px-3 py-1.5 text-[10px] hover:bg-muted text-foreground">Duplicate</button>
                              <button onClick={() => togglePublic(j)} className="block w-full text-left px-3 py-1.5 text-[10px] hover:bg-muted text-foreground">Make {j.isPublic ? "Private" : "Public"}</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PIPELINE */}
          {hiringSubTab === "pipeline" && (
            <div className="space-y-3">
              <div>
                <div className="text-sm font-bold text-foreground">Candidates</div>
                <div className="text-[10px] text-muted-foreground">{applicants.length} total applications</div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input value={pipelineSearch} onChange={e => setPipelineSearch(e.target.value)} placeholder="Search name, email, position..." className="h-8 text-xs pl-8" />
                </div>
                <Select value={pipelinePosition} onValueChange={setPipelinePosition}>
                  <SelectTrigger className="h-8 text-xs w-[180px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Positions</SelectItem>
                    {jobs.map(j => <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={pipelineStatus} onValueChange={setPipelineStatus}>
                  <SelectTrigger className="h-8 text-xs w-[140px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {APPLICANT_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={pipelineAppFilter} onValueChange={setPipelineAppFilter}>
                  <SelectTrigger className="h-8 text-xs w-[160px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Applications</SelectItem>
                    <SelectItem value="unread">Unread Only</SelectItem>
                    <SelectItem value="hasReviews">Has Reviews</SelectItem>
                    <SelectItem value="noReviews">No Reviews</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-[10px] text-muted-foreground">{filteredApplicants.length} applications</span>
              </div>

              {/* Table */}
              <div className="bg-card border border-border rounded-xl overflow-hidden overflow-x-auto">
                <table className="w-full text-[11px] min-w-[800px]">
                  <thead>
                    <tr className="border-b border-border">
                      {["Name", "Email", "Position", "Applied", "Rating", "Status", "Actions"].map(h => (
                        <th key={h} className="text-left p-3 font-semibold text-muted-foreground/50 text-[9px] uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplicants.length === 0 && (
                      <tr><td colSpan={7} className="p-8 text-center text-muted-foreground/60 text-[11px]">No candidates yet. Share the job link to start receiving applications.</td></tr>
                    )}
                    {filteredApplicants.map(a => {
                      const job = jobOf(a.jobId);
                      const avg = a.reviews.length ? a.reviews.reduce((s, r) => s + r.rating, 0) / a.reviews.length : 0;
                      const sc = applicantStatusColor(a.status);
                      return (
                        <tr key={a.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 cursor-pointer" onClick={() => openCandidate(a)}>
                          <td className="p-3 font-semibold text-foreground">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full" style={{ background: a.isRead ? "hsl(215,20%,40%)" : "hsl(220,95%,47%)" }} />
                              {a.firstName} {a.lastName}
                            </div>
                          </td>
                          <td className="p-3 text-muted-foreground font-mono text-[10px]">{a.email}</td>
                          <td className="p-3" onClick={e => e.stopPropagation()}>{job ? <Link to={`/founder/team/jobs/${job.id}`} className="text-primary hover:underline">{job.title}</Link> : <span className="text-muted-foreground">-</span>}</td>
                          <td className="p-3 text-muted-foreground">{formatDate(a.appliedAt)}</td>
                          <td className="p-3">
                            {avg ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={ratingColor(avg)}>{avg.toFixed(1)}</span>
                            ) : <span className="text-muted-foreground/40">—</span>}
                          </td>
                          <td className="p-3">
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1" style={{ background: `${sc}22`, color: sc }}>
                              {a.status === "Hired" && <CheckCircle className="w-2.5 h-2.5" />}
                              {a.status}
                            </span>
                          </td>
                          <td className="p-3" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center gap-2">
                              <a href={a.cvUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" title="View CV"><ExternalLink className="w-3 h-3" /></a>
                              {canEditHiring && (
                                <button onClick={() => { if (confirm(`Reject ${a.firstName}?`)) changeApplicantStatus(a.id, "Rejected"); }} className="text-muted-foreground hover:text-destructive" title="Reject"><X className="w-3 h-3" /></button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TALENT POOL */}
          {hiringSubTab === "pool" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="text-sm font-bold text-foreground">Talent Pool</div>
                  <div className="text-[10px] text-muted-foreground">All candidates across roles. Use this view to find people for current and future opportunities.</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 bg-muted rounded-md p-0.5">
                    <button onClick={() => setPoolView("grid")} className={`p-1 rounded ${poolView === "grid" ? "bg-card text-foreground" : "text-muted-foreground"}`}><LayoutGrid className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setPoolView("table")} className={`p-1 rounded ${poolView === "table" ? "bg-card text-foreground" : "text-muted-foreground"}`}><List className="w-3.5 h-3.5" /></button>
                  </div>
                  {canEditHiring && <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => setPoolModalOpen(true)}><UserPlus className="w-3.5 h-3.5" /> Add to Pool</Button>}
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                <KpiCard icon={Users} label="Total Pool" value={poolKpis.total} color="hsl(220,95%,47%)" />
                <KpiCard icon={Star} label="Open to Future" value={poolKpis.future} color="hsl(160,80%,40%)" />
                <KpiCard icon={Briefcase} label="External Talent" value={poolKpis.external} color="hsl(36,90%,53%)" />
                <KpiCard icon={Sparkles} label="Top Skill" value={poolKpis.topSkill} color="hsl(250,60%,60%)" />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input value={poolSearch} onChange={e => setPoolSearch(e.target.value)} placeholder="Search name, email, skills..." className="h-8 text-xs pl-8" />
                </div>
                <Select value={poolSource} onValueChange={setPoolSource}>
                  <SelectTrigger className="h-8 text-xs w-[160px]"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="all">All Sources</SelectItem>{APPLICANT_SOURCES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={poolStatus} onValueChange={setPoolStatus}>
                  <SelectTrigger className="h-8 text-xs w-[140px]"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="all">All Statuses</SelectItem>{APPLICANT_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
                <button onClick={() => setPoolAvailableOnly(!poolAvailableOnly)} className="h-8 px-3 rounded-md border border-border bg-background text-[10px] flex items-center gap-2">
                  <span className="relative inline-flex items-center w-7 h-3.5 rounded-full" style={{ background: poolAvailableOnly ? "hsl(160,80%,40%)" : "hsl(220,15%,38%,0.4)" }}>
                    <span className="inline-block w-2.5 h-2.5 bg-white rounded-full transition-transform" style={{ transform: poolAvailableOnly ? "translateX(15px)" : "translateX(2px)" }} />
                  </span>
                  Available only
                </button>
              </div>

              {/* Tag filter pills */}
              <div className="flex flex-wrap gap-1.5">
                {TALENT_POOL_TAGS.slice(0, 14).map(t => {
                  const active = poolTags.includes(t);
                  return (
                    <button key={t} onClick={() => setPoolTags(prev => active ? prev.filter(x => x !== t) : [...prev, t])}
                      className={`text-[9px] px-2 py-0.5 rounded-full border transition-colors ${active ? "bg-primary/20 border-primary text-primary" : "bg-muted border-border text-muted-foreground hover:text-foreground"}`}>
                      {t}
                    </button>
                  );
                })}
              </div>

              <div className="text-[10px] text-muted-foreground">{filteredPool.length} of {applicants.length} candidates</div>

              {filteredPool.length === 0 && (
                <div className="bg-card border border-border rounded-xl p-8 text-center text-[11px] text-muted-foreground/60">Your talent pool will grow as candidates apply and as you add people through outreach.</div>
              )}

              {poolView === "grid" && filteredPool.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredPool.map(a => {
                    const job = jobOf(a.jobId);
                    const avg = a.reviews.length ? a.reviews.reduce((s, r) => s + r.rating, 0) / a.reviews.length : 0;
                    const sca = applicantStatusColor(a.status);
                    const srcC = sourceColor(a.source);
                    return (
                      <div key={a.id} onClick={() => openCandidate(a)} className="bg-card border border-border rounded-xl p-3.5 cursor-pointer hover:border-primary/50 transition-colors space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-[12px] font-bold text-foreground truncate">{a.firstName} {a.lastName}</div>
                            <div className="text-[10px] text-muted-foreground">{a.location || "—"}</div>
                          </div>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0" style={{ background: `${srcC}22`, color: srcC }}>{a.source}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">For: {job?.title || "—"}</div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${sca}22`, color: sca }}>{a.status}</span>
                          {avg > 0 && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={ratingColor(avg)}>{avg.toFixed(1)}</span>}
                        </div>
                        {a.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {a.skills.slice(0, 3).map(s => <span key={s} className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "hsl(220,95%,47%,0.12)", color: "hsl(220,95%,47%)" }}>{s}</span>)}
                          </div>
                        )}
                        {a.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {a.tags.slice(0, 3).map(t => <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-muted border border-border text-muted-foreground">{t}</span>)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {poolView === "table" && filteredPool.length > 0 && (
                <div className="bg-card border border-border rounded-xl overflow-hidden overflow-x-auto">
                  <table className="w-full text-[11px] min-w-[900px]">
                    <thead><tr className="border-b border-border">{["Name", "Source", "Original Job", "Skills", "Tags", "Status", "Rating", "Last Activity"].map(h => <th key={h} className="text-left p-3 font-semibold text-muted-foreground/50 text-[9px] uppercase tracking-wide">{h}</th>)}</tr></thead>
                    <tbody>
                      {filteredPool.map(a => {
                        const job = jobOf(a.jobId);
                        const avg = a.reviews.length ? a.reviews.reduce((s, r) => s + r.rating, 0) / a.reviews.length : 0;
                        const sca = applicantStatusColor(a.status);
                        const srcC = sourceColor(a.source);
                        return (
                          <tr key={a.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 cursor-pointer" onClick={() => openCandidate(a)}>
                            <td className="p-3 font-semibold text-foreground">{a.firstName} {a.lastName}</td>
                            <td className="p-3"><span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${srcC}22`, color: srcC }}>{a.source}</span></td>
                            <td className="p-3" onClick={e => e.stopPropagation()}>{job ? <Link to={`/founder/team/jobs/${job.id}`} className="text-primary hover:underline">{job.title}</Link> : <span className="text-muted-foreground">—</span>}</td>
                            <td className="p-3"><div className="flex flex-wrap gap-1">{a.skills.slice(0, 3).map(s => <span key={s} className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "hsl(220,95%,47%,0.12)", color: "hsl(220,95%,47%)" }}>{s}</span>)}</div></td>
                            <td className="p-3"><div className="flex flex-wrap gap-1">{a.tags.slice(0, 3).map(t => <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-muted border border-border text-muted-foreground">{t}</span>)}</div></td>
                            <td className="p-3"><span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${sca}22`, color: sca }}>{a.status}</span></td>
                            <td className="p-3">{avg > 0 ? <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={ratingColor(avg)}>{avg.toFixed(1)}</span> : <span className="text-muted-foreground/40">—</span>}</td>
                            <td className="p-3 text-muted-foreground text-[10px]">{relativeTime(a.lastUpdatedAt)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add to Talent Pool Dialog */}
      <Dialog open={poolModalOpen} onOpenChange={v => { if (!v) { setPoolForm(emptyPool); } setPoolModalOpen(v); }}>
        <DialogContent className="sm:max-w-[720px] bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add to Talent Pool</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">First Name *</label><Input value={poolForm.firstName} onChange={e => setPoolForm({ ...poolForm, firstName: e.target.value })} className="h-8 text-xs" /></div>
              <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Last Name *</label><Input value={poolForm.lastName} onChange={e => setPoolForm({ ...poolForm, lastName: e.target.value })} className="h-8 text-xs" /></div>
              <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Email *</label><Input value={poolForm.email} onChange={e => setPoolForm({ ...poolForm, email: e.target.value })} className="h-8 text-xs" /></div>
              <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Phone</label><Input value={poolForm.phone} onChange={e => setPoolForm({ ...poolForm, phone: e.target.value })} className="h-8 text-xs" /></div>
              <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">LinkedIn</label><Input value={poolForm.linkedin} onChange={e => setPoolForm({ ...poolForm, linkedin: e.target.value })} className="h-8 text-xs" /></div>
              <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Portfolio</label><Input value={poolForm.portfolio} onChange={e => setPoolForm({ ...poolForm, portfolio: e.target.value })} className="h-8 text-xs" /></div>
              <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Location</label><Input value={poolForm.location} onChange={e => setPoolForm({ ...poolForm, location: e.target.value })} className="h-8 text-xs" /></div>
              <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Source *</label>
                <Select value={poolForm.source} onValueChange={v => setPoolForm({ ...poolForm, source: v as ApplicantSource })}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{APPLICANT_SOURCES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
              </div>
              <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Initial Status</label>
                <Select value={poolForm.initialStatus} onValueChange={v => setPoolForm({ ...poolForm, initialStatus: v as ApplicantStatus })}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{APPLICANT_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
              </div>
              <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Related Job (optional)</label>
                <Select value={poolForm.jobId || "none"} onValueChange={v => setPoolForm({ ...poolForm, jobId: v === "none" ? "" : v })}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem>{jobs.map(j => <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>)}</SelectContent></Select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground font-medium">Skills</label>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {poolForm.skills.map(s => <span key={s} className="text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1" style={{ background: "hsl(220,95%,47%,0.12)", color: "hsl(220,95%,47%)" }}>{s}<button onClick={() => setPoolForm({ ...poolForm, skills: poolForm.skills.filter(x => x !== s) })}><X className="w-2.5 h-2.5" /></button></span>)}
              </div>
              <div className="flex gap-1.5">
                <Input value={poolSkillInput} onChange={e => setPoolSkillInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addPoolSkill(); } }} placeholder="Type and press Enter..." className="h-7 text-xs" />
                <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={addPoolSkill}>Add</Button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground font-medium">Tags</label>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {poolForm.tags.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1 bg-muted border border-border text-foreground">{t}<button onClick={() => setPoolForm({ ...poolForm, tags: poolForm.tags.filter(x => x !== t) })}><X className="w-2.5 h-2.5" /></button></span>)}
              </div>
              <div className="flex gap-1.5">
                <Input value={poolTagInput} onChange={e => setPoolTagInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addPoolTag(); } }} placeholder="Add tag..." list="pool-tag-suggestions" className="h-7 text-xs" />
                <datalist id="pool-tag-suggestions">{TALENT_POOL_TAGS.map(t => <option key={t} value={t} />)}</datalist>
                <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={addPoolTag}>Add</Button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground font-medium">Notes</label>
              <Textarea value={poolForm.notes} onChange={e => setPoolForm({ ...poolForm, notes: e.target.value })} rows={3} placeholder="How they came to us, what role they might fit..." className="text-xs" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPoolModalOpen(false)} className="text-xs h-8">Cancel</Button>
            <Button onClick={savePoolEntry} className="text-xs h-8">Save to Pool</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Member Dialog */}
      <Dialog open={addModal} onOpenChange={v => { if (!v) { setEditIdx(null); resetForm(); } setAddModal(v); }}>
        <DialogContent className="sm:max-w-[480px] bg-card border-border">
          <DialogHeader><DialogTitle>{editIdx !== null ? "Edit Team Member" : "Add Team Member"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Full Name *</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Role</label><Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Department</label>
              <Select value={form.dept} onValueChange={v => setForm({ ...form, dept: v })}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{DEPTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Equity</label><Input value={form.equity} onChange={e => setForm({ ...form, equity: e.target.value })} className="h-8 text-xs" /></div>
          </div>
          <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Skills (comma-separated)</label><Input value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} className="h-8 text-xs" /></div>
          <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Bio</label><Input value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="h-8 text-xs" /></div>
          <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Current Focus</label><Input value={form.focus} onChange={e => setForm({ ...form, focus: e.target.value })} className="h-8 text-xs" /></div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => { setAddModal(false); setEditIdx(null); resetForm(); }} className="text-xs h-8">Cancel</Button>
            <Button onClick={saveMember} disabled={!form.name.trim()} className="text-xs h-8">{editIdx !== null ? "Save Changes" : "Add Member"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Advisor Dialog */}
      <Dialog open={addAdvisorModal} onOpenChange={v => { if (!v) { setEditAdvisorIdx(null); resetAdvisorForm(); } setAddAdvisorModal(v); }}>
        <DialogContent className="sm:max-w-[420px] bg-card border-border">
          <DialogHeader><DialogTitle>{editAdvisorIdx !== null ? "Edit Advisor" : "Add Advisor"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Name *</label><Input value={advisorForm.name} onChange={e => setAdvisorForm({ ...advisorForm, name: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Role</label><Input value={advisorForm.role} onChange={e => setAdvisorForm({ ...advisorForm, role: e.target.value })} className="h-8 text-xs" /></div>
          </div>
          <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Note</label><Input value={advisorForm.note} onChange={e => setAdvisorForm({ ...advisorForm, note: e.target.value })} className="h-8 text-xs" /></div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => { setAddAdvisorModal(false); setEditAdvisorIdx(null); resetAdvisorForm(); }} className="text-xs h-8">Cancel</Button>
            <Button onClick={saveAdvisor} disabled={!advisorForm.name.trim()} className="text-xs h-8">{editAdvisorIdx !== null ? "Save Changes" : "Add Advisor"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Job Dialog */}
      <JobFormDialog
        open={jobModalOpen}
        onOpenChange={setJobModalOpen}
        initial={jobInitial}
        mode={jobEditId ? "edit" : "create"}
        onSave={saveJob}
      />

      {/* Delete Job */}
      <Dialog open={!!jobToDelete} onOpenChange={() => setJobToDelete(null)}>
        <DialogContent className="sm:max-w-[400px] bg-card border-border">
          <DialogHeader>
            <DialogTitle>Delete {jobToDelete?.title}?</DialogTitle>
            <DialogDescription>This cannot be undone. {jobToDelete && applicantCount(jobToDelete.id)} applications will also be deleted.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setJobToDelete(null)} className="text-xs h-8">Cancel</Button>
            <Button variant="destructive" onClick={deleteJob} className="text-xs h-8">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CandidateModal candidateId={candidateOpen} onClose={() => setCandidateOpen(null)} />
    </div>
  );
};

export const Route = createFileRoute("/founder/team")({ component: Team });
