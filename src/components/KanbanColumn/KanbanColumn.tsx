import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import clsx from 'clsx';
import type { Task, TaskStatus } from '../../models/task.model';
import { TaskCard } from '../TaskCard/TaskCard';
import styles from './KanbanColumn.module.scss';

interface KanbanColumnProps {
  status: TaskStatus;
  label: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const COL_ACCENT: Record<TaskStatus, string> = {
  'todo':        styles.accentTodo ?? '',
  'in-progress': styles.accentInProgress ?? '',
  'review':      styles.accentReview ?? '',
  'done':        styles.accentDone ?? '',
};

export function KanbanColumn({ status, label, tasks, onEdit, onDelete }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className={clsx(styles.column, COL_ACCENT[status])}>
      <div className={styles.header}>
        <span className={styles.title}>{label}</span>
        <span className={styles.count}>{tasks.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={clsx(styles.taskList, isOver && styles.isOver)}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <p className={styles.empty}>Drop tasks here</p>
        )}
      </div>
    </div>
  );
}
