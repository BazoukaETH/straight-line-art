import { useCallback, useEffect, useState } from "react";

export type FavoriteKind = "space" | "folder" | "list" | "task";
export interface Favorite {
  kind: FavoriteKind;
  id: string;
  label: string;
  href: string; // resolved path with params already filled
}

const KEY = "wasla.favorites";
type Listener = () => void;
const listeners = new Set<Listener>();

function read(): Favorite[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function write(v: Favorite[]) {
  localStorage.setItem(KEY, JSON.stringify(v));
  listeners.forEach((l) => l());
}

export function useFavorites() {
  const [favs, setFavs] = useState<Favorite[]>(() => read());
  useEffect(() => {
    const l = () => setFavs(read());
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);

  const isStarred = useCallback((kind: FavoriteKind, id: string) =>
    favs.some((f) => f.kind === kind && f.id === id), [favs]);

  const toggle = useCallback((fav: Favorite) => {
    const cur = read();
    const exists = cur.some((f) => f.kind === fav.kind && f.id === fav.id);
    write(exists ? cur.filter((f) => !(f.kind === fav.kind && f.id === fav.id)) : [...cur, fav]);
  }, []);

  return { favorites: favs, isStarred, toggle };
}
