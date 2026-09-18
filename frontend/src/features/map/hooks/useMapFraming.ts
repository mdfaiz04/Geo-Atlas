// Frames every site when the data first arrives and zooms to a site when it is selected.
import type { Map as MapboxMap } from 'mapbox-gl';
import { useEffect, useRef } from 'react';
import { boundsOf } from '@/features/map/lib/boundsOf';
import type { MapSiteCollection } from '@/features/map/types';

const FRAME_PADDING = 64;
const PORTFOLIO_MAX_ZOOM = 13;
const SITE_MAX_ZOOM = 16;

export function useMapFraming(
  map: MapboxMap | null,
  sites: MapSiteCollection,
  selectedSiteId: string | null,
): void {
  const framedRef = useRef(false);

  useEffect(() => {
    if (map === null || framedRef.current) {
      return;
    }
    const bounds = boundsOf(sites.features);
    if (bounds === null) {
      return;
    }
    map.fitBounds(bounds, { padding: FRAME_PADDING, maxZoom: PORTFOLIO_MAX_ZOOM, duration: 0 });
    framedRef.current = true;
  }, [map, sites]);

  useEffect(() => {
    if (map === null || selectedSiteId === null) {
      return;
    }
    const selected = sites.features.find((feature) => feature.properties.id === selectedSiteId);
    const bounds = selected === undefined ? null : boundsOf([selected]);
    if (bounds !== null) {
      map.fitBounds(bounds, { padding: FRAME_PADDING, maxZoom: SITE_MAX_ZOOM });
    }
  }, [map, sites, selectedSiteId]);
}
