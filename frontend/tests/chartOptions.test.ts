// Checks every metric chart follows the shared mark and labelling rules.
import type { Options, PointOptionsObject, SeriesAreaOptions } from 'highcharts';
import { describe, expect, it } from 'vitest';
import type { ChartTheme } from '@/features/analytics/hooks/useChartTheme';
import { metricChartOptions } from '@/features/analytics/lib/chartOptions';

const THEME: ChartTheme = {
  series: '#2a78d6',
  grid: '#e6ece9',
  crosshair: '#b4c2bb',
  text: '#10201a',
  textMuted: '#5d6d66',
  surface: '#ffffff',
};

const POINTS = [
  { recordedAt: '2026-07-01', value: 70 },
  { recordedAt: '2026-08-01', value: 71 },
  { recordedAt: '2026-09-01', value: 72.5 },
];

// Reads the first series' points back out of the generated options.
function pointsOf(area: boolean): PointOptionsObject[] {
  const options = metricChartOptions({
    metric: 'carbon_density',
    points: POINTS,
    theme: THEME,
    area,
  });
  return (options.series?.[0] as SeriesAreaOptions).data as PointOptionsObject[];
}

// Reads which kind of series the options describe.
function seriesType(options: Options): string | undefined {
  return (options.series?.[0] as { type?: string } | undefined)?.type;
}

describe('metricChartOptions', () => {
  it('labels only the newest reading', () => {
    const points = pointsOf(false);

    expect(points.map((point) => point.dataLabels !== undefined)).toEqual([false, false, true]);
    expect(points[2]?.marker?.enabled).toBe(true);
  });

  it('draws an area only when asked', () => {
    const line = metricChartOptions({ metric: 'ndvi', points: POINTS, theme: THEME });
    const area = metricChartOptions({ metric: 'ndvi', points: POINTS, theme: THEME, area: true });

    expect(seriesType(line)).toBe('line');
    expect(seriesType(area)).toBe('area');
  });

  it('uses the theme colours and hides the legend for a single series', () => {
    const options = metricChartOptions({ metric: 'ndvi', points: POINTS, theme: THEME });

    expect(options.plotOptions?.series?.color).toBe(THEME.series);
    expect(options.legend?.enabled).toBe(false);
  });

  it('puts the value first and the unit beside it in the tooltip', () => {
    const options = metricChartOptions({ metric: 'carbon_density', points: POINTS, theme: THEME });

    expect(options.tooltip?.pointFormat).toMatch(/^<b>\{point\.y:\.1f\} tCO₂e\/ha<\/b>/);
  });
});
