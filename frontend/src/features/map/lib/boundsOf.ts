// Finds the smallest box that holds every polygon so the map can frame them.
import type { Feature, Polygon, Position } from 'geojson';

export type Bounds = [[number, number], [number, number]];

// Reads a GeoJSON position as a longitude and latitude pair.
function toLngLat(position: Position): [number, number] {
  const [longitude, latitude] = position;
  if (longitude === undefined || latitude === undefined) {
    throw new Error('A boundary point is missing a coordinate');
  }
  return [longitude, latitude];
}

export function boundsOf(features: Feature<Polygon>[]): Bounds | null {
  const points = features.flatMap((feature) => feature.geometry.coordinates.flat().map(toLngLat));
  if (points.length === 0) {
    return null;
  }
  const longitudes = points.map(([longitude]) => longitude);
  const latitudes = points.map(([, latitude]) => latitude);
  return [
    [Math.min(...longitudes), Math.min(...latitudes)],
    [Math.max(...longitudes), Math.max(...latitudes)],
  ];
}
