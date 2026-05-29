import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  tasks as seedTasks,
  lists as seedLists,
  folders as seedFolders,
  spaces as spacesArr,
  taskTemplates,
  type Task,
  type List,
  type Folder,
  type Space,
  type SpaceProfile,
  type Status,
  type Priority,
  type CustomField,
} from "./mock-data";


interface NewTaskInput {
  title: string;
  listId: string;
  parentId?: string;
  assigneeId?: string;
  status?: Status;
  priority?: Priority;
  due?: Date;
  tags?: string[];
  description?: string;
}

interface TasksCtx {
  tasks: Task[];
  lists: List[];
  folders: Folder[];
  templates: typeof taskTemplates;
  // CRUD
  createTask: (input: NewTaskInput) => Task;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, listId: string, parentId?: string) => void;
  bulkUpdate: (ids: string[], patch: Partial<Task>) => void;
  bulkDelete: (ids: string[]) => void;
  duplicateTasks: (ids: string[]) => void;
  // Dependencies
  addDependency: (blockerId: string, blockedId: string) => void;
  removeDependency: (blockerId: string, blockedId: string) => void;
  // Lists / Folders / CustomFields
  createList: (name: string, spaceId: string, folderId?: string) => List;
  createFolder: (name: string, spaceId: string) => Folder;
  createSpace: (input: { name: string; pillar: Space["pillar"]; profile?: SpaceProfile }) => Space;
  addCustomField: (listId: string, field: Omit<CustomField, "id">) => void;
  removeCustomField: (listId: string, fieldId: string) => void;
  // Templates
  saveTemplateFromTask: (taskId: string, name: string) => void;
  applyTemplate: (templateId: string, input: NewTaskInput) => Task;
}


const Ctx = createContext<TasksCtx | null>(null);

