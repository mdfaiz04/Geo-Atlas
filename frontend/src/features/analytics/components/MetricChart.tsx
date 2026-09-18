// One metric over time, drawn with Highcharts in the shared chart style.
import Highcharts from 'highcharts';
import 'highcharts/modules/accessibility';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
import { useChartTheme } from '@/features/analytics/hooks/useChartTheme';
import { metricChartOptions } from '@/features/analytics/lib/chartOptions';
import { METRIC_DETAILS } from '@/features/analytics/lib/metricCatalog';
import type { MetricKey, MetricPoint } from '@/features/analytics/types';
import '@/features/analytics/components/MetricChart.css';

interface MetricChartProps {
  metric: MetricKey;
  points: MetricPoint[];
  area?: boolean;
  height?: number;
}

export function MetricChart({ metric, points, area = false, height }: MetricChartProps) {
  const theme = useChartTheme();
  const { title, description } = METRIC_DETAILS[metric];
  const options = useMemo(
    () => metricChartOptions({ metric, points, theme, area, height }),
    [metric, points, theme, area, height],
  );

  return (
    <figure className="metric-chart">
      <figcaption className="metric-chart__caption">
        <span className="metric-chart__title">{title}</span>
        <span className="metric-chart__description">{description}</span>
      </figcaption>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </figure>
  );
}
