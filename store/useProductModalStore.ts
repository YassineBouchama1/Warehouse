import { create } from 'zustand';

interface ProductModalState {
 productId: string | null | number;
  isModalOpen: boolean;
  openModal: (taskId: string) => void;
  closeModal: () => void;
}

export const useProductModalStore = create<ProductModalState>((set) => ({
  productId: null,
  isModalOpen: false,

  openModal: (productId) => set({ productId, isModalOpen: true }),

  closeModal: () => set({ productId: null, isModalOpen: false }),
}));
