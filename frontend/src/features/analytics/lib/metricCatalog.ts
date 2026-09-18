// How each metric is named, explained and formatted on screen.
import type { MetricKey } from '@/features/analytics/types';

export interface MetricDetails {
  title: string;
  description: string;
  unitLabel: string;
  decimals: number;
}

export const METRIC_DETAILS: Record<MetricKey, MetricDetails> = {
  carbon_density: {
    title: 'Carbon density',
    description: 'CO₂-equivalent stored per hectare',
    unitLabel: 'tCO₂e/ha',
    decimals: 1,
  },
  ndvi: {
    title: 'Vegetation index (NDVI)',
    description: 'Satellite greenness, from bare ground (0) to dense canopy (1)',
    unitLabel: '',
    decimals: 2,
  },
  canopy_cover: {
    title: 'Canopy cover',
    description: 'Share of the site under tree canopy',
    unitLabel: '%',
    decimals: 1,
  },
  species_richness: {
    title: 'Species richness',
    description: 'Distinct species recorded in the monthly survey',
    unitLabel: 'species',
    decimals: 0,
  },
};

export function formatMetric(metric: MetricKey, value: number): string {
  const { decimals, unitLabel } = METRIC_DETAILS[metric];
  const number = value.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  if (unitLabel === '%') {
    return `${number}%`;
  }
  return unitLabel === '' ? number : `${number} ${unitLabel}`;
}
