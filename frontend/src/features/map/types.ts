// The minimum a feature needs to be drawn on the site map.
import type { FeatureCollection, Polygon } from 'geojson';
import type { ProjectType } from '@/shared/domain/projectType';

export interface MapSiteProperties {
  id: string;
  name: string;
  projectType: ProjectType;
}

export type MapSiteCollection = FeatureCollection<Polygon, MapSiteProperties>;
