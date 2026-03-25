// authRepository — stratul de acces la date pentru modulul de autentificare.
// Gestioneaza login mock (verificare in JSON), register si persistare sesiune in AsyncStorage.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUsers } from '../../../shared/repository/dataProvider';
import type { User } from '../../../shared/types/plant.types';

const STORAGE_KEY = '@ecolocatie_user';

export async function login(username: string, _password: string): Promise<User> {
  const users = getUsers();
  const found = users.find((u) => u.username === username);

  if (!found) {
    throw new Error('Utilizatorul nu a fost găsit.');
  }

  if (!found.is_active) {
    throw new Error('Contul este inactiv.');
  }

  return found;
}

export async function register(username: string, email: string, _password: string): Promise<User> {
  const users = getUsers();
  const existingUsername = users.find((u) => u.username === username);
  if (existingUsername) {
    throw new Error('Numele de utilizator este deja folosit.');
  }

  const existingEmail = users.find((u) => u.email === email);
  if (existingEmail) {
    throw new Error('Adresa de email este deja înregistrată.');
  }

  const newUser: User = {
    id: Date.now(),
    username,
    email,
    role: 'user',
    created_at: new Date().toISOString(),
    is_active: true,
  };

  return newUser;
}

export async function getUserFromStorage(): Promise<User | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export async function saveUserToStorage(user: User): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export async function clearUserFromStorage(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
