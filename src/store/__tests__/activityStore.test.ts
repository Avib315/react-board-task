import { describe, it, expect } from 'vitest';
import { selectFilteredFeed } from '../activityStore';
import type { ActivityEvent } from '../../models/task.model';

const base: ActivityEvent = {
  id: '1', type: 'created', taskId: 't1', taskTitle: 'Fix login bug',
  actor: 'Alice Kim', timestamp: new Date(), detail: 'created task "Fix login bug"',
};

describe('selectFilteredFeed', () => {
  it('returns up to 20 events when no query', () => {
    const feed = Array.from({ length: 30 }, (_, i) => ({ ...base, id: String(i) }));
    expect(selectFilteredFeed(feed, '')).toHaveLength(20);
  });

  it('filters by taskTitle case-insensitively', () => {
    const feed: ActivityEvent[] = [
      { ...base, id: '1', taskTitle: 'Fix login bug' },
      { ...base, id: '2', taskTitle: 'Add dark mode' },
    ];
    expect(selectFilteredFeed(feed, 'login')).toHaveLength(1);
    expect(selectFilteredFeed(feed, 'LOGIN')).toHaveLength(1);
  });

  it('filters by actor name', () => {
    const feed: ActivityEvent[] = [
      { ...base, id: '1', actor: 'Alice Kim' },
      { ...base, id: '2', actor: 'Bob Chen' },
    ];
    expect(selectFilteredFeed(feed, 'bob')).toHaveLength(1);
  });
});
