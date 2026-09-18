// Dialog that collects the details for a new project and saves it.
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useCreateProject } from '@/features/projects/hooks/projectQueries';
import type { Project } from '@/features/projects/types';
import { ApiError } from '@/shared/api/httpClient';
import { PROJECT_TYPES, PROJECT_TYPE_LABELS } from '@/shared/domain/projectType';
import type { ProjectType } from '@/shared/domain/projectType';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Modal } from '@/shared/ui/Modal';
import { TextArea } from '@/shared/ui/TextArea';
import '@/features/projects/components/CreateProjectDialog.css';

const MINIMUM_NAME_LENGTH = 2;

interface CreateProjectDialogProps {
  onClose: () => void;
  onCreated: (project: Project) => void;
}

export function CreateProjectDialog({ onClose, onCreated }: CreateProjectDialogProps) {
  const createProject = useCreateProject();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState<ProjectType>('carbon');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(null);
    if (name.trim().length < MINIMUM_NAME_LENGTH) {
      setError('Give the project a name of at least two characters');
      return;
    }
    try {
      onCreated(await createProject.mutateAsync({ name, description, projectType }));
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'Unable to reach the server');
    }
  }

  return (
    <Modal title="New project" onClose={onClose}>
      <form className="project-form" onSubmit={(event) => void handleSubmit(event)} noValidate>
        {error === null ? null : <Alert tone="error">{error}</Alert>}
        <Input
          label="Project name"
          name="name"
          autoFocus
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <fieldset className="type-picker">
          <legend className="type-picker__legend">Project type</legend>
          {PROJECT_TYPES.map((type) => (
            <label className="type-option" key={type}>
              <input
                type="radio"
                name="projectType"
                value={type}
                checked={projectType === type}
                onChange={() => setProjectType(type)}
              />
              {PROJECT_TYPE_LABELS[type]}
            </label>
          ))}
        </fieldset>
        <TextArea
          label="Description (optional)"
          name="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <div className="project-form__actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={createProject.isPending}>
            Create project
          </Button>
        </div>
      </form>
    </Modal>
  );
}
