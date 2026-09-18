// Moves the camera to a searched place, framing its whole extent when one is known.
import type { Map as MapboxMap } from 'mapbox-gl';
import type { Place } from '@/features/map/types';

const PLACE_PADDING = 40;
const PLACE_MAX_ZOOM = 14;
const POINT_ZOOM = 13;

export function focusPlace(map: MapboxMap, place: Place): void {
  if (place.bounds === null) {
    map.flyTo({ center: place.center, zoom: POINT_ZOOM });
    return;
  }
  const [west, south, east, north] = place.bounds;
  map.fitBounds(
    [
      [west, south],
      [east, north],
    ],
    { padding: PLACE_PADDING, maxZoom: PLACE_MAX_ZOOM },
  );
}
