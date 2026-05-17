// Angular equivalent: board.component.html column section with cdkDropList
// React equivalent:   @dnd-kit/sortable SortableContext wrapper

import type { Task, TaskStatus } from '../../models/task.model';
import styles from './KanbanColumn.module.scss';

interface KanbanColumnProps {
  status: TaskStatus;
  label: string;
  tasks: Task[];
}

export function KanbanColumn({ status: _status, label, tasks }: KanbanColumnProps) {
  return (
    <div className={styles.column}>
      <div className={styles.header}>
        <span>{label}</span>
        <span className={styles.count}>{tasks.length}</span>
      </div>
      <div className={styles.taskList}>
        {/* TODO: SortableContext + TaskCard */}
      </div>
    </div>
  );
}
