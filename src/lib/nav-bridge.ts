import { taskById, type Task } from "./mock-data";

type NavFn = (opts: { to: string; params?: Record<string, string> }) => void;

let _nav: NavFn | null = null;
export function setNav(n: NavFn | null) { _nav = n; }

function routeFor(t: Task): { to: string; params: Record<string, string> } {
  if (t.parentId) {
    let root: Task = t;
    while (root.parentId) {
      const p = taskById(root.parentId);
      if (!p) break;
      root = p;
    }
    return {
      to: "/space/$spaceId/list/$listId/task/$taskId/subtask/$subtaskId",
      params: { spaceId: t.spaceId, listId: t.listId, taskId: root.id, subtaskId: t.id },
    };
  }
  return {
    to: "/space/$spaceId/list/$listId/task/$taskId",
    params: { spaceId: t.spaceId, listId: t.listId, taskId: t.id },
  };
}

export function navigateToTask(id: string) {
  const t = taskById(id);
  if (!t || !_nav) return;
  const r = routeFor(t);
  _nav(r);
}
