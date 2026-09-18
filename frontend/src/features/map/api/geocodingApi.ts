// Looks up places by name with the Mapbox Geocoding API so the map can jump to them.
import type { Place } from '@/features/map/types';
import { MAPBOX_TOKEN } from '@/shared/config/env';

const GEOCODING_URL = 'https://api.mapbox.com/search/geocode/v6/forward';
const RESULT_LIMIT = 5;

interface GeocodingFeature {
  id: string;
  geometry: { coordinates: [number, number] };
  properties: {
    name: string;
    place_formatted?: string;
    bbox?: [number, number, number, number];
  };
}

// Keeps only what the map needs from a geocoding result.
function toPlace(feature: GeocodingFeature): Place {
  return {
    id: feature.id,
    name: feature.properties.name,
    context: feature.properties.place_formatted ?? '',
    center: feature.geometry.coordinates,
    bounds: feature.properties.bbox ?? null,
  };
}

export async function searchPlaces(query: string, signal?: AbortSignal): Promise<Place[]> {
  const params = new URLSearchParams({
    q: query,
    limit: String(RESULT_LIMIT),
    access_token: MAPBOX_TOKEN,
  });
  const response = await fetch(`${GEOCODING_URL}?${params.toString()}`, { signal });
  if (!response.ok) {
    throw new Error('Place search is unavailable right now');
  }
  const payload = (await response.json()) as { features: GeocodingFeature[] };
  return payload.features.map(toPlace);
}
