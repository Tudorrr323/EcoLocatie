// plant.types — interfetele TypeScript globale ale aplicatiei.
// Defineste Plant, PointOfInterest, User, MapConfig si EcolocatieData. Folosite de toate modulele.

export interface Plant {
  id: number;
  name_ro: string;
  name_latin: string;
  family: string;
  description: string;
  parts_used: string[];
  benefits: string[];
  contraindications: string[];
  habitat: string;
  harvest_period: string;
  preparation: string;
  image_url: string;
  icon_color: string;
}

export interface PointOfInterest {
  id: number;
  user_id: number;
  plant_id: number;
  latitude: number;
  longitude: number;
  description?: string;
  habitat?: string;
  harvest_period?: string;
  benefits?: string;
  contraindications?: string;
  comment: string;
  ai_confidence: number;
  is_approved: boolean;
  created_at: string;
  image_url: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
  is_active: boolean;
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

export interface EcolocatieData {
  plants: Plant[];
  users: User[];
  points_of_interest: PointOfInterest[];
  config: MapConfig;
}
