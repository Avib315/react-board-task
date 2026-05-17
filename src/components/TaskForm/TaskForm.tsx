import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import type { Task, TaskStatus, TaskPriority } from '../../models/task.model';
import { ASSIGNEES, PROJECTS } from '../../models/task.model';
import { t } from '../../i18n';
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

function noWhitespace(value: string) {
  return value.trim().length > 0 || t.taskForm.validation.titleNoWhitespace;
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
      tags:        values.tags.split(',').map(v => v.trim()).filter(Boolean),
    });
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {task ? t.taskForm.editHeading : t.taskForm.addHeading}
          </h2>
          <button className={styles.closeBtn} type="button" onClick={onCancel}>✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.modalBody}>

            {/* Title */}
            <div className={clsx(styles.field, errors.title && styles.fieldError)}>
              <label className={styles.label}>
                {t.taskForm.fields.title} <span className={styles.required}>*</span>
              </label>
              <input
                className={styles.input}
                placeholder={t.taskForm.placeholders.title}
                {...register('title', {
                  required:  t.taskForm.validation.titleRequired,
                  minLength: { value: 3,   message: t.taskForm.validation.titleMin },
                  maxLength: { value: 120, message: t.taskForm.validation.titleMax },
                  validate:  noWhitespace,
                })}
              />
              {errors.title && <p className={styles.errorMsg}>{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div className={clsx(styles.field, errors.description && styles.fieldError)}>
              <label className={styles.label}>{t.taskForm.fields.description}</label>
              <textarea
                className={clsx(styles.input, styles.textarea)}
                placeholder={t.taskForm.placeholders.description}
                {...register('description', {
                  maxLength: { value: 500, message: t.taskForm.validation.descriptionMax },
                })}
              />
              {errors.description && <p className={styles.errorMsg}>{errors.description.message}</p>}
            </div>

            {/* Status + Priority */}
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>{t.taskForm.fields.status}</label>
                <select className={styles.input} {...register('status')}>
                  <option value="todo">{t.status.todo}</option>
                  <option value="in-progress">{t.status.inProgress}</option>
                  <option value="review">{t.status.review}</option>
                  <option value="done">{t.status.done}</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{t.taskForm.fields.priority}</label>
                <select className={styles.input} {...register('priority')}>
                  <option value="low">{t.priority.low}</option>
                  <option value="medium">{t.priority.medium}</option>
                  <option value="high">{t.priority.high}</option>
                  <option value="critical">{t.priority.critical}</option>
                </select>
              </div>
            </div>

            {/* Assignee + Project */}
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>{t.taskForm.fields.assignee}</label>
                <select className={styles.input} {...register('assignee')}>
                  {ASSIGNEES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{t.taskForm.fields.project}</label>
                <select className={styles.input} {...register('projectId')}>
                  {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>

            {/* Due date */}
            <div className={styles.field}>
              <label className={styles.label}>
                {t.taskForm.fields.dueDate}{' '}
                <span className={styles.hint}>({t.taskForm.hints.optional})</span>
              </label>
              <input type="date" className={styles.input} {...register('dueDate')} />
            </div>

            {/* Tags */}
            <div className={styles.field}>
              <label className={styles.label}>
                {t.taskForm.fields.tags}{' '}
                <span className={styles.hint}>({t.taskForm.hints.commaSeparated})</span>
              </label>
              <input
                className={styles.input}
                placeholder={t.taskForm.placeholders.tags}
                {...register('tags')}
              />
            </div>

          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnCancel} onClick={onCancel}>
              {t.taskForm.cancel}
            </button>
            <button type="submit" className={styles.btnSubmit} disabled={isSubmitting}>
              {task ? t.taskForm.saveChanges : t.taskForm.addTaskBtn}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
