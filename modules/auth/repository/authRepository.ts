// authRepository — stratul de acces la date pentru modulul de autentificare.
// Login prin email, register cu date complete (first/last name, phone, birth date).

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUsers } from '../../../shared/repository/dataProvider';
import type { User } from '../../../shared/types/plant.types';
import type { RegisterData } from '../types/auth.types';

const STORAGE_KEY = '@ecolocatie_user';

export async function login(email: string, password: string): Promise<User> {
  const users = getUsers();
  const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!found) {
    throw new Error('Nu exista niciun cont cu acest email.');
  }

  if (!found.is_active) {
    throw new Error('Contul este inactiv.');
  }

  if (found.password && found.password !== password) {
    throw new Error('Parola este incorecta.');
  }

  return found;
}

export async function register(data: RegisterData): Promise<User> {
  const users = getUsers();

  const existingEmail = users.find(
    (u) => u.email.toLowerCase() === data.email.trim().toLowerCase()
  );
  if (existingEmail) {
    throw new Error('Adresa de email este deja inregistrata.');
  }

  const username = `${data.firstName.trim().toLowerCase()}_${data.lastName.trim().toLowerCase()}`.replace(/\s+/g, '_');

  const newUser: User = {
    id: Date.now(),
    username,
    email: data.email.trim(),
    role: 'user',
    created_at: new Date().toISOString(),
    is_active: true,
    first_name: data.firstName.trim(),
    last_name: data.lastName.trim(),
    phone: data.phone?.trim() || undefined,
    birth_date: data.birthDate?.trim() || undefined,
  };

  return newUser;
}

export function checkEmailExists(email: string): boolean {
  const users = getUsers();
  return users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
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
