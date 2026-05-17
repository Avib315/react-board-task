// Angular equivalent: BoardComponent (board.component.ts + board.component.html)
// Thin page shell — filter state lives here, heavy lifting delegated to child components

import { useState } from 'react';
import { COLUMN_ORDER, COLUMN_LABELS } from '../../models/task.model';
import { useFilteredTasksByStatus, useTaskActions } from '../../hooks/useTaskStore';
import { KanbanColumn } from '../../components/KanbanColumn/KanbanColumn';
import { TaskForm } from '../../components/TaskForm/TaskForm';
import type { Task } from '../../models/task.model';
import styles from './BoardPage.module.scss';

export function BoardPage() {
  // Angular: filterPriority = signal(''), searchQuery = signal(''), showForm = signal(false)
  const [searchQuery, setSearchQuery]     = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [showForm, setShowForm]           = useState(false);
  const [editingTask, setEditingTask]     = useState<Task | null>(null);

  const tasksByStatus = useFilteredTasksByStatus(searchQuery, filterPriority);
  const { addTask, updateTask, deleteTask } = useTaskActions();

  function handleSave(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }
    setShowForm(false);
    setEditingTask(null);
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Board</h1>
        <div className={styles.filters}>
          <input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className={styles.prioritySelect}
          >
            <option value="">All priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button onClick={() => { setEditingTask(null); setShowForm(true); }}>
            + Add Task
          </button>
        </div>
      </div>

      {/* Board — TODO: wrap in DndContext for drag-and-drop */}
      <div className={styles.board}>
        {COLUMN_ORDER.map(status => (
          <KanbanColumn
            key={status}
            status={status}
            label={COLUMN_LABELS[status]}
            tasks={tasksByStatus[status]}
          />
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingTask(null); }}
        />
      )}
    </div>
  );
}
