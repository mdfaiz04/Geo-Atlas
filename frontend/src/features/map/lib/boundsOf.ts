// Finds the smallest box that holds every polygon so the map can frame them.
import type { Feature, Polygon } from 'geojson';
import { toLngLat } from '@/features/map/lib/lngLat';

export type Bounds = [[number, number], [number, number]];

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
