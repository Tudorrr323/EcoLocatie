// auth.types — tipuri TypeScript specifice modulului de autentificare.
// Defineste AuthState, LoginCredentials, RegisterData si AuthContextType.

import type { User } from '../../../shared/types/plant.types';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  birthDate?: string;
}
