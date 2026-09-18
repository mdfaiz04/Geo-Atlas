// Title block for a project with its type, description and delete action.
import { Link } from 'react-router-dom';
import { ProjectTypeBadge } from '@/features/projects/components/ProjectTypeBadge';
import type { Project } from '@/features/projects/types';
import { Button } from '@/shared/ui/Button';

interface ProjectHeaderProps {
  project: Project;
  deleting: boolean;
  onDelete: () => void;
}

export function ProjectHeader({ project, deleting, onDelete }: ProjectHeaderProps) {
  return (
    <header className="page__header">
      <div>
        <Link className="page__back" to="/dashboard">
          ← Portfolio
        </Link>
        <div className="project-title">
          <h1 className="page__title">{project.name}</h1>
          <ProjectTypeBadge type={project.projectType} />
        </div>
        {project.description === null ? null : (
          <p className="page__subtitle">{project.description}</p>
        )}
      </div>
      <Button variant="danger" loading={deleting} onClick={onDelete}>
        Delete project
      </Button>
    </header>
  );
}
