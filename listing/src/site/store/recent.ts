import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface RecentState {
  recentSlugs: string[];
  addRecent: (slug: string) => void;
  clearRecent: () => void;
}

export const useRecentStore = create<RecentState>()(
  persist(
    (set, get) => ({
      recentSlugs: [],
      addRecent: (slug: string) => {
        const { recentSlugs } = get();
        const filtered = recentSlugs.filter((s) => s !== slug);
        set({ recentSlugs: [slug, ...filtered].slice(0, 10) });
      },
      clearRecent: () => set({ recentSlugs: [] }),
    }),
    {
      name: 'parmar-recent-properties',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
