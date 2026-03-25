import { MAP_BOUNDS } from '../constants/config';

export function distanceBetween(
  coord1: { latitude: number; longitude: number },
  coord2: { latitude: number; longitude: number }
): number {
  const R = 6371;
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.latitude)) *
      Math.cos(toRad(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function isInsideBounds(coord: { latitude: number; longitude: number }): boolean {
  return (
    coord.latitude >= MAP_BOUNDS.south &&
    coord.latitude <= MAP_BOUNDS.north &&
    coord.longitude >= MAP_BOUNDS.west &&
    coord.longitude <= MAP_BOUNDS.east
  );
}
