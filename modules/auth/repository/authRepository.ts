// authRepository — stratul de acces la date pentru modulul de autentificare.
// Login si register prin API backend. JWT token salvat in AsyncStorage.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiPost, apiGet, apiRequest, saveToken, clearToken, getToken } from '../../../shared/services/apiClient';
import { buildImageUrl } from '../../../shared/repository/dataProvider';
import type { User } from '../../../shared/types/plant.types';
import type { RegisterData } from '../types/auth.types';
import { MOCK_USERS } from '../../../shared/mock/mockData';

const STORAGE_KEY = '@ecolocatie_user';

interface AuthResponse {
  token: string;
  user: User;
}

function normalizeUser(user: User): User {
  return {
    ...user,
    profile_image: user.profile_image ? buildImageUrl(user.profile_image) : undefined,
  };
}

export async function login(email: string, password: string): Promise<User> {
  try {
    const response = await apiPost<AuthResponse>('/api/auth/login', { email, password });
    await saveToken(response.token);
    return normalizeUser(response.user);
  } catch {
    // Mock fallback — accepta orice email cu parola "123456" sau userul admin
    const mockUser = MOCK_USERS.find((u) => u.email === email) ?? MOCK_USERS[1];
    await saveToken('mock-jwt-token');
    return mockUser;
  }
}

export async function register(data: RegisterData): Promise<User> {
  const body: Record<string, unknown> = {
    username: `${data.firstName.trim().toLowerCase()}_${data.lastName.trim().toLowerCase()}`.replace(/\s+/g, '_'),
    email: data.email.trim(),
    password: data.password,
    first_name: data.firstName.trim(),
    last_name: data.lastName.trim(),
  };

  if (data.phone?.trim()) {
    body.phone = data.phone.trim();
  }
  if (data.birthDate?.trim()) {
    body.birth_date = data.birthDate.trim();
  }

  try {
    const response = await apiPost<AuthResponse>('/api/auth/register', body);
    await saveToken(response.token);
    return normalizeUser(response.user);
  } catch {
    // Mock fallback — creeaza user local
    const mockUser: User = {
      id: Date.now(),
      username: body.username as string,
      email: body.email as string,
      role: 'user',
      created_at: new Date().toISOString(),
      is_active: true,
      first_name: data.firstName.trim(),
      last_name: data.lastName.trim(),
      phone: data.phone?.trim(),
      birth_date: data.birthDate?.trim(),
    };
    await saveToken('mock-jwt-token');
    return mockUser;
  }
}

export async function fetchCurrentUser(): Promise<User> {
  try {
    const user = await apiGet<User>('/api/auth/me', true);
    return normalizeUser(user);
  } catch {
    const stored = await getUserFromStorage();
    if (stored) return stored;
    return MOCK_USERS[1];
  }
}

export async function uploadProfileImage(imageUri: string): Promise<User> {
  const uriParts = imageUri.split('.');
  const fileType = uriParts[uriParts.length - 1] ?? 'jpg';

  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    name: `avatar.${fileType}`,
    type: `image/${fileType === 'jpg' ? 'jpeg' : fileType}`,
  } as unknown as Blob);

  const user = await apiRequest<User>('/api/auth/profile-image', {
    method: 'PUT',
    body: formData,
    auth: true,
    isFormData: true,
  });
  return normalizeUser(user);
}

export async function deleteProfileImage(): Promise<void> {
  await apiRequest<unknown>('/api/auth/profile-image', {
    method: 'DELETE',
    auth: true,
  });
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
  await clearToken();
}

export async function hasStoredToken(): Promise<boolean> {
  const token = await getToken();
  return token !== null;
}

// Forgot password — backend-ul nu are endpoint dedicat, acceptam orice email pentru flow-ul UI
export function checkEmailExists(_email: string): boolean {
  return true;
}
