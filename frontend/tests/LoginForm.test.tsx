// Checks the sign-in form submits credentials and reports failures.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { AuthContext, type AuthContextValue } from '@/features/auth/context/authContext';
import { ApiError } from '@/shared/api/httpClient';
import { DEMO_ACCOUNT } from '@/shared/config/demoAccount';

// Renders the form with a stubbed auth context so no network call happens.
function renderLoginForm(signIn: AuthContextValue['signIn']) {
  const value: AuthContextValue = {
    user: null,
    initialising: false,
    signIn,
    signUp: vi.fn(),
    signOut: vi.fn(),
  };

  render(
    <MemoryRouter>
      <AuthContext.Provider value={value}>
        <LoginForm />
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

describe('LoginForm', () => {
  it('submits the typed credentials', async () => {
    const signIn = vi.fn().mockResolvedValue(undefined);
    renderLoginForm(signIn);

    await userEvent.type(screen.getByLabelText('Email'), 'admin@darukaa.earth');
    await userEvent.type(screen.getByLabelText('Password'), 'StrongPassword123');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(signIn).toHaveBeenCalledWith({
      email: 'admin@darukaa.earth',
      password: 'StrongPassword123',
    });
  });

  it('shows the server message when the credentials are rejected', async () => {
    const signIn = vi.fn().mockRejectedValue(new ApiError(401, 'Incorrect email or password'));
    renderLoginForm(signIn);

    await userEvent.type(screen.getByLabelText('Email'), 'admin@darukaa.earth');
    await userEvent.type(screen.getByLabelText('Password'), 'WrongPassword');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Incorrect email or password');
  });

  it('signs straight in with the demo account in one click', async () => {
    const signIn = vi.fn().mockResolvedValue(undefined);
    renderLoginForm(signIn);

    await userEvent.click(screen.getByRole('button', { name: 'Explore with the demo account' }));

    expect(signIn).toHaveBeenCalledWith(DEMO_ACCOUNT);
  });
});
