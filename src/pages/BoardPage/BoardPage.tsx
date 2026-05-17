import { useState } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import type { DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import type { Task, TaskStatus } from '../../models/task.model';
import { COLUMN_ORDER, COLUMN_LABELS } from '../../models/task.model';
import { useFilteredTasksByStatus, useTaskActions, useTaskStore } from '../../hooks/useTaskStore';
import { KanbanColumn } from '../../components/KanbanColumn/KanbanColumn';
import { TaskForm } from '../../components/TaskForm/TaskForm';
import styles from './BoardPage.module.scss';

export function BoardPage() {
  const [searchQuery, setSearchQuery]       = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [showForm, setShowForm]             = useState(false);
  const [editingTask, setEditingTask]       = useState<Task | null>(null);

  const tasksByStatus = useFilteredTasksByStatus(searchQuery, filterPriority);
  const { addTask, updateTask, deleteTask, moveTask, reorderInColumn } = useTaskActions();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Cross-column: fires while hovering — moves task to new column immediately for live feedback.
  // Uses getState() so the read is always fresh (avoids stale closure).
  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const tasks      = useTaskStore.getState().tasks;
    const activeTask = tasks.find(t => t.id === String(active.id));
    const overId     = String(over.id);

    const targetStatus = COLUMN_ORDER.includes(overId as TaskStatus)
      ? (overId as TaskStatus)
      : tasks.find(t => t.id === overId)?.status;

    if (activeTask && targetStatus && activeTask.status !== targetStatus) {
      moveTask(String(active.id), targetStatus);
    }
  }

  // Same-column reorder: fires on drop — cross-column was already handled in onDragOver.
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const tasks      = useTaskStore.getState().tasks;
    const activeTask = tasks.find(t => t.id === String(active.id));
    const overTask   = tasks.find(t => t.id === String(over.id));

    if (activeTask && overTask && activeTask.status === overTask.status) {
      const col  = tasks.filter(t => t.status === activeTask.status);
      const from = col.findIndex(t => t.id === String(active.id));
      const to   = col.findIndex(t => t.id === String(over.id));
      if (from !== -1 && to !== -1 && from !== to) {
        reorderInColumn(activeTask.status, from, to);
      }
    }
  }

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
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Board</h1>
          <p className={styles.sub}>Drag cards between columns to update status</p>
        </div>
        <div className={styles.actions}>
          <input
            className={styles.searchInput}
            placeholder="Search tasks…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <select
            className={styles.filterSelect}
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
          >
            <option value="">All priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button
            className={styles.btnAdd}
            onClick={() => { setEditingTask(null); setShowForm(true); }}
          >
            + Add Task
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className={styles.board}>
          {COLUMN_ORDER.map(status => (
            <KanbanColumn
              key={status}
              status={status}
              label={COLUMN_LABELS[status]}
              tasks={tasksByStatus[status]}
              onEdit={task => { setEditingTask(task); setShowForm(true); }}
              onDelete={task => deleteTask(task.id)}
            />
          ))}
        </div>
      </DndContext>

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
