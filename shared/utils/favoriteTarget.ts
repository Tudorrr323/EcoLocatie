// favoriteTarget — obiect mutable singleton pentru a transmite POI-ul tinta
// din lista de favorite catre MyPlantDetailScreen, fara a depinde de URL params.
// Stocam intregul POI (nu doar ID-ul) pentru a evita re-fetch din API.

import type { PointOfInterest } from '../types/plant.types';

export const favoriteTarget = {
  poi: null as PointOfInterest | null,
};
