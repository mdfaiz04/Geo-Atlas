// Side panel that switches between the site list, drawing help and the naming form.
import { DrawSiteInstructions } from '@/features/sites/components/DrawSiteInstructions';
import { SiteDraftForm } from '@/features/sites/components/SiteDraftForm';
import { SiteList } from '@/features/sites/components/SiteList';
import type { SiteFeature } from '@/features/sites/types';
import { Button } from '@/shared/ui/Button';
import { Spinner } from '@/shared/ui/Spinner';

export type SiteEditorMode = 'browse' | 'drawing' | 'naming';

interface ProjectSidebarProps {
  mode: SiteEditorMode;
  sites: SiteFeature[];
  sitesLoading: boolean;
  selectedSiteId: string | null;
  deletingSiteId: string | null;
  saving: boolean;
  saveError: string | null;
  onStartDrawing: () => void;
  onCancelDrawing: () => void;
  onSaveSite: (name: string) => void;
  onSelectSite: (siteId: string) => void;
  onDeleteSite: (siteId: string) => void;
}

export function ProjectSidebar(props: ProjectSidebarProps) {
  if (props.mode === 'drawing') {
    return <DrawSiteInstructions onCancel={props.onCancelDrawing} />;
  }

  if (props.mode === 'naming') {
    return (
      <SiteDraftForm
        saving={props.saving}
        serverError={props.saveError}
        onSave={props.onSaveSite}
        onCancel={props.onCancelDrawing}
      />
    );
  }

  return (
    <aside className="project-sidebar" aria-label="Sites">
      <Button fullWidth onClick={props.onStartDrawing}>
        Draw a new site
      </Button>
      <h2 className="project-sidebar__heading">Sites</h2>
      {props.sitesLoading ? <Spinner label="Loading sites…" /> : null}
      {!props.sitesLoading && props.sites.length === 0 ? (
        <p className="project-sidebar__hint">
          No sites yet. Draw the first boundary on the map to start tracking this project.
        </p>
      ) : null}
      <SiteList
        sites={props.sites}
        selectedSiteId={props.selectedSiteId}
        deletingSiteId={props.deletingSiteId}
        onSelect={props.onSelectSite}
        onDelete={props.onDeleteSite}
      />
    </aside>
  );
}
