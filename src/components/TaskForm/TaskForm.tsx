import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import type { Task, TaskStatus, TaskPriority } from '../../models/task.model';
import { ASSIGNEES, PROJECTS } from '../../models/task.model';
import styles from './TaskForm.module.scss';

interface TaskFormProps {
  task?: Task | null;
  onSave: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

interface FormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  projectId: string;
  dueDate: string;
  tags: string;
}

// Mirrors Angular noWhitespaceValidator
function noWhitespace(value: string) {
  return value.trim().length > 0 || 'Cannot be blank or whitespace only';
}

export function TaskForm({ task, onSave, onCancel }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      title:       task?.title       ?? '',
      description: task?.description ?? '',
      status:      task?.status      ?? 'todo',
      priority:    task?.priority    ?? 'medium',
      assignee:    task?.assignee    ?? ASSIGNEES[0],
      projectId:   task?.projectId   ?? PROJECTS[0].id,
      dueDate:     task?.dueDate ? task.dueDate.toISOString().slice(0, 10) : '',
      tags:        task?.tags?.join(', ') ?? '',
    },
  });

  // Reset form when task prop changes (switching between add and edit)
  useEffect(() => {
    reset({
      title:       task?.title       ?? '',
      description: task?.description ?? '',
      status:      task?.status      ?? 'todo',
      priority:    task?.priority    ?? 'medium',
      assignee:    task?.assignee    ?? ASSIGNEES[0],
      projectId:   task?.projectId   ?? PROJECTS[0].id,
      dueDate:     task?.dueDate ? task.dueDate.toISOString().slice(0, 10) : '',
      tags:        task?.tags?.join(', ') ?? '',
    });
  }, [task, reset]);

  function onSubmit(values: FormValues) {
    onSave({
      title:       values.title.trim(),
      description: values.description.trim(),
      status:      values.status,
      priority:    values.priority,
      assignee:    values.assignee,
      projectId:   values.projectId,
      dueDate:     values.dueDate ? new Date(values.dueDate) : null,
      tags:        values.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
    });
  }

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{task ? 'Edit Task' : 'Add Task'}</h2>
          <button className={styles.closeBtn} type="button" onClick={onCancel}>✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.modalBody}>

            {/* Title */}
            <div className={clsx(styles.field, errors.title && styles.fieldError)}>
              <label className={styles.label}>
                Title <span className={styles.required}>*</span>
              </label>
              <input
                className={styles.input}
                placeholder="Task title"
                {...register('title', {
                  required: 'Title is required',
                  minLength: { value: 3, message: 'At least 3 characters' },
                  maxLength: { value: 120, message: 'Max 120 characters' },
                  validate: noWhitespace,
                })}
              />
              {errors.title && <p className={styles.errorMsg}>{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div className={clsx(styles.field, errors.description && styles.fieldError)}>
              <label className={styles.label}>Description</label>
              <textarea
                className={clsx(styles.input, styles.textarea)}
                placeholder="Optional description"
                {...register('description', {
                  maxLength: { value: 500, message: 'Max 500 characters' },
                })}
              />
              {errors.description && <p className={styles.errorMsg}>{errors.description.message}</p>}
            </div>

            {/* Status + Priority */}
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Status</label>
                <select className={styles.input} {...register('status')}>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Priority</label>
                <select className={styles.input} {...register('priority')}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Assignee + Project */}
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Assignee</label>
                <select className={styles.input} {...register('assignee')}>
                  {ASSIGNEES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Project</label>
                <select className={styles.input} {...register('projectId')}>
                  {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>

            {/* Due date */}
            <div className={styles.field}>
              <label className={styles.label}>
                Due Date <span className={styles.hint}>(optional)</span>
              </label>
              <input type="date" className={styles.input} {...register('dueDate')} />
            </div>

            {/* Tags */}
            <div className={styles.field}>
              <label className={styles.label}>
                Tags <span className={styles.hint}>(comma-separated)</span>
              </label>
              <input
                className={styles.input}
                placeholder="bug, feature, ux"
                {...register('tags')}
              />
            </div>

          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnCancel} onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className={styles.btnSubmit} disabled={isSubmitting}>
              {task ? 'Save changes' : 'Add task'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
