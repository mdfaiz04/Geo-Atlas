// Header and content frame shown on every signed-in screen.
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/shared/ui/Button';
import '@/app/layout/AppLayout.css';

export function AppLayout() {
  const { user, signOut } = useAuth();

  return (
    <div className="layout">
      <header className="layout__header">
        <span className="layout__brand">Darukaa.earth</span>
        <div className="layout__account">
          {user === null ? null : (
            <div className="layout__user">
              <div className="layout__name">{user.fullName}</div>
              <div className="layout__email">{user.email}</div>
            </div>
          )}
          <Button variant="secondary" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </header>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
}
