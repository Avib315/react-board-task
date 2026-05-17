import { describe, it, expect } from 'vitest';
import { selectTasksByStatus, selectStats } from '../taskStore';
import type { Task } from '../../models/task.model';

const base: Task = {
  id: '1', title: 'Test', description: '', status: 'todo', priority: 'low',
  assignee: 'Alice Kim', projectId: 'p1',
  createdAt: new Date(), updatedAt: new Date(), dueDate: null, tags: [],
};

describe('selectTasksByStatus', () => {
  it('groups tasks by status', () => {
    const tasks: Task[] = [
      { ...base, id: '1', status: 'todo' },
      { ...base, id: '2', status: 'in-progress' },
      { ...base, id: '3', status: 'todo' },
    ];
    const result = selectTasksByStatus(tasks);
    expect(result.todo).toHaveLength(2);
    expect(result['in-progress']).toHaveLength(1);
    expect(result.review).toHaveLength(0);
    expect(result.done).toHaveLength(0);
  });
});

describe('selectStats', () => {
  it('calculates completion rate correctly', () => {
    const tasks: Task[] = [
      { ...base, id: '1', status: 'done' },
      { ...base, id: '2', status: 'todo' },
    ];
    const stats = selectStats(tasks);
    expect(stats.total).toBe(2);
    expect(stats.done).toBe(1);
    expect(stats.completionRate).toBe(50);
  });

  it('flags overdue tasks that are not done', () => {
    const past = new Date(Date.now() - 1000 * 60 * 60 * 24);
    const tasks: Task[] = [
      { ...base, id: '1', status: 'todo', dueDate: past },
      { ...base, id: '2', status: 'done', dueDate: past },
    ];
    const stats = selectStats(tasks);
    expect(stats.overdue).toBe(1);
  });
});
