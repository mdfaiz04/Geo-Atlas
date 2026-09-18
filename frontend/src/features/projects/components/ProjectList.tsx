// List of project cards linking through to each project.
import { Link } from 'react-router-dom';
import { ProjectTypeBadge } from '@/features/projects/components/ProjectTypeBadge';
import type { Project } from '@/features/projects/types';
import { formatCount, formatDate, formatHectares } from '@/shared/lib/format';
import '@/features/projects/components/ProjectList.css';

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <ul className="project-list">
      {projects.map((project) => (
        <li key={project.id}>
          <Link className="project-card" to={`/projects/${project.id}`}>
            <div className="project-card__header">
              <span className="project-card__name">{project.name}</span>
              <ProjectTypeBadge type={project.projectType} />
            </div>
            {project.description === null ? null : (
              <p className="project-card__description">{project.description}</p>
            )}
            <div className="project-card__meta">
              <span>
                {formatCount(project.siteCount)} {project.siteCount === 1 ? 'site' : 'sites'}
              </span>
              <span>{formatHectares(project.totalAreaHectares)}</span>
              <span>Created {formatDate(project.createdAt)}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
