import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { TaskCard } from '../TaskCard';
import type { Task } from '../../../models/task.model';

const task: Task = {
  id: '1', title: 'Fix login bug', description: '', status: 'todo', priority: 'high',
  assignee: 'Alice Kim', projectId: 'p1',
  createdAt: new Date(), updatedAt: new Date(), dueDate: null, tags: [],
};

function renderCard(props?: Partial<Parameters<typeof TaskCard>[0]>) {
  return render(
    <MemoryRouter>
      <TaskCard task={task} onEdit={vi.fn()} onDelete={vi.fn()} {...props} />
    </MemoryRouter>
  );
}

describe('TaskCard', () => {
  it('renders task title', () => {
    renderCard();
    expect(screen.getByText('Fix login bug')).toBeInTheDocument();
  });

  it('renders priority badge', () => {
    renderCard();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('renders assignee', () => {
    renderCard();
    expect(screen.getByText('Alice Kim')).toBeInTheDocument();
  });

  it('calls onEdit when Edit is clicked', async () => {
    const onEdit = vi.fn();
    renderCard({ onEdit });
    await userEvent.click(screen.getByTitle('Edit'));
    expect(onEdit).toHaveBeenCalledWith(task);
  });

  it('calls onDelete when Delete is clicked', async () => {
    const onDelete = vi.fn();
    renderCard({ onDelete });
    await userEvent.click(screen.getByTitle('Delete'));
    expect(onDelete).toHaveBeenCalledWith(task);
  });

  it('applies done style for completed tasks', () => {
    const { container } = renderCard({ task: { ...task, status: 'done' } });
    expect(container.firstChild).toHaveClass('done');
  });

  it('shows overdue style when past due date and not done', () => {
    const past = new Date(Date.now() - 86400000);
    const { container } = renderCard({ task: { ...task, dueDate: past, status: 'todo' } });
    expect(container.firstChild).toHaveClass('overdue');
  });
});
