import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/wasla/AppShell";
import { SpaceTreeSidebar } from "@/components/wasla/SpaceTreeSidebar";
import { PageHeader } from "@/components/wasla/PageHeader";
import { pillarMeta, spaces, type Pillar } from "@/lib/mock-data";
import { useTasks } from "@/lib/tasks-store";
import { usePageTitle } from "@/lib/page-title";
import { ChevronRight, Layers } from "lucide-react";

const VALID: Pillar[] = ["client", "ventures", "internal"];

export const Route = createFileRoute("/pillar/$pillarId")({ component: PillarPage });

function PillarPage() {
  const { pillarId } = Route.useParams();
  const pillar = (VALID.includes(pillarId as Pillar) ? pillarId : "client") as Pillar;
  const meta = pillarMeta[pillar];
  const { tasks } = useTasks();
  const pillarSpaces = spaces.filter((s) => s.pillar === pillar);
  usePageTitle(meta.label);

  const openCount = tasks.filter((t) => t.status !== "Done" && pillarSpaces.some((s) => s.id === t.spaceId)).length;

  return (
    <AppShell sidebar={<SpaceTreeSidebar />}>
      <PageHeader crumbs={[{ label: meta.label }]} />
      <div className="px-6 py-5">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg" style={{ background: `color-mix(in oklab, ${meta.color} 18%, transparent)`, color: meta.color }}>
            <Layers className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{meta.label}</h1>
            <div className="text-xs text-muted-foreground">{pillarSpaces.length} spaces · {openCount} open tasks</div>
          </div>
        </div>

        <div className="space-y-6">
          {pillarSpaces.map((s) => {
            const ts = tasks.filter((t) => t.spaceId === s.id);
            const open = ts.filter((t) => t.status !== "Done");
            return (
              <section key={s.id}>
                <div className="mb-2 flex items-center justify-between">
                  <Link to="/space/$spaceId" params={{ spaceId: s.id }} className="flex items-center gap-2 text-sm font-semibold hover:underline">
                    <span className="size-1.5 rounded-full" style={{ background: meta.color }} />
                    {s.name}
                    <span className="text-[11px] font-normal text-muted-foreground">({open.length} open)</span>
                  </Link>
                  <Link to="/space/$spaceId" params={{ spaceId: s.id }} className="text-[11px] text-muted-foreground hover:text-foreground">
                    Open space <ChevronRight className="inline size-3" />
                  </Link>
                </div>
                {open.length === 0 ? (
                  <div className="rounded-md border border-dashed border-border/60 px-3 py-4 text-xs text-muted-foreground">No open tasks.</div>
                ) : (
                  <div className="divide-y divide-border/60 rounded-lg border border-border bg-card">
                    {open.slice(0, 8).map((t) => (
                      <Link
                        key={t.id}
                        to="/space/$spaceId/list/$listId/task/$taskId"
                        params={{ spaceId: t.spaceId, listId: t.listId, taskId: t.id }}
                        className="flex items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-muted/50"
                      >
                        <span className="truncate">{t.title}</span>
                        <span className="text-[11px] text-muted-foreground">{t.status}</span>
                      </Link>
                    ))}
                    {open.length > 8 && (
                      <div className="px-3 py-1.5 text-[11px] text-muted-foreground">+ {open.length - 8} more</div>
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
