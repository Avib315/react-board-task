import { describe, it, expect } from 'vitest';
import { splitHighlight } from '../highlight';

describe('splitHighlight', () => {
  it('returns single non-highlighted segment when no query', () => {
    const result = splitHighlight('Hello world', '');
    expect(result).toEqual([{ text: 'Hello world', highlight: false }]);
  });

  it('splits and marks matching segments case-insensitively', () => {
    const result = splitHighlight('Fix Login Bug', 'login');
    const highlighted = result.filter(s => s.highlight);
    expect(highlighted).toHaveLength(1);
    expect(highlighted[0].text.toLowerCase()).toBe('login');
  });

  it('handles no match', () => {
    const result = splitHighlight('Hello world', 'xyz');
    expect(result).toEqual([{ text: 'Hello world', highlight: false }]);
  });

  it('handles multiple matches', () => {
    const result = splitHighlight('bug fix bug', 'bug');
    expect(result.filter(s => s.highlight)).toHaveLength(2);
  });
});
