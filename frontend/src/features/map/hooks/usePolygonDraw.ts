// Lets the administrator draw one polygon and hands the finished boundary back.
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import type { Feature, Polygon } from 'geojson';
import type { Map as MapboxMap } from 'mapbox-gl';
import { useEffect, useState } from 'react';
import { useLatest } from '@/shared/hooks/useLatest';

interface DrawCreateEvent {
  features: Feature[];
}

export function usePolygonDraw(
  map: MapboxMap | null,
  active: boolean,
  onComplete: (boundary: Polygon) => void,
): void {
  const [draw, setDraw] = useState<MapboxDraw | null>(null);
  const onCompleteRef = useLatest(onComplete);

  useEffect(() => {
    if (map === null) {
      return;
    }
    const control = new MapboxDraw({ displayControlsDefault: false, defaultMode: 'simple_select' });
    map.addControl(control);

    const handleCreate = (event: DrawCreateEvent): void => {
      const geometry = event.features[0]?.geometry;
      if (geometry?.type === 'Polygon') {
        onCompleteRef.current(geometry);
      }
    };
    map.on('draw.create', handleCreate);
    setDraw(control);

    return () => {
      map.off('draw.create', handleCreate);
      setDraw(null);
    };
  }, [map, onCompleteRef]);

  useEffect(() => {
    if (draw === null) {
      return;
    }
    draw.deleteAll();
    if (active) {
      draw.changeMode('draw_polygon');
    } else {
      draw.changeMode('simple_select');
    }
  }, [draw, active]);
}
