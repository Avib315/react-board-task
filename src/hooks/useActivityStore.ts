// Angular equivalent: ActivityService injected into components
// Auto-push interval (interval(4000) + takeUntil destroy$) lives here as a useEffect

import { useEffect, useMemo } from 'react';
import { useActivityStore, selectFilteredFeed } from '../store/activityStore';

export function useActivityFeed() {
  const feed = useActivityStore(s => s.feed);
  const filterQuery = useActivityStore(s => s.filterQuery);
  const pushRandomEvent = useActivityStore(s => s.pushRandomEvent);

  // Angular: interval(4000).pipe(takeUntil(destroy$)).subscribe(() => pushRandomEvent())
  useEffect(() => {
    const id = setInterval(pushRandomEvent, 4000);
    return () => clearInterval(id);
  }, [pushRandomEvent]);

  const filteredFeed = useMemo(
    () => selectFilteredFeed(feed, filterQuery),
    [feed, filterQuery],
  );

  return {
    feed: filteredFeed,
    filterQuery,
    setFilter: useActivityStore.getState().setFilter,
  };
}

export { useActivityStore };
