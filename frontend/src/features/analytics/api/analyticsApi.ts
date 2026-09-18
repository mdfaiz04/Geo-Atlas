// Calls the site analytics endpoint and maps the response into application types.
import type { MetricKey, SiteAnalytics } from '@/features/analytics/types';
import { apiRequest } from '@/shared/api/httpClient';

interface MetricSeriesResponse {
  metric: MetricKey;
  unit: string;
  latest: number | null;
  change_over_year_percent: number | null;
  points: { recorded_at: string; value: number }[];
}

interface SiteAnalyticsResponse {
  site_id: string;
  area_hectares: number;
  carbon_stock_tonnes: number | null;
  series: MetricSeriesResponse[];
}

export async function fetchSiteAnalytics(siteId: string): Promise<SiteAnalytics> {
  const response = await apiRequest<SiteAnalyticsResponse>(`/sites/${siteId}/analytics`);
  return {
    siteId: response.site_id,
    areaHectares: response.area_hectares,
    carbonStockTonnes: response.carbon_stock_tonnes,
    series: response.series.map((series) => ({
      metric: series.metric,
      unit: series.unit,
      latest: series.latest,
      changeOverYearPercent: series.change_over_year_percent,
      points: series.points.map((point) => ({ recordedAt: point.recorded_at, value: point.value })),
    })),
  };
}
