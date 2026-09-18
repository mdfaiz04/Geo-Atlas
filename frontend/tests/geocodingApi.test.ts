// Checks place search results are reduced to what the map needs.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { searchPlaces } from '@/features/map/api/geocodingApi';

afterEach(() => {
  vi.unstubAllGlobals();
});

const RESPONSE = {
  features: [
    {
      id: 'place-1',
      geometry: { coordinates: [77.03, 28.46] },
      properties: {
        name: 'Gurugram',
        place_formatted: 'Haryana, India',
        bbox: [76.93, 28.38, 77.12, 28.54],
      },
    },
    {
      id: 'address-1',
      geometry: { coordinates: [77.2, 28.6] },
      properties: { name: 'Janpath' },
    },
  ],
};

describe('searchPlaces', () => {
  it('asks Mapbox for the typed place and keeps name, context, centre and extent', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve(RESPONSE) });
    vi.stubGlobal('fetch', fetchMock);

    const places = await searchPlaces('Gurugram');

    expect(String(fetchMock.mock.calls[0]?.[0])).toContain('q=Gurugram');
    expect(places[0]).toEqual({
      id: 'place-1',
      name: 'Gurugram',
      context: 'Haryana, India',
      center: [77.03, 28.46],
      bounds: [76.93, 28.38, 77.12, 28.54],
    });
  });

  it('copes with results that have no extent or context', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(RESPONSE) }),
    );

    const [, address] = await searchPlaces('Janpath');

    expect(address).toMatchObject({ context: '', bounds: null });
  });
});
