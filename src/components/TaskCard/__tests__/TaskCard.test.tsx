import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TaskCard } from '../TaskCard';
import type { Task } from '../../../models/task.model';

const task: Task = {
  id: '1', title: 'Fix login bug', description: '', status: 'todo', priority: 'high',
  assignee: 'Alice Kim', projectId: 'p1',
  createdAt: new Date(), updatedAt: new Date(), dueDate: null, tags: [],
};

describe('TaskCard', () => {
  it('renders task title', () => {
    render(<TaskCard task={task} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Fix login bug')).toBeInTheDocument();
  });

  it('calls onEdit when Edit is clicked', async () => {
    const onEdit = vi.fn();
    render(<TaskCard task={task} onEdit={onEdit} onDelete={vi.fn()} />);
    await userEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith(task);
  });

  it('calls onDelete when Delete is clicked', async () => {
    const onDelete = vi.fn();
    render(<TaskCard task={task} onEdit={vi.fn()} onDelete={onDelete} />);
    await userEvent.click(screen.getByText('Delete'));
    expect(onDelete).toHaveBeenCalledWith(task);
  });

  it('applies done style for completed tasks', () => {
    const done: Task = { ...task, status: 'done' };
    const { container } = render(<TaskCard task={done} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(container.firstChild).toHaveClass('done');
  });
});
