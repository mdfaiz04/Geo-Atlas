// Portfolio overview shown straight after signing in.
import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { fetchSystemHealth, type SystemHealth } from '@/shared/api/systemApi';
import { Card } from '@/shared/ui/Card';
import '@/features/dashboard/pages/DashboardPage.css';

export function DashboardPage() {
  const { user } = useAuth();
  const [health, setHealth] = useState<SystemHealth | null>(null);

  useEffect(() => {
    let active = true;

    fetchSystemHealth()
      .then((result) => {
        if (active) {
          setHealth(result);
        }
      })
      .catch(() => {
        if (active) {
          setHealth(null);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const databaseOnline = health?.database === 'connected';

  return (
    <>
      <header className="dashboard__heading">
        <h1 className="dashboard__title">Welcome back, {user?.fullName ?? 'administrator'}</h1>
        <p className="dashboard__subtitle">Your carbon and biodiversity portfolio at a glance.</p>
      </header>

      <div className="dashboard__grid">
        <Card
          title="Projects"
          description="Create a project, then draw its sites on the map to start collecting analytics."
        />
        <Card
          title="Sites"
          description="Every site is stored as a PostGIS polygon so areas and overlaps are calculated in the database."
        />
        <Card title="Platform status">
          <div className="status">
            <div className="status__row">
              <span className="status__label">API</span>
              <span
                className={`status__value ${health === null ? 'status__value--down' : 'status__value--ok'}`}
              >
                {health === null ? 'Unreachable' : 'Online'}
              </span>
            </div>
            <div className="status__row">
              <span className="status__label">Database</span>
              <span
                className={`status__value ${databaseOnline ? 'status__value--ok' : 'status__value--down'}`}
              >
                {databaseOnline ? 'Connected' : 'Unavailable'}
              </span>
            </div>
            <div className="status__row">
              <span className="status__label">PostGIS</span>
              <span className="status__value">{health?.postgisVersion ?? 'Unknown'}</span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
