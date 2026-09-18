// Cached reads and writes for sites, built on TanStack Query.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import {
  createSite,
  deleteSite,
  fetchPortfolioSites,
  fetchProjectSites,
  fetchSite,
} from '@/features/sites/api/sitesApi';
import type { CreateSiteInput } from '@/features/sites/types';
import { queryKeys } from '@/shared/api/queryKeys';

// Site changes move project counts and areas too, so both caches are refreshed.
function refreshSiteData(queryClient: QueryClient): Promise<unknown> {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.projects }),
    queryClient.invalidateQueries({ queryKey: queryKeys.portfolioSites }),
  ]);
}

export function usePortfolioSites() {
  return useQuery({ queryKey: queryKeys.portfolioSites, queryFn: fetchPortfolioSites });
}

export function useProjectSites(projectId: string) {
  return useQuery({
    queryKey: queryKeys.projectSites(projectId),
    queryFn: () => fetchProjectSites(projectId),
  });
}

export function useSite(siteId: string) {
  return useQuery({ queryKey: queryKeys.site(siteId), queryFn: () => fetchSite(siteId) });
}

export function useCreateSite(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSiteInput) => createSite(projectId, input),
    onSuccess: () => refreshSiteData(queryClient),
  });
}

export function useDeleteSite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSite,
    onSuccess: (_result, siteId) => {
      queryClient.removeQueries({ queryKey: queryKeys.site(siteId) });
      return refreshSiteData(queryClient);
    },
  });
}
