// auth.types — tipuri TypeScript specifice modulului de autentificare.
// Defineste AuthState, LoginCredentials, RegisterData si AuthContextType.

import type { User } from '../../../shared/types/plant.types';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}
