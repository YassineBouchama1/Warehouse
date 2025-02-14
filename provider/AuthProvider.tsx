import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { storeData, getData, removeData } from '~/utils/storage';
import { Warehouseman } from '~/types';

type AuthContextType = {
  user: Warehouseman | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: Warehouseman) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Warehouseman | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback(async (newUser: Warehouseman) => {
    try {
      setUser(newUser);
      await storeData('warehouseman', newUser);
    } catch (error) {
      console.error('Error during login:', error);
      throw new Error('Failed to log in');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setUser(null);
      await removeData('warehouseman');
    } catch (error) {
      console.error('Error during logout:', error);
      throw new Error('Failed to log out');
    }
  }, []);

  const loadUser = useCallback(async () => {
    try {
      const storedUser = await getData<Warehouseman>('warehouseman');
      setUser(storedUser || null);
    } catch (error) {
      console.error('Error loading user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        loadUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
