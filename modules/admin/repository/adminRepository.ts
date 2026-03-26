// adminRepository — stratul de acces la date pentru modulul de administrare.
// Folosește API-ul backend pentru gestionarea utilizatorilor, observațiilor și statisticilor.

import { apiGet, apiPut } from '../../../shared/services/apiClient';
import type { User, PointOfInterest, Plant } from '../../../shared/types/plant.types';
import type { AdminStats, ModerationAction } from '../types/admin.types';
import { buildImageUrl } from '../../../shared/repository/dataProvider';
import { MOCK_ADMIN_STATS, MOCK_USERS, MOCK_POIS } from '../../../shared/mock/mockData';

// --- API response types ---

interface ApiAdminStats {
  totalUsers: number;
  totalPlants: number;
  totalPois: number;
  pendingPois: number;
  totalComments: number;
}

interface ApiUser {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  is_active: boolean;
  created_at: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  birth_date?: string;
  profile_image?: string;
}

interface ApiPOI {
  id: number;
  user_id: number;
  plant_id: number;
  latitude: number;
  longitude: number;
  comment: string;
  ai_confidence: number;
  status: string;
  plant_name?: string;
  name_latin?: string;
  author?: string;
  primary_image?: string;
  images?: string[];
  created_at: string;
}

interface UsersListResponse {
  data?: ApiUser[];
}

interface POIsListResponse {
  data?: ApiPOI[];
  total?: number;
}

function normalizeUser(api: ApiUser): User {
  return {
    id: api.id,
    username: api.username,
    email: api.email,
    role: api.role,
    is_active: api.is_active,
    created_at: api.created_at,
    first_name: api.first_name,
    last_name: api.last_name,
    phone: api.phone,
    birth_date: api.birth_date,
    profile_image: api.profile_image ? buildImageUrl(api.profile_image) : undefined,
  };
}

function normalizePOI(api: ApiPOI): PointOfInterest {
  return {
    id: api.id,
    user_id: api.user_id,
    plant_id: api.plant_id,
    latitude: Number(api.latitude) || 0,
    longitude: Number(api.longitude) || 0,
    comment: api.comment ?? '',
    ai_confidence: api.ai_confidence != null ? Number(api.ai_confidence) : 0,
    status: (api.status as import('../../../shared/types/plant.types').POIStatus) ?? 'pending',
    created_at: api.created_at,
    image_url: buildImageUrl(api.primary_image),
    images: api.images?.map(buildImageUrl),
  };
}

export async function getAdminStats(): Promise<AdminStats> {
  try {
    const api = await apiGet<ApiAdminStats>('/api/admin/stats', true);
    const pending = api.pendingPois ?? 0;
    const total = api.totalPois ?? 0;
    return {
      totalUsers: api.totalUsers ?? 0,
      activeUsers: api.totalUsers ?? 0,
      totalPOIs: total,
      approvedPOIs: total - pending,
      pendingPOIs: pending,
      rejectedPOIs: 0,
      totalPlants: api.totalPlants ?? 0,
    };
  } catch {
    return MOCK_ADMIN_STATS;
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const response = await apiGet<UsersListResponse | ApiUser[]>('/api/admin/users', true);
    const users = Array.isArray(response) ? response : (response.data ?? []);
    return users.map(normalizeUser);
  } catch {
    return MOCK_USERS;
  }
}

export async function toggleUserStatus(userId: number, reason?: string): Promise<User[]> {
  const users = await getAllUsers();
  const targetUser = users.find((u) => u.id === userId);
  if (targetUser) {
    const body: Record<string, unknown> = { is_active: !targetUser.is_active };
    if (reason) body.reason = reason;
    await apiPut<unknown>(`/api/admin/users/${userId}`, body, true);
  }
  return getAllUsers();
}

export async function moderatePOI(
  poiId: number,
  action: ModerationAction,
  reason?: string,
): Promise<PointOfInterest[]> {
  const status = action === 'approve' ? 'approved' : 'rejected';
  const body: Record<string, unknown> = { status };
  if (reason) {
    body.reason = reason;
  }
  await apiPut<unknown>(`/api/pois/${poiId}/status`, body, true);
  return getPendingPOIsAdmin();
}

export async function getPendingPOIsAdmin(): Promise<PointOfInterest[]> {
  try {
    const response = await apiGet<POIsListResponse | ApiPOI[]>('/api/admin/pois/pending', true);
    const pois = Array.isArray(response) ? response : (response.data ?? []);
    return pois.map(normalizePOI);
  } catch {
    return MOCK_POIS.filter((p) => p.status === 'pending');
  }
}

export async function getAllPOIsAdmin(pendingPOIs?: PointOfInterest[]): Promise<PointOfInterest[]> {
  try {
    const extract = (r: POIsListResponse | ApiPOI[]) => Array.isArray(r) ? r : (r.data ?? []);
    const [approvedRes, rejectedRes] = await Promise.all([
      apiGet<POIsListResponse | ApiPOI[]>('/api/pois?status=approved&limit=500', true),
      apiGet<POIsListResponse | ApiPOI[]>('/api/pois?status=rejected&limit=500', true).catch(() => [] as ApiPOI[]),
    ]);
    const approved = extract(approvedRes).map(normalizePOI);
    const rejected = extract(rejectedRes).map(normalizePOI);
    const merged = [...approved, ...rejected];
    if (pendingPOIs) {
      const ids = new Set(merged.map((p) => p.id));
      for (const p of pendingPOIs) {
        if (!ids.has(p.id)) merged.push(p);
      }
    }
    return merged;
  } catch {
    return MOCK_POIS;
  }
}