let nextId = 9000;
const genId = (prefix = "T") => `${prefix}-${++nextId}`;

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => [...seedTasks]);
  const [lists, setLists] = useState<List[]>(() => [...seedLists]);
  const [folders, setFolders] = useState<Folder[]>(() => [...seedFolders]);
  const [templates, setTemplates] = useState(() => [...taskTemplates]);

  const createTask = useCallback((input: NewTaskInput): Task => {
    const list = lists.find((l) => l.id === input.listId) ?? lists[0];
    const t: Task = {
      id: genId(),
      title: input.title.trim() || "Untitled",
      status: input.status ?? "To Do",
      priority: input.priority ?? "normal",
      spaceId: list.spaceId,
      listId: list.id,
      parentId: input.parentId,
      assigneeId: input.assigneeId ?? "bassel",
      due: (input.due ?? new Date(Date.now() + 86400000 * 3)).toISOString(),
      startDate: new Date().toISOString(),
      description: input.description ?? "",
      comments: [],
      watchers: [],
      tags: input.tags ?? [],
      attachments: [],
      dependencies: { blocks: [], blockedBy: [] },
      customFieldValues: {},
      createdAt: new Date().toISOString(),
    };
    setTasks((cur) => [t, ...cur]);
    return t;
  }, [lists]);

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setTasks((cur) => cur.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((cur) => {
      // collect descendants
      const toRemove = new Set<string>([id]);
      let changed = true;
      while (changed) {
        changed = false;
        for (const t of cur) {
          if (t.parentId && toRemove.has(t.parentId) && !toRemove.has(t.id)) {
            toRemove.add(t.id); changed = true;
          }
        }
      }
      return cur.filter((t) => !toRemove.has(t.id))
        .map((t) => ({
          ...t,
          dependencies: t.dependencies ? {
            blocks: t.dependencies.blocks.filter((x) => !toRemove.has(x)),
            blockedBy: t.dependencies.blockedBy.filter((x) => !toRemove.has(x)),
          } : t.dependencies,
        }));
    });
  }, []);

  const moveTask = useCallback((id: string, listId: string, parentId?: string) => {
    setTasks((cur) => {
      const list = lists.find((l) => l.id === listId);
      if (!list) return cur;
      return cur.map((t) => t.id === id ? { ...t, listId, spaceId: list.spaceId, parentId } : t);
    });
  }, [lists]);

  const bulkUpdate = useCallback((ids: string[], patch: Partial<Task>) => {
    const set = new Set(ids);
    setTasks((cur) => cur.map((t) => (set.has(t.id) ? { ...t, ...patch } : t)));
  }, []);

  const bulkDelete = useCallback((ids: string[]) => {
    ids.forEach((id) => deleteTask(id));
  }, [deleteTask]);

  const duplicateTasks = useCallback((ids: string[]) => {
    setTasks((cur) => {
      const dups = cur.filter((t) => ids.includes(t.id)).map((t) => ({
        ...t,
        id: genId(),
        title: `${t.title} (copy)`,
        createdAt: new Date().toISOString(),
      }));
      return [...dups, ...cur];
    });
  }, []);

  const addDependency = useCallback((blockerId: string, blockedId: string) => {
    if (blockerId === blockedId) return;
    setTasks((cur) => cur.map((t) => {
      if (t.id === blockerId) {
        const d = t.dependencies ?? { blocks: [], blockedBy: [] };
        if (d.blocks.includes(blockedId)) return t;
        return { ...t, dependencies: { ...d, blocks: [...d.blocks, blockedId] } };
      }
      if (t.id === blockedId) {
        const d = t.dependencies ?? { blocks: [], blockedBy: [] };
        if (d.blockedBy.includes(blockerId)) return t;
        return { ...t, dependencies: { ...d, blockedBy: [...d.blockedBy, blockerId] } };
      }
      return t;
    }));
  }, []);

  const removeDependency = useCallback((blockerId: string, blockedId: string) => {
    setTasks((cur) => cur.map((t) => {
      if (t.id === blockerId && t.dependencies) {
        return { ...t, dependencies: { ...t.dependencies, blocks: t.dependencies.blocks.filter((x) => x !== blockedId) } };
      }
      if (t.id === blockedId && t.dependencies) {
        return { ...t, dependencies: { ...t.dependencies, blockedBy: t.dependencies.blockedBy.filter((x) => x !== blockerId) } };
      }
      return t;
    }));
  }, []);

  const createList = useCallback((name: string, spaceId: string, folderId?: string): List => {
    const l: List = { id: `l-${genId("L")}`, name, spaceId, folderId };
    setLists((cur) => [...cur, l]);
    return l;
  }, []);

  const createFolder = useCallback((name: string, spaceId: string): Folder => {
    const f: Folder = { id: `f-${genId("F")}`, name, spaceId };
    setFolders((cur) => [...cur, f]);
    return f;
  }, []);

  const addCustomField = useCallback((listId: string, field: Omit<CustomField, "id">) => {
    setLists((cur) => cur.map((l) => l.id === listId
      ? { ...l, customFields: [...(l.customFields ?? []), { ...field, id: `cf-${genId("CF")}` }] }
      : l));
  }, []);

  const removeCustomField = useCallback((listId: string, fieldId: string) => {
    setLists((cur) => cur.map((l) => l.id === listId
      ? { ...l, customFields: (l.customFields ?? []).filter((f) => f.id !== fieldId) }
      : l));
  }, []);

  const saveTemplateFromTask = useCallback((taskId: string, name: string) => {
    const t = tasks.find((x) => x.id === taskId);
    if (!t) return;
    const subs = tasks.filter((x) => x.parentId === taskId).map((x) => x.title);
    setTemplates((cur) => [...cur, {
      id: `tpl-${genId("T")}`,
      name,
      description: t.description,
      subtasks: subs,
      tags: t.tags,
    }]);
  }, [tasks]);

  const applyTemplate = useCallback((templateId: string, input: NewTaskInput): Task => {
    const tpl = templates.find((t) => t.id === templateId);
    const parent = createTask({
      ...input,
      title: input.title || tpl?.name || "Untitled",
      tags: [...(input.tags ?? []), ...(tpl?.tags ?? [])],
      description: tpl?.description ?? input.description,
    });
    if (tpl?.subtasks?.length) {
      const list = lists.find((l) => l.id === parent.listId)!;
      setTasks((cur) => {
        const subs: Task[] = tpl.subtasks!.map((title) => ({
          id: genId(),
          title,
          status: "To Do",
          priority: "normal",
          spaceId: list.spaceId,
          listId: list.id,
          parentId: parent.id,
          assigneeId: parent.assigneeId,
          due: parent.due,
          description: "",
          comments: [],
          watchers: [],
          tags: [],
          attachments: [],
          dependencies: { blocks: [], blockedBy: [] },
          customFieldValues: {},
          createdAt: new Date().toISOString(),
        }));
        return [...subs, ...cur];
      });
    }
    return parent;
  }, [templates, createTask, lists]);

  const value = useMemo<TasksCtx>(() => ({
    tasks, lists, folders, templates,
    createTask, updateTask, deleteTask, moveTask, bulkUpdate, bulkDelete, duplicateTasks,
    addDependency, removeDependency,
    createList, createFolder,
    addCustomField, removeCustomField,
    saveTemplateFromTask, applyTemplate,
  }), [tasks, lists, folders, templates, createTask, updateTask, deleteTask, moveTask, bulkUpdate, bulkDelete, duplicateTasks, addDependency, removeDependency, createList, createFolder, addCustomField, removeCustomField, saveTemplateFromTask, applyTemplate]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTasks() {
  const c = useContext(Ctx);
  if (!c) throw new Error("TasksProvider missing");
  return c;
}
