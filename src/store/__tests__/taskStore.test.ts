import { describe, it, expect, beforeEach } from 'vitest';
import { selectTasksByStatus, selectStats, useTaskStore } from '../taskStore';
import type { Task } from '../../models/task.model';

const base: Task = {
  id: '1', title: 'Test', description: '', status: 'todo', priority: 'low',
  assignee: 'Alice Kim', projectId: 'p1',
  createdAt: new Date(), updatedAt: new Date(), dueDate: null, tags: [],
};

// Reset store to known state before each test
beforeEach(() => {
  useTaskStore.setState({
    tasks: [
      { ...base, id: 'a', status: 'todo' },
      { ...base, id: 'b', status: 'todo' },
      { ...base, id: 'c', status: 'todo' },
      { ...base, id: 'd', status: 'in-progress' },
    ],
  });
});

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

describe('moveTask', () => {
  it('changes a task status to the target column', () => {
    useTaskStore.getState().moveTask('a', 'in-progress');
    const tasks = useTaskStore.getState().tasks;
    expect(tasks.find(t => t.id === 'a')?.status).toBe('in-progress');
  });

  it('does not affect other tasks', () => {
    useTaskStore.getState().moveTask('a', 'done');
    const tasks = useTaskStore.getState().tasks;
    expect(tasks.find(t => t.id === 'b')?.status).toBe('todo');
    expect(tasks.find(t => t.id === 'd')?.status).toBe('in-progress');
  });
});

describe('reorderInColumn', () => {
  it('moves a task from index 0 to index 2 within same column', () => {
    // todo column: [a, b, c]  →  after reorder(todo, 0, 2): [b, c, a]
    useTaskStore.getState().reorderInColumn('todo', 0, 2);
    const col = useTaskStore.getState().tasks.filter(t => t.status === 'todo');
    expect(col[0].id).toBe('b');
    expect(col[1].id).toBe('c');
    expect(col[2].id).toBe('a');
  });

  it('moves a task from index 2 to index 0 within same column', () => {
    // todo column: [a, b, c]  →  after reorder(todo, 2, 0): [c, a, b]
    useTaskStore.getState().reorderInColumn('todo', 2, 0);
    const col = useTaskStore.getState().tasks.filter(t => t.status === 'todo');
    expect(col[0].id).toBe('c');
    expect(col[1].id).toBe('a');
    expect(col[2].id).toBe('b');
  });

  it('does not affect tasks in other columns', () => {
    useTaskStore.getState().reorderInColumn('todo', 0, 2);
    const inProgress = useTaskStore.getState().tasks.filter(t => t.status === 'in-progress');
    expect(inProgress).toHaveLength(1);
    expect(inProgress[0].id).toBe('d');
  });
});

describe('deleteTask', () => {
  it('removes the task from the store', () => {
    useTaskStore.getState().deleteTask('a');
    const tasks = useTaskStore.getState().tasks;
    expect(tasks.find(t => t.id === 'a')).toBeUndefined();
    expect(tasks).toHaveLength(3);
  });
});

describe('addTask', () => {
  it('adds a new task with a generated id and timestamps', () => {
    const before = useTaskStore.getState().tasks.length;
    const task = useTaskStore.getState().addTask({
      title: 'New task', description: '', status: 'todo', priority: 'low',
      assignee: 'Alice Kim', projectId: 'p1', dueDate: null, tags: [],
    });
    expect(useTaskStore.getState().tasks).toHaveLength(before + 1);
    expect(task.id).toBeTruthy();
    expect(task.createdAt).toBeInstanceOf(Date);
  });
});
