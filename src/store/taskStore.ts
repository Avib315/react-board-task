import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, TaskStatus, StatsSnapshot } from '../models/task.model';
import { ASSIGNEES, PROJECTS, COLUMN_ORDER } from '../models/task.model';

const STORAGE_KEY = 'pm_tasks';

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function seedTasks(): Task[] {
  const statuses: TaskStatus[] = ['todo', 'in-progress', 'review', 'done'];
  const priorities = ['low', 'medium', 'high', 'critical'] as const;
  const tagPool = ['bug', 'feature', 'docs', 'refactor', 'test', 'ux', 'perf', 'security'];
  const titles = [
    'Implement user authentication flow',
    'Fix pagination bug on dashboard',
    'Refactor API response caching',
    'Add unit tests for payment module',
    'Design new onboarding screens',
    'Migrate database to PostgreSQL',
    'Set up CI/CD pipeline',
    'Resolve memory leak in worker service',
    'Update API documentation',
    'Implement dark mode support',
    'Add CSV export feature',
    'Fix broken layout on mobile',
    'Code review for PR #241',
    'Performance audit on search endpoint',
    'Write E2E tests for checkout flow',
    'Integrate third-party analytics SDK',
    'Sync translations for 5 locales',
    'Harden input validation across forms',
    'Investigate flaky test in CI',
    'Deploy hotfix to staging',
  ];

  const now = new Date();
  return titles.map((title, i) => {
    const createdAt = new Date(now.getTime() - (20 - i) * 24 * 60 * 60 * 1000);
    const dueDays = Math.floor(Math.random() * 30) - 5;
    return {
      id: generateId(),
      title,
      description: `This task covers the work needed for: ${title.toLowerCase()}. Acceptance criteria are defined in the linked spec doc.`,
      status: randomFrom(statuses),
      priority: randomFrom(priorities),
      assignee: randomFrom(ASSIGNEES),
      projectId: randomFrom(PROJECTS).id,
      createdAt,
      updatedAt: new Date(createdAt.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000),
      dueDate: new Date(now.getTime() + dueDays * 24 * 60 * 60 * 1000),
      tags: [randomFrom(tagPool), randomFrom(tagPool)].filter((v, idx, a) => a.indexOf(v) === idx),
    };
  });
}

// Restores Date objects after JSON.parse (persist middleware strips them to strings)
function reviveDates(tasks: Task[]): Task[] {
  return tasks.map(t => ({
    ...t,
    createdAt: new Date(t.createdAt),
    updatedAt: new Date(t.updatedAt),
    dueDate: t.dueDate ? new Date(t.dueDate) : null,
  }));
}

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
    (set, get) => ({
      tasks: seedTasks(),

      addTask: (partial) => {
        const now = new Date();
        const task: Task = { ...partial, id: generateId(), createdAt: now, updatedAt: now };
        set(state => ({ tasks: [...state.tasks, task] }));
        return task;
      },

      updateTask: (id, changes) => {
        set(state => ({
          tasks: state.tasks.map(t =>
            t.id === id ? { ...t, ...changes, updatedAt: new Date() } : t
          ),
        }));
      },

      moveTask: (id, newStatus) => get().updateTask(id, { status: newStatus }),

      deleteTask: (id) => {
        set(state => ({ tasks: state.tasks.filter(t => t.id !== id) }));
      },

      reorderInColumn: (status, from, to) => {
        set(state => {
          const col = state.tasks.filter(t => t.status === status);
          const rest = state.tasks.filter(t => t.status !== status);
          const [moved] = col.splice(from, 1);
          col.splice(to, 0, moved);
          return { tasks: [...rest, ...col] };
        });
      },
    }),
    {
      name: STORAGE_KEY,
      onRehydrateStorage: () => state => {
        if (state) state.tasks = reviveDates(state.tasks);
      },
    }
  )
);

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

export { ASSIGNEES, PROJECTS, COLUMN_ORDER };
