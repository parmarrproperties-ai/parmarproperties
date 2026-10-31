import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CompareState {
  compareIds: string[];
  toggleCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      compareIds: [],
      toggleCompare: (id: string) => {
        const { compareIds } = get();
        if (compareIds.includes(id)) {
          set({ compareIds: compareIds.filter((item) => item !== id) });
        } else {
          if (compareIds.length >= 4) {
            alert('You can compare up to 4 properties at a time.');
            return;
          }
          set({ compareIds: [...compareIds, id] });
        }
      },
      removeFromCompare: (id: string) => {
        set({ compareIds: get().compareIds.filter((item) => item !== id) });
      },
      isInCompare: (id: string) => get().compareIds.includes(id),
      clearCompare: () => set({ compareIds: [] }),
    }),
    {
      name: 'parmar-compare-properties',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
