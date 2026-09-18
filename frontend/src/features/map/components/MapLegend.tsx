// Key explaining which colour belongs to which project type.
import {
  PROJECT_TYPES,
  PROJECT_TYPE_COLORS,
  PROJECT_TYPE_LABELS,
} from '@/shared/domain/projectType';
import '@/features/map/components/SiteMap.css';

export function MapLegend() {
  return (
    <div className="map-legend" aria-label="Map legend">
      {PROJECT_TYPES.map((type) => (
        <span className="map-legend__item" key={type}>
          <span
            className="map-legend__swatch"
            style={{ backgroundColor: PROJECT_TYPE_COLORS[type] }}
            aria-hidden="true"
          />
          {PROJECT_TYPE_LABELS[type]}
        </span>
      ))}
    </div>
  );
}
