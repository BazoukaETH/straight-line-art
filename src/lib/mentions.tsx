import { useCallback, useEffect, useMemo, useState, type RefObject } from "react";
import { members, memberById } from "@/lib/mock-data";
import { Avatar } from "@/components/wasla/Avatar";
import { cn } from "@/lib/utils";

/** Render a plain text body, highlighting any `@Name` sequence that matches a known member. */
export function renderWithMentions(text: string): React.ReactNode {
  if (!text) return text;
  const names = members.map((m) => m.name).sort((a, b) => b.length - a.length);
  const escaped = names.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`@(${escaped.join("|")})`, "g");
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <span key={`${m.index}-${m[1]}`} className="text-accent font-medium">
        @{m[1]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

type AnyInputRef = RefObject<HTMLInputElement | HTMLTextAreaElement | null>;

/** Picker that opens when the user types `@` in the referenced input/textarea. */
export function useMentionPicker(opts: {
  value: string;
  setValue: (v: string) => void;
  inputRef: AnyInputRef;
}) {
  const { value, setValue, inputRef } = opts;
  const [state, setState] = useState<{ query: string; start: number; end: number } | null>(null);
  const [hi, setHi] = useState(0);

  const recompute = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    const pos = el.selectionStart ?? value.length;
    const upto = value.slice(0, pos);
    const m = upto.match(/@(\w*)$/);
    if (!m) {
      setState(null);
      return;
    }
    setState({ query: m[1].toLowerCase(), start: pos - m[0].length, end: pos });
    setHi(0);
  }, [value, inputRef]);

  useEffect(() => {
    recompute();
  }, [value, recompute]);

  const filtered = useMemo(() => {
    if (!state) return [];
    return members
      .filter(
        (m) =>
          !state.query ||
          m.name.toLowerCase().includes(state.query) ||
          m.id.startsWith(state.query),
      )
      .slice(0, 6);
  }, [state]);

  const insert = (memberId: string) => {
    if (!state) return;
    const m = memberById(memberId);
    const before = value.slice(0, state.start);
    const after = value.slice(state.end);
    const inserted = `@${m.name} `;
    const next = before + inserted + after;
    setValue(next);
    setState(null);
    const el = inputRef.current;
    if (el) {
      const caret = (before + inserted).length;
      requestAnimationFrame(() => {
        el.focus();
        try {
          (el as HTMLInputElement).setSelectionRange(caret, caret);
        } catch {
          /* ignore */
        }
      });
    }
  };

  /** Returns true if the key was handled and the caller should stop further handling. */
  const onKeyDown = (e: React.KeyboardEvent): boolean => {
    if (!state || filtered.length === 0) return false;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHi((h) => (h + 1) % filtered.length);
      return true;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHi((h) => (h - 1 + filtered.length) % filtered.length);
      return true;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      insert(filtered[hi].id);
      return true;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setState(null);
      return true;
    }
    return false;
  };

  const dropdown =
    state && filtered.length > 0 ? (
      <div className="absolute bottom-full left-0 z-50 mb-2 w-72 overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
        <ul className="max-h-64 overflow-y-auto py-1 text-sm">
          {filtered.map((m, i) => (
            <li
              key={m.id}
              onMouseEnter={() => setHi(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                insert(m.id);
              }}
              className={cn(
                "flex cursor-pointer items-center gap-2 px-3 py-2",
                hi === i && "bg-muted",
              )}
            >
              <Avatar memberId={m.id} size={20} />
              <span className="font-medium">{m.name}</span>
              <span className="ml-auto truncate text-xs text-muted-foreground">{m.title}</span>
            </li>
          ))}
        </ul>
      </div>
    ) : null;

  return { onKeyDown, dropdown, active: !!state };
}
