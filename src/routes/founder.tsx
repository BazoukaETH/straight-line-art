import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/wasla/AppShell";
import { useApp } from "@/lib/app-context";
import { Crown } from "lucide-react";

export const Route = createFileRoute("/founder")({ component: FounderPage });

function FounderPage() {
  const { role } = useApp();
  const nav = useNavigate();
  useEffect(() => { if (role !== "founder") nav({ to: "/" }); }, [role, nav]);
  if (role !== "founder") return null;

  return (
    <AppShell>
      <div className="flex min-h-full items-center justify-center px-6 py-16">
        <div className="flex max-w-xl flex-col items-center text-center">
          <Crown size={48} style={{ color: "#F59E0B" }} />
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">Founder Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Financials, ventures pipeline, and your private founder views live here.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            This page is reserved. Moaz will plug in the founder dashboard build during production.
          </p>
          <div
            className="mt-8 flex items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground"
            style={{ width: 560, maxWidth: "100%", height: 280 }}
          >
            Founder Dashboard area
          </div>
        </div>
      </div>
    </AppShell>
  );
}
