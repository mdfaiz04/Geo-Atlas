// One project: its sites on the map, with the tools to draw and manage them.
import type { Polygon } from 'geojson';
import { useCallback, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SiteMap } from '@/features/map/components/SiteMap';
import { useDeleteProject, useProject } from '@/features/projects/hooks/projectQueries';
import { useCreateSite, useDeleteSite, useProjectSites } from '@/features/sites/hooks/siteQueries';
import type { SiteCollection } from '@/features/sites/types';
import { ProjectHeader } from '@/pages/project/ProjectHeader';
import { ProjectSidebar } from '@/pages/project/ProjectSidebar';
import type { SiteEditorMode } from '@/pages/project/ProjectSidebar';
import { ApiError } from '@/shared/api/httpClient';
import { formatCount, formatDate, formatHectares } from '@/shared/lib/format';
import { Alert } from '@/shared/ui/Alert';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Spinner } from '@/shared/ui/Spinner';
import { StatTile } from '@/shared/ui/StatTile';
import '@/pages/page.css';
import '@/pages/project/ProjectPage.css';

const NO_SITES: SiteCollection = { type: 'FeatureCollection', features: [] };
const NOT_FOUND = 404;

export function ProjectPage() {
  const { projectId = '' } = useParams();
  const navigate = useNavigate();
  const project = useProject(projectId);
  const sites = useProjectSites(projectId);
  const createSite = useCreateSite(projectId);
  const deleteSite = useDeleteSite();
  const deleteProject = useDeleteProject();
  const [mode, setMode] = useState<SiteEditorMode>('browse');
  const [draft, setDraft] = useState<Polygon | null>(null);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  const siteCollection = sites.data ?? NO_SITES;

  const handleBoundaryDrawn = useCallback((boundary: Polygon) => {
    setDraft(boundary);
    setMode('naming');
  }, []);

  const handleSelectSite = useCallback(
    (siteId: string) => {
      if (mode === 'browse') {
        setSelectedSiteId(siteId);
      }
    },
    [mode],
  );

  function startDrawing(): void {
    createSite.reset();
    setSelectedSiteId(null);
    setMode('drawing');
  }

  function stopDrawing(): void {
    setDraft(null);
    setMode('browse');
  }

  function saveSite(name: string): void {
    if (draft === null) {
      return;
    }
    createSite.mutate(
      { name, boundary: draft },
      {
        onSuccess: (site) => {
          stopDrawing();
          setSelectedSiteId(site.properties.id);
        },
      },
    );
  }

  function removeSite(siteId: string): void {
    const site = siteCollection.features.find((feature) => feature.properties.id === siteId);
    if (site === undefined || !window.confirm(`Delete the site "${site.properties.name}"?`)) {
      return;
    }
    deleteSite.mutate(siteId, {
      onSuccess: () => setSelectedSiteId((current) => (current === siteId ? null : current)),
    });
  }

  function removeProject(): void {
    if (!window.confirm('Delete this project and every site in it? This cannot be undone.')) {
      return;
    }
    deleteProject.mutate(projectId, {
      onSuccess: () => navigate('/dashboard', { replace: true }),
    });
  }

  if (project.isPending) {
    return <Spinner label="Loading project…" />;
  }

  if (project.isError) {
    const missing = project.error instanceof ApiError && project.error.status === NOT_FOUND;
    return missing ? (
      <EmptyState
        title="Project not found"
        text="It may have been deleted, or it belongs to another account."
        action={<Link to="/dashboard">Back to the portfolio</Link>}
      />
    ) : (
      <Alert tone="error">{project.error.message}</Alert>
    );
  }

  return (
    <div className="page">
      <ProjectHeader
        project={project.data}
        deleting={deleteProject.isPending}
        onDelete={removeProject}
      />

      <div className="page__stats">
        <StatTile label="Sites" value={formatCount(project.data.siteCount)} />
        <StatTile label="Total area" value={formatHectares(project.data.totalAreaHectares)} />
        <StatTile label="Created" value={formatDate(project.data.createdAt)} />
      </div>

      <div className="project-workspace">
        <div className="project-workspace__map">
          <SiteMap
            sites={siteCollection}
            selectedSiteId={selectedSiteId}
            onSelectSite={handleSelectSite}
            drawing={mode !== 'browse'}
            onBoundaryDrawn={handleBoundaryDrawn}
            searchable
          />
        </div>
        <ProjectSidebar
          mode={mode}
          sites={siteCollection.features}
          sitesLoading={sites.isPending}
          selectedSiteId={selectedSiteId}
          deletingSiteId={deleteSite.isPending ? (deleteSite.variables ?? null) : null}
          saving={createSite.isPending}
          saveError={createSite.error?.message ?? null}
          onStartDrawing={startDrawing}
          onCancelDrawing={stopDrawing}
          onSaveSite={saveSite}
          onSelectSite={handleSelectSite}
          onDeleteSite={removeSite}
        />
      </div>
    </div>
  );
}
