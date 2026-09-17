// Context object shared by the auth provider and the useAuth hook.
import { createContext } from 'react';
import type { AuthUser, LoginPayload, RegisterPayload } from '@/features/auth/types';

export interface AuthContextValue {
  user: AuthUser | null;
  initialising: boolean;
  signIn: (payload: LoginPayload) => Promise<void>;
  signUp: (payload: RegisterPayload) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
