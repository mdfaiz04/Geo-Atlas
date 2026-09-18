// Places one label per site at the point deepest inside its polygon.
import type { FeatureCollection, Point } from 'geojson';
import polylabel from 'polylabel';
import { toLngLat } from '@/features/map/lib/lngLat';
import type { MapSiteCollection, MapSiteProperties } from '@/features/map/types';

const LABEL_PRECISION_DEGREES = 0.00005;

export function labelPointsOf(
  sites: MapSiteCollection,
): FeatureCollection<Point, MapSiteProperties> {
  return {
    type: 'FeatureCollection',
    features: sites.features.map((feature) => {
      const rings = feature.geometry.coordinates.map((ring) => ring.map(toLngLat));
      const [longitude, latitude] = polylabel(rings, LABEL_PRECISION_DEGREES);
      return {
        type: 'Feature',
        properties: feature.properties,
        geometry: { type: 'Point', coordinates: [longitude, latitude] },
      };
    }),
  };
}
