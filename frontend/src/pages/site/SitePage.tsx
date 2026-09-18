// One site's performance over time: headline numbers, trend charts and the raw readings.
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnalyticsHighlights } from '@/features/analytics/components/AnalyticsHighlights';
import { MetricChart } from '@/features/analytics/components/MetricChart';
import { MetricTable } from '@/features/analytics/components/MetricTable';
import { RangeSelector } from '@/features/analytics/components/RangeSelector';
import { useSiteAnalytics } from '@/features/analytics/hooks/useSiteAnalytics';
import { DEFAULT_TIME_RANGE, withinRange } from '@/features/analytics/lib/timeRange';
import type { TimeRange } from '@/features/analytics/lib/timeRange';
import type { MetricKey, MetricSeries, SiteAnalytics } from '@/features/analytics/types';
import { SiteMap } from '@/features/map/components/SiteMap';
import { ProjectTypeBadge } from '@/features/projects/components/ProjectTypeBadge';
import { useSite } from '@/features/sites/hooks/siteQueries';
import type { SiteCollection } from '@/features/sites/types';
import { ApiError } from '@/shared/api/httpClient';
import { formatDate, formatHectares } from '@/shared/lib/format';
import { Alert } from '@/shared/ui/Alert';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Spinner } from '@/shared/ui/Spinner';
import '@/pages/page.css';
import '@/pages/site/SitePage.css';

const NOT_FOUND = 404;
const SMALL_MULTIPLES: MetricKey[] = ['ndvi', 'canopy_cover', 'species_richness'];
const ignoreSelection = (): void => undefined;

// Trims every series to the chosen window so charts and table always agree.
function trimSeries(analytics: SiteAnalytics | undefined, range: TimeRange): MetricSeries[] {
  return (analytics?.series ?? []).map((series) => ({
    ...series,
    points: withinRange(series.points, range),
  }));
}

export function SitePage() {
  const { siteId = '' } = useParams();
  const site = useSite(siteId);
  const analytics = useSiteAnalytics(siteId);
  const [range, setRange] = useState<TimeRange>(DEFAULT_TIME_RANGE);

  const visibleSeries = useMemo(() => trimSeries(analytics.data, range), [analytics.data, range]);
  const siteCollection = useMemo<SiteCollection>(
    () => ({ type: 'FeatureCollection', features: site.data === undefined ? [] : [site.data] }),
    [site.data],
  );
  const pointsFor = (metric: MetricKey) =>
    visibleSeries.find((series) => series.metric === metric)?.points ?? [];

  function renderAnalytics() {
    if (analytics.isPending) {
      return <Spinner label="Loading analytics…" />;
    }
    if (analytics.isError) {
      return <Alert tone="error">{analytics.error.message}</Alert>;
    }
    if (analytics.data.series.every((series) => series.points.length === 0)) {
      return (
        <EmptyState
          title="No monitoring data yet"
          text="Readings appear here once the site has been measured."
        />
      );
    }
    return (
      <>
        <div className="site-overview">
          <AnalyticsHighlights analytics={analytics.data} />
          <div className="site-overview__map">
            <SiteMap
              sites={siteCollection}
              selectedSiteId={siteId}
              onSelectSite={ignoreSelection}
            />
          </div>
        </div>

        <div className="site-toolbar">
          <h2 className="site-toolbar__title">Performance over time</h2>
          <RangeSelector value={range} onChange={setRange} />
        </div>

        <MetricChart
          metric="carbon_density"
          points={pointsFor('carbon_density')}
          area
          height={280}
        />
        <div className="site-charts">
          {SMALL_MULTIPLES.map((metric) => (
            <MetricChart key={metric} metric={metric} points={pointsFor(metric)} />
          ))}
        </div>

        <MetricTable series={visibleSeries} />
        <p className="site-note">
          Demo data: this monitoring history is simulated from a seasonal growth model, not measured
          in the field.
        </p>
      </>
    );
  }

  if (site.isPending) {
    return <Spinner label="Loading site…" />;
  }

  if (site.isError) {
    const missing = site.error instanceof ApiError && site.error.status === NOT_FOUND;
    return missing ? (
      <EmptyState
        title="Site not found"
        text="It may have been deleted, or it belongs to another account."
        action={<Link to="/dashboard">Back to the portfolio</Link>}
      />
    ) : (
      <Alert tone="error">{site.error.message}</Alert>
    );
  }

  const details = site.data.properties;

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <Link className="page__back" to={`/projects/${details.projectId}`}>
            ← {details.projectName}
          </Link>
          <div className="site-title">
            <h1 className="page__title">{details.name}</h1>
            <ProjectTypeBadge type={details.projectType} />
          </div>
          <p className="page__subtitle">
            {formatHectares(details.areaHectares)} · added {formatDate(details.createdAt)}
          </p>
        </div>
      </header>
      {renderAnalytics()}
    </div>
  );
}
