// Calls the authentication endpoints and maps responses into application types.
import { apiRequest } from '@/shared/api/httpClient';
import type { AuthSession, AuthUser, LoginPayload, RegisterPayload } from '@/features/auth/types';

interface UserResponse {
  id: string;
  email: string;
  full_name: string;
}

interface AuthResponse {
  user: UserResponse;
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// Converts the API user shape into the camel-cased type used by the app.
function toUser(response: UserResponse): AuthUser {
  return { id: response.id, email: response.email, fullName: response.full_name };
}

// Converts an authentication response into a session the provider can store.
function toSession(response: AuthResponse): AuthSession {
  return {
    user: toUser(response.user),
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
  };
}

export async function registerAccount(payload: RegisterPayload): Promise<AuthSession> {
  const response = await apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    authenticated: false,
    body: { email: payload.email, full_name: payload.fullName, password: payload.password },
  });
  return toSession(response);
}

export async function loginAccount(payload: LoginPayload): Promise<AuthSession> {
  const response = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    authenticated: false,
    body: payload,
  });
  return toSession(response);
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  return toUser(await apiRequest<UserResponse>('/auth/me'));
}
