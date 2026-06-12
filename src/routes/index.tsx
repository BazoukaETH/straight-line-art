import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/wasla/AppShell";
import { SpaceTreeSidebar } from "@/components/wasla/SpaceTreeSidebar";
import { useApp } from "@/lib/app-context";
import { DailyBrief } from "@/components/wasla/DailyBrief";
import { Signals } from "@/components/wasla/Signals";
import { bodEod, memberById, pillarMeta, spaces, tasks, formatCairoDate } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { TaskCard } from "@/components/wasla/TaskCard";
import { Avatar } from "@/components/wasla/Avatar";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Sunrise, Sunset, Calendar, AlertCircle, ArrowUpRight, TriangleAlert, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });


function Home() {
  const { currentUserId, role } = useApp();
  const me = memberById(currentUserId);
  const today = formatCairoDate();
  const [bodSubmitted, setBodSubmitted] = useState(false);
  const [eodSubmitted, setEodSubmitted] = useState(false);
  const [bodText, setBodText] = useState("Ship the Loop Commerce marketing site refresh and review the May board deck.");
  const [eodText, setEodText] = useState("");
  const [eodBlockers, setEodBlockers] = useState("");
  // Tracked misses (in real life: from backend). Persist across submits so we have a record.
  const [missed, setMissed] = useState<Array<{ id: string; label: string }>>([
    { id: "m1", label: "Yesterday's EOD" },
    { id: "m2", label: "Monday's BOD" },
  ]);
  const [missBrief, setMissBrief] = useState("");
  const [missAcknowledged, setMissAcknowledged] = useState(false);
  const needsMissBrief = missed.length > 0 && !missAcknowledged;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const my = tasks.filter((t) => t.assigneeId === currentUserId);
  const now = my.filter((t) => t.status === "In Progress").slice(0, 2);
  const next = my.filter((t) => t.status === "To Do").slice(0, 2);
  const blocked = my.filter((t) => t.status === "Blocked").slice(0, 2);

  return (
    <AppShell sidebar={<SpaceTreeSidebar />} breadcrumb={<span className="font-medium text-foreground">Home</span>}>
      <div className="grid gap-6 px-6 py-6 lg:grid-cols-5">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{greeting}, {me.name.split(" ")[0]}</h1>
            <p className="text-sm text-muted-foreground">{today}</p>
          </div>

          {role === "founder" && <DailyBrief />}



          {/* Daily check-in: BOD until submitted, then EOD. One place for everyone. */}
          {(() => {
            const phase: "bod" | "eod" | "done" = !bodSubmitted ? "bod" : !eodSubmitted ? "eod" : "done";
            const bodLate = phase === "bod" && hour >= 10;
            const eodLate = phase === "eod" && hour >= 19;
            const late = bodLate || eodLate;
            const Icon = phase === "eod" ? Sunset : Sunrise;
            const title = phase === "bod" ? "Beginning of Day" : phase === "eod" ? "End of Day" : "Daily check-in";

            return (
              <Card className="overflow-hidden border-border p-0">
                <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-5 py-3">
                  <Icon className="size-4 text-[color:var(--warning)]" />
                  <h3 className="text-sm font-semibold">{title}</h3>
                  {late && (
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-[color:var(--warning)]/15 px-2 py-0.5 text-[11px] font-medium text-[color:var(--warning)]" title={phase === "bod" ? "BOD is late" : "EOD is late"}>
                      <TriangleAlert className="size-3" /> Late
                    </span>
                  )}
                  {phase === "done" && (
                    <span className="ml-auto inline-flex items-center gap-1 text-xs text-[color:var(--success)]"><CheckCircle2 className="size-3.5" /> All in for today</span>
                  )}
                </div>

                {/* Missed-entries gate: must acknowledge before writing new BOD/EOD */}
                {needsMissBrief && phase !== "done" ? (
                  <div className="space-y-3 p-5">
                    <div className="flex items-start gap-2 rounded-md border border-[color:var(--warning)]/40 bg-[color:var(--warning)]/10 p-3">
                      <TriangleAlert className="mt-0.5 size-4 text-[color:var(--warning)]" />
                      <div className="text-sm">
                        <p className="font-medium">Before you submit, a quick note on what you missed</p>
                        <p className="mt-0.5 text-muted-foreground">
                          On record: {missed.map((m) => m.label).join(", ")}.
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Briefly, what happened?</label>
                      <Textarea value={missBrief} onChange={(e) => setMissBrief(e.target.value)} rows={2} placeholder="A short reason for each miss — we'll handle it offline." className="mt-1.5 resize-none" />
                    </div>
                    <Button
                      onClick={() => {
                        if (missBrief.trim().length < 3) { toast.error("Add a short note before continuing"); return; }
                        setMissAcknowledged(true);
                        toast.success("Thanks — noted on the record");
                      }}
                    >
                      Continue
                    </Button>
                  </div>
                ) : phase === "bod" ? (
                  <div className="space-y-3 p-5">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">What will you ship today?</label>
                      <Textarea value={bodText} onChange={(e) => setBodText(e.target.value)} rows={2} className="mt-1.5 resize-none" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Any blockers?</label>
                      <Textarea rows={1} placeholder="Optional…" className="mt-1.5 resize-none" />
                    </div>
                    <Button onClick={() => { setBodSubmitted(true); toast.success("BOD submitted to the team"); }}>Submit BOD</Button>
                  </div>
                ) : phase === "eod" ? (
                  <div className="space-y-3 p-5">
                    <div className="rounded-md border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">This morning:</span> {bodText}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">What did you ship today?</label>
                      <Textarea value={eodText} onChange={(e) => setEodText(e.target.value)} rows={2} placeholder="Wins, shipped work, decisions made…" className="mt-1.5 resize-none" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">What's blocked for tomorrow?</label>
                      <Textarea value={eodBlockers} onChange={(e) => setEodBlockers(e.target.value)} rows={1} placeholder="Optional…" className="mt-1.5 resize-none" />
                    </div>
                    <Button onClick={() => { setEodSubmitted(true); toast.success("EOD submitted"); }}>Submit EOD</Button>
                  </div>
                ) : (
                  <div className="space-y-3 p-5 text-sm">
                    <div className="flex items-start gap-2">
                      <Sunrise className="mt-0.5 size-4 text-muted-foreground" />
                      <div className="flex-1"><span className="text-xs text-muted-foreground">BOD</span><div>{bodText}</div></div>
                      <Button variant="ghost" size="icon" onClick={() => setBodSubmitted(false)}><Pencil className="size-3.5" /></Button>
                    </div>
                    <div className="flex items-start gap-2">
                      <Sunset className="mt-0.5 size-4 text-muted-foreground" />
                      <div className="flex-1"><span className="text-xs text-muted-foreground">EOD</span><div>{eodText || <span className="text-muted-foreground">—</span>}</div></div>
                      <Button variant="ghost" size="icon" onClick={() => setEodSubmitted(false)}><Pencil className="size-3.5" /></Button>
                    </div>
                  </div>
                )}

                {/* Tracked misses footer (always visible while there are any) */}
                {missed.length > 0 && (
                  <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-muted/20 px-5 py-2 text-[11px] text-muted-foreground">
                    <span><b className="text-foreground">{missed.length}</b> tracked miss{missed.length === 1 ? "" : "es"} on record{missAcknowledged ? " · noted" : ""}</span>
                    {missAcknowledged && (
                      <button className="text-accent hover:underline" onClick={() => { setMissed([]); setMissAcknowledged(false); setMissBrief(""); }}>Clear</button>
                    )}
                  </div>
                )}
              </Card>
            );
          })()}

          {/* Now / Next / Blocked */}
          <Card className="border-border p-5">
            <h3 className="mb-4 text-sm font-semibold">My work</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { label: "Now", items: now, accent: "var(--accent)" },
                { label: "Next", items: next, accent: "var(--muted-foreground)" },
                { label: "Blocked", items: blocked, accent: "var(--destructive)" },
              ].map((col) => (
                <div key={col.label}>
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <span className="size-1.5 rounded-full" style={{ backgroundColor: col.accent }} /> {col.label}
                  </div>
                  <div className="space-y-2">
                    {col.items.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-border/80 p-3 text-center text-xs text-muted-foreground">Nothing here</div>
                    ) : col.items.map((t) => <TaskCard key={t.id} task={t} />)}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Calendar */}
          <Card className="border-border p-5">
            <div className="mb-3 flex items-center gap-2"><Calendar className="size-4 text-muted-foreground" /><h3 className="text-sm font-semibold">Today's calendar</h3></div>
            <div className="space-y-2">
              {[
                { t: "09:30", title: "Founders sync", who: "Bassel, Moaz" },
                { t: "11:00", title: "Loop Commerce launch review", who: "Osama, Hagry" },
                { t: "15:30", title: "Cairo Capital weekly", who: "Usef, Bassel" },
              ].map((m) => (
                <div key={m.t} className="flex items-center gap-4 rounded-md border border-border/60 px-3 py-2">
                  <span className="text-xs font-mono text-muted-foreground">{m.t}</span>
                  <span className="flex-1 text-sm font-medium">{m.title}</span>
                  <span className="text-xs text-muted-foreground">{m.who}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-border p-5">
            <h3 className="mb-3 text-sm font-semibold">Pillars snapshot</h3>
            <div className="space-y-2">
              {(Object.keys(pillarMeta) as Array<keyof typeof pillarMeta>).map((p) => {
                const open = tasks.filter((t) => spaces.find((s) => s.id === t.spaceId)?.pillar === p && t.status !== "Done").length;
                const shipped = tasks.filter((t) => spaces.find((s) => s.id === t.spaceId)?.pillar === p && t.status === "Done").length;
                const blockers = tasks.filter((t) => spaces.find((s) => s.id === t.spaceId)?.pillar === p && t.status === "Blocked").length;
                return (
                  <div key={p} className="rounded-lg border border-border p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="size-2 rounded-full" style={{ backgroundColor: pillarMeta[p].color }} />
                      <span className="text-sm font-medium">{pillarMeta[p].label}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span><b className="text-foreground">{open}</b> open</span>
                      <span><b className="text-foreground">{shipped}</b> shipped</span>
                      <span><b className={blockers > 0 ? "text-destructive" : "text-foreground"}>{blockers}</b> blockers</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {role === "founder" && <Signals />}



          <Card className="border-border p-5">
            <h3 className="mb-3 text-sm font-semibold">Mentions & replies</h3>
            <div className="space-y-3">
              {bodEod.slice(0, 4).map((b, i) => {
                const m = memberById(b.memberId);
                const previews = [
                  "@bassel can you approve the Loop tagline?",
                  "Replied to your comment on Cairo Capital hero B",
                  "Moved 'April invoices' to In Review",
                  "@bassel new Drive folder shared",
                ];
                return (
                  <div key={b.id} className="flex items-start gap-3">
                    <Avatar memberId={m.id} size={28} />
                    <div className="flex-1">
                      <p className="text-sm leading-snug">
                        <b className="font-semibold">{m.name}</b> <span className="text-muted-foreground">{previews[i]}</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground">{i + 1}h ago · #tourism</p>
                    </div>
                    <ArrowUpRight className="size-3.5 text-muted-foreground" />
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="border-border p-5">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold"><AlertCircle className="size-4 text-[color:var(--warning)]" /> Heads up</h3>
            <p className="text-sm text-muted-foreground">Saif hasn't submitted BOD yet. <a className="text-accent cursor-pointer hover:underline">Nudge</a></p>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
