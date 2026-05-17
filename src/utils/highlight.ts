// Angular equivalent: HighlightDirective (wraps matches in <mark class="highlight">)
// React equivalent:   pure function that returns an array of segments for the Highlight component

export interface TextSegment {
  text: string;
  highlight: boolean;
}

export function splitHighlight(text: string, query: string): TextSegment[] {
  if (!query.trim()) return [{ text, highlight: false }];

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return parts
    .filter(p => p.length > 0)
    .map(part => ({
      text: part,
      highlight: regex.test(part),
    }));
}
