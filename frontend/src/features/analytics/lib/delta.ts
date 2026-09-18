// Describes a year-on-year change so it can be shown with an arrow and a named baseline month.
import type { MetricSeries } from '@/features/analytics/types';

export type DeltaDirection = 'up' | 'down' | 'flat';

export interface Delta {
  direction: DeltaDirection;
  percentText: string;
  baselineMonth: string;
}

const monthFormat = new Intl.DateTimeFormat('en-IN', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

// Turns a signed percentage into the direction the arrow should point.
function directionOf(change: number): DeltaDirection {
  if (change > 0) {
    return 'up';
  }
  return change < 0 ? 'down' : 'flat';
}

export function describeDelta(series: MetricSeries): Delta | null {
  const latest = series.points.at(-1);
  if (series.changeOverYearPercent === null || latest === undefined) {
    return null;
  }
  const baseline = new Date(latest.recordedAt);
  baseline.setUTCFullYear(baseline.getUTCFullYear() - 1);
  return {
    direction: directionOf(series.changeOverYearPercent),
    percentText: `${Math.abs(series.changeOverYearPercent).toFixed(1)}%`,
    baselineMonth: monthFormat.format(baseline),
  };
}
