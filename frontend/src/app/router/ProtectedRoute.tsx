// Keeps a route private until the session has been restored and a user exists.
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function ProtectedRoute() {
  const { user, initialising } = useAuth();
  const location = useLocation();

  if (initialising) {
    return null;
  }

  if (user === null) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
