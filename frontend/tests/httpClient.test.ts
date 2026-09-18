// Checks that API failures surface a readable message.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, apiRequest } from '@/shared/api/httpClient';

afterEach(() => {
  vi.unstubAllGlobals();
});

// Builds a fetch stub that answers with the given status and body.
function stubFetch(status: number, body: unknown): void {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      statusText: 'Error',
      json: () => Promise.resolve(body),
    }),
  );
}

describe('apiRequest', () => {
  it('returns the parsed body on success', async () => {
    stubFetch(200, { email: 'admin@darukaa.earth' });

    await expect(apiRequest('/auth/me')).resolves.toEqual({ email: 'admin@darukaa.earth' });
  });

  it('returns nothing for an empty 204 response', async () => {
    stubFetch(204, null);

    await expect(apiRequest('/sites/1', { method: 'DELETE' })).resolves.toBeUndefined();
  });

  it('raises an ApiError carrying the server detail', async () => {
    stubFetch(409, { detail: 'An account already exists' });

    await expect(apiRequest('/auth/register', { method: 'POST' })).rejects.toThrow(
      new ApiError(409, 'An account already exists'),
    );
  });

  it('falls back to the status text when the body is not readable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.reject(new Error('not json')),
      }),
    );

    await expect(apiRequest('/auth/me')).rejects.toThrow('Internal Server Error');
  });
});
