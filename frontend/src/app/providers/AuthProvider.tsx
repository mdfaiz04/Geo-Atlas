// Holds the signed-in user and exposes the authentication actions to the tree.
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { fetchCurrentUser, loginAccount, registerAccount } from '@/features/auth/api/authApi';
import { AuthContext, type AuthContextValue } from '@/features/auth/context/authContext';
import type { AuthSession, AuthUser, LoginPayload, RegisterPayload } from '@/features/auth/types';
import { clearTokens, readAccessToken, saveTokens } from '@/shared/api/tokenStorage';

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [initialising, setInitialising] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession(): Promise<void> {
      if (readAccessToken() === null) {
        setInitialising(false);
        return;
      }
      try {
        const currentUser = await fetchCurrentUser();
        if (active) {
          setUser(currentUser);
        }
      } catch {
        clearTokens();
      } finally {
        if (active) {
          setInitialising(false);
        }
      }
    }

    void restoreSession();
    return () => {
      active = false;
    };
  }, []);

  const startSession = useCallback(
    (session: AuthSession): void => {
      queryClient.clear();
      saveTokens({ accessToken: session.accessToken, refreshToken: session.refreshToken });
      setUser(session.user);
    },
    [queryClient],
  );

  const signIn = useCallback(
    async (payload: LoginPayload): Promise<void> => {
      startSession(await loginAccount(payload));
    },
    [startSession],
  );

  const signUp = useCallback(
    async (payload: RegisterPayload): Promise<void> => {
      startSession(await registerAccount(payload));
    },
    [startSession],
  );

  const signOut = useCallback((): void => {
    clearTokens();
    queryClient.clear();
    setUser(null);
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, initialising, signIn, signUp, signOut }),
    [user, initialising, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
