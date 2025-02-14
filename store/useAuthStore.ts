import { create } from 'zustand';
import { removeData, storeData } from '~/utils/storage';

export interface User {
  id: number;
  name: string;
  warehouseId: number;
  secretKey: string;
  city: string;
  dob: string;
}

interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  setUserFromStorage: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  login: (user: User) => {
    set({ user });
   storeData('warehouseman', user);
  },

  logout: () => {
    set({ user: null });
    removeData('warehouseman');
  },

  setUserFromStorage: (user: User | null) => {
    set({ user });
  },
}));
