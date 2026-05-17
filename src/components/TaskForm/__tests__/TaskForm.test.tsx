import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { TaskForm } from '../TaskForm';

const task = {
  id: '1', title: 'Existing task', description: '', status: 'todo' as const,
  priority: 'low' as const, assignee: 'Alice Kim', projectId: 'p1',
  createdAt: new Date(), updatedAt: new Date(), dueDate: null, tags: [],
};

function renderForm(props?: Partial<Parameters<typeof TaskForm>[0]>) {
  return render(
    <MemoryRouter>
      <TaskForm onSave={vi.fn()} onCancel={vi.fn()} {...props} />
    </MemoryRouter>
  );
}

describe('TaskForm', () => {
  it('shows "New Task" heading when no task prop', () => {
    renderForm();
    expect(screen.getByText('New Task')).toBeInTheDocument();
  });

  it('shows "Edit Task" heading when task prop provided', () => {
    renderForm({ task });
    expect(screen.getByText('Edit Task')).toBeInTheDocument();
  });

  it('shows "Create Task" submit button for new task', () => {
    renderForm();
    expect(screen.getByText('Create Task')).toBeInTheDocument();
  });

  it('shows "Save Changes" submit button for edit', () => {
    renderForm({ task });
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  it('calls onCancel when Cancel is clicked', async () => {
    const onCancel = vi.fn();
    renderForm({ onCancel });
    await userEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('shows Angular title placeholder text', () => {
    renderForm();
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
  });

  it('shows Angular description placeholder text', () => {
    renderForm();
    expect(screen.getByPlaceholderText('Add more context…')).toBeInTheDocument();
  });
});
