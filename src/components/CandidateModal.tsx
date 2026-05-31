import { useState, useMemo } from "react";
import { Plus, Pencil, Star, X, FileText, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUsers } from "@/contexts/UserContext";
import { useHiring } from "@/contexts/HiringContext";
import { toast } from "sonner";
import {
  APPLICANT_STATUSES, FIT_LEVELS, EXPERIENCE_LEVELS, RECOMMENDATIONS, APPLICANT_SOURCES, TALENT_POOL_TAGS, sourceColor,
  type ApplicantStatus, type FitLevel, type ExperienceLevel, type Recommendation, type Review,
  type ApplicantSource,
} from "@/data/jobs";

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

const Stars = ({ rating, size = 12, onChange }: { rating: number; size?: number; onChange?: (r: number) => void }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(n => (
      <Star key={n} style={{ width: size, height: size }}
        className={`${onChange ? "cursor-pointer" : ""} ${n <= rating ? "fill-current" : ""}`}
        color={n <= rating ? "hsl(48,95%,55%)" : "hsl(220,15%,38%)"}
        onClick={() => onChange?.(n)} />
    ))}
  </div>
);

interface Props {
  candidateId: string | null;
  onClose: () => void;
  initialTab?: TabId;
}
type TabId = "overview" | "reviews" | "activity" | "pool";

