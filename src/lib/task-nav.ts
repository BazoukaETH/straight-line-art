import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { taskById, type Task } from "./mock-data";

/** Resolve the canonical route for a task (or subtask). Subtasks live on
 * the same route as their root ancestor's list, but use the subtask route
 * for any task with a parent. */
function routeForTask(t: Task): { to: string; params: Record<string, string> } {
  if (t.parentId) {
    // Walk up to the root ancestor to get the canonical task id segment.
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

export function useTaskNav() {
  const nav = useNavigate();
  const goTask = useCallback((idOrTask: string | Task) => {
    const t = typeof idOrTask === "string" ? taskById(idOrTask) : idOrTask;
    if (!t) return;
    const r = routeForTask(t);
    nav({ to: r.to, params: r.params });
  }, [nav]);
  const goList = useCallback((spaceId: string, listId: string) => {
    nav({ to: "/space/$spaceId/list/$listId", params: { spaceId, listId } });
  }, [nav]);
  const goFolder = useCallback((spaceId: string, folderId: string) => {
    nav({ to: "/space/$spaceId/folder/$folderId", params: { spaceId, folderId } });
  }, [nav]);
  const goSpace = useCallback((spaceId: string) => {
    nav({ to: "/space/$spaceId", params: { spaceId } });
  }, [nav]);
  return { goTask, goList, goFolder, goSpace };
}
