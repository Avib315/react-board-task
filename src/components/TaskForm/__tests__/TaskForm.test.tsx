import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TaskForm } from '../TaskForm';

describe('TaskForm', () => {
  it('shows "Add Task" heading when no task prop', () => {
    render(<TaskForm onSave={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  it('shows "Edit Task" heading when task prop provided', () => {
    const task = {
      id: '1', title: 'Existing', description: '', status: 'todo' as const,
      priority: 'low' as const, assignee: 'Alice Kim', projectId: 'p1',
      createdAt: new Date(), updatedAt: new Date(), dueDate: null, tags: [],
    };
    render(<TaskForm task={task} onSave={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText('Edit Task')).toBeInTheDocument();
  });

  it('calls onCancel when Cancel is clicked', async () => {
    const onCancel = vi.fn();
    render(<TaskForm onSave={vi.fn()} onCancel={onCancel} />);
    await userEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });
});
