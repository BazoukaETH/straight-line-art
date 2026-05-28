import { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, Mic, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { spaces, tasks as allTasks } from "@/lib/mock-data";

type Kind = "Task" | "Decision" | "Follow-up" | "Note" | "Risk";
const KINDS: Kind[] = ["Task", "Decision", "Follow-up", "Note", "Risk"];

type Destination = { label: string; path: string };

const DEFAULT_DEST: Record<Kind, Destination> = {
  Task: { label: "Personal — Bassel > My Exec List", path: "/tasks" },
  Decision: { label: "Personal — Bassel > Matters > Decisions", path: "/tasks" },
  "Follow-up": { label: "Personal — Bassel > Matters > Follow-ups", path: "/tasks" },
  Note: { label: "Personal — Bassel > Notes", path: "/tasks" },
  Risk: { label: "Personal — Bassel > Matters > Risks", path: "/tasks" },
};

function classify(text: string): { kind: Kind; dest: Destination } {
  const t = text.toLowerCase();
  // Space/client mention → Task in that space
  const spaceMatch = spaces.find((s) => t.includes(s.name.toLowerCase()));
  if (spaceMatch) {
    return {
      kind: "Task",
      dest: { label: `${spaceMatch.name} > Tasks`, path: `/space/${spaceMatch.id}` },
    };
  }
  if (/\b(risk|worried|concern)\b/.test(t)) return { kind: "Risk", dest: DEFAULT_DEST.Risk };
  if (/\b(follow up|follow-up|circle back|remind me)\b/.test(t))
    return { kind: "Follow-up", dest: DEFAULT_DEST["Follow-up"] };
  if (/\b(should we|decide|decision)\b/.test(t) || /\?/.test(t))
    return { kind: "Decision", dest: DEFAULT_DEST.Decision };
  if (/@\w+/.test(t)) return { kind: "Task", dest: DEFAULT_DEST.Task };
  return { kind: "Task", dest: DEFAULT_DEST.Task };
}

export function SmartCapture() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [overrideKind, setOverrideKind] = useState<Kind | null>(null);
  const [overrideDest, setOverrideDest] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Global shortcut Cmd/Ctrl+Shift+N
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => textareaRef.current?.focus(), 50);
    if (!open) {
      setText("");
      setOverrideKind(null);
      setOverrideDest(null);
    }
  }, [open]);

  const auto = useMemo(() => classify(text), [text]);
  const kind: Kind = overrideKind ?? auto.kind;
  const destLabel = overrideDest ?? (overrideKind ? DEFAULT_DEST[overrideKind].label : auto.dest.label);
  const destPath = overrideDest
    ? spaces.find((s) => destLabel.startsWith(s.name))
      ? `/space/${spaces.find((s) => destLabel.startsWith(s.name))!.id}`
      : "/tasks"
    : overrideKind
      ? DEFAULT_DEST[overrideKind].path
      : auto.dest.path;

  const destOptions: Destination[] = useMemo(() => {
    const base = Object.values(DEFAULT_DEST);
    const spaceDests = spaces.map((s) => ({ label: `${s.name} > Tasks`, path: `/space/${s.id}` }));
    return [...base, ...spaceDests];
  }, []);

  const submit = () => {
    if (!text.trim()) return;
    setOpen(false);
    toast.success(`${kind} captured`, {
      description: `Saved to ${destLabel}`,
      action: { label: "View", onClick: () => (window.location.href = destPath) },
    });
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Smart Capture"
        title="Smart Capture (⌘⇧N)"
        className="fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        style={{ backgroundColor: "#0B2545", boxShadow: "0 10px 30px -8px rgba(11,37,69,0.45)" }}
      >
        <Sparkles className="size-6" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-[640px] gap-0 border-border p-0"
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
        >
          <div className="flex items-center gap-2 border-b border-border/60 px-5 py-4">
            <Sparkles className="size-4" style={{ color: "#0B2545" }} />
            <h2 className="text-[18px] font-semibold tracking-tight">Capture a thought</h2>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto rounded p-1 text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="space-y-4 px-5 py-5">
            <Textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setOverrideKind(null);
                setOverrideDest(null);
              }}
              rows={4}
              placeholder="Type anything. I'll figure out where it goes."
              className="resize-none text-[14px]"
            />

            <button
              type="button"
              onClick={() => toast("Voice capture coming soon")}
              className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground"
            >
              <Mic className="size-3.5" />
              Or speak it
            </button>

            {text.trim().length > 0 && (
              <div className="space-y-2 rounded-lg border border-border/60 bg-muted/30 p-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Detected as
                  </span>
                  {KINDS.map((k) => {
                    const active = k === kind;
                    return (
                      <button
                        key={k}
                        onClick={() => setOverrideKind(k)}
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                          active
                            ? "border-transparent bg-[#0B2545] text-white"
                            : "border-border/70 bg-background text-muted-foreground hover:border-border hover:text-foreground"
                        )}
                      >
                        {k}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 text-[12px]">
                  <span className="text-muted-foreground">Goes to:</span>
                  <Select
                    value={destLabel}
                    onValueChange={(v) => setOverrideDest(v)}
                  >
                    <SelectTrigger className="h-7 w-auto gap-1 border-none bg-transparent px-1 py-0 text-[12px] font-medium text-foreground hover:bg-foreground/5 focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {destOptions.map((d) => (
                        <SelectItem key={d.label} value={d.label} className="text-[12px]">
                          {d.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border/60 px-5 py-3">
            <span className="mr-auto text-[11px] text-muted-foreground">⌘⏎ to capture · Esc to cancel</span>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={!text.trim()} style={{ backgroundColor: "#0B2545" }}>
              Capture
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// silence unused import warning if tree-shaken
void allTasks;