export default function CandidateModal({ candidateId, onClose, initialTab = "overview" }: Props) {
  const { applicants, setApplicants, jobs } = useHiring();
  const { currentUser } = useUsers();
  const canEditHiring = currentUser.role === "Founder" || (currentUser.role === "Team" && !!currentUser.isHiringManager);

  const [tab, setTab] = useState<TabId>(initialTab);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewEditId, setReviewEditId] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState<{ rating: number; fit: FitLevel; experience: ExperienceLevel; recommendation: Recommendation; notes: string }>({
    rating: 0, fit: "Good", experience: "Mid", recommendation: "Maybe", notes: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [skillInput, setSkillInput] = useState("");

  const candidate = applicants.find(a => a.id === candidateId);
  const candidateJob = candidate ? jobs.find(j => j.id === candidate.jobId) : undefined;
  const avgRating = candidate && candidate.reviews.length
    ? candidate.reviews.reduce((s, r) => s + r.rating, 0) / candidate.reviews.length : 0;

  function mode<T extends string>(arr: T[]): T | undefined {
    const m = new Map<T, number>(); arr.forEach(v => m.set(v, (m.get(v) || 0) + 1));
    let best: T | undefined; let bestN = 0;
    m.forEach((n, k) => { if (n > bestN) { bestN = n; best = k; } });
    return best;
  }

  function patch(patchFn: (a: typeof applicants[0]) => typeof applicants[0]) {
    if (!candidate) return;
    setApplicants(prev => prev.map(a => a.id === candidate.id ? patchFn(a) : a));
  }

  function changeStatus(status: ApplicantStatus) {
    if (!candidate || candidate.status === status) return;
    const ts = new Date().toISOString().slice(0, 16).replace("T", " ");
    patch(a => ({
      ...a, status, lastUpdatedAt: new Date().toISOString().slice(0, 10),
      activity: [...a.activity, { id: `act-${Date.now()}`, actorName: currentUser.name, action: `moved to ${status}`, timestamp: ts }],
    }));
  }

  function openAddReview(existing?: Review) {
    if (existing) {
      setReviewForm({ rating: existing.rating, fit: existing.fit, experience: existing.experience, recommendation: existing.recommendation, notes: existing.notes });
      setReviewEditId(existing.id);
    } else {
      setReviewForm({ rating: 0, fit: "Good", experience: "Mid", recommendation: "Maybe", notes: "" });
      setReviewEditId(null);
    }
    setReviewModalOpen(true);
  }

  function saveReview() {
    if (!candidate || reviewForm.rating < 1) { toast.error("Pick a rating"); return; }
    const ts = new Date().toISOString().slice(0, 16).replace("T", " ");
    patch(a => {
      if (reviewEditId) {
        return {
          ...a,
          reviews: a.reviews.map(r => r.id === reviewEditId ? { ...r, ...reviewForm } : r),
          activity: [...a.activity, { id: `act-${Date.now()}`, actorName: currentUser.name, action: "edited their review", timestamp: ts }],
        };
      }
      const newReview: Review = {
        id: `rev-${Date.now()}`, reviewerId: currentUser.id, reviewerName: currentUser.name,
        rating: reviewForm.rating, fit: reviewForm.fit, experience: reviewForm.experience,
        recommendation: reviewForm.recommendation, notes: reviewForm.notes, createdAt: ts,
      };
      return {
        ...a, reviews: [...a.reviews, newReview],
        activity: [...a.activity, { id: `act-${Date.now()}`, actorName: currentUser.name, action: `added review (${reviewForm.rating} stars)`, timestamp: ts }],
      };
    });
    setReviewModalOpen(false);
    toast.success(reviewEditId ? "Review updated" : "Review added");
  }

  function addTag(t: string) {
    const v = t.trim().toLowerCase(); if (!v || !candidate) return;
    if (candidate.tags.includes(v)) return;
    patch(a => ({ ...a, tags: [...a.tags, v] }));
    setTagInput("");
  }
  function removeTag(t: string) { patch(a => ({ ...a, tags: a.tags.filter(x => x !== t) })); }
  function addSkill(s: string) {
    const v = s.trim(); if (!v || !candidate) return;
    if (candidate.skills.includes(v)) return;
    patch(a => ({ ...a, skills: [...a.skills, v] }));
    setSkillInput("");
  }
  function removeSkill(s: string) { patch(a => ({ ...a, skills: a.skills.filter(x => x !== s) })); }
  function setSource(s: ApplicantSource) { patch(a => ({ ...a, source: s })); }
  function setConsider(v: boolean) { patch(a => ({ ...a, considerForFutureRoles: v })); }
  function setFutureNotes(v: string) { patch(a => ({ ...a, futureRoleNotes: v })); }

  return (
    <>
      <Dialog open={!!candidateId} onOpenChange={(v) => { if (!v) onClose(); }}>
        <DialogContent className="sm:max-w-[900px] bg-card border-border max-h-[90vh] overflow-y-auto">
          {candidate && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <DialogTitle className="text-lg">{candidate.firstName} {candidate.lastName}</DialogTitle>
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${applicantStatusColor(candidate.status)}22`, color: applicantStatusColor(candidate.status) }}>{candidate.status}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${sourceColor(candidate.source)}22`, color: sourceColor(candidate.source) }}>{candidate.source}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-2 flex flex-wrap gap-x-2">
                      <span>{candidate.email}</span>
                      {candidate.phone && <><span>·</span><span>{candidate.phone}</span></>}
                      {candidate.location && <><span>·</span><span>{candidate.location}</span></>}
                      <span>·</span><span>Applied {formatDate(candidate.appliedAt)}</span>
                    </div>
                  </div>
                  {candidateJob && (
                    <a href={`/team/jobs/${candidateJob.id}`} target="_blank" rel="noopener noreferrer" className="shrink-0 mt-1">
                      <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1.5"><ExternalLink className="w-3 h-3" /> View Job Posting</Button>
                    </a>
                  )}
                </div>
              </DialogHeader>

              <div className="flex gap-0 border-b border-border flex-wrap">
                {[
                  { id: "overview" as const, l: "Overview" },
                  { id: "reviews" as const, l: `Reviews (${candidate.reviews.length})` },
                  { id: "activity" as const, l: `Activity (${candidate.activity.length})` },
                  { id: "pool" as const, l: "Pool Info" },
                ].map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    className={`px-4 py-2 text-[11px] font-medium transition-colors border-b-2 ${tab === t.id ? "text-secondary border-secondary" : "text-muted-foreground border-transparent hover:text-foreground"}`}>
                    {t.l}
                  </button>
                ))}
              </div>

              {tab === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="md:col-span-3 space-y-3">
                    <div>
                      <div className="text-[9px] uppercase tracking-wide text-muted-foreground/60 font-semibold mb-1">Cover Note</div>
                      <p className="text-[11px] italic text-muted-foreground leading-relaxed">{candidate.coverNote || "—"}</p>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-wide text-muted-foreground/60 font-semibold mb-1.5">About</div>
                      <div className="space-y-1 text-[11px]">
                        <div><span className="text-muted-foreground">Position: </span><span className="text-foreground font-semibold">{candidateJob?.title || "—"}</span></div>
                        <div><span className="text-muted-foreground">Applied: </span>{formatDate(candidate.appliedAt)}</div>
                        {candidate.location && <div><span className="text-muted-foreground">Location: </span>{candidate.location}</div>}
                        {candidate.linkedin && <div><span className="text-muted-foreground">LinkedIn: </span><a href={candidate.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{candidate.linkedin}</a></div>}
                        {candidate.portfolio && <div><span className="text-muted-foreground">Portfolio: </span><a href={candidate.portfolio} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{candidate.portfolio}</a></div>}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-wide text-muted-foreground/60 font-semibold mb-1.5">CV</div>
                      <a href={candidate.cvUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="h-8 text-xs gap-1.5"><FileText className="w-3.5 h-3.5" /> View CV</Button>
                      </a>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <div className="bg-muted/40 rounded-lg p-3">
                      <div className="text-[9px] uppercase tracking-wide text-muted-foreground/60 font-semibold mb-2">Current Status</div>
                      <Select value={candidate.status} onValueChange={v => changeStatus(v as ApplicantStatus)} disabled={!canEditHiring}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>{APPLICANT_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>

                    {candidate.reviews.length > 0 && (
                      <div className="bg-muted/40 rounded-lg p-3">
                        <div className="text-[9px] uppercase tracking-wide text-muted-foreground/60 font-semibold mb-2">Rating Summary</div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl font-bold" style={{ color: ratingColor(avgRating).background as string }}>{avgRating.toFixed(1)}</span>
                          <Stars rating={Math.round(avgRating)} size={14} />
                        </div>
                        <div className="text-[10px] space-y-0.5 text-muted-foreground">
                          <div>Fit: <span className="text-foreground">{mode(candidate.reviews.map(r => r.fit))}</span></div>
                          <div>Experience: <span className="text-foreground">{mode(candidate.reviews.map(r => r.experience))}</span></div>
                          <div>Recommendation: <span className="text-foreground">{mode(candidate.reviews.map(r => r.recommendation))}</span></div>
                        </div>
                      </div>
                    )}

                    <div className="bg-muted/40 rounded-lg p-3 space-y-2">
                      <div className="text-[9px] uppercase tracking-wide text-muted-foreground/60 font-semibold">Quick Actions</div>
                      {canEditHiring ? (
                        <>
                          <Button size="sm" variant="outline" className="w-full h-8 text-xs gap-1.5" onClick={() => openAddReview()}><Plus className="w-3 h-3" /> Add Review</Button>
                          <Button size="sm" variant="outline" className="w-full h-8 text-xs" onClick={() => changeStatus("Interview")}>Move to Interview</Button>
                          <Button size="sm" variant="outline" className="w-full h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => { if (confirm("Reject this candidate?")) changeStatus("Rejected"); }}>Reject</Button>
                        </>
                      ) : <p className="text-[10px] text-muted-foreground">Read-only view.</p>}
                    </div>

                    {/* Talent Pool Info card */}
                    <div className="bg-muted/40 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-[9px] uppercase tracking-wide text-muted-foreground/60 font-semibold">Talent Pool Info</div>
                        <button onClick={() => setTab("pool")} className="text-[9px] text-primary hover:underline">Edit</button>
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Source: <span className="font-bold px-1.5 py-0.5 rounded ml-1" style={{ background: `${sourceColor(candidate.source)}22`, color: sourceColor(candidate.source) }}>{candidate.source}</span>
                      </div>
                      {candidate.tags.length > 0 && (
                        <div>
                          <div className="text-[9px] text-muted-foreground/70 mb-1">Tags</div>
                          <div className="flex flex-wrap gap-1">
                            {candidate.tags.slice(0, 6).map(t => <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-muted border border-border text-muted-foreground">{t}</span>)}
                          </div>
                        </div>
                      )}
                      {candidate.skills.length > 0 && (
                        <div>
                          <div className="text-[9px] text-muted-foreground/70 mb-1">Skills</div>
                          <div className="flex flex-wrap gap-1">
                            {candidate.skills.slice(0, 6).map(s => <span key={s} className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "hsl(220,95%,47%,0.12)", color: "hsl(220,95%,47%)" }}>{s}</span>)}
                          </div>
                        </div>
                      )}
                      <div className="text-[10px] text-muted-foreground pt-1">
                        Future: {candidate.considerForFutureRoles
                          ? <span className="font-bold px-1.5 py-0.5 rounded ml-1 inline-flex items-center gap-1" style={{ background: "hsl(160,80%,40%,0.18)", color: "hsl(160,80%,40%)" }}><Star className="w-2.5 h-2.5 fill-current" /> Yes</span>
                          : <span className="font-bold px-1.5 py-0.5 rounded ml-1" style={{ background: "hsl(220,15%,38%,0.2)", color: "hsl(215,15%,55%)" }}>No</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {tab === "reviews" && (
                <div className="space-y-3">
                  {canEditHiring && <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => openAddReview()}><Plus className="w-3.5 h-3.5" /> Add Review</Button>}
                  {candidate.reviews.length === 0 && <div className="text-[11px] text-muted-foreground text-center py-6">No reviews yet.</div>}
                  {[...candidate.reviews].reverse().map(r => (
                    <div key={r.id} className="bg-muted/40 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-1.5">
                        <div className="text-[11px] font-bold text-foreground">{r.reviewerName}</div>
                        <div className="text-[9px] text-muted-foreground">{r.createdAt}</div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Stars rating={r.rating} size={12} />
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={ratingColor(r.rating)}>{r.rating}/5</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mb-1.5">
                        Fit: <span className="text-foreground font-medium">{r.fit}</span> · Experience: <span className="text-foreground font-medium">{r.experience}</span> · Recommend: <span className="text-foreground font-medium">{r.recommendation}</span>
                      </div>
                      {r.notes && <div className="text-[11px] text-muted-foreground leading-relaxed">{r.notes}</div>}
                      {r.reviewerId === currentUser.id && (
                        <Button size="sm" variant="outline" className="h-6 text-[10px] mt-2 gap-1" onClick={() => openAddReview(r)}><Pencil className="w-3 h-3" /> Edit</Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {tab === "activity" && (
                <div className="space-y-2">
                  {[...candidate.activity].reverse().map(act => (
                    <div key={act.id} className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: "hsl(220,95%,47%)" }} />
                      <div className="flex-1">
                        <div className="text-[11px] text-foreground"><span className="font-semibold">{act.actorName}</span> {act.action}</div>
                        <div className="text-[9px] text-muted-foreground">{act.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab === "pool" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-muted-foreground font-medium">Source</label>
                      <Select value={candidate.source} onValueChange={v => setSource(v as ApplicantSource)} disabled={!canEditHiring}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>{APPLICANT_SOURCES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-muted-foreground font-medium">Consider for Future Roles</label>
                      <button disabled={!canEditHiring} onClick={() => setConsider(!candidate.considerForFutureRoles)} className="h-8 px-3 rounded-md border border-border bg-background text-xs flex items-center gap-2 disabled:opacity-50">
                        <span className="relative inline-flex items-center w-8 h-4 rounded-full transition-colors" style={{ background: candidate.considerForFutureRoles ? "hsl(160,80%,40%)" : "hsl(220,15%,38%,0.4)" }}>
                          <span className="inline-block w-3 h-3 bg-white rounded-full transition-transform" style={{ transform: candidate.considerForFutureRoles ? "translateX(18px)" : "translateX(2px)" }} />
                        </span>
                        {candidate.considerForFutureRoles ? "Yes" : "No"}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground font-medium">Tags</label>
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      {candidate.tags.map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1 bg-muted border border-border text-foreground">
                          {t}
                          {canEditHiring && <button onClick={() => removeTag(t)} className="text-muted-foreground hover:text-destructive"><X className="w-2.5 h-2.5" /></button>}
                        </span>
                      ))}
                    </div>
                    {canEditHiring && (
                      <div className="flex gap-1.5">
                        <Input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(tagInput); } }} placeholder="Add tag..." list="tag-suggestions" className="h-7 text-xs" />
                        <datalist id="tag-suggestions">{TALENT_POOL_TAGS.map(t => <option key={t} value={t} />)}</datalist>
                        <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => addTag(tagInput)}>Add</Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground font-medium">Skills</label>
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      {candidate.skills.map(s => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1" style={{ background: "hsl(220,95%,47%,0.12)", color: "hsl(220,95%,47%)" }}>
                          {s}
                          {canEditHiring && <button onClick={() => removeSkill(s)} className="hover:text-destructive"><X className="w-2.5 h-2.5" /></button>}
                        </span>
                      ))}
                    </div>
                    {canEditHiring && (
                      <div className="flex gap-1.5">
                        <Input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput); } }} placeholder="Add skill..." className="h-7 text-xs" />
                        <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => addSkill(skillInput)}>Add</Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground font-medium">Future Role Notes</label>
                    <Textarea value={candidate.futureRoleNotes} onChange={e => setFutureNotes(e.target.value)} disabled={!canEditHiring} rows={4} placeholder="What role might they fit, when, why..." className="text-xs" />
                  </div>

                  {canEditHiring && (
                    <div className="text-[10px] text-muted-foreground">Changes save automatically.</div>
                  )}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="sm:max-w-[560px] bg-card border-border">
          <DialogHeader><DialogTitle>{reviewEditId ? "Edit Review" : "Add Review"} for {candidate?.firstName} {candidate?.lastName}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground font-medium">Rating *</label>
              <Stars rating={reviewForm.rating} size={20} onChange={r => setReviewForm({ ...reviewForm, rating: r })} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Fit *</label>
                <Select value={reviewForm.fit} onValueChange={v => setReviewForm({ ...reviewForm, fit: v as FitLevel })}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{FIT_LEVELS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
              </div>
              <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Experience *</label>
                <Select value={reviewForm.experience} onValueChange={v => setReviewForm({ ...reviewForm, experience: v as ExperienceLevel })}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{EXPERIENCE_LEVELS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
              </div>
              <div className="space-y-1"><label className="text-[10px] text-muted-foreground font-medium">Recommend *</label>
                <Select value={reviewForm.recommendation} onValueChange={v => setReviewForm({ ...reviewForm, recommendation: v as Recommendation })}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{RECOMMENDATIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground font-medium">Notes</label>
              <Textarea value={reviewForm.notes} onChange={e => setReviewForm({ ...reviewForm, notes: e.target.value })} rows={4} placeholder="Any specific observations, concerns, or strengths..." className="text-xs" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setReviewModalOpen(false)} className="text-xs h-8">Cancel</Button>
            <Button onClick={saveReview} className="text-xs h-8">Submit Review</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
