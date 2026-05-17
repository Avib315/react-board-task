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

function DueDate({ date, isDone }: { date: Date; isDone: boolean }) {
  const label = useTimeAgo(date);
  const isOverdue = !isDone && date < new Date();
  return (
    <span className={clsx(styles.dueDate, isOverdue && styles.dueDateOverdue)}>
      {label}
    </span>
  );
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const project = PROJECTS.find(p => p.id === task.projectId);
  const isOverdue = !!task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  const isDone = task.status === 'done';

  const cardStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={cardStyle}
      className={clsx(styles.card, isDone && styles.done, isOverdue && styles.overdue)}
      {...attributes}
    >
      {/* Drag handle — visible on hover */}
      <span className={styles.dragHandle} {...listeners} title="Drag">
        ⠿
      </span>

      {/* Top meta: priority badge + project tag */}
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

      {/* Title — navigates to task detail */}
      <Link to={`/tasks/${task.id}`} className={styles.title}>
        {task.title}
      </Link>

      {/* Footer: assignee + due date + actions */}
      <div className={styles.footer}>
        <span className={styles.assignee}>{task.assignee}</span>
        {task.dueDate && <DueDate date={task.dueDate} isDone={isDone} />}
        <div className={styles.actions}>
          <button
            className={styles.iconBtn}
            onClick={() => onEdit(task)}
            title="Edit"
          >
            ✎
          </button>
          <button
            className={clsx(styles.iconBtn, styles.danger)}
            onClick={() => onDelete(task)}
            title="Delete"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className={styles.tags}>
          {task.tags.map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}
