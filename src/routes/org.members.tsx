import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/wasla/Avatar";
import { members } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/org/members")({ component: OrgMembers });

function OrgMembers() {
  return (
    <div className="px-6 py-6 max-w-5xl">
      <Card className="border-border p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div>
            <h2 className="text-base font-semibold">Org Members</h2>
            <p className="text-xs text-muted-foreground">Members across every workspace in this organization.</p>
          </div>
          <Button size="sm" onClick={() => toast.success("Invite link copied")}>Invite to organization</Button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-2">Name</th>
              <th className="px-2 py-2">Workspaces</th>
              <th className="px-2 py-2">Org role</th>
              <th className="px-5 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-t border-border/60 hover:bg-muted/40">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar memberId={m.id} size={28} />
                    <div>
                      <div className="font-medium">{m.name}</div>
                      <div className="text-[11px] text-muted-foreground">{m.title}</div>
                    </div>
                  </div>
                </td>
                <td className="px-2 text-muted-foreground">Wasla Solutions</td>
                <td className="px-2">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] capitalize">
                    {m.orgFounder ? "Org Founder" : "Member"}
                  </span>
                </td>
                <td className="px-5 text-right"><Button size="sm" variant="ghost">Manage</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
