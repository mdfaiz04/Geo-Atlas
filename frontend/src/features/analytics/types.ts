// Types describing a site's performance over time.
export type MetricKey = 'carbon_density' | 'ndvi' | 'canopy_cover' | 'species_richness';

export interface MetricPoint {
  recordedAt: string;
  value: number;
}

export interface MetricSeries {
  metric: MetricKey;
  unit: string;
  latest: number | null;
  changeOverYearPercent: number | null;
  points: MetricPoint[];
}

export interface SiteAnalytics {
  siteId: string;
  areaHectares: number;
  carbonStockTonnes: number | null;
  series: MetricSeries[];
}
