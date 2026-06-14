import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StoreState {
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      favorites: [],
      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((favId) => favId !== id)
            : [...state.favorites, id],
        })),
    }),
    {
      name: 'reef-storage',
    }
  )
);
