import { useSyncExternalStore } from "react";

// True below the 768px breakpoint. Reports false during server rendering and
// hydration (matching the pre-rendered HTML), then updates immediately in the
// browser, so pre-rendered pages hydrate without mismatches.
const query = () => window.innerWidth < 768;

const subscribe = (onChange: () => void) => {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
};

export const useIsMobile = () => useSyncExternalStore(subscribe, query, () => false);
