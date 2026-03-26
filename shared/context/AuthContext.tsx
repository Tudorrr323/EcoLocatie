// AuthContext — context global pentru starea de autentificare a utilizatorului.
// Ofera login, register, logout cu persistare in AsyncStorage si guard de navigare.
// La startup, verifica token-ul JWT prin /api/auth/me si reincarca profilul.

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../types/plant.types';
import type { RegisterData } from '../../modules/auth/types/auth.types';
import {
  login as repoLogin,
  register as repoRegister,
  fetchCurrentUser,
  getUserFromStorage,
  saveUserToStorage,
  clearUserFromStorage,
  hasStoredToken,
  AccountDeactivatedError,
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
      try {
        const hasToken = await hasStoredToken();
        if (hasToken) {
          // Validate token by fetching current user from API
          try {
            const freshUser = await fetchCurrentUser();
            await saveUserToStorage(freshUser);
            setUser(freshUser);
          } catch (err) {
            if (err instanceof AccountDeactivatedError) {
              // Account deactivated — force logout
              await clearUserFromStorage();
              setUser(null);
            } else {
              // Token expired or invalid — fallback to cached user or clear
              const stored = await getUserFromStorage();
              if (stored) {
                setUser(stored);
              } else {
                await clearUserFromStorage();
              }
            }
          }
        } else {
          // No token — check for cached user (shouldn't exist, but just in case)
          await clearUserFromStorage();
        }
      } catch {
        // Fallback: try cached user
        const stored = await getUserFromStorage();
        setUser(stored);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const loggedIn = await repoLogin(email, password);
    await saveUserToStorage(loggedIn);
    setUser(loggedIn);
    // Fetch complete profile (login response may omit phone, birth_date, etc.)
    try {
      const fullProfile = await fetchCurrentUser();
      await saveUserToStorage(fullProfile);
      setUser(fullProfile);
    } catch { /* keep login response user */ }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const newUser = await repoRegister(data);
    await saveUserToStorage(newUser);
    setUser(newUser);
    // Fetch complete profile (register response may omit phone, birth_date, etc.)
    try {
      const fullProfile = await fetchCurrentUser();
      await saveUserToStorage(fullProfile);
      setUser(fullProfile);
    } catch { /* keep register response user */ }
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
    await AsyncStorage.clear();
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
