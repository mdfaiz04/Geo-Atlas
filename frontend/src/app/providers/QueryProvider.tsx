// Shares one query cache across the app, with retry rules suited to this API.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { ApiError } from '@/shared/api/httpClient';

const MAX_RETRIES = 2;
const STALE_TIME_MS = 30_000;
const FIRST_SERVER_ERROR = 500;

// Retries network and server failures, but never client errors such as 401 or 404.
function shouldRetry(failureCount: number, error: Error): boolean {
  if (error instanceof ApiError && error.status < FIRST_SERVER_ERROR) {
    return false;
  }
  return failureCount < MAX_RETRIES;
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: shouldRetry, staleTime: STALE_TIME_MS, refetchOnWindowFocus: false },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
