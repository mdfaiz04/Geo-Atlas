// Checks the site list shows each site and reports selection and deletion.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SiteList } from '@/features/sites/components/SiteList';
import type { SiteFeature } from '@/features/sites/types';

// Builds a minimal site feature for the list to render.
function site(id: string, name: string, areaHectares: number): SiteFeature {
  return {
    type: 'Feature',
    id,
    geometry: { type: 'Polygon', coordinates: [] },
    properties: {
      id,
      name,
      projectId: 'project-1',
      projectName: 'Aravalli Forest',
      projectType: 'carbon',
      areaHectares,
      createdAt: '2026-09-18T00:00:00Z',
    },
  };
}

const SITES = [site('a', 'North block', 109.3), site('b', 'South block', 42)];

describe('SiteList', () => {
  it('shows every site with its area', () => {
    render(<SiteList sites={SITES} selectedSiteId={null} onSelect={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('North block')).toBeInTheDocument();
    expect(screen.getByText('109.3 ha')).toBeInTheDocument();
    expect(screen.getByText('South block')).toBeInTheDocument();
  });

  it('marks the selected site', () => {
    render(<SiteList sites={SITES} selectedSiteId="b" onSelect={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByRole('button', { name: /^South block/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('reports which site was selected or deleted', async () => {
    const onSelect = vi.fn();
    const onDelete = vi.fn();
    render(
      <SiteList sites={SITES} selectedSiteId={null} onSelect={onSelect} onDelete={onDelete} />,
    );

    await userEvent.click(screen.getByRole('button', { name: /^North block/ }));
    await userEvent.click(screen.getByRole('button', { name: 'Delete South block' }));

    expect(onSelect).toHaveBeenCalledWith('a');
    expect(onDelete).toHaveBeenCalledWith('b');
  });
});
