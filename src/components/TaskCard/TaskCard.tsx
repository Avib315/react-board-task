// Angular equivalent: task card inside board.component.html (cdkDrag)
// Shows: priority badge, project tag, title, assignee, due date, edit/delete actions

import type { Task } from '../../models/task.model';
import { PROJECTS } from '../../models/task.model';
import styles from './TaskCard.module.scss';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const project = PROJECTS.find(p => p.id === task.projectId);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div className={`${styles.card} ${task.status === 'done' ? styles.done : ''} ${isOverdue ? styles.overdue : ''}`}>
      {/* TODO: drag handle, priority badge, project tag, title link, footer, tags */}
      <span className={`${styles.priorityBadge} ${styles[`p_${task.priority}`]}`}>
        {task.priority}
      </span>
      {project && (
        <span className={styles.projectTag} style={{ borderColor: project.color }}>
          {project.name}
        </span>
      )}
      <p className={styles.title}>{task.title}</p>
      <div className={styles.actions}>
        <button onClick={() => onEdit(task)}>Edit</button>
        <button onClick={() => onDelete(task)}>Delete</button>
      </div>
    </div>
  );
}
