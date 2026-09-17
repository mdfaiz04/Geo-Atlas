// Thin fetch wrapper that adds auth headers and normalises API failures.
import { API_BASE_URL, API_PREFIX } from '@/shared/config/env';
import { readAccessToken } from '@/shared/api/tokenStorage';

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  authenticated?: boolean;
}

// Pulls the first readable message out of a FastAPI error body.
function extractDetail(payload: unknown): string | null {
  if (typeof payload !== 'object' || payload === null || !('detail' in payload)) {
    return null;
  }
  const { detail } = payload as { detail: unknown };
  if (typeof detail === 'string') {
    return detail;
  }
  if (Array.isArray(detail) && typeof detail[0] === 'object' && detail[0] !== null) {
    const { msg } = detail[0] as { msg?: unknown };
    return typeof msg === 'string' ? msg : null;
  }
  return null;
}

// Reads an error response without letting a malformed body mask the status.
async function readErrorMessage(response: Response): Promise<string> {
  const fallback = response.statusText || 'Request failed';
  try {
    return extractDetail(await response.json()) ?? fallback;
  } catch {
    return fallback;
  }
}

// Sends a JSON request to the API and returns the parsed response body.
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, authenticated = true } = options;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (authenticated) {
    const token = readAccessToken();
    if (token !== null) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${API_PREFIX}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response));
  }

  return (await response.json()) as T;
}
