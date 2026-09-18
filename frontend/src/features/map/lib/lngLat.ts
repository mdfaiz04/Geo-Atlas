// Reads a GeoJSON position as a longitude and latitude pair.
import type { Position } from 'geojson';

export function toLngLat(position: Position): [number, number] {
  const [longitude, latitude] = position;
  if (longitude === undefined || latitude === undefined) {
    throw new Error('A boundary point is missing a coordinate');
  }
  return [longitude, latitude];
}
