import { Link } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUsers } from "@/contexts/UserContext";
import { useApp } from "@/lib/app-context";

export function TeamTabs({ active }: { active: "workload" | "checkins" | "hiring" }) {
  const { currentUser } = useUsers();
  const { role } = useApp();
  const canSeeHiring =
    currentUser.role === "Founder" ||
    currentUser.role === "Team";
  const canSeeWorkload = role === "founder" || role === "manager";

  return (
    <Tabs value={active}>
      <TabsList>
        {canSeeWorkload && (
          <TabsTrigger value="workload" asChild>
            <Link to="/team/workload">Workload</Link>
          </TabsTrigger>
        )}
        <TabsTrigger value="checkins" asChild>
          <Link to="/team/checkins">Check-ins</Link>
        </TabsTrigger>
        {canSeeHiring && (
          <TabsTrigger value="hiring" asChild>
            <Link to="/team/hiring">Hiring</Link>
          </TabsTrigger>
        )}
      </TabsList>
    </Tabs>
  );
}
