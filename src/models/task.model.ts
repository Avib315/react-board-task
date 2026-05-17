export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date | null;
  tags: string[];
}

export interface Project {
  id: string;
  name: string;
  color: string;
}

export interface ActivityEvent {
  id: string;
  type: 'created' | 'updated' | 'moved' | 'completed';
  taskId: string;
  taskTitle: string;
  actor: string;
  timestamp: Date;
  detail: string;
}

export interface StatsSnapshot {
  total: number;
  todo: number;
  inProgress: number;
  review: number;
  done: number;
  overdue: number;
  completionRate: number;
}

export const ASSIGNEES = [
  'Alice Kim',
  'Bob Chen',
  'Carol Davis',
  'Dan Harris',
  'Eve Martinez',
];

export const PROJECTS: Project[] = [
  { id: 'p1', name: 'Frontend Revamp', color: '#6366f1' },
  { id: 'p2', name: 'API Gateway', color: '#f59e0b' },
  { id: 'p3', name: 'Mobile App', color: '#10b981' },
  { id: 'p4', name: 'DevOps', color: '#ef4444' },
];

export const COLUMN_ORDER: TaskStatus[] = ['todo', 'in-progress', 'review', 'done'];

export const COLUMN_LABELS: Record<TaskStatus, string> = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'review': 'Review',
  'done': 'Done',
};
