// Portfolio overview: headline numbers, every project, and every site on one map.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SiteMap } from '@/features/map/components/SiteMap';
import { CreateProjectDialog } from '@/features/projects/components/CreateProjectDialog';
import { ProjectList } from '@/features/projects/components/ProjectList';
import { useProjects } from '@/features/projects/hooks/projectQueries';
import { portfolioTotals } from '@/features/projects/lib/portfolioTotals';
import { SiteDetailsCard } from '@/features/sites/components/SiteDetailsCard';
import { usePortfolioSites } from '@/features/sites/hooks/siteQueries';
import type { SiteCollection } from '@/features/sites/types';
import { formatCount, formatHectares } from '@/shared/lib/format';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Spinner } from '@/shared/ui/Spinner';
import { StatTile } from '@/shared/ui/StatTile';
import '@/pages/page.css';
import '@/pages/dashboard/DashboardPage.css';

const NO_SITES: SiteCollection = { type: 'FeatureCollection', features: [] };

export function DashboardPage() {
  const navigate = useNavigate();
  const projects = useProjects();
  const sites = usePortfolioSites();
  const [creating, setCreating] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  const totals = portfolioTotals(projects.data ?? []);
  const siteCollection = sites.data ?? NO_SITES;
  const selectedSite = siteCollection.features.find(
    (feature) => feature.properties.id === selectedSiteId,
  )?.properties;

  function renderProjects() {
    if (projects.isPending) {
      return <Spinner label="Loading projects…" />;
    }
    if (projects.isError) {
      return <Alert tone="error">{projects.error.message}</Alert>;
    }
    if (projects.data.length === 0) {
      return (
        <EmptyState
          title="No projects yet"
          text="Create your first project, then draw its sites on the map."
          action={<Button onClick={() => setCreating(true)}>Create a project</Button>}
        />
      );
    }
    return <ProjectList projects={projects.data} />;
  }

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1 className="page__title">Portfolio</h1>
          <p className="page__subtitle">
            Every project you manage, and exactly where its sites are.
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>New project</Button>
      </header>

      <div className="page__stats">
        <StatTile label="Projects" value={formatCount(totals.projects)} />
        <StatTile label="Sites" value={formatCount(totals.sites)} />
        <StatTile label="Area under management" value={formatHectares(totals.hectares)} />
      </div>

      <div className="dashboard">
        <section className="dashboard__projects" aria-label="Projects">
          <h2 className="dashboard__heading">Projects</h2>
          {renderProjects()}
        </section>
        <section className="dashboard__map" aria-label="Portfolio map">
          <SiteMap
            sites={siteCollection}
            selectedSiteId={selectedSiteId}
            onSelectSite={setSelectedSiteId}
          />
          {selectedSite === undefined ? null : (
            <div className="dashboard__selection">
              <SiteDetailsCard
                site={selectedSite}
                onClose={() => setSelectedSiteId(null)}
                action={
                  <div className="dashboard__actions">
                    <Link to={`/sites/${selectedSite.id}`}>View analytics →</Link>
                    <Link to={`/projects/${selectedSite.projectId}`}>Open project</Link>
                  </div>
                }
              />
            </div>
          )}
        </section>
      </div>

      {creating ? (
        <CreateProjectDialog
          onClose={() => setCreating(false)}
          onCreated={(project) => navigate(`/projects/${project.id}`)}
        />
      ) : null}
    </div>
  );
}
