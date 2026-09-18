// GeoJSON types used across the sites feature.
import type { Feature, FeatureCollection, Polygon } from 'geojson';
import type { ProjectType } from '@/shared/domain/projectType';

export interface SiteProperties {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  projectType: ProjectType;
  areaHectares: number;
  createdAt: string;
}

export type SiteFeature = Feature<Polygon, SiteProperties>;

export type SiteCollection = FeatureCollection<Polygon, SiteProperties>;

export interface CreateSiteInput {
  name: string;
  boundary: Polygon;
}
