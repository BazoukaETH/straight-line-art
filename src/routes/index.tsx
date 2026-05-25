import { createFileRoute } from "@tanstack/react-router";
import { AppShell, SidebarHeader, SidebarTreeItem } from "@/components/wasla/AppShell";
import { useApp } from "@/lib/app-context";
import { bodEod, memberById, pillarMeta, spaces, tasks, formatCairoDate } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { TaskCard } from "@/components/wasla/TaskCard";
import { Avatar } from "@/components/wasla/Avatar";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Sunrise, Sunset, Calendar, AlertCircle, ArrowUpRight } from "lucide-react";
import { Layers } from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

function Sidebar() {
  return (
    <>
      <SidebarHeader title="Workspace" />
      <div className="flex-1 overflow-y-auto px-2 py-2 scrollbar-thin">
        <div className="mb-2 px-2 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Pillars</div>
        {(Object.keys(pillarMeta) as Array<keyof typeof pillarMeta>).map((p) => (
          <div key={p} className="mb-2">
            <SidebarTreeItem label={pillarMeta[p].label} icon={Layers} />
            <div className="ml-3 border-l border-border/60 pl-1">
              {spaces.filter((s) => s.pillar === p).map((s) => (
                <SidebarTreeItem key={s.id} label={s.name} count={tasks.filter((t) => t.spaceId === s.id).length} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Home() {
  const { currentUserId } = useApp();
  const me = memberById(currentUserId);
  const today = formatCairoDate();
  const [bodSubmitted, setBodSubmitted] = useState(false);
  const [bodText, setBodText] = useState("Ship the Venture X marketing site refresh and review the board deck.");
  const isEvening = new Date().getHours() >= 17;

  const my = tasks.filter((t) => t.assigneeId === currentUserId);
  const now = my.filter((t) => t.status === "In Progress").slice(0, 2);
  const next = my.filter((t) => t.status === "To Do").slice(0, 2);
  const blocked = my.filter((t) => t.status === "Blocked").slice(0, 2);

  return (
    <AppShell sidebar={<Sidebar />} breadcrumb={<span className="font-medium text-foreground">Home</span>}>
      <div className="grid gap-6 px-6 py-6 lg:grid-cols-5">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Good morning, {me.name.split(" ")[0]}</h1>
            <p className="text-sm text-muted-foreground">{today}</p>
          </div>

          {/* BOD */}
          <Card className="overflow-hidden border-border p-0">
            <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-5 py-3">
              <Sunrise className="size-4 text-[color:var(--warning)]" />
              <h3 className="text-sm font-semibold">Beginning of Day</h3>
              {bodSubmitted && <span className="ml-auto text-xs text-[color:var(--success)]">Submitted · 8:14 AM</span>}
            </div>
            <div className="space-y-3 p-5">
              {!bodSubmitted ? (
                <>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">What will you ship today?</label>
                    <Textarea value={bodText} onChange={(e) => setBodText(e.target.value)} rows={2} className="mt-1.5 resize-none" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Any blockers?</label>
                    <Textarea rows={1} placeholder="Optional…" className="mt-1.5 resize-none" />
                  </div>
                  <Button onClick={() => { setBodSubmitted(true); toast.success("BOD submitted to the team"); }}>Submit BOD</Button>
                </>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="flex-1 text-sm text-foreground/85">{bodText}</div>
                  <Button variant="ghost" size="icon" onClick={() => setBodSubmitted(false)}><Pencil className="size-3.5" /></Button>
                </div>
              )}
            </div>
          </Card>

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
                { t: "11:00", title: "Venture X launch review", who: "Yara, Omar" },
                { t: "15:30", title: "Acme weekly", who: "Lina, Bassel" },
              ].map((m) => (
                <div key={m.t} className="flex items-center gap-4 rounded-md border border-border/60 px-3 py-2">
                  <span className="text-xs font-mono text-muted-foreground">{m.t}</span>
                  <span className="flex-1 text-sm font-medium">{m.title}</span>
                  <span className="text-xs text-muted-foreground">{m.who}</span>
                </div>
              ))}
            </div>
          </Card>

          {isEvening && (
            <Card className="overflow-hidden border-border p-0">
              <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-5 py-3">
                <Sunset className="size-4 text-[color:var(--warning)]" />
                <h3 className="text-sm font-semibold">End of Day</h3>
              </div>
              <div className="space-y-3 p-5">
                <Textarea rows={2} placeholder="What did you ship today?" className="resize-none" />
                <Textarea rows={1} placeholder="What is blocked for tomorrow?" className="resize-none" />
                <Button onClick={() => toast.success("EOD submitted")}>Submit EOD</Button>
              </div>
            </Card>
          )}
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

          <Card className="border-border p-5">
            <h3 className="mb-3 text-sm font-semibold">Mentions & replies</h3>
            <div className="space-y-3">
              {bodEod.slice(0, 4).map((b, i) => {
                const m = memberById(b.memberId);
                const previews = [
                  "@bassel can you approve the tagline?",
                  "Replied to your comment on Hero option B",
                  "Moved ‘Q3 invoices’ to In Review",
                  "@bassel new Drive folder shared",
                ];
                return (
                  <div key={b.id} className="flex items-start gap-3">
                    <Avatar memberId={m.id} size={28} />
                    <div className="flex-1">
                      <p className="text-sm leading-snug">
                        <b className="font-semibold">{m.name}</b> <span className="text-muted-foreground">{previews[i]}</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground">{i + 1}h ago · #venture-x</p>
                    </div>
                    <ArrowUpRight className="size-3.5 text-muted-foreground" />
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="border-border p-5">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold"><AlertCircle className="size-4 text-[color:var(--warning)]" /> Heads up</h3>
            <p className="text-sm text-muted-foreground">Tarek hasn't submitted BOD yet. <a className="text-accent">Nudge</a></p>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
