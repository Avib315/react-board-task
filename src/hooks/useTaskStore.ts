// Typed selector hooks — mirror Angular's @Injectable service injection pattern
// Usage: const tasks = useTasksByStatus();  (replaces injecting TaskService)

import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import type { Task, TaskStatus, StatsSnapshot } from '../models/task.model';
import { useTaskStore, selectTasksByStatus, selectStats } from '../store/taskStore';

export function useTasksByStatus(): Record<TaskStatus, Task[]> {
  const tasks = useTaskStore(s => s.tasks);
  return useMemo(() => selectTasksByStatus(tasks), [tasks]);
}

export function useTaskStats(): StatsSnapshot {
  const tasks = useTaskStore(s => s.tasks);
  return useMemo(() => selectStats(tasks), [tasks]);
}

export function useFilteredTasksByStatus(
  searchQuery: string,
  priority: string,
): Record<TaskStatus, Task[]> {
  const tasks = useTaskStore(s => s.tasks);
  return useMemo(() => {
    const q = searchQuery.toLowerCase();
    const filtered = tasks.filter(t => {
      const matchesSearch = !q || t.title.toLowerCase().includes(q);
      const matchesPriority = !priority || priority === 'all' || t.priority === priority;
      return matchesSearch && matchesPriority;
    });
    return selectTasksByStatus(filtered);
  }, [tasks, searchQuery, priority]);
}

export function useTaskActions() {
  return useTaskStore(
    useShallow(s => ({
      addTask:         s.addTask,
      updateTask:      s.updateTask,
      moveTask:        s.moveTask,
      deleteTask:      s.deleteTask,
      reorderInColumn: s.reorderInColumn,
    }))
  );
}

export function useTaskById(id: string): Task | undefined {
  return useTaskStore(s => s.tasks.find(t => t.id === id));
}

export { useTaskStore };
