import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/wasla/AppShell";
import { SpaceTreeSidebar } from "@/components/wasla/SpaceTreeSidebar";
import { PageHeader } from "@/components/wasla/PageHeader";
import { ClientsTabs } from "@/components/wasla/ClientsTabs";
import { useApp } from "@/lib/app-context";
import { usePageTitle } from "@/lib/page-title";
import { Pipeline } from "./founder.pipeline";

export const Route = createFileRoute("/clients/pipeline")({ component: ClientsPipelinePage });

function ClientsPipelinePage() {
  usePageTitle("Pipeline");
  const { role } = useApp();
  const nav = useNavigate();
  const allowed = role === "founder" || role === "manager";

  useEffect(() => {
    if (!allowed) nav({ to: "/clients" });
  }, [allowed, nav]);

  if (!allowed) return null;

  return (
    <AppShell sidebar={<SpaceTreeSidebar />} breadcrumb={<span className="font-medium text-foreground">Clients · Pipeline</span>}>
      <PageHeader crumbs={[{ label: "Clients", to: "/clients" }, { label: "Pipeline" }]} />
      <div className="px-6 pt-5">
        <ClientsTabs active="pipeline" />
      </div>
      <Pipeline />
    </AppShell>
  );
}
