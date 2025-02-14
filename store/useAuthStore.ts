import { create } from 'zustand';
import { removeData, storeData, getData } from '~/utils/storage';

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
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  setUserFromStorage: (user: User | null) => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true, 

  login: async (user: User) => {
    set({ user });
    await storeData('warehouseman', user);
  },

  logout: () => {
    set({ user: null });
    removeData('warehouseman');
  },

  setUserFromStorage: (user: User | null) => {
    set({ user, isLoading: false }); 
  },

  loadUser: async () => {
    const storedUser = await getData('warehouseman');
    set({ user: storedUser || null, isLoading: false });
  },
}));

