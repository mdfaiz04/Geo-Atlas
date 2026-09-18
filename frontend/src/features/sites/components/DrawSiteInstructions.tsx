// Step-by-step help shown while the administrator draws a boundary.
import { Button } from '@/shared/ui/Button';
import '@/features/sites/components/SitePanel.css';

export function DrawSiteInstructions({ onCancel }: { onCancel: () => void }) {
  return (
    <section className="site-panel" aria-live="polite">
      <h3 className="site-panel__title">Draw the site boundary</h3>
      <ol className="site-panel__steps">
        <li>Click on the map to place each corner.</li>
        <li>Click the first point again to close the shape.</li>
        <li>Name the site and save it.</li>
      </ol>
      <div className="site-panel__actions">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </section>
  );
}
