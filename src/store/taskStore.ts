// Angular equivalent: TaskService (signal<Task[]> + computed + effect → localStorage)
// React equivalent:   Zustand store with persist middleware

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, TaskStatus, StatsSnapshot } from '../models/task.model';
import { ASSIGNEES, PROJECTS, COLUMN_ORDER } from '../models/task.model';

// TODO: implement store
// Shape mirrors TaskService:
//   state:   tasks[]
//   derived: tasksByStatus, stats  (computed → Zustand selectors + useMemo in hooks)
//   actions: addTask, updateTask, moveTask, deleteTask, reorderInColumn
//   effect:  persist middleware replaces Angular effect(() => localStorage.setItem(...))

export interface TaskState {
  tasks: Task[];
  addTask: (partial: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Task;
  updateTask: (id: string, changes: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  moveTask: (id: string, newStatus: TaskStatus) => void;
  deleteTask: (id: string) => void;
  reorderInColumn: (status: TaskStatus, from: number, to: number) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (_set, _get) => ({
      tasks: [], // TODO: seed tasks on first load

      addTask: (_partial) => {
        throw new Error('Not implemented');
      },
      updateTask: (_id, _changes) => {
        throw new Error('Not implemented');
      },
      moveTask: (_id, _newStatus) => {
        throw new Error('Not implemented');
      },
      deleteTask: (_id) => {
        throw new Error('Not implemented');
      },
      reorderInColumn: (_status, _from, _to) => {
        throw new Error('Not implemented');
      },
    }),
    { name: 'pm_tasks' }
  )
);

// Selectors (Angular computed → Zustand selector functions)
export function selectTasksByStatus(tasks: Task[]): Record<TaskStatus, Task[]> {
  const map: Record<TaskStatus, Task[]> = { todo: [], 'in-progress': [], review: [], done: [] };
  for (const task of tasks) map[task.status].push(task);
  return map;
}

export function selectStats(tasks: Task[]): StatsSnapshot {
  const now = new Date();
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  return {
    total,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    review: tasks.filter(t => t.status === 'review').length,
    done,
    overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'done').length,
    completionRate: total ? Math.round((done / total) * 100) : 0,
  };
}

// Re-export constants used by seed logic
export { ASSIGNEES, PROJECTS, COLUMN_ORDER };
