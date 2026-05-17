import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { KanbanColumn } from '../KanbanColumn';

function renderColumn(tasks = []) {
  return render(
    <MemoryRouter>
      <KanbanColumn
        status="todo"
        label="To Do"
        tasks={tasks}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    </MemoryRouter>
  );
}

describe('KanbanColumn', () => {
  it('renders label and task count', () => {
    renderColumn();
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('shows empty message when no tasks', () => {
    renderColumn();
    expect(screen.getByText('Drop tasks here')).toBeInTheDocument();
  });
});
