// Checks the new-project dialog validates input and sends the chosen type.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createProject } from '@/features/projects/api/projectsApi';
import { CreateProjectDialog } from '@/features/projects/components/CreateProjectDialog';
import type { Project } from '@/features/projects/types';

vi.mock('@/features/projects/api/projectsApi', () => ({ createProject: vi.fn() }));

const CREATED: Project = {
  id: 'project-1',
  name: 'Sundarbans Mangroves',
  description: null,
  projectType: 'biodiversity',
  status: 'active',
  siteCount: 0,
  totalAreaHectares: 0,
  createdAt: '2026-09-18T00:00:00Z',
};

// Renders the dialog inside a fresh query cache.
function renderDialog(onCreated = vi.fn(), onClose = vi.fn()) {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <CreateProjectDialog onClose={onClose} onCreated={onCreated} />
    </QueryClientProvider>,
  );
  return { onCreated, onClose };
}

describe('CreateProjectDialog', () => {
  beforeEach(() => {
    vi.mocked(createProject).mockReset();
  });

  it('asks for a name before saving', async () => {
    renderDialog();

    await userEvent.click(screen.getByRole('button', { name: 'Create project' }));

    expect(screen.getByRole('alert')).toHaveTextContent('at least two characters');
    expect(createProject).not.toHaveBeenCalled();
  });

  it('creates the project with the chosen type', async () => {
    vi.mocked(createProject).mockResolvedValue(CREATED);
    const { onCreated } = renderDialog();

    await userEvent.type(screen.getByLabelText('Project name'), 'Sundarbans Mangroves');
    await userEvent.click(screen.getByLabelText('Biodiversity'));
    await userEvent.click(screen.getByRole('button', { name: 'Create project' }));

    expect(vi.mocked(createProject).mock.calls[0]?.[0]).toEqual({
      name: 'Sundarbans Mangroves',
      description: '',
      projectType: 'biodiversity',
    });
    expect(onCreated).toHaveBeenCalledWith(CREATED);
  });

  it('closes on Escape', async () => {
    const { onClose } = renderDialog();

    await userEvent.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalled();
  });
});
