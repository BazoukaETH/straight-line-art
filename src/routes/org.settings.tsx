import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { organization } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/org/settings")({ component: OrgSettingsPage });

function OrgSettingsPage() {
  return (
    <div className="px-6 py-6 max-w-3xl">
      <Card className="border-border p-6 space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Organization settings</h2>
          <p className="text-sm text-muted-foreground">High-level settings for {organization.name}.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">Org name</Label>
            <Input defaultValue={organization.name} />
          </div>
          <div>
            <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">Billing currency</Label>
            <Input defaultValue="EGP — Egyptian Pound" />
          </div>
          <div>
            <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">Time zone</Label>
            <Input defaultValue="Africa/Cairo (UTC+2)" />
          </div>
          <div>
            <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">Working days</Label>
            <Input defaultValue="Sun – Thu" />
          </div>
        </div>
        <Button onClick={() => toast.success("Org settings saved")}>Save changes</Button>
      </Card>
    </div>
  );
}
