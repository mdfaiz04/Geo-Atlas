// Checks the headline portfolio numbers add up across projects.
import { describe, expect, it } from 'vitest';
import { portfolioTotals } from '@/features/projects/lib/portfolioTotals';
import type { Project } from '@/features/projects/types';

// Builds a project with only the numbers that matter to the totals.
function project(siteCount: number, totalAreaHectares: number): Project {
  return {
    id: crypto.randomUUID(),
    name: 'Project',
    description: null,
    projectType: 'carbon',
    status: 'active',
    siteCount,
    totalAreaHectares,
    createdAt: '2026-09-18T00:00:00Z',
  };
}

describe('portfolioTotals', () => {
  it('is all zeros for an empty portfolio', () => {
    expect(portfolioTotals([])).toEqual({ projects: 0, sites: 0, hectares: 0 });
  });

  it('adds sites and area across every project', () => {
    expect(portfolioTotals([project(2, 120.5), project(3, 79.5)])).toEqual({
      projects: 2,
      sites: 5,
      hectares: 200,
    });
  });
});
