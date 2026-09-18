// Calls the project endpoints and maps responses into application types.
import type { CreateProjectInput, Project } from '@/features/projects/types';
import { apiRequest } from '@/shared/api/httpClient';
import type { ProjectType } from '@/shared/domain/projectType';

interface ProjectResponse {
  id: string;
  name: string;
  description: string | null;
  project_type: ProjectType;
  status: Project['status'];
  site_count: number;
  total_area_hectares: number;
  created_at: string;
}

// Converts the API project shape into the camel-cased type used by the app.
function toProject(response: ProjectResponse): Project {
  return {
    id: response.id,
    name: response.name,
    description: response.description,
    projectType: response.project_type,
    status: response.status,
    siteCount: response.site_count,
    totalAreaHectares: response.total_area_hectares,
    createdAt: response.created_at,
  };
}

export async function fetchProjects(): Promise<Project[]> {
  const response = await apiRequest<ProjectResponse[]>('/projects');
  return response.map(toProject);
}

export async function fetchProject(projectId: string): Promise<Project> {
  return toProject(await apiRequest<ProjectResponse>(`/projects/${projectId}`));
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const response = await apiRequest<ProjectResponse>('/projects', {
    method: 'POST',
    body: {
      name: input.name,
      description: input.description,
      project_type: input.projectType,
    },
  });
  return toProject(response);
}

export async function deleteProject(projectId: string): Promise<void> {
  await apiRequest<void>(`/projects/${projectId}`, { method: 'DELETE' });
}
