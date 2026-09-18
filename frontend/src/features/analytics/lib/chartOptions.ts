// Builds the Highcharts options for one metric so every chart shares a single visual language.
import type { Options, PointOptionsObject, SeriesOptionsType } from 'highcharts';
import type { ChartTheme } from '@/features/analytics/hooks/useChartTheme';
import { METRIC_DETAILS } from '@/features/analytics/lib/metricCatalog';
import type { MetricKey, MetricPoint } from '@/features/analytics/types';

const DEFAULT_HEIGHT = 240;
const LINE_WIDTH = 2;
const END_MARKER_RADIUS = 4;
const SURFACE_RING_WIDTH = 2;
const AREA_WASH_OPACITY = 0.1;
const END_LABEL_GAP = 8;
const END_LABEL_ROOM = 52;

interface MetricChartInput {
  metric: MetricKey;
  points: MetricPoint[];
  theme: ChartTheme;
  area?: boolean;
  height?: number;
}

// Marks only the newest reading: a ringed end-dot with its value just to the right of it.
function endPoint(theme: ChartTheme, decimals: number): Partial<PointOptionsObject> {
  return {
    marker: {
      enabled: true,
      radius: END_MARKER_RADIUS,
      lineWidth: SURFACE_RING_WIDTH,
      lineColor: theme.surface,
    },
    dataLabels: {
      enabled: true,
      align: 'left',
      verticalAlign: 'middle',
      x: END_LABEL_GAP,
      y: 0,
      crop: false,
      overflow: 'allow',
      format: `{y:.${decimals}f}`,
      style: { color: theme.text, textOutline: 'none', fontWeight: '600', fontSize: '12px' },
    },
  };
}

// Writes the unit after a value the way a person would: 42%, 0.61, 74.2 tCO₂e/ha.
function unitSuffix(unitLabel: string): string {
  if (unitLabel === '' || unitLabel === '%') {
    return unitLabel;
  }
  return ` ${unitLabel}`;
}

export function metricChartOptions({
  metric,
  points,
  theme,
  area = false,
  height = DEFAULT_HEIGHT,
}: MetricChartInput): Options {
  const { title, unitLabel, decimals } = METRIC_DETAILS[metric];
  const data: PointOptionsObject[] = points.map((point, index) => ({
    x: Date.parse(point.recordedAt),
    y: point.value,
    ...(index === points.length - 1 ? endPoint(theme, decimals) : {}),
  }));
  const series: SeriesOptionsType = area
    ? { type: 'area', name: title, data }
    : { type: 'line', name: title, data };
  const axisLabels = { color: theme.textMuted, fontSize: '11px' };

  return {
    chart: {
      height,
      backgroundColor: 'transparent',
      spacing: [16, END_LABEL_ROOM, 8, 4],
      style: { fontFamily: 'inherit' },
    },
    title: { text: undefined },
    credits: { enabled: false },
    legend: { enabled: false },
    accessibility: { description: `${title}, one reading per month.` },
    xAxis: {
      type: 'datetime',
      lineColor: theme.grid,
      tickColor: theme.grid,
      crosshair: { color: theme.crosshair, width: 1 },
      labels: { style: axisLabels, format: '{value:%b %y}' },
    },
    yAxis: {
      title: { text: undefined },
      gridLineColor: theme.grid,
      gridLineWidth: 1,
      labels: { style: axisLabels, format: unitLabel === '%' ? '{value}%' : undefined },
    },
    tooltip: {
      backgroundColor: theme.surface,
      borderColor: theme.grid,
      borderRadius: 8,
      shadow: false,
      padding: 10,
      style: { color: theme.text, fontSize: '12px' },
      headerFormat: '',
      pointFormat:
        `<b>{point.y:.${decimals}f}${unitSuffix(unitLabel)}</b><br/>` +
        `<span style="color:${theme.textMuted}">{point.x:%B %Y}</span>`,
    },
    plotOptions: {
      series: {
        color: theme.series,
        lineWidth: LINE_WIDTH,
        marker: {
          enabled: false,
          symbol: 'circle',
          radius: END_MARKER_RADIUS,
          lineWidth: SURFACE_RING_WIDTH,
          lineColor: theme.surface,
        },
        states: { hover: { lineWidthPlus: 0 } },
      },
      area: { fillOpacity: AREA_WASH_OPACITY, threshold: null },
    },
    series: [series],
  };
}
