// useAuth — hook pentru gestionarea autentificarii utilizatorului.
// Ofera login, register, logout cu persistare in AsyncStorage. Doua roluri: user si admin.

import { useState, useEffect, useCallback } from 'react';
import type { User } from '../../../shared/types/plant.types';
import type { AuthState } from '../types/auth.types';
import {
  login as repoLogin,
  register as repoRegister,
  getUserFromStorage,
  saveUserToStorage,
  clearUserFromStorage,
} from '../repository/authRepository';

interface UseAuthReturn extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await getUserFromStorage();
      setUser(stored);
      setLoading(false);
    })();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const loggedIn = await repoLogin(username, password);
    await saveUserToStorage(loggedIn);
    setUser(loggedIn);
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const newUser = await repoRegister(username, email, password);
    await saveUserToStorage(newUser);
    setUser(newUser);
  }, []);

  const logout = useCallback(async () => {
    await clearUserFromStorage();
    setUser(null);
  }, []);

  const isAuthenticated = !loading && user !== null;
  const isAdmin = isAuthenticated && user?.role === 'admin';

  return {
    user,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
  };
}
