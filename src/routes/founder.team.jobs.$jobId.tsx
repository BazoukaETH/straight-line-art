import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useNavigate, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Pencil, Pause, Play, X, Share2, Copy, ExternalLink, Search, Eye, Inbox, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useHiring } from "@/contexts/HiringContext";
import { useUsers } from "@/contexts/UserContext";
import CandidateModal from "@/components/CandidateModal";
import JobFormDialog, { type JobFormValues, jobToForm } from "@/components/JobFormDialog";
import { toast } from "sonner";
import { APPLICANT_STATUSES, sourceColor, type ApplicantStatus, type JobStatus, type WorkType } from "@/data/jobs";

const workTypeColor = (w: WorkType) => w === "Remote" ? "hsl(160,80%,40%)" : w === "On-site" ? "hsl(220,95%,47%)" : "hsl(250,60%,60%)";
const jobStatusColor = (s: JobStatus) => s === "Active" ? "hsl(160,80%,40%)" : s === "Paused" ? "hsl(36,90%,53%)" : s === "Draft" ? "hsl(215,20%,55%)" : "hsl(350,75%,50%)";
const applicantStatusColor = (s: ApplicantStatus): string => {
  switch (s) {
    case "New": return "hsl(220,95%,47%)";
    case "Reviewing": return "hsl(36,90%,53%)";
    case "Interview": return "hsl(250,60%,60%)";
    case "Offer": return "hsl(160,80%,40%)";
    case "Hired": return "hsl(145,80%,42%)";
    case "Rejected": return "hsl(350,75%,50%)";
  }
};
const ratingColor = (r: number) => r < 3 ? { background: "hsl(350,75%,50%)", color: "white" } : r === 3 ? { background: "hsl(36,90%,53%)", color: "hsl(0,0%,12%)" } : { background: "hsl(160,80%,40%)", color: "white" };
const formatDate = (d: string) => { if (!d) return "-"; try { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); } catch { return d; } };
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

