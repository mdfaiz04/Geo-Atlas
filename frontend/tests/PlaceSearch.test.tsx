// Checks the place search can be driven entirely from the keyboard.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { searchPlaces } from '@/features/map/api/geocodingApi';
import { PlaceSearch } from '@/features/map/components/PlaceSearch';
import type { Place } from '@/features/map/types';

vi.mock('@/features/map/api/geocodingApi', () => ({ searchPlaces: vi.fn() }));

const PLACES: Place[] = [
  { id: 'a', name: 'Gurugram', context: 'Haryana, India', center: [77.03, 28.46], bounds: null },
  { id: 'b', name: 'Gurugram', context: 'Uttarakhand, India', center: [79.6, 29], bounds: null },
];

// Renders the search box inside a fresh query cache.
function renderSearch() {
  const onSelect = vi.fn();
  render(
    <QueryClientProvider client={new QueryClient()}>
      <PlaceSearch onSelect={onSelect} />
    </QueryClientProvider>,
  );
  return onSelect;
}

describe('PlaceSearch', () => {
  beforeEach(() => {
    vi.mocked(searchPlaces).mockResolvedValue(PLACES);
  });

  it('lists matches with their region so same-named places can be told apart', async () => {
    renderSearch();

    await userEvent.type(screen.getByRole('combobox'), 'Guru');

    expect(await screen.findAllByRole('option')).toHaveLength(2);
    expect(screen.getByText('Uttarakhand, India')).toBeInTheDocument();
  });

  it('selects a result with the arrow keys and Enter', async () => {
    const onSelect = renderSearch();

    await userEvent.type(screen.getByRole('combobox'), 'Guru');
    await screen.findAllByRole('option');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');

    expect(onSelect).toHaveBeenCalledWith(PLACES[1]);
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  it('closes the list on Escape', async () => {
    renderSearch();

    await userEvent.type(screen.getByRole('combobox'), 'Guru');
    await screen.findAllByRole('option');
    await userEvent.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
