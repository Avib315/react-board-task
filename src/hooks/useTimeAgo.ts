// Angular equivalent: TimeAgoPipe (impure, auto-refreshes via NgZone)
// React equivalent:   hook that re-renders on a calculated interval

import { useState, useEffect } from 'react';
import { timeAgo } from '../utils/timeAgo';

export function useTimeAgo(date: Date): string {
  const [label, setLabel] = useState(() => timeAgo(date));

  useEffect(() => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    const interval =
      seconds < 60    ? 5_000    :
      seconds < 3600  ? 60_000   :
      seconds < 86400 ? 3_600_000 : 0;

    if (!interval) return;
    const id = setInterval(() => setLabel(timeAgo(date)), interval);
    return () => clearInterval(id);
  }, [date]);

  return label;
}
