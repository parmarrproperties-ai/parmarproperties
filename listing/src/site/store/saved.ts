import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SavedState {
  savedIds: string[];
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
  clearSaved: () => void;
}

export const useSavedStore = create<SavedState>()(
  persist(
    (set, get) => ({
      savedIds: [],
      toggleSaved: (id: string) => {
        const { savedIds } = get();
        if (savedIds.includes(id)) {
          set({ savedIds: savedIds.filter((item) => item !== id) });
        } else {
          set({ savedIds: [...savedIds, id] });
        }
      },
      isSaved: (id: string) => get().savedIds.includes(id),
      clearSaved: () => set({ savedIds: [] }),
    }),
    {
      name: 'parmar-saved-properties',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
