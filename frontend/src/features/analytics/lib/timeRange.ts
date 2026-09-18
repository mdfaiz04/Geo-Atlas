// The time windows a reader can pick, and trimming a series to one of them.
export const TIME_RANGES = [12, 24, 36] as const;

export type TimeRange = (typeof TIME_RANGES)[number];

export const DEFAULT_TIME_RANGE: TimeRange = 36;

export function withinRange<T>(points: T[], months: TimeRange): T[] {
  return points.slice(-months);
}
