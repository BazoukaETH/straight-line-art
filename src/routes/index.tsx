import { createFileRoute, Link } from "@tanstack/react-router";
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
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Pencil, Sunrise, Sunset, Calendar, AlertCircle, ArrowUpRight, TriangleAlert, CheckCircle2 } from "lucide-react";
import { useCheckins, cairoNow } from "@/lib/checkins-store";
import { useTasks } from "@/lib/tasks-store";
import { formatDistanceToNow, parseISO, isPast } from "date-fns";

export const Route = createFileRoute("/")({ component: Home });


function Home() {
  const { currentUserId, role } = useApp();
  const { tasks: liveTasks } = useTasks();
  const me = memberById(currentUserId);
  const today = formatCairoDate();
  const { submitCheckin, getCheckin } = useCheckins();
  // Compute Cairo time on client only to avoid SSR hydration mismatch
  const [cairo, setCairo] = useState<{ dateStr: string; hour: number } | null>(null);
  useEffect(() => { setCairo(cairoNow()); }, []);
  const phase: "bod" | "eod" = cairo && cairo.hour >= 15 ? "eod" : "bod";
  const todayStr = cairo?.dateStr ?? "";
  const existing = cairo ? getCheckin(currentUserId, todayStr, phase) : undefined;
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");
  const [blockers, setBlockers] = useState("");
  // Initialize fields from existing entry when phase/cairo resolves
  useEffect(() => {
    if (!cairo) return;
    setText(existing?.text ?? "");
    setBlockers(existing?.blockers ?? "");
    setEditing(false);
  }, [cairo?.dateStr, phase, existing?.id]);
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



          {/* Daily check-in: phase driven by Cairo time. Persisted via checkins-store. */}
          {(() => {
            const bodLate = phase === "bod" && cairo !== null && cairo.hour >= 10;
            const eodLate = phase === "eod" && cairo !== null && cairo.hour >= 19;
            const late = bodLate || eodLate;
            const Icon = phase === "eod" ? Sunset : Sunrise;
            const title = phase === "bod" ? "Beginning of Day" : "End of Day";
            const isDone = !!existing && !editing;
            const placeholderShipped = phase === "bod"
              ? "e.g. Ship the Loop Commerce site refresh and review May deck."
              : "Wins, shipped work, decisions made…";
            const labelShipped = phase === "bod" ? "What will you ship today?" : "What did you ship today?";
            const labelBlockers = phase === "bod" ? "Any blockers?" : "What's blocked for tomorrow?";

            const handleSubmit = () => {
              if (!cairo) return;
              if (text.trim().length < 3) { toast.error(`Add a brief note before submitting ${phase.toUpperCase()}`); return; }
              submitCheckin({
                memberId: currentUserId,
                date: todayStr,
                phase,
                text: text.trim(),
                blockers: blockers.trim(),
              });
              setEditing(false);
              toast.success(`${phase.toUpperCase()} submitted`);
            };

            return (
              <Card className="overflow-hidden border-border p-0">
                <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-5 py-3">
                  <Icon className="size-4 text-[color:var(--warning)]" />
                  <h3 className="text-sm font-semibold">{title}</h3>
                  {late && !isDone && (
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-[color:var(--warning)]/15 px-2 py-0.5 text-[11px] font-medium text-[color:var(--warning)]" title={phase === "bod" ? "BOD is late" : "EOD is late"}>
                      <TriangleAlert className="size-3" /> Late
                    </span>
                  )}
                  {isDone && (
                    <span className="ml-auto inline-flex items-center gap-1 text-xs text-[color:var(--success)]"><CheckCircle2 className="size-3.5" /> Checked in</span>
                  )}
                </div>

                {/* Missed-entries gate: must acknowledge before writing new BOD/EOD */}
                {needsMissBrief && !isDone ? (
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
                ) : isDone && existing ? (
                  <div className="space-y-3 p-5 text-sm">
                    <div className="flex items-start gap-2">
                      <Icon className="mt-0.5 size-4 text-muted-foreground" />
                      <div className="flex-1">
                        <span className="text-xs text-muted-foreground">{phase.toUpperCase()}</span>
                        <div>{existing.text}</div>
                        {existing.blockers && (
                          <div className="mt-1 text-xs text-muted-foreground"><span className="font-medium text-foreground">Blockers:</span> {existing.blockers}</div>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                        <Pencil className="size-3.5 mr-1" /> Edit
                      </Button>
                    </div>
                  </div>
                ) : cairo ? (
                  <div className="space-y-3 p-5">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">{labelShipped}</label>
                      <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} placeholder={placeholderShipped} className="mt-1.5 resize-none" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">{labelBlockers}</label>
                      <Textarea value={blockers} onChange={(e) => setBlockers(e.target.value)} rows={1} placeholder="Optional…" className="mt-1.5 resize-none" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button onClick={handleSubmit}>Submit {phase.toUpperCase()}</Button>
                      {existing && (
                        <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-5 text-sm text-muted-foreground">Loading…</div>
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
          <Link to="/deadlines" className="block">
            <Card className="border-border p-5 transition-colors hover:bg-muted/30">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Due this week</h3>
                {(() => {
                  const myOpen = liveTasks
                    .filter((t) => t.assigneeId === currentUserId && t.status !== "Done")
                    .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());
                  const overdue = myOpen.filter((t) => isPast(parseISO(t.due))).length;
                  return overdue > 0 ? (
                    <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1.5 text-[11px] font-medium text-white">
                      {overdue}
                    </span>
                  ) : null;
                })()}
              </div>
              <div className="space-y-2">
                {(() => {
                  const myOpen = liveTasks
                    .filter((t) => t.assigneeId === currentUserId && t.status !== "Done")
                    .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())
                    .slice(0, 5);
                  if (myOpen.length === 0) {
                    return <p className="text-sm text-muted-foreground">Nothing due. You're clear.</p>;
                  }
                  return myOpen.map((t) => {
                    const due = parseISO(t.due);
                    const isOver = isPast(due);
                    return (
                      <div key={t.id} className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium">{t.title}</span>
                        <span
                          className={`whitespace-nowrap text-xs ${isOver ? "font-medium text-destructive" : "text-muted-foreground"}`}
                          suppressHydrationWarning
                        >
                          {isOver ? "Overdue" : formatDistanceToNow(due, { addSuffix: true })}
                        </span>
                      </div>
                    );
                  });
                })()}
              </div>
            </Card>
          </Link>

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
