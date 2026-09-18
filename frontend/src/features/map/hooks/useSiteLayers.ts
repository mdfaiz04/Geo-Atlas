// Keeps the site polygons on the map in sync with the data and reports clicks on them.
import type { GeoJSONSource, Map as MapboxMap, MapMouseEvent } from 'mapbox-gl';
import { useEffect, useMemo, useRef } from 'react';
import { labelPointsOf } from '@/features/map/lib/labelPoints';
import {
  SITE_FILL_LAYER_ID,
  SITE_LABEL_SOURCE_ID,
  SITE_SOURCE_ID,
  siteFillLayer,
  siteLabelLayer,
  siteOutlineLayer,
} from '@/features/map/lib/siteLayers';
import type { MapSiteCollection } from '@/features/map/types';
import { useLatest } from '@/shared/hooks/useLatest';

const EMPTY_COLLECTION: MapSiteCollection = { type: 'FeatureCollection', features: [] };

export function useSiteLayers(
  map: MapboxMap | null,
  sites: MapSiteCollection,
  selectedSiteId: string | null,
  onSelectSite: (siteId: string) => void,
): void {
  const onSelectRef = useLatest(onSelectSite);
  const highlightedRef = useRef<string | null>(null);
  const labelPoints = useMemo(() => labelPointsOf(sites), [sites]);

  useEffect(() => {
    if (map === null) {
      return;
    }
    map.addSource(SITE_SOURCE_ID, { type: 'geojson', data: EMPTY_COLLECTION, promoteId: 'id' });
    map.addSource(SITE_LABEL_SOURCE_ID, { type: 'geojson', data: EMPTY_COLLECTION });
    map.addLayer(siteFillLayer);
    map.addLayer(siteOutlineLayer);
    map.addLayer(siteLabelLayer);

    const selectClickedSite = (event: MapMouseEvent): void => {
      const siteId: unknown = event.features?.[0]?.properties?.id;
      if (typeof siteId === 'string') {
        onSelectRef.current(siteId);
      }
    };
    const showPointer = (): void => {
      map.getCanvas().style.cursor = 'pointer';
    };
    const resetPointer = (): void => {
      map.getCanvas().style.cursor = '';
    };

    map.on('click', SITE_FILL_LAYER_ID, selectClickedSite);
    map.on('mouseenter', SITE_FILL_LAYER_ID, showPointer);
    map.on('mouseleave', SITE_FILL_LAYER_ID, resetPointer);

    return () => {
      map.off('click', SITE_FILL_LAYER_ID, selectClickedSite);
      map.off('mouseenter', SITE_FILL_LAYER_ID, showPointer);
      map.off('mouseleave', SITE_FILL_LAYER_ID, resetPointer);
    };
  }, [map, onSelectRef]);

  useEffect(() => {
    map?.getSource<GeoJSONSource>(SITE_SOURCE_ID)?.setData(sites);
    map?.getSource<GeoJSONSource>(SITE_LABEL_SOURCE_ID)?.setData(labelPoints);
  }, [map, sites, labelPoints]);

  useEffect(() => {
    if (map === null) {
      return;
    }
    if (highlightedRef.current !== null) {
      map.setFeatureState(
        { source: SITE_SOURCE_ID, id: highlightedRef.current },
        { selected: false },
      );
    }
    if (selectedSiteId !== null) {
      map.setFeatureState({ source: SITE_SOURCE_ID, id: selectedSiteId }, { selected: true });
    }
    highlightedRef.current = selectedSiteId;
  }, [map, selectedSiteId]);
}
