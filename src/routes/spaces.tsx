import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/wasla/AppShell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { spaces, tasks, pillarMeta, type Pillar } from "@/lib/mock-data";
import { Avatar } from "@/components/wasla/Avatar";
import { Users, Clock, AlertCircle, ArrowRight } from "lucide-react";
import { useApp } from "@/lib/app-context";

export const Route = createFileRoute("/spaces")({ component: SpacesPage });

function SpacesPage() {
  const { currentUserId } = useApp();
  return (
    <AppShell breadcrumb={<span className="font-medium text-foreground">Spaces</span>}>
      <div className="px-6 py-5">
        <div className="mb-4">
          <h1 className="text-xl font-semibold">Spaces</h1>
          <p className="text-sm text-muted-foreground">Browse all pillars and the spaces inside them</p>
        </div>

        <Tabs defaultValue="client">
          <TabsList>
            {(Object.keys(pillarMeta) as Pillar[]).map((p) => (
              <TabsTrigger key={p} value={p}>{pillarMeta[p].label}</TabsTrigger>
            ))}
          </TabsList>
          {(Object.keys(pillarMeta) as Pillar[]).map((p) => (
            <TabsContent key={p} value={p} className="mt-5">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {spaces.filter((s) => s.pillar === p && (!s.ownerId || s.ownerId === currentUserId)).map((s) => {
                  const ts = tasks.filter((t) => t.spaceId === s.id);
                  const blockers = ts.filter((t) => t.status === "Blocked").length;
                  return (
                    <div key={s.id} className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-md">
                      <div className="h-1.5" style={{ backgroundColor: pillarMeta[p].color }} />
                      <div className="p-5">
                        <div className="mb-3 flex items-start justify-between">
                          <h3 className="text-base font-semibold">{s.name}</h3>
                          <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5" />
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <Stat icon={Users} label="Members" value={s.members} />
                          <Stat icon={Clock} label="Open" value={ts.filter(t => t.status !== "Done").length} />
                          <Stat icon={AlertCircle} label="Blockers" value={blockers} accent={blockers > 0} />
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                          <div className="flex -space-x-1.5">
                            {tasks.filter(t => t.spaceId === s.id).slice(0, 4).map(t => (
                              <Avatar key={t.id} memberId={t.assigneeId} size={22} className="ring-2 ring-card" />
                            ))}
                          </div>
                          <span className="text-[11px] text-muted-foreground">Last activity 2h ago</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppShell>
  );
}

function Stat({ icon: Icon, label, value, accent }: { icon: typeof Users; label: string; value: number; accent?: boolean }) {
  return (
    <div className="rounded-md border border-border/60 px-2.5 py-2">
      <div className="mb-1 flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3" /> {label}
      </div>
      <div className={`text-sm font-semibold ${accent ? "text-destructive" : ""}`}>{value}</div>
    </div>
  );
}
