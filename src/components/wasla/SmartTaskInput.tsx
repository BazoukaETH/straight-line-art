import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { parseSmartInput } from "@/lib/task-utils";
import { members } from "@/lib/mock-data";
import { Avatar } from "./Avatar";
import { cn } from "@/lib/utils";
import { Calendar, Flag, Hash, AtSign } from "lucide-react";

export interface SmartTaskInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: (e: { withShift: boolean; withMeta: boolean }) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  size?: "sm" | "md";
}

const POPULAR_TAGS = ["urgent", "bug", "design", "launch", "marketing", "internal", "review"];

export function SmartTaskInput({ value, onChange, onSubmit, placeholder, autoFocus, className, size = "md" }: SmartTaskInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [popover, setPopover] = useState<null | { kind: "assignee" | "tag" | "priority"; q: string }>(null);
  const parsed = useMemo(() => parseSmartInput(value), [value]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // detect active token from caret position
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const handle = () => {
      const pos = el.selectionStart ?? value.length;
      const upto = value.slice(0, pos);
      const m = upto.match(/(@|#|!)(\w*)$/);
      if (!m) { setPopover(null); return; }
      const kind = m[1] === "@" ? "assignee" : m[1] === "#" ? "tag" : "priority";
      setPopover({ kind, q: m[2].toLowerCase() });
    };
    handle();
    el.addEventListener("keyup", handle);
    el.addEventListener("click", handle);
    return () => {
      el.removeEventListener("keyup", handle);
      el.removeEventListener("click", handle);
    };
  }, [value]);

  const insertSuggestion = (text: string) => {
    const el = inputRef.current;
    if (!el) return;
    const pos = el.selectionStart ?? value.length;
    const upto = value.slice(0, pos);
    const rest = value.slice(pos);
    const m = upto.match(/(@|#|!)(\w*)$/);
    if (!m) return;
    const replaced = upto.slice(0, upto.length - m[0].length) + m[1] + text + " ";
    const next = replaced + rest;
    onChange(next);
    setPopover(null);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(replaced.length, replaced.length); });
  };

  return (
    <div className={cn("relative", className)}>
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Task title — try '@usef tomorrow #urgent !high'"}
        className={cn(size === "sm" ? "h-8 text-sm" : "h-10 text-sm", "pr-2")}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSubmit?.({ withShift: e.shiftKey, withMeta: e.metaKey || e.ctrlKey });
          }
        }}
      />
      {/* chips preview row */}
      {(parsed.assigneeId || parsed.due || parsed.priority || parsed.tags.length > 0) && (
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px]">
          {parsed.assigneeId && (() => {
            const m = members.find((x) => x.id === parsed.assigneeId)!;
            return (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-1.5 py-0.5">
                <Avatar memberId={m.id} size={14} /> {m.name.split(" ")[0]}
              </span>
            );
          })()}
          {parsed.due && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] px-1.5 py-0.5 text-accent">
              <Calendar className="size-3" /> {parsed.due.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          )}
          {parsed.priority && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-1.5 py-0.5 capitalize">
              <Flag className="size-3" /> {parsed.priority}
            </span>
          )}
          {parsed.tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-0.5 rounded-full bg-muted px-1.5 py-0.5">
              <Hash className="size-3" />{t}
            </span>
          ))}
        </div>
      )}
      {/* suggestion popover */}
      {popover && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-lg">
          {popover.kind === "assignee" && members
            .filter((m) => !popover.q || m.name.toLowerCase().includes(popover.q) || m.id.startsWith(popover.q))
            .slice(0, 6)
            .map((m) => (
              <button key={m.id} onClick={() => insertSuggestion(m.id)} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-muted">
                <AtSign className="size-3.5 text-muted-foreground" />
                <Avatar memberId={m.id} size={18} />
                <span className="flex-1">{m.name}</span>
                <span className="text-[11px] text-muted-foreground">{m.title}</span>
              </button>
            ))}
          {popover.kind === "tag" && POPULAR_TAGS
            .filter((t) => !popover.q || t.startsWith(popover.q))
            .map((t) => (
              <button key={t} onClick={() => insertSuggestion(t)} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-muted">
                <Hash className="size-3.5 text-muted-foreground" /> {t}
              </button>
            ))}
          {popover.kind === "priority" && (["urgent","high","normal","low"] as const)
            .filter((p) => !popover.q || p.startsWith(popover.q))
            .map((p) => (
              <button key={p} onClick={() => insertSuggestion(p)} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm capitalize hover:bg-muted">
                <Flag className="size-3.5 text-muted-foreground" /> {p}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
