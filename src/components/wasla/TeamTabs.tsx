import { Link } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUsers } from "@/contexts/UserContext";

export function TeamTabs({ active }: { active: "workload" | "checkins" | "hiring" }) {
  const { currentUser } = useUsers();
  const canSeeHiring =
    currentUser.role === "Founder" ||
    currentUser.role === "Team";

  return (
    <Tabs value={active}>
      <TabsList>
        <TabsTrigger value="workload" asChild>
          <Link to="/team/workload">Workload</Link>
        </TabsTrigger>
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
