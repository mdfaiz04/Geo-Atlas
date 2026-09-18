// Checks year-on-year changes, time windows and metric formatting.
import { describe, expect, it } from 'vitest';
import { describeDelta } from '@/features/analytics/lib/delta';
import { formatMetric } from '@/features/analytics/lib/metricCatalog';
import { withinRange } from '@/features/analytics/lib/timeRange';
import type { MetricSeries } from '@/features/analytics/types';

// Builds an NDVI series ending in September 2026 with the given year-on-year change.
function series(change: number | null): MetricSeries {
  return {
    metric: 'ndvi',
    unit: 'index',
    latest: 0.6,
    changeOverYearPercent: change,
    points: [{ recordedAt: '2026-09-01', value: 0.6 }],
  };
}

describe('describeDelta', () => {
  it('names the direction and the month it compares against', () => {
    expect(describeDelta(series(8.25))).toEqual({
      direction: 'up',
      percentText: '8.3%',
      baselineMonth: 'Sept 2025',
    });
  });

  it('reports a fall as down without a minus sign in the text', () => {
    expect(describeDelta(series(-4))).toMatchObject({ direction: 'down', percentText: '4.0%' });
  });

  it('has nothing to say without a year-earlier reading', () => {
    expect(describeDelta(series(null))).toBeNull();
  });
});

describe('withinRange', () => {
  it('keeps only the most recent months', () => {
    expect(withinRange([1, 2, 3, 4, 5], 12)).toEqual([1, 2, 3, 4, 5]);
    expect(
      withinRange(
        Array.from({ length: 36 }, (_, index) => index),
        12,
      ),
    ).toHaveLength(12);
  });
});

describe('formatMetric', () => {
  it('writes each unit the way a person would', () => {
    expect(formatMetric('canopy_cover', 42.345)).toBe('42.3%');
    expect(formatMetric('ndvi', 0.6123)).toBe('0.61');
    expect(formatMetric('carbon_density', 74.16)).toBe('74.2 tCO₂e/ha');
    expect(formatMetric('species_richness', 57)).toBe('57 species');
  });
});
