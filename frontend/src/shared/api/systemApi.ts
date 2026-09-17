// Reads the service health endpoint, which sits outside the versioned API.
import { API_BASE_URL } from '@/shared/config/env';

export interface SystemHealth {
  status: string;
  environment: string;
  database: string;
  postgisVersion: string | null;
}

interface HealthResponse {
  status: string;
  environment: string;
  database: string;
  postgis_version: string | null;
}

export async function fetchSystemHealth(): Promise<SystemHealth> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error('Health check failed');
  }
  const payload = (await response.json()) as HealthResponse;
  return {
    status: payload.status,
    environment: payload.environment,
    database: payload.database,
    postgisVersion: payload.postgis_version,
  };
}
