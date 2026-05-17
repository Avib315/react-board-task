// Angular equivalent: TaskFormComponent (ReactiveFormsModule + FormBuilder + custom validators)
// React equivalent:   react-hook-form with custom validation rules

import type { Task } from '../../models/task.model';
import { ASSIGNEES, PROJECTS } from '../../models/task.model';
import styles from './TaskForm.module.scss';

interface TaskFormProps {
  task?: Task | null;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function TaskForm({ task: _task, onSave: _onSave, onCancel }: TaskFormProps) {
  // TODO: implement with react-hook-form
  // Fields: title (required, 3-120 chars, noWhitespace), description (max 500),
  //         status, priority, assignee, projectId, dueDate, tags (comma-separated)
  // Custom validators: noWhitespaceValidator, futureDateValidator

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h2>{_task ? 'Edit Task' : 'Add Task'}</h2>
        {/* TODO: form fields */}
        <div className={styles.actions}>
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="submit">Save</button>
        </div>
      </div>
    </div>
  );
}

// Re-export for convenience
export { ASSIGNEES, PROJECTS };
