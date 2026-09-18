// Maps every URL in the application to a screen, loading the map screens on demand.
import { lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/app/layout/AppLayout';
import { ProtectedRoute } from '@/app/router/ProtectedRoute';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';

const DashboardPage = lazy(() =>
  import('@/pages/dashboard/DashboardPage').then((module) => ({ default: module.DashboardPage })),
);

const ProjectPage = lazy(() =>
  import('@/pages/project/ProjectPage').then((module) => ({ default: module.ProjectPage })),
);

export function AppRouter() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/projects/:projectId" element={<ProjectPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
