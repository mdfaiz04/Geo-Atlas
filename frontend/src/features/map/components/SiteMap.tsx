// Satellite map of site polygons that can also capture a newly drawn boundary.
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import type { Polygon } from 'geojson';
import { useCallback, useRef } from 'react';
import { MapLegend } from '@/features/map/components/MapLegend';
import { MapUnavailable } from '@/features/map/components/MapUnavailable';
import { PlaceSearch } from '@/features/map/components/PlaceSearch';
import { useMapbox } from '@/features/map/hooks/useMapbox';
import { useMapFraming } from '@/features/map/hooks/useMapFraming';
import { usePolygonDraw } from '@/features/map/hooks/usePolygonDraw';
import { useSiteLayers } from '@/features/map/hooks/useSiteLayers';
import { focusPlace } from '@/features/map/lib/focusPlace';
import type { MapSiteCollection, Place } from '@/features/map/types';
import { MAPBOX_TOKEN } from '@/shared/config/env';
import '@/features/map/components/SiteMap.css';

interface SiteMapProps {
  sites: MapSiteCollection;
  selectedSiteId: string | null;
  onSelectSite: (siteId: string) => void;
  drawing?: boolean;
  onBoundaryDrawn?: (boundary: Polygon) => void;
  searchable?: boolean;
}

const ignoreBoundary = (): void => undefined;

// Wires the map hooks together once a token is known to exist.
function MapCanvas({
  sites,
  selectedSiteId,
  onSelectSite,
  drawing = false,
  onBoundaryDrawn,
  searchable = false,
}: SiteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const map = useMapbox(containerRef);

  useSiteLayers(map, sites, selectedSiteId, onSelectSite);
  useMapFraming(map, sites, selectedSiteId);
  usePolygonDraw(
    onBoundaryDrawn === undefined ? null : map,
    drawing,
    onBoundaryDrawn ?? ignoreBoundary,
  );

  const goToPlace = useCallback(
    (place: Place) => {
      if (map !== null) {
        focusPlace(map, place);
      }
    },
    [map],
  );

  return (
    <div className="site-map">
      <div className="site-map__canvas" ref={containerRef} />
      {searchable && map !== null ? <PlaceSearch onSelect={goToPlace} /> : null}
      <MapLegend />
    </div>
  );
}

export function SiteMap(props: SiteMapProps) {
  return MAPBOX_TOKEN === '' ? <MapUnavailable /> : <MapCanvas {...props} />;
}
