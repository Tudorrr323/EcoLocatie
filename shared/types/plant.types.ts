// plant.types — interfetele TypeScript globale ale aplicatiei.
// Defineste Plant, PointOfInterest, User, MapConfig si EcoLocationData. Folosite de toate modulele.

export type POIStatus = 'pending' | 'approved' | 'rejected';

export interface Plant {
  id: number;
  name_ro: string;
  name_latin: string;
  name_en: string;
  family: string;
  description: string;
  parts_used: string[];
  benefits: string[];
  contraindications: string[];
  habitat: string;
  harvest_period: string;
  preparation: string;
  image_url: string;
  images: string[];
  icon_color: string;
}

export interface PointOfInterest {
  id: number;
  user_id: number;
  plant_id: number;
  latitude: number;
  longitude: number;
  address?: string;
  description?: string;
  habitat?: string;
  harvest_period?: string;
  benefits?: string;
  contraindications?: string;
  comment: string;
  ai_confidence: number;
  status: POIStatus;
  created_at: string;
  image_url: string;
  images?: string[];
  comment_count?: number;
}

export interface Comment {
  id: number;
  user_id: number;
  poi_id: number;
  content: string;
  username: string;
  profile_image?: string;
  parent_id?: number | null;
  replies?: Comment[];
  created_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  created_at: string;
  is_active: boolean;
  first_name?: string;
  last_name?: string;
  phone?: string;
  birth_date?: string;
  profile_image?: string;
}

export interface MapConfig {
  map_center: [number, number];
  map_default_zoom: number;
  map_max_zoom: number;
  map_min_zoom: number;
  galati_bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  demo_locations: Record<string, [number, number]>;
}

export interface EcoLocationData {
  plants: Plant[];
  users: User[];
  points_of_interest: PointOfInterest[];
  config: MapConfig;
}
