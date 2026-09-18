// Checks the map frames every polygon and copes with an empty portfolio.
import type { Feature, Polygon } from 'geojson';
import { describe, expect, it } from 'vitest';
import { boundsOf } from '@/features/map/lib/boundsOf';

// Builds a square polygon feature from its south-west corner and side length.
function square(west: number, south: number, size: number): Feature<Polygon> {
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [west, south],
          [west + size, south],
          [west + size, south + size],
          [west, south + size],
          [west, south],
        ],
      ],
    },
  };
}

describe('boundsOf', () => {
  it('returns null when there is nothing to frame', () => {
    expect(boundsOf([])).toBeNull();
  });

  it('wraps a single polygon', () => {
    expect(boundsOf([square(77, 28, 0.5)])).toEqual([
      [77, 28],
      [77.5, 28.5],
    ]);
  });

  it('wraps polygons that are far apart', () => {
    expect(boundsOf([square(72, 19, 1), square(88, 22, 1)])).toEqual([
      [72, 19],
      [89, 23],
    ]);
  });
});
