// Checks each site gets exactly one label, placed inside its polygon.
import type { Position } from 'geojson';
import { describe, expect, it } from 'vitest';
import { labelPointsOf } from '@/features/map/lib/labelPoints';
import type { MapSiteCollection } from '@/features/map/types';

// Wraps a single ring into a one-site collection.
function collectionOf(ring: Position[]): MapSiteCollection {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { id: 'site-1', name: 'North Block', projectType: 'carbon' },
        geometry: { type: 'Polygon', coordinates: [ring] },
      },
    ],
  };
}

describe('labelPointsOf', () => {
  it('produces one point per site carrying its properties', () => {
    const square = [
      [0, 0],
      [2, 0],
      [2, 2],
      [0, 2],
      [0, 0],
    ];

    const [label] = labelPointsOf(collectionOf(square)).features;

    expect(label?.properties.name).toBe('North Block');
    expect(label?.geometry.coordinates[0]).toBeCloseTo(1, 2);
    expect(label?.geometry.coordinates[1]).toBeCloseTo(1, 2);
  });

  it('keeps the label inside a concave shape where the box centre falls outside', () => {
    const lShape = [
      [0, 0],
      [4, 0],
      [4, 1],
      [1, 1],
      [1, 4],
      [0, 4],
      [0, 0],
    ];

    const [longitude = NaN, latitude = NaN] =
      labelPointsOf(collectionOf(lShape)).features[0]?.geometry.coordinates ?? [];

    expect(longitude < 1 || latitude < 1).toBe(true);
  });
});
