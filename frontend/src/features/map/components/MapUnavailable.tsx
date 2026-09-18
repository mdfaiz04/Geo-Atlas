// Explains how to switch the map on when no Mapbox token has been configured.
import '@/features/map/components/SiteMap.css';

export function MapUnavailable() {
  return (
    <div className="site-map site-map--unavailable" role="note">
      <strong>The map needs a Mapbox access token.</strong>
      <span>
        Set <code>VITE_MAPBOX_TOKEN</code> in <code>frontend/.env</code> and restart the dev server.
      </span>
    </div>
  );
}
