// Calls the site endpoints and maps the GeoJSON into application types.
import type { Feature, FeatureCollection, Polygon } from 'geojson';
import type { CreateSiteInput, SiteCollection, SiteFeature } from '@/features/sites/types';
import { apiRequest } from '@/shared/api/httpClient';
import type { ProjectType } from '@/shared/domain/projectType';

interface SitePropertiesResponse {
  id: string;
  name: string;
  project_id: string;
  project_name: string;
  project_type: ProjectType;
  area_hectares: number;
  created_at: string;
}

type SiteFeatureResponse = Feature<Polygon, SitePropertiesResponse>;
type SiteCollectionResponse = FeatureCollection<Polygon, SitePropertiesResponse>;

// Converts one API feature so its properties use the app's camel-cased names.
function toSiteFeature(response: SiteFeatureResponse): SiteFeature {
  const { properties } = response;
  return {
    type: 'Feature',
    id: properties.id,
    geometry: response.geometry,
    properties: {
      id: properties.id,
      name: properties.name,
      projectId: properties.project_id,
      projectName: properties.project_name,
      projectType: properties.project_type,
      areaHectares: properties.area_hectares,
      createdAt: properties.created_at,
    },
  };
}

// Converts a whole API feature collection.
function toSiteCollection(response: SiteCollectionResponse): SiteCollection {
  return { type: 'FeatureCollection', features: response.features.map(toSiteFeature) };
}

export async function fetchPortfolioSites(): Promise<SiteCollection> {
  return toSiteCollection(await apiRequest<SiteCollectionResponse>('/sites'));
}

export async function fetchProjectSites(projectId: string): Promise<SiteCollection> {
  return toSiteCollection(await apiRequest<SiteCollectionResponse>(`/projects/${projectId}/sites`));
}

export async function createSite(projectId: string, input: CreateSiteInput): Promise<SiteFeature> {
  const response = await apiRequest<SiteFeatureResponse>(`/projects/${projectId}/sites`, {
    method: 'POST',
    body: { name: input.name, geometry: input.boundary },
  });
  return toSiteFeature(response);
}

export async function deleteSite(siteId: string): Promise<void> {
  await apiRequest<void>(`/sites/${siteId}`, { method: 'DELETE' });
}
