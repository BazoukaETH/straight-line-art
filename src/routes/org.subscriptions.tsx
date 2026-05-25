import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";
import { egp } from "@/lib/mock-data";
import { Info } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/org/subscriptions")({ component: SubsPage });

const STATUS_STYLES: Record<string, string> = {
  Active:    "bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] text-accent",
  Cutover:   "bg-[color-mix(in_oklab,var(--warning)_18%,transparent)] text-[color:var(--warning)]",
  Cancelled: "bg-muted text-muted-foreground",
};

function SubsPage() {
  const { subscriptions, setSubStatus } = useApp();
  const active = subscriptions.filter((s) => s.status === "Active");
  const monthlySpend = active.reduce((sum, s) => sum + s.monthly, 0);
  const projectedSavings = subscriptions.reduce((sum, s) => sum + s.monthly, 0);

  return (
    <div className="px-6 py-6 max-w-5xl">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">Subscriptions</h1>
        <p className="text-sm text-muted-foreground">Track and cancel SaaS tools as Wasla OS modules replace them.</p>
      </div>

      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <Card className="border-border p-5">
          <div className="text-xs text-muted-foreground">Total active monthly spend</div>
          <div className="mt-1.5 text-[28px] font-semibold tracking-tight">{egp(monthlySpend)}</div>
          <div className="text-[11px] text-muted-foreground">{active.length} active subscriptions</div>
        </Card>
        <Card className="border-border p-5">
          <div className="text-xs text-muted-foreground">Projected savings at full migration</div>
          <div className="mt-1.5 text-[28px] font-semibold tracking-tight text-[color:var(--success)]">{egp(projectedSavings)}</div>
          <div className="text-[11px] text-muted-foreground">If every replaced tool is cancelled</div>
        </Card>
      </div>

      <Card className="border-border p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-2.5">Subscription</th>
              <th className="px-2 py-2.5">Replaced by</th>
              <th className="px-2 py-2.5">Status</th>
              <th className="px-2 py-2.5">Cutover date</th>
              <th className="px-2 py-2.5 text-right">Monthly</th>
              <th className="px-5 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((s) => {
              const cancelled = s.status === "Cancelled";
              return (
                <tr key={s.id} className={cn("border-b border-border/60 last:border-0 transition", cancelled ? "bg-muted/30 text-muted-foreground" : "hover:bg-muted/40")}>
                  <td className="px-5 py-3 font-medium">{s.name}</td>
                  <td className="px-2 text-xs">{s.replacedBy}</td>
                  <td className="px-2"><span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[s.status]}`}>{s.status}</span></td>
                  <td className="px-2 text-xs text-muted-foreground">{s.cutoverDate ?? "—"}</td>
                  <td className="px-2 text-right tabular-nums">{egp(s.monthly)}</td>
                  <td className="px-5 py-2 text-right">
                    <div className="inline-flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={s.status !== "Active"}
                        onClick={() => { setSubStatus(s.id, "Cutover"); toast.success(`${s.name} marked Cutover`); }}
                      >
                        Mark cutover
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        disabled={s.status === "Cancelled"}
                        onClick={() => { setSubStatus(s.id, "Cancelled"); toast.success(`${s.name} cancelled`); }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-[color:var(--warning)]" />
        <span>
          <b className="text-foreground">Cancellation discipline:</b> do not cancel any subscription until the
          replacing Wasla OS module has been live for at least 30 days with the full team adopting it.
        </span>
      </div>
    </div>
  );
}
