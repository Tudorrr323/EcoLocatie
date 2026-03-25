// AuthContext — context global pentru starea de autentificare a utilizatorului.
// Ofera login, register, logout cu persistare in AsyncStorage si guard de navigare.

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types/plant.types';
import type { RegisterData } from '../../modules/auth/types/auth.types';
import {
  login as repoLogin,
  register as repoRegister,
  getUserFromStorage,
  saveUserToStorage,
  clearUserFromStorage,
} from '../../modules/auth/repository/authRepository';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await getUserFromStorage();
      setUser(stored);
      setLoading(false);
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const loggedIn = await repoLogin(email, password);
    await saveUserToStorage(loggedIn);
    setUser(loggedIn);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const newUser = await repoRegister(data);
    await saveUserToStorage(newUser);
    setUser(newUser);
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      saveUserToStorage(updated);
      return updated;
    });
  }, []);

  const logout = useCallback(async () => {
    await clearUserFromStorage();
    setUser(null);
  }, []);

  const isAuthenticated = !loading && user !== null;
  const isAdmin = isAuthenticated && user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, isAdmin, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext trebuie folosit in interiorul AuthProvider');
  return ctx;
}
