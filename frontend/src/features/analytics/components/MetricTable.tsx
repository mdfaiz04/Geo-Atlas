// The chart data as a plain table, for screen readers and anyone who wants exact numbers.
import { useMemo } from 'react';
import { METRIC_DETAILS, formatMetric } from '@/features/analytics/lib/metricCatalog';
import type { MetricSeries } from '@/features/analytics/types';
import { formatMonth } from '@/shared/lib/format';
import '@/features/analytics/components/MetricTable.css';

// Indexes each series by month so every table cell is a direct lookup.
function valuesByMonth(series: MetricSeries[]): Map<string, number>[] {
  return series.map((item) => new Map(item.points.map((point) => [point.recordedAt, point.value])));
}

export function MetricTable({ series }: { series: MetricSeries[] }) {
  const lookups = useMemo(() => valuesByMonth(series), [series]);
  const months = useMemo(
    () => (series[0]?.points ?? []).map((point) => point.recordedAt).reverse(),
    [series],
  );

  return (
    <details className="metric-table">
      <summary className="metric-table__summary">View the readings as a table</summary>
      <div className="metric-table__scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Month</th>
              {series.map((item) => (
                <th scope="col" key={item.metric}>
                  {METRIC_DETAILS[item.metric].title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {months.map((month) => (
              <tr key={month}>
                <th scope="row">{formatMonth(month)}</th>
                {series.map((item, index) => {
                  const value = lookups[index]?.get(month);
                  return (
                    <td key={item.metric}>
                      {value === undefined ? '—' : formatMetric(item.metric, value)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
