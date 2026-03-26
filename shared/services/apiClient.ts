// apiClient — HTTP client centralizat pentru comunicarea cu backend-ul.
// Gestioneaza JWT token, headers, base URL si error handling.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/config';

const TOKEN_KEY = '@ecolocatie_token';

// --- Token management ---

export async function getToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function saveToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

// --- API error ---

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// --- Core fetch wrapper ---

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown> | FormData;
  auth?: boolean;
  isFormData?: boolean;
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = false, isFormData = false } = options;

  const headers: Record<string, string> = {};

  // ngrok free requires this header to skip the browser warning page
  headers['ngrok-skip-browser-warning'] = 'true';

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = await getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = isFormData ? (body as FormData) : JSON.stringify(body);
  }

  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, config);

  if (!response.ok) {
    let message = `Eroare ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        message = errorData.message;
      }
    } catch {
      // ignore parse errors
    }
    throw new ApiError(message, response.status);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// --- Convenience methods ---

export function apiGet<T>(endpoint: string, auth = false): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET', auth });
}

export function apiPost<T>(endpoint: string, body: Record<string, unknown>, auth = false): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'POST', body, auth });
}

export function apiPut<T>(endpoint: string, body: Record<string, unknown>, auth = false): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'PUT', body, auth });
}

export function apiDelete<T>(endpoint: string, auth = false): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE', auth });
}

export function apiUpload<T>(endpoint: string, formData: FormData, auth = false): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'POST', body: formData, auth, isFormData: true });
}
