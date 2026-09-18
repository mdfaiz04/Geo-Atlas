// Checks the landing page leads signed-out visitors to sign in and members to their dashboard.
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { AuthContext, type AuthContextValue } from '@/features/auth/context/authContext';
import type { AuthUser } from '@/features/auth/types';
import { LandingPage } from '@/pages/LandingPage';

// Renders the landing page as a visitor who is signed in or not.
function renderLanding(user: AuthUser | null) {
  const value: AuthContextValue = {
    user,
    initialising: false,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  };
  render(
    <MemoryRouter>
      <AuthContext.Provider value={value}>
        <LandingPage />
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

describe('LandingPage', () => {
  it('shows the headline and sends visitors to sign in', () => {
    renderLanding(null);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Measure What Your Landscapes Are Actually Doing',
    );
    for (const link of screen.getAllByRole('link', { name: /Get Started/ })) {
      expect(link).toHaveAttribute('href', '/login');
    }
  });

  it('takes a signed-in member straight to the dashboard', () => {
    renderLanding({ id: 'user-1', email: 'demo@darukaa.earth', fullName: 'Demo Administrator' });

    expect(screen.getByRole('link', { name: 'Open dashboard' })).toHaveAttribute(
      'href',
      '/dashboard',
    );
    expect(screen.queryByRole('link', { name: 'Sign in' })).not.toBeInTheDocument();
  });

  it('links each navigation item to its section', () => {
    renderLanding(null);

    expect(screen.getByRole('link', { name: 'Features' })).toHaveAttribute('href', '#features');
    expect(screen.getByRole('link', { name: 'How it works' })).toHaveAttribute(
      'href',
      '#how-it-works',
    );
    expect(screen.getByRole('link', { name: 'Platform' })).toHaveAttribute('href', '#platform');
  });
});
