// Names a freshly drawn boundary and saves it as a site.
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import '@/features/sites/components/SitePanel.css';

const MINIMUM_NAME_LENGTH = 2;

interface SiteDraftFormProps {
  saving: boolean;
  serverError: string | null;
  onSave: (name: string) => void;
  onCancel: () => void;
}

export function SiteDraftForm({ saving, serverError, onSave, onCancel }: SiteDraftFormProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (name.trim().length < MINIMUM_NAME_LENGTH) {
      setError('Give the site a name of at least two characters');
      return;
    }
    setError(null);
    onSave(name.trim());
  }

  const message = error ?? serverError;

  return (
    <form className="site-panel" onSubmit={handleSubmit} noValidate>
      <h3 className="site-panel__title">Name this site</h3>
      <p className="site-panel__text">The area is measured by PostGIS once the site is saved.</p>
      {message === null ? null : <Alert tone="error">{message}</Alert>}
      <Input
        label="Site name"
        name="siteName"
        autoFocus
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <div className="site-panel__actions">
        <Button type="submit" loading={saving}>
          Save site
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Discard
        </Button>
      </div>
    </form>
  );
}
