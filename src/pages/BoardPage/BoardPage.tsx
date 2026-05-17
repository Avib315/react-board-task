import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import type { Task, TaskStatus } from '../../models/task.model';
import { COLUMN_ORDER, COLUMN_LABELS } from '../../models/task.model';
import { useFilteredTasksByStatus, useTaskActions, useTaskStore } from '../../hooks/useTaskStore';
import { t, interp } from '../../i18n';
import { KanbanColumn } from '../../components/KanbanColumn/KanbanColumn';
import { TaskCardOverlay } from '../../components/TaskCard/TaskCard';
import { TaskForm } from '../../components/TaskForm/TaskForm';
import styles from './BoardPage.module.scss';

export function BoardPage() {
  const [searchQuery, setSearchQuery]       = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [showForm, setShowForm]             = useState(false);
  const [editingTask, setEditingTask]       = useState<Task | null>(null);
  const [activeTask, setActiveTask]         = useState<Task | null>(null);

  const tasksByStatus = useFilteredTasksByStatus(searchQuery, filterPriority);
  // Mirror Angular's totalTaskCount() — count only the visible (filtered) tasks
  const filteredTotal = Object.values(tasksByStatus).reduce((sum, tasks) => sum + tasks.length, 0);
  const { addTask, updateTask, deleteTask, moveTask, reorderInColumn } = useTaskActions();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Track which task is being dragged so DragOverlay can render a floating copy
  function handleDragStart(event: DragStartEvent) {
    const task = useTaskStore.getState().tasks.find(t => t.id === String(event.active.id));
    setActiveTask(task ?? null);
  }

  // Cross-column move — fires while hovering over a different column
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

  // Same-column reorder — fires on drop (cross-column already handled in onDragOver)
  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);

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
          <h1 className={styles.title}>{t.board.title}</h1>
          <p className={styles.sub}>{interp(t.board.subtitle, { total: filteredTotal, columns: COLUMN_ORDER.length })}</p>
        </div>
        <div className={styles.actions}>
          <input
            className={styles.searchInput}
            placeholder={t.board.searchPlaceholder}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <select
            className={styles.filterSelect}
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
          >
            <option value="">{t.priority.all}</option>
            <option value="critical">{t.priority.critical}</option>
            <option value="high">{t.priority.high}</option>
            <option value="medium">{t.priority.medium}</option>
            <option value="low">{t.priority.low}</option>
          </select>
          <button
            className={styles.btnAdd}
            onClick={() => { setEditingTask(null); setShowForm(true); }}
          >
            {t.board.addTask}
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
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

        {/* Floating card that follows the mouse — mirrors Angular .cdk-drag-preview */}
        <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0, 0, 0.2, 1)' }}>
          {activeTask && <TaskCardOverlay task={activeTask} />}
        </DragOverlay>
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
