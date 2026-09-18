// Cache keys shared by every feature so one change can refresh all related data.
export const queryKeys = {
  projects: ['projects'] as const,
  project: (projectId: string) => ['projects', projectId] as const,
  projectSites: (projectId: string) => ['projects', projectId, 'sites'] as const,
  portfolioSites: ['sites'] as const,
  site: (siteId: string) => ['sites', siteId] as const,
  siteAnalytics: (siteId: string) => ['sites', siteId, 'analytics'] as const,
};
