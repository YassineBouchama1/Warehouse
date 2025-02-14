import { create } from 'zustand';

interface FilterModalState {
  isFilterModalOpen: boolean;
  orderBy: 'asc' | 'desc';
  sortBy: 'name' | 'quantity' | 'stock'; 
  city: string; 
  inStockOnly: boolean; 

  // Actions
  openFilterModal: () => void;
  closeFilterModal: () => void;
  setFilters: (filters: Partial<FilterModalState>) => void;
  resetFilters: () => void;
}

export const useFilterModalStore = create<FilterModalState>((set) => ({
  isFilterModalOpen: false,
  orderBy: 'asc',
  sortBy: 'name', 
  city: '', 
  inStockOnly: false, 

  openFilterModal: () => set({ isFilterModalOpen: true }),

  closeFilterModal: () => set({ isFilterModalOpen: false }),

  setFilters: (filters) =>
    set((state) => ({
      ...state,
      ...filters,
    })),

  resetFilters: () =>
    set({
      orderBy: 'asc',
      sortBy: 'name',
      city: '',
      inStockOnly: false,
    }),
}));
