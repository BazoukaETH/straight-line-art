import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/wasla/AppShell";
import { Avatar } from "@/components/wasla/Avatar";
import { MiniBars } from "@/components/wasla/Charts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { bodEod, memberById, members, pillarMeta, spaceById, tasks, formatCairoDate } from "@/lib/mock-data";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/people/$id")({ component: PersonPage });

function PersonPage() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const m = members.find((x) => x.id === id);
  if (!m) {
    return (
      <AppShell>
        <div className="px-6 py-10 text-sm text-muted-foreground">
          Person not found. <button onClick={() => nav({ to: "/founder" })} className="text-accent hover:underline">Back to team</button>
        </div>
      </AppShell>
    );
  }
  const openTasks = tasks.filter((t) => t.assigneeId === m.id && t.status !== "Done").slice(0, 8);
  const todayStr = new Date().toISOString().slice(0, 10);

  // Last 14 days, grouped by week
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    return { date: d, ds, entry: bodEod.find((b) => b.memberId === m.id && b.date === ds) };
  });

  // Time-in-status mock
  const timeInStatus = [
    { name: "To Do", value: 2 },
    { name: "In Prog", value: 14 },
    { name: "Review", value: 6 },
    { name: "Blocked", value: 1 },
    { name: "Done", value: 9 },
  ];

  return (
    <AppShell breadcrumb={
      <><Link to="/founder" className="hover:underline">Founder</Link><span className="text-border">/</span><span className="font-medium text-foreground">{m.name}</span></>
    }>
      <div className="px-6 py-6 max-w-6xl space-y-6">
        {/* Back */}
        <button onClick={() => nav({ to: "/founder" })} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" /> Back to team
        </button>

        {/* Header */}
        <div className="flex flex-wrap items-center gap-4">
          <Avatar memberId={m.id} size={64} status />
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">{m.name}</h1>
            <p className="text-sm text-muted-foreground">
              {m.title} · <span className="capitalize">{pillarMeta[m.pillar].label}</span>{m.role === "manager" && " lead"}
            </p>
          </div>
          <Button className="gap-1.5" onClick={() => toast.success(`Opening WhatsApp chat with ${m.name.split(" ")[0]}`)}>
            <MessageCircle className="size-4" /> Send WhatsApp
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left column - timeline */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-sm font-semibold">BOD / EOD timeline · last 14 days</h3>
            {[0, 1].map((week) => {
              const slice = days.slice(week * 7, week * 7 + 7);
              return (
                <div key={week}>
                  <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {week === 0 ? "This week" : "Last week"}
                  </div>
                  <div className="space-y-2">
                    {slice.map(({ date, ds, entry }) => {
                      const isToday = ds === todayStr;
                      return (
                        <Card key={ds} className={cn("border-border p-4", isToday && "border-accent ring-1 ring-accent/30")}>
                          <div className="mb-2 flex items-center justify-between">
                            <div className="text-xs font-semibold">
                              {formatCairoDate(date)} {isToday && <span className="ml-1 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-medium text-accent-foreground">Today</span>}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">BOD</div>
                              {entry?.bod ? (
                                <p className="mt-0.5 text-sm text-foreground/85">{entry.bod.ship}</p>
                              ) : (
                                <div className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <span className="size-1.5 rounded-full bg-destructive" /> Not submitted
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">EOD</div>
                              {entry?.eod ? (
                                <p className="mt-0.5 text-sm text-foreground/85">{entry.eod.shipped}</p>
                              ) : (
                                <div className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <span className="size-1.5 rounded-full bg-destructive" /> Not submitted
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-border p-5">
              <h3 className="mb-3 text-sm font-semibold">Open tasks</h3>
              {openTasks.length === 0 ? (
                <div className="text-xs text-muted-foreground">No open tasks.</div>
              ) : (
                <div className="space-y-1.5">
                  {openTasks.map((t) => (
                    <div key={t.id} className="flex items-center justify-between gap-2 rounded-md border border-border/60 px-2.5 py-1.5">
                      <span className="truncate text-xs font-medium">{t.title}</span>
                      <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{spaceById(t.spaceId).name}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="border-border p-5">
              <h3 className="mb-2 text-sm font-semibold">Time in status (this week)</h3>
              <p className="mb-2 text-[11px] text-muted-foreground">Hours per status</p>
              <MiniBars data={timeInStatus} color={m.color} />
            </Card>

            <Card className="border-border p-5">
              <h3 className="mb-1 text-sm font-semibold">Performance review</h3>
              <p className="mb-3 text-xs text-muted-foreground">Last review: 12 Mar 2026</p>
              <ReviewDialog name={m.name} />
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function ReviewDialog({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const [scores, setScores] = useState({ effort: 4, impact: 4, growth: 3 });
  const [note, setNote] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm">Start new review</Button></DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Performance review · {name}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          {(["effort", "impact", "growth"] as const).map((k) => (
            <div key={k}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="capitalize font-medium">{k}</span>
                <span className="tabular-nums text-muted-foreground">{scores[k]} / 5</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setScores((s) => ({ ...s, [k]: n }))}
                    className={cn(
                      "h-7 flex-1 rounded-md border text-xs font-medium transition",
                      scores[k] >= n ? "border-accent bg-accent/15 text-accent" : "border-border text-muted-foreground hover:bg-muted",
                    )}
                  >{n}</button>
                ))}
              </div>
            </div>
          ))}
          <div>
            <div className="mb-1 text-xs font-medium">Notes</div>
            <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="What went well, what to improve…" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => { setOpen(false); toast.success("Review saved"); }}>Save review</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
