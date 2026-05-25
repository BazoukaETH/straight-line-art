import { useEffect } from "react";
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
      // Skip if a Radix overlay is open (dialog / popover / dropdown)
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
  const get = (): T => {
    if (typeof window === "undefined") return initial;
    return (sessionStorage.getItem(key) as T) || initial;
  };
  // Read once on mount; updates go through setter
  // We don't use useState for SSR safety — compute lazily via ref-like pattern.
  // Simpler: derive from sessionStorage on every render but trigger re-render via state.
  const [v, setV] = (function useS() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [s, set] = (require("react") as typeof import("react")).useState<T>(get);
    return [s, set] as const;
  })();
  const set = (next: T) => {
    setV(next);
    try { sessionStorage.setItem(key, next); } catch { /* noop */ }
  };
  return [v, set];
}
