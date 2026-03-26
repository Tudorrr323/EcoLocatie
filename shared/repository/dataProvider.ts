// dataProvider — punctul unic de acces la datele aplicatiei.
// Acum foloseste API-ul backend in loc de JSON static.
// Toate functiile sunt async si returneaza Promise.

import { apiGet } from '../services/apiClient';
import type { Plant, PointOfInterest, User, MapConfig } from '../types/plant.types';
import { API_BASE_URL } from '../constants/config';
import { getCurrentLanguage } from '../context/SettingsContext';
import { MOCK_PLANTS, MOCK_POIS } from '../mock/mockData';

// --- Response types from backend ---

interface PlantsListResponse {
  data: ApiPlant[];
  total: number;
  limit: number;
  offset: number;
}

interface ApiPlant {
  id: number;
  name_ro: string;
  name_latin: string;
  name_en?: string;
  family: string;
  description: string;
  habitat: string;
  harvest_period: string;
  preparation: string;
  image_url: string;
  icon_color: string;
  folder_name?: string;
  benefits: { id: number; benefit: string }[] | string[];
  contraindications: { id: number; contraindication: string }[] | string[];
  usable_parts: { id: number; part: string }[] | string[];
  images?: string[];
  primary_image?: string;
}

interface POIsListResponse {
  data: ApiPOI[];
  total: number;
  limit: number;
  offset: number;
}

interface ApiPOI {
  id: number;
  user_id: number;
  plant_id: number;
  latitude: number;
  longitude: number;
  address?: string;
  comment: string;
  ai_confidence: number;
  status: 'approved' | 'pending' | 'rejected';
  plant_name?: string;
  name_latin?: string;
  author?: string;
  primary_image?: string;
  images?: string[];
  comment_count?: number;
  created_at: string;
}

interface MapConfigResponse {
  map_center_lat: number;
  map_center_lng: number;
  map_default_zoom: number;
  map_max_zoom: number;
  map_min_zoom: number;
  tile_url: string;
  tile_attribution: string;
  bounds_north: number;
  bounds_south: number;
  bounds_east: number;
  bounds_west: number;
}

// --- Helpers to normalize API responses to app types ---

function buildImageUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
}

function normalizePlant(api: ApiPlant): Plant {
  return {
    id: api.id,
    name_ro: api.name_ro,
    name_latin: api.name_latin,
    name_en: api.name_en ?? '',
    family: api.family,
    description: api.description ?? '',
    parts_used: Array.isArray(api.usable_parts)
      ? api.usable_parts.map((p) => (typeof p === 'string' ? p : p.part))
      : [],
    benefits: Array.isArray(api.benefits)
      ? api.benefits.map((b) => (typeof b === 'string' ? b : b.benefit))
      : [],
    contraindications: Array.isArray(api.contraindications)
      ? api.contraindications.map((c) => (typeof c === 'string' ? c : c.contraindication))
      : [],
    habitat: api.habitat ?? '',
    harvest_period: api.harvest_period ?? '',
    preparation: api.preparation ?? '',
    image_url: buildImageUrl(api.primary_image ?? api.image_url),
    images: api.images?.map(buildImageUrl) ?? [],
    icon_color: api.icon_color ?? '#4CAF50',
  };
}

function normalizePOI(api: ApiPOI): PointOfInterest {
  return {
    id: api.id,
    user_id: api.user_id,
    plant_id: api.plant_id,
    latitude: api.latitude,
    longitude: api.longitude,
    address: api.address,
    comment: api.comment ?? '',
    ai_confidence: api.ai_confidence ?? 0,
    status: api.status,
    created_at: api.created_at,
    image_url: buildImageUrl(api.primary_image),
    images: api.images?.map(buildImageUrl),
    comment_count: api.comment_count ?? 0,
  };
}

// --- Public API (all async) ---

export async function getPlants(): Promise<Plant[]> {
  try {
    const lang = getCurrentLanguage();
    const response = await apiGet<PlantsListResponse>(`/api/plants?limit=200&lang=${lang}`);
    return response.data.map(normalizePlant);
  } catch {
    return MOCK_PLANTS;
  }
}

export async function getPlantById(id: number): Promise<Plant | undefined> {
  try {
    const lang = getCurrentLanguage();
    const api = await apiGet<ApiPlant>(`/api/plants/${id}?lang=${lang}`);
    return normalizePlant(api);
  } catch {
    return MOCK_PLANTS.find((p) => p.id === id);
  }
}

export async function getApprovedPOIs(): Promise<PointOfInterest[]> {
  try {
    const response = await apiGet<POIsListResponse>('/api/pois?status=approved&limit=500');
    return response.data.map(normalizePOI);
  } catch {
    return MOCK_POIS.filter((p) => p.status === 'approved');
  }
}

export async function getPendingPOIs(): Promise<PointOfInterest[]> {
  try {
    const response = await apiGet<POIsListResponse>('/api/pois?status=pending&limit=500');
    return response.data.map(normalizePOI);
  } catch {
    return MOCK_POIS.filter((p) => p.status === 'pending');
  }
}

export async function getPOIs(): Promise<PointOfInterest[]> {
  try {
    const response = await apiGet<POIsListResponse>('/api/pois?limit=500');
    return response.data.map(normalizePOI);
  } catch {
    return MOCK_POIS;
  }
}

export async function getPOIById(id: number): Promise<PointOfInterest | undefined> {
  try {
    const api = await apiGet<ApiPOI>(`/api/pois/${id}`);
    return normalizePOI(api);
  } catch {
    return MOCK_POIS.find((p) => p.id === id);
  }
}

export async function getConfig(): Promise<MapConfig> {
  try {
    const api = await apiGet<MapConfigResponse>('/api/config/map');
    return {
      map_center: [api.map_center_lat, api.map_center_lng],
      map_default_zoom: api.map_default_zoom,
      map_max_zoom: api.map_max_zoom,
      map_min_zoom: api.map_min_zoom,
      galati_bounds: {
        north: api.bounds_north,
        south: api.bounds_south,
        east: api.bounds_east,
        west: api.bounds_west,
      },
      demo_locations: {},
    };
  } catch {
    // Fallback to hardcoded defaults
    return {
      map_center: [45.4353, 28.008],
      map_default_zoom: 13,
      map_max_zoom: 18,
      map_min_zoom: 10,
      galati_bounds: { north: 45.52, south: 45.37, east: 28.12, west: 27.92 },
      demo_locations: {},
    };
  }
}

// Re-export for convenience
export { buildImageUrl };
