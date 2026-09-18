// Types used across the projects feature.
import type { ProjectType } from '@/shared/domain/projectType';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  projectType: ProjectType;
  status: 'active' | 'archived';
  siteCount: number;
  totalAreaHectares: number;
  createdAt: string;
}

export interface CreateProjectInput {
  name: string;
  description: string;
  projectType: ProjectType;
}
