// Creates a satellite Mapbox map in a container and hands it back once it has loaded.
import mapboxgl from 'mapbox-gl';
import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import { MAPBOX_TOKEN } from '@/shared/config/env';

const MAP_STYLE = 'mapbox://styles/mapbox/satellite-streets-v12';
const INDIA_CENTER: [number, number] = [78.9629, 22.5937];
const COUNTRY_ZOOM = 3.6;

export function useMapbox(containerRef: RefObject<HTMLDivElement | null>): mapboxgl.Map | null {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container === null) {
      return;
    }
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const instance = new mapboxgl.Map({
      container,
      style: MAP_STYLE,
      center: INDIA_CENTER,
      zoom: COUNTRY_ZOOM,
    });
    instance.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
    instance.addControl(new mapboxgl.ScaleControl({ unit: 'metric' }), 'bottom-right');
    instance.on('load', () => setMap(instance));

    return () => {
      setMap(null);
      instance.remove();
    };
  }, [containerRef]);

  return map;
}
