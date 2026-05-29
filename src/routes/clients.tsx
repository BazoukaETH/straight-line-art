import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/wasla/AppShell";
import { SpaceTreeSidebar } from "@/components/wasla/SpaceTreeSidebar";
import { PageHeader } from "@/components/wasla/PageHeader";
import { spaces, memberById, egp } from "@/lib/mock-data";
import { useTasks } from "@/lib/tasks-store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar } from "@/components/wasla/Avatar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { usePageTitle } from "@/lib/page-title";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/clients")({ component: ClientsPage });

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  pilot: "bg-blue-100 text-blue-700",
  paused: "bg-amber-100 text-amber-700",
  churned: "bg-red-100 text-red-700",
};

function ClientsPage() {
  usePageTitle("Clients");
  const { tasks } = useTasks();
  const clients = spaces.filter((s) => s.pillar === "client" && s.id !== "archived");

  return (
    <AppShell sidebar={<SpaceTreeSidebar />} breadcrumb={<span className="font-medium text-foreground">Clients</span>}>
      <PageHeader crumbs={[{ label: "Clients" }]} />
      <div className="px-6 py-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Clients</h1>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">{clients.length}</span>
          </div>
          <Button size="sm" className="gap-1.5" onClick={() => toast("New Client flow coming soon")}>
            <Plus className="size-3.5" /> New Client
          </Button>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Open tasks</TableHead>
                <TableHead className="text-center">Health</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((s) => {
                const p = s.profile;
                const open = tasks.filter((t) => t.spaceId === s.id && t.status !== "Done").length;
                const owner = p?.ownerId ? memberById(p.ownerId) : null;
                const healthColor = p?.health === "green" ? "bg-emerald-500" : p?.health === "yellow" ? "bg-amber-500" : p?.health === "red" ? "bg-red-500" : "bg-muted-foreground/30";
                return (
                  <TableRow key={s.id}>
                    <TableCell>
                      <Link to="/space/$spaceId" params={{ spaceId: s.id }} className="font-medium text-foreground hover:text-accent hover:underline">
                        {s.name}
                      </Link>
                    </TableCell>
                    <TableCell className="capitalize text-sm">{p?.type ?? "—"}</TableCell>
                    <TableCell>
                      {p?.status ? (
                        <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium capitalize", statusColors[p.status])}>{p.status}</span>
                      ) : "—"}
                    </TableCell>
                    <TableCell>
                      {owner ? (
                        <span className="inline-flex items-center gap-2"><Avatar memberId={owner.id} size={22} /><span className="text-sm">{owner.name.split(" ")[0]}</span></span>
                      ) : "—"}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {p?.type === "retainer" && p?.contractValue != null ? egp(p.contractValue) : "—"}
                    </TableCell>
                    <TableCell className="text-right text-sm">{open}</TableCell>
                    <TableCell className="text-center">
                      <span className={cn("inline-block size-2.5 rounded-full", healthColor)} title={p?.health ?? "unknown"} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppShell>
  );
}
