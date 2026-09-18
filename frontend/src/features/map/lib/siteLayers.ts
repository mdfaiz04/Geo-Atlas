// Map layers that colour each site by project type and highlight the selected one.
import type {
  CircleLayerSpecification,
  ExpressionSpecification,
  FillLayerSpecification,
  LineLayerSpecification,
  SymbolLayerSpecification,
} from 'mapbox-gl';
import { PROJECT_TYPE_COLORS } from '@/shared/domain/projectType';

export const SITE_SOURCE_ID = 'sites';
export const SITE_LABEL_SOURCE_ID = 'site-labels';
export const SITE_FILL_LAYER_ID = 'sites-fill';
export const SITE_MARKER_LAYER_ID = 'sites-marker';

const MARKERS_HIDE_AT_ZOOM = 10;

const TYPE_COLOR: ExpressionSpecification = [
  'match',
  ['get', 'projectType'],
  'carbon',
  PROJECT_TYPE_COLORS.carbon,
  'biodiversity',
  PROJECT_TYPE_COLORS.biodiversity,
  '#ffffff',
];

const IS_SELECTED: ExpressionSpecification = ['boolean', ['feature-state', 'selected'], false];

export const siteFillLayer: FillLayerSpecification = {
  id: SITE_FILL_LAYER_ID,
  type: 'fill',
  source: SITE_SOURCE_ID,
  paint: {
    'fill-color': TYPE_COLOR,
    'fill-opacity': ['case', IS_SELECTED, 0.55, 0.3],
  },
};

export const siteOutlineLayer: LineLayerSpecification = {
  id: 'sites-outline',
  type: 'line',
  source: SITE_SOURCE_ID,
  paint: {
    'line-color': ['case', IS_SELECTED, '#ffffff', TYPE_COLOR],
    'line-width': ['case', IS_SELECTED, 3, 2],
  },
};

export const siteMarkerLayer: CircleLayerSpecification = {
  id: SITE_MARKER_LAYER_ID,
  type: 'circle',
  source: SITE_LABEL_SOURCE_ID,
  maxzoom: MARKERS_HIDE_AT_ZOOM,
  paint: {
    'circle-color': TYPE_COLOR,
    'circle-radius': 6,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#ffffff',
  },
};

export const siteLabelLayer: SymbolLayerSpecification = {
  id: 'sites-label',
  type: 'symbol',
  source: SITE_LABEL_SOURCE_ID,
  minzoom: 11,
  layout: {
    'text-field': ['get', 'name'],
    'text-size': 12,
    'text-font': ['DIN Pro Medium', 'Arial Unicode MS Regular'],
  },
  paint: {
    'text-color': '#ffffff',
    'text-halo-color': 'rgba(0, 0, 0, 0.75)',
    'text-halo-width': 1.5,
  },
};
