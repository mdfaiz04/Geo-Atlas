// Types used across the authentication feature.
export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterPayload {
  email: string;
  fullName: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
