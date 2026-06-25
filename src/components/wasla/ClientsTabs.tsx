import { Link } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/lib/app-context";

export function ClientsTabs({ active }: { active: "clients" | "pipeline" }) {
  const { role } = useApp();
  const canSeePipeline = role === "founder" || role === "manager";

  return (
    <Tabs value={active}>
      <TabsList>
        <TabsTrigger value="clients" asChild>
          <Link to="/clients">Clients</Link>
        </TabsTrigger>
        {canSeePipeline && (
          <TabsTrigger value="pipeline" asChild>
            <Link to="/clients/pipeline">Pipeline</Link>
          </TabsTrigger>
        )}
      </TabsList>
    </Tabs>
  );
}
