// Cached read of a site's performance over time.
import { useQuery } from '@tanstack/react-query';
import { fetchSiteAnalytics } from '@/features/analytics/api/analyticsApi';
import { queryKeys } from '@/shared/api/queryKeys';

export function useSiteAnalytics(siteId: string) {
  return useQuery({
    queryKey: queryKeys.siteAnalytics(siteId),
    queryFn: () => fetchSiteAnalytics(siteId),
  });
}