function JobDetail() {
  const { jobId } = useParams({ strict: false }) as { jobId: string };
  const navigate = useNavigate();
  const { jobs, setJobs, applicants, setApplicants } = useHiring();
  const { currentUser } = useUsers();
  const canEditHiring = currentUser.role === "Founder" || (currentUser.role === "Team" && !!currentUser.isHiringManager);
  const canSeeHiring = canEditHiring || currentUser.role === "Team";

  const job = jobs.find(j => j.id === jobId);
  const jobApplicants = useMemo(() => applicants.filter(a => a.jobId === jobId), [applicants, jobId]);

  const [tab, setTab] = useState<"details" | "candidates" | "analytics">(jobApplicants.length > 0 ? "candidates" : "details");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [openCandidateId, setOpenCandidateId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  if (!canSeeHiring) {
    return <div className="bg-card border border-border rounded-xl p-8 text-center"><p className="text-[11px] text-muted-foreground">You don't have permission to view the Hiring section.</p></div>;
  }
  if (!job) {
    return (
      <div className="space-y-3">
        <Link to="/founder/team" className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Back to Hiring</Link>
        <div className="bg-card border border-border rounded-xl p-8 text-center"><p className="text-[11px] text-muted-foreground">Job not found.</p></div>
      </div>
    );
  }

  function toggleStatus(status: JobStatus) {
    setJobs(prev => prev.map(p => p.id === job!.id ? { ...p, status } : p));
    toast.success(`Job ${status}`);
  }
  function copyShareLink() { navigator.clipboard.writeText(job!.shareLink); toast.success("Copied to clipboard"); }
  function togglePublic() {
    setJobs(prev => prev.map(p => p.id === job!.id ? { ...p, isPublic: !p.isPublic } : p));
  }

  function openCandidate(id: string, isRead: boolean) {
    if (!isRead) {
      setApplicants(prev => prev.map(p => p.id === id ? {
        ...p, isRead: true,
        activity: [...p.activity, { id: `act-${Date.now()}`, actorName: currentUser.name, action: "opened applicant", timestamp: new Date().toISOString().slice(0, 16).replace("T", " ") }],
      } : p));
    }
    setOpenCandidateId(id);
  }

  const filteredCandidates = useMemo(() => {
    let res = jobApplicants.filter(a => {
      const matchSearch = !search || `${a.firstName} ${a.lastName} ${a.email}`.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || a.status === statusFilter;
      const avg = a.reviews.length ? a.reviews.reduce((s, r) => s + r.rating, 0) / a.reviews.length : 0;
      const matchRating = ratingFilter === "all"
        || (ratingFilter === "unrated" && a.reviews.length === 0)
        || (ratingFilter === "low" && a.reviews.length > 0 && avg < 3)
        || (ratingFilter === "mid" && a.reviews.length > 0 && Math.round(avg) === 3)
        || (ratingFilter === "high" && a.reviews.length > 0 && avg >= 4);
      return matchSearch && matchStatus && matchRating;
    });
    res = [...res].sort((a, b) => {
      const aAvg = a.reviews.length ? a.reviews.reduce((s, r) => s + r.rating, 0) / a.reviews.length : 0;
      const bAvg = b.reviews.length ? b.reviews.reduce((s, r) => s + r.rating, 0) / b.reviews.length : 0;
      switch (sortBy) {
        case "oldest": return a.appliedAt.localeCompare(b.appliedAt);
        case "highestRated": return bAvg - aAvg;
        case "mostReviews": return b.reviews.length - a.reviews.length;
        default: return b.appliedAt.localeCompare(a.appliedAt);
      }
    });
    return res;
  }, [jobApplicants, search, statusFilter, ratingFilter, sortBy]);

  const counts = useMemo(() => ({
    total: jobApplicants.length,
    new: jobApplicants.filter(a => a.status === "New").length,
    interview: jobApplicants.filter(a => a.status === "Interview").length,
    hired: jobApplicants.filter(a => a.status === "Hired").length,
    rejected: jobApplicants.filter(a => a.status === "Rejected").length,
  }), [jobApplicants]);

  const conversion = job.viewCount > 0 ? ((jobApplicants.length / job.viewCount) * 100).toFixed(1) : "0";

  // Application timeline (last 8 weeks, dummy data)
  const timeline = useMemo(() => {
    const weeks: { label: string; count: number }[] = [];
    for (let i = 7; i >= 0; i--) {
      weeks.push({ label: `W-${i}`, count: Math.max(0, Math.floor(jobApplicants.length / 8 + Math.random() * 3 - 1)) });
    }
    return weeks;
  }, [jobApplicants.length]);

  const sourceBreakdown = useMemo(() => {
    const m = new Map<string, number>();
    jobApplicants.forEach(a => m.set(a.source, (m.get(a.source) || 0) + 1));
    return Array.from(m.entries());
  }, [jobApplicants]);

  const wt = workTypeColor(job.workType);
  const sc = jobStatusColor(job.status);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate({ to: "/founder/team" as never })} className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Hiring
        </button>
        <div className="text-[10px] text-muted-foreground">Team / Hiring / <span className="text-foreground">{job.title}</span></div>
      </div>

      {/* Header */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-foreground tracking-tight">{job.title}</h1>
            <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[10px]">
              <span className="text-muted-foreground">{job.venture}</span><span className="text-muted-foreground/50">·</span>
              <span className="text-muted-foreground">{job.location}</span><span className="text-muted-foreground/50">·</span>
              <span className="text-muted-foreground">{job.employmentType}</span>
              <span className="font-bold px-2 py-0.5 rounded-full" style={{ background: `${wt}22`, color: wt }}>{job.workType}</span>
              <span className="font-bold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>{job.status}</span>
            </div>
            <div className="text-[10px] text-muted-foreground mt-2">
              {job.viewCount} views · {jobApplicants.length} applications · Posted {relativeTime(job.createdAt)} by {job.createdBy}
            </div>
          </div>
          {canEditHiring && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={() => setEditOpen(true)}><Pencil className="w-3 h-3" /> Edit Job</Button>
              {job.status === "Active" && <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={() => toggleStatus("Paused")}><Pause className="w-3 h-3" /> Pause</Button>}
              {job.status === "Paused" && <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={() => toggleStatus("Active")}><Play className="w-3 h-3" /> Resume</Button>}
              {job.status !== "Closed" && <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => toggleStatus("Closed")}><X className="w-3 h-3" /> Close Job</Button>}
              <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={copyShareLink}><Share2 className="w-3 h-3" /> Share Link</Button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-border">
        {[
          { id: "details" as const, l: "Job Details" },
          { id: "candidates" as const, l: `Candidates (${jobApplicants.length})` },
          { id: "analytics" as const, l: "Analytics" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-[11px] font-medium transition-colors border-b-2 ${tab === t.id ? "text-secondary border-secondary" : "text-muted-foreground border-transparent hover:text-foreground"}`}>
            {t.l}
          </button>
        ))}
      </div>

      {/* Job Details */}
      {tab === "details" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-[9px] uppercase tracking-wide text-muted-foreground/60 font-semibold mb-2">About the Role</div>
              <p className="text-[12px] text-foreground/90 leading-relaxed whitespace-pre-wrap">{job.aboutRole}</p>
            </div>
            {job.responsibilities.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="text-[9px] uppercase tracking-wide text-muted-foreground/60 font-semibold mb-2">Responsibilities</div>
                <ul className="space-y-1.5">{job.responsibilities.map((r, i) => <li key={i} className="text-[11px] text-foreground/90 flex gap-2"><span className="text-muted-foreground/50">•</span>{r}</li>)}</ul>
              </div>
            )}
            {job.requirements.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="text-[9px] uppercase tracking-wide text-muted-foreground/60 font-semibold mb-2">Requirements</div>
                <ul className="space-y-1.5">{job.requirements.map((r, i) => <li key={i} className="text-[11px] text-foreground/90 flex gap-2"><span className="text-muted-foreground/50">•</span>{r}</li>)}</ul>
              </div>
            )}
            {job.niceToHave.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="text-[9px] uppercase tracking-wide text-muted-foreground/60 font-semibold mb-2">Nice to Have</div>
                <ul className="space-y-1.5">{job.niceToHave.map((r, i) => <li key={i} className="text-[11px] text-foreground/90 flex gap-2"><span className="text-muted-foreground/50">•</span>{r}</li>)}</ul>
              </div>
            )}
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card border border-border rounded-xl p-4 space-y-2">
              <div className="text-[9px] uppercase tracking-wide text-muted-foreground/60 font-semibold mb-1">Job Info</div>
              {[
                ["Department", job.department],
                ["Venture", job.venture],
                ["Work Type", job.workType],
                ["Location", job.location],
                ["Employment Type", job.employmentType],
                ["Salary Range", job.salaryRange || "—"],
                ["Status", job.status],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="text-foreground font-medium">{v}</span>
                </div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-xl p-4 space-y-2.5">
              <div className="text-[9px] uppercase tracking-wide text-muted-foreground/60 font-semibold mb-1">Public Page</div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Public</span>
                <button disabled={!canEditHiring} onClick={togglePublic} className="inline-flex items-center gap-2 disabled:opacity-50">
                  <span className="relative inline-flex items-center w-8 h-4 rounded-full transition-colors" style={{ background: job.isPublic ? "hsl(160,80%,40%)" : "hsl(220,15%,38%,0.4)" }}>
                    <span className="inline-block w-3 h-3 bg-white rounded-full transition-transform" style={{ transform: job.isPublic ? "translateX(18px)" : "translateX(2px)" }} />
                  </span>
                  <span className="text-foreground font-medium">{job.isPublic ? "Yes" : "No"}</span>
                </button>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-muted-foreground">Share Link</div>
                <div className="flex items-center gap-1.5">
                  <Input readOnly value={job.shareLink} className="h-7 text-[10px] font-mono" />
                  <Button size="sm" variant="outline" className="h-7 px-2" onClick={copyShareLink}><Copy className="w-3 h-3" /></Button>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Views</span>
                <span className="text-foreground font-medium">{job.viewCount}</span>
              </div>
              <a href={job.shareLink} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="w-full h-8 text-xs gap-1.5"><ExternalLink className="w-3 h-3" /> Open Public Page</Button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Candidates */}
      {tab === "candidates" && (
        <div className="space-y-3">
          <div className="text-[10px] text-muted-foreground">
            <span className="font-bold text-foreground">{counts.total}</span> total · <span className="font-bold" style={{ color: applicantStatusColor("New") }}>{counts.new}</span> new · <span className="font-bold" style={{ color: applicantStatusColor("Interview") }}>{counts.interview}</span> in interview · <span className="font-bold" style={{ color: applicantStatusColor("Hired") }}>{counts.hired}</span> hired · <span className="font-bold" style={{ color: applicantStatusColor("Rejected") }}>{counts.rejected}</span> rejected
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email..." className="h-8 text-xs pl-8" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 text-xs w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Statuses</SelectItem>{APPLICANT_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="h-8 text-xs w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="unrated">Unrated</SelectItem>
                <SelectItem value="low">1-2 stars</SelectItem>
                <SelectItem value="mid">3 stars</SelectItem>
                <SelectItem value="high">4-5 stars</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-8 text-xs w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="highestRated">Highest Rated</SelectItem>
                <SelectItem value="mostReviews">Most Reviews</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-[11px] min-w-[800px]">
              <thead>
                <tr className="border-b border-border">
                  {["Name", "Email", "Applied", "Rating", "Status", "Reviews", "Actions"].map(h => (
                    <th key={h} className="text-left p-3 font-semibold text-muted-foreground/50 text-[9px] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-muted-foreground/60 text-[11px]">No candidates yet for this role. Share the public link to start receiving applications.</td></tr>
                )}
                {filteredCandidates.map(a => {
                  const avg = a.reviews.length ? a.reviews.reduce((s, r) => s + r.rating, 0) / a.reviews.length : 0;
                  const sca = applicantStatusColor(a.status);
                  return (
                    <tr key={a.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 cursor-pointer" onClick={() => openCandidate(a.id, a.isRead)}>
                      <td className="p-3 font-semibold text-foreground">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ background: a.isRead ? "hsl(215,20%,40%)" : "hsl(220,95%,47%)" }} />
                          {a.firstName} {a.lastName}
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground font-mono text-[10px]">{a.email}</td>
                      <td className="p-3 text-muted-foreground">{formatDate(a.appliedAt)}</td>
                      <td className="p-3">{avg ? <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={ratingColor(avg)}>{avg.toFixed(1)}</span> : <span className="text-muted-foreground/40">—</span>}</td>
                      <td className="p-3"><span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${sca}22`, color: sca }}>{a.status}</span></td>
                      <td className="p-3" onClick={e => { e.stopPropagation(); openCandidate(a.id, a.isRead); }}>
                        {a.reviews.length === 0 ? <span className="text-muted-foreground/40 text-[10px]">No reviews</span> : (
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-muted-foreground">{a.reviews.length}</span>
                            <div className="flex -space-x-1">
                              {Array.from(new Set(a.reviews.map(r => r.reviewerName))).slice(0, 3).map(n => (
                                <span key={n} title={n} className="w-5 h-5 rounded-full border border-card bg-muted text-[8px] font-bold text-foreground flex items-center justify-center">
                                  {n.split(" ").map(p => p[0]).join("").slice(0, 2)}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="p-3" onClick={e => e.stopPropagation()}>
                        <a href={a.cvUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" title="View CV"><ExternalLink className="w-3 h-3" /></a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics */}
      {tab === "analytics" && (
        <div className="space-y-4">
          <div className="text-[10px] text-muted-foreground italic">Real-time analytics will populate once Moaz wires the public job pages.</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            <KpiCard icon={Eye} label="Total Views" value={job.viewCount} color="hsl(220,95%,47%)" />
            <KpiCard icon={Inbox} label="Applications" value={jobApplicants.length} color="hsl(160,80%,40%)" />
            <KpiCard icon={TrendingUp} label="Conversion" value={`${conversion}%`} color="hsl(36,90%,53%)" />
            <KpiCard icon={Clock} label="Avg Time to Review" value="2.3 days" color="hsl(250,60%,60%)" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-[9px] uppercase tracking-wide text-muted-foreground/60 font-semibold mb-3">Applications (Last 8 Weeks)</div>
              <div className="flex items-end gap-2 h-32">
                {timeline.map((w, i) => {
                  const maxH = Math.max(...timeline.map(t => t.count), 1);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full rounded-t" style={{ background: "hsl(220,95%,47%)", height: `${(w.count / maxH) * 100}%`, minHeight: "2px" }} />
                      <div className="text-[8px] text-muted-foreground/70">{w.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-[9px] uppercase tracking-wide text-muted-foreground/60 font-semibold mb-3">Source Breakdown</div>
              {sourceBreakdown.length === 0 && <div className="text-[11px] text-muted-foreground">No applications yet.</div>}
              <div className="space-y-2">
                {sourceBreakdown.map(([s, n]) => {
                  const total = jobApplicants.length || 1;
                  const pct = (n / total) * 100;
                  const c = sourceColor(s as any);
                  return (
                    <div key={s}>
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-foreground">{s}</span>
                        <span className="text-muted-foreground">{n} ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ background: c, width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <CandidateModal candidateId={openCandidateId} onClose={() => setOpenCandidateId(null)} />
      <JobFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initial={jobToForm(job)}
        mode="edit"
        onSave={(values: JobFormValues) => {
          setJobs(prev => prev.map(j => j.id === job.id ? { ...j, ...values } : j));
          toast.success("Job updated");
        }}
      />
    </div>
  );
}

export const Route = createFileRoute("/founder/team/jobs/$jobId")({ component: JobDetail });
