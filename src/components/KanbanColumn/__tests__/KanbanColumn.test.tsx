import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KanbanColumn } from '../KanbanColumn';

describe('KanbanColumn', () => {
  it('renders label and task count', () => {
    render(<KanbanColumn status="todo" label="To Do" tasks={[]} />);
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
