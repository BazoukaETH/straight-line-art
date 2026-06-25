import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useApp } from "@/lib/app-context";
import { useUsers } from "@/contexts/UserContext";
import { TeamTabs } from "@/components/wasla/TeamTabs";
import { Team } from "./founder.team";

export const Route = createFileRoute("/team/hiring")({ component: TeamHiringPage });

function TeamHiringPage() {
  const { role } = useApp();
  const nav = useNavigate();
  const { currentUser } = useUsers();
  const canSeeHiring =
    currentUser.role === "Founder" || currentUser.role === "Team";

  useEffect(() => {
    if (role === "member" && !canSeeHiring) nav({ to: "/" });
  }, [role, canSeeHiring, nav]);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <TeamTabs active="hiring" />
      <Team />
    </div>
  );
}
