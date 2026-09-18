// Adds up the headline numbers shown at the top of the portfolio.
import type { Project } from '@/features/projects/types';

export interface PortfolioTotals {
  projects: number;
  sites: number;
  hectares: number;
}

export function portfolioTotals(projects: Project[]): PortfolioTotals {
  return projects.reduce<PortfolioTotals>(
    (totals, project) => ({
      projects: totals.projects + 1,
      sites: totals.sites + project.siteCount,
      hectares: totals.hectares + project.totalAreaHectares,
    }),
    { projects: 0, sites: 0, hectares: 0 },
  );
}
