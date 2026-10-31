"use client";

import * as React from "react";

import { getErrorMessage } from "@/lib/utils";

export interface Resource<T> {
  data: T;
  /** Write straight to the cache, for optimistic reordering and toggles. */
  setData: React.Dispatch<React.SetStateAction<T>>;
  loading: boolean;
  error: string | null;
  /** Fetch again, showing the loading state while it runs. */
  reload: () => void;
  /** Fetch again in the background: current data stays on screen, no loading state. */
  refresh: () => void;
}

/**
 * Fetches `fetcher` on mount, whenever its identity changes, and whenever
 * `reload` is called. Wrap the fetcher in `useCallback` so it only changes when
 * its inputs do — filters and pagination then refetch on their own.
 *
 * State is written after the promise settles rather than before it starts, so a
 * mount never costs a second synchronous render.
 */
export function useResource<T>(
  fetcher: () => Promise<T>,
  initial: T
): Resource<T> {
  const [data, setData] = React.useState<T>(initial);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [attempt, setAttempt] = React.useState(0);

  React.useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const result = await fetcher();
        if (!active) return;
        setData(result);
        setError(null);
      } catch (caught) {
        if (active) setError(getErrorMessage(caught));
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [fetcher, attempt]);

  const reload = React.useCallback(() => {
    setLoading(true);
    setAttempt((value) => value + 1);
  }, []);

  const refresh = React.useCallback(() => setAttempt((value) => value + 1), []);

  return { data, setData, loading, error, reload, refresh };
}
