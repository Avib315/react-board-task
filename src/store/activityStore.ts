import { create } from 'zustand';
import type { ActivityEvent } from '../models/task.model';
import { ASSIGNEES } from '../models/task.model';

const EVENT_TEMPLATES: Array<{ type: ActivityEvent['type']; detail: (t: string) => string }> = [
  { type: 'created',   detail: t => `created task "${t}"` },
  { type: 'updated',   detail: t => `updated description on "${t}"` },
  { type: 'moved',     detail: t => `moved "${t}" to In Progress` },
  { type: 'moved',     detail: t => `moved "${t}" to Review` },
  { type: 'completed', detail: t => `marked "${t}" as Done` },
];

const SAMPLE_TITLES = [
  'Fix login redirect bug', 'Add dark mode toggle', 'Improve error messages',
  'Refactor auth middleware', 'Update API docs', 'Write E2E tests',
  'Optimize bundle size', 'Fix mobile layout', 'Add rate limiting', 'Improve search UX',
];

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateInitialFeed(): ActivityEvent[] {
  const now = new Date();
  return Array.from({ length: 10 }, (_, i) => {
    const template = randomFrom(EVENT_TEMPLATES);
    const title = randomFrom(SAMPLE_TITLES);
    return {
      id: generateId(),
      type: template.type,
      taskId: generateId(),
      taskTitle: title,
      actor: randomFrom(ASSIGNEES),
      detail: template.detail(title),
      timestamp: new Date(now.getTime() - i * 3 * 60 * 1000),
    };
  });
}

export interface ActivityState {
  feed: ActivityEvent[];
  filterQuery: string;
  setFilter: (query: string) => void;
  pushEvent: (event: Omit<ActivityEvent, 'id' | 'timestamp'>) => void;
  pushRandomEvent: () => void;
}

export const useActivityStore = create<ActivityState>()((set, get) => ({
  feed: generateInitialFeed(),
  filterQuery: '',

  setFilter: (query) => set({ filterQuery: query }),

  pushEvent: (event) => {
    const full: ActivityEvent = { ...event, id: generateId(), timestamp: new Date() };
    set(state => ({ feed: [full, ...state.feed].slice(0, 100) }));
  },

  pushRandomEvent: () => {
    const template = randomFrom(EVENT_TEMPLATES);
    const title = randomFrom(SAMPLE_TITLES);
    get().pushEvent({
      type: template.type,
      taskId: generateId(),
      taskTitle: title,
      actor: randomFrom(ASSIGNEES),
      detail: template.detail(title),
    });
  },
}));

export function selectFilteredFeed(feed: ActivityEvent[], query: string): ActivityEvent[] {
  if (!query.trim()) return feed.slice(0, 20);
  const q = query.toLowerCase();
  return feed
    .filter(e => e.taskTitle.toLowerCase().includes(q) || e.actor.toLowerCase().includes(q))
    .slice(0, 20);
}
