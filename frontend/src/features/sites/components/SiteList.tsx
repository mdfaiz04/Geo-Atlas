// Selectable list of sites with a delete action on each row.
import { Link } from 'react-router-dom';
import type { SiteFeature } from '@/features/sites/types';
import { formatHectares } from '@/shared/lib/format';
import '@/features/sites/components/SiteList.css';

interface SiteListProps {
  sites: SiteFeature[];
  selectedSiteId: string | null;
  deletingSiteId?: string | null;
  onSelect: (siteId: string) => void;
  onDelete: (siteId: string) => void;
}

export function SiteList({
  sites,
  selectedSiteId,
  deletingSiteId = null,
  onSelect,
  onDelete,
}: SiteListProps) {
  return (
    <ul className="site-list">
      {sites.map(({ properties: site }) => (
        <li
          key={site.id}
          className={`site-row ${site.id === selectedSiteId ? 'site-row--selected' : ''}`.trim()}
        >
          <button
            type="button"
            className="site-row__select"
            aria-pressed={site.id === selectedSiteId}
            onClick={() => onSelect(site.id)}
          >
            <span className="site-row__name">{site.name}</span>
            <span className="site-row__area">{formatHectares(site.areaHectares)}</span>
          </button>
          <Link
            className="site-row__link"
            to={`/sites/${site.id}`}
            aria-label={`Analytics for ${site.name}`}
          >
            Analytics
          </Link>
          <button
            type="button"
            className="site-row__delete"
            aria-label={`Delete ${site.name}`}
            disabled={deletingSiteId === site.id}
            onClick={() => onDelete(site.id)}
          >
            {deletingSiteId === site.id ? 'Deleting…' : 'Delete'}
          </button>
        </li>
      ))}
    </ul>
  );
}
