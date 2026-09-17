// Gives components access to the authentication state and actions.
import { useContext } from 'react';
import { AuthContext, type AuthContextValue } from '@/features/auth/context/authContext';

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}
