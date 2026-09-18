// Cached reads and writes for projects, built on TanStack Query.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createProject,
  deleteProject,
  fetchProject,
  fetchProjects,
} from '@/features/projects/api/projectsApi';
import { queryKeys } from '@/shared/api/queryKeys';

export function useProjects() {
  return useQuery({ queryKey: queryKeys.projects, queryFn: fetchProjects });
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: queryKeys.project(projectId),
    queryFn: () => fetchProject(projectId),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.projects }),
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: async (_result, projectId) => {
      queryClient.removeQueries({ queryKey: queryKeys.project(projectId) });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.projects }),
        queryClient.invalidateQueries({ queryKey: queryKeys.portfolioSites }),
      ]);
    },
  });
}
