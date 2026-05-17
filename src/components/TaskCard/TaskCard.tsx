import { Link } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import type { Task } from '../../models/task.model';
import { PROJECTS } from '../../models/task.model';
import { useTimeAgo } from '../../hooks/useTimeAgo';
import styles from './TaskCard.module.scss';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

// ─── Shared visual sub-components ────────────────────────────────────────────

function DueDate({ date, isDone }: { date: Date; isDone: boolean }) {
  const label = useTimeAgo(date);
  const isOverdue = !isDone && date < new Date();
  return (
    <span className={clsx(styles.dueDate, isOverdue && styles.dueDateOverdue)}>
      {label}
    </span>
  );
}

// Inner content — no dnd-kit hooks, safe to render inside DragOverlay
function TaskCardInner({ task, onEdit, onDelete }: TaskCardProps) {
  const project = PROJECTS.find(p => p.id === task.projectId);
  const isDone  = task.status === 'done';

  return (
    <>
      <span className={styles.dragHandle} aria-hidden>⠿</span>

      <div className={styles.metaTop}>
        <span className={clsx(styles.priorityBadge, styles[`p_${task.priority}`])}>
          {task.priority}
        </span>
        {project && (
          <span className={styles.projectTag} style={{ borderColor: project.color }}>
            {project.name}
          </span>
        )}
      </div>

      <Link to={`/tasks/${task.id}`} className={styles.title}>
        {task.title}
      </Link>

      <div className={styles.footer}>
        <span className={styles.assignee}>{task.assignee}</span>
        {task.dueDate && <DueDate date={task.dueDate} isDone={isDone} />}
        <div className={styles.actions}>
          <button className={styles.iconBtn}  onClick={() => onEdit(task)}   title="Edit">✎</button>
          <button className={clsx(styles.iconBtn, styles.danger)} onClick={() => onDelete(task)} title="Delete">✕</button>
        </div>
      </div>

      {task.tags.length > 0 && (
        <div className={styles.tags}>
          {task.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
        </div>
      )}
    </>
  );
}

// ─── Sortable card (used inside KanbanColumn) ─────────────────────────────────

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const isOverdue = !!task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  const isDone    = task.status === 'done';

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={clsx(
        styles.card,
        isDone      && styles.done,
        isOverdue   && styles.overdue,
        isDragging  && styles.dragging,   // invisible — DragOverlay shows the floating copy
      )}
      {...attributes}
      {...listeners}
    >
      <TaskCardInner task={task} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}

// ─── Overlay card (rendered inside DragOverlay, no dnd-kit hooks) ─────────────

export function TaskCardOverlay({ task }: { task: Task }) {
  const isOverdue = !!task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  const isDone    = task.status === 'done';

  return (
    <div className={clsx(styles.card, styles.overlay, isDone && styles.done, isOverdue && styles.overdue)}>
      <TaskCardInner task={task} onEdit={() => {}} onDelete={() => {}} />
    </div>
  );
}
