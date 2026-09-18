// Summary of the site currently selected on the map.
import type { ReactNode } from 'react';
import type { SiteProperties } from '@/features/sites/types';
import { PROJECT_TYPE_COLORS, PROJECT_TYPE_LABELS } from '@/shared/domain/projectType';
import { formatDate, formatHectares } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/Badge';
import '@/features/sites/components/SitePanel.css';

interface SiteDetailsCardProps {
  site: SiteProperties;
  action?: ReactNode;
}

export function SiteDetailsCard({ site, action }: SiteDetailsCardProps) {
  return (
    <section className="site-panel" aria-label={`Selected site ${site.name}`}>
      <div>
        <h3 className="site-panel__title">{site.name}</h3>
        <p className="site-panel__text">{site.projectName}</p>
      </div>
      <div className="site-panel__meta">
        <Badge color={PROJECT_TYPE_COLORS[site.projectType]}>
          {PROJECT_TYPE_LABELS[site.projectType]}
        </Badge>
        <span>{formatHectares(site.areaHectares)}</span>
        <span>Added {formatDate(site.createdAt)}</span>
      </div>
      {action}
    </section>
  );
}
