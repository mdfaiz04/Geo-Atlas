// Header and content frame shown on every signed-in screen.
import { Suspense } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { BrandMark } from '@/shared/ui/BrandMark';
import { Button } from '@/shared/ui/Button';
import { Spinner } from '@/shared/ui/Spinner';
import '@/app/layout/AppLayout.css';

export function AppLayout() {
  const { user, signOut } = useAuth();

  return (
    <div className="layout">
      <header className="layout__header">
        <Link className="layout__brand" to="/dashboard" aria-label="Darukaa.earth dashboard">
          <BrandMark size={28} />
        </Link>
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
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
