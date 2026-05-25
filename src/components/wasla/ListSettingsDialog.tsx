import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useTasks } from "@/lib/tasks-store";
import { type CustomFieldType } from "@/lib/mock-data";
import { Trash2, Plus, Settings } from "lucide-react";
import { toast } from "sonner";

export function ListSettingsDialog({ listId, open, onOpenChange }: { listId: string; open: boolean; onOpenChange: (b: boolean) => void }) {
  const { lists, addCustomField, removeCustomField } = useTasks();
  const list = lists.find((l) => l.id === listId);
  const [name, setName] = useState("");
  const [type, setType] = useState<CustomFieldType>("text");
  const [opts, setOpts] = useState("");

  if (!list) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Settings className="size-4" /> {list.name} — Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <section>
            <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Custom fields</h4>
            <div className="space-y-1.5">
              {(list.customFields ?? []).map((f) => (
                <div key={f.id} className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm">
                  <div className="flex-1">
                    <div className="font-medium">{f.name}</div>
                    <div className="text-[11px] text-muted-foreground capitalize">{f.type}{f.options ? ` · ${f.options.join(", ")}` : ""}{f.currency ? ` · ${f.currency}` : ""}</div>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => { removeCustomField(list.id, f.id); toast.success("Field removed"); }}><Trash2 className="size-3.5" /></Button>
                </div>
              ))}
              {!list.customFields?.length && <div className="text-xs text-muted-foreground">No custom fields yet.</div>}
            </div>
          </section>
          <section className="rounded-md border border-dashed border-border p-3 space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Add field</div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Field name" value={name} onChange={(e) => setName(e.target.value)} />
              <Select value={type} onValueChange={(v) => setType(v as CustomFieldType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["text","number","date","dropdown","money"] as CustomFieldType[]).map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {type === "dropdown" && <Input placeholder="Options, comma separated" value={opts} onChange={(e) => setOpts(e.target.value)} />}
            <div className="flex justify-end">
              <Button size="sm" className="gap-1.5" onClick={() => {
                if (!name.trim()) return;
                addCustomField(list.id, {
                  name: name.trim(), type,
                  options: type === "dropdown" ? opts.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
                  currency: type === "money" ? "EGP" : undefined,
                });
                toast.success("Field added");
                setName(""); setOpts("");
              }}><Plus className="size-3.5" /> Add field</Button>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
