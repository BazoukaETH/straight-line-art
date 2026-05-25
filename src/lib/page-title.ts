import { useEffect, useState } from "react";
import { useRouter, useLocation } from "@tanstack/react-router";

/** Sets `document.title` to `Wasla OS · {name}` while the component is mounted. */
export function usePageTitle(name?: string) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const prev = document.title;
    document.title = name ? `Wasla OS · ${name}` : "Wasla OS";
    return () => { document.title = prev; };
  }, [name]);
}

/** When Escape is pressed (and no input is focused, no modal/popover open),
 * navigate back in browser history. */
export function useEscToBack(enabled: boolean = true) {
  const router = useRouter();
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const el = document.activeElement as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      if (document.querySelector("[data-state='open'][role='dialog'], [data-radix-popper-content-wrapper]")) return;
      e.preventDefault();
      router.history.back();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [enabled, router]);
}

/** Persists a piece of view state (e.g. active tab) per pathname in sessionStorage. */
export function useStickyState<T extends string>(suffix: string, initial: T): [T, (v: T) => void] {
  const loc = useLocation();
  const key = `wasla.view:${loc.pathname}:${suffix}`;
  const [v, setV] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    return (sessionStorage.getItem(key) as T) || initial;
  });
  // Re-sync when pathname changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    setV((sessionStorage.getItem(key) as T) || initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const set = (next: T) => {
    setV(next);
    try { sessionStorage.setItem(key, next); } catch { /* noop */ }
  };
  return [v, set];
}
