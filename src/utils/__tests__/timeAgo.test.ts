import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { timeAgo } from '../timeAgo';

describe('timeAgo', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns "just now" for < 5 seconds', () => {
    const now = new Date();
    vi.setSystemTime(now.getTime() + 3000);
    expect(timeAgo(now)).toBe('just now');
  });

  it('returns seconds for < 60s', () => {
    const now = new Date();
    vi.setSystemTime(now.getTime() + 30000);
    expect(timeAgo(now)).toBe('30s ago');
  });

  it('returns minutes for < 60m', () => {
    const now = new Date();
    vi.setSystemTime(now.getTime() + 5 * 60 * 1000);
    expect(timeAgo(now)).toBe('5m ago');
  });

  it('returns hours for < 24h', () => {
    const now = new Date();
    vi.setSystemTime(now.getTime() + 3 * 60 * 60 * 1000);
    expect(timeAgo(now)).toBe('3h ago');
  });

  it('returns days for < 7d', () => {
    const now = new Date();
    vi.setSystemTime(now.getTime() + 4 * 24 * 60 * 60 * 1000);
    expect(timeAgo(now)).toBe('4d ago');
  });
});
