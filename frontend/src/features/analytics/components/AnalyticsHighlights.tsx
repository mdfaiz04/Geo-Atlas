// Headline numbers for a site: its total carbon stock and the latest reading of each metric.
import { MetricDelta } from '@/features/analytics/components/MetricDelta';
import { describeDelta } from '@/features/analytics/lib/delta';
import { METRIC_DETAILS, formatMetric } from '@/features/analytics/lib/metricCatalog';
import type { MetricKey, MetricSeries, SiteAnalytics } from '@/features/analytics/types';
import { formatCount, formatHectares } from '@/shared/lib/format';
import { StatTile } from '@/shared/ui/StatTile';
import '@/features/analytics/components/AnalyticsHighlights.css';

const SUPPORTING_METRICS: MetricKey[] = ['ndvi', 'canopy_cover', 'species_richness'];

// Shows a metric's latest value, or a dash when it has never been measured.
function latestText(series: MetricSeries | undefined): string {
  return series?.latest == null ? '—' : formatMetric(series.metric, series.latest);
}

export function AnalyticsHighlights({ analytics }: { analytics: SiteAnalytics }) {
  const find = (metric: MetricKey) => analytics.series.find((series) => series.metric === metric);
  const carbon = find('carbon_density');

  return (
    <section className="highlights" aria-label="Latest readings">
      <div className="highlights__hero">
        <span className="highlights__label">Carbon stock</span>
        <span className="highlights__value">
          {analytics.carbonStockTonnes === null
            ? '—'
            : formatCount(Math.round(analytics.carbonStockTonnes))}{' '}
          <span className="highlights__unit">tCO₂e</span>
        </span>
        <span className="highlights__detail">
          {latestText(carbon)} across {formatHectares(analytics.areaHectares)}
        </span>
        <MetricDelta delta={carbon === undefined ? null : describeDelta(carbon)} />
      </div>
      <div className="highlights__tiles">
        {SUPPORTING_METRICS.map((metric) => {
          const series = find(metric);
          return (
            <StatTile
              key={metric}
              label={METRIC_DETAILS[metric].title}
              value={latestText(series)}
              detail={<MetricDelta delta={series === undefined ? null : describeDelta(series)} />}
            />
          );
        })}
      </div>
    </section>
  );
}
