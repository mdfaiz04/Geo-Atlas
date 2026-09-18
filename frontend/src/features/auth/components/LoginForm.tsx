// Collects credentials and starts a session, with a one-click demo sign-in.
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { LoginPayload } from '@/features/auth/types';
import { ApiError } from '@/shared/api/httpClient';
import { DEMO_ACCOUNT } from '@/shared/config/demoAccount';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import '@/features/auth/components/AuthForm.css';

type Pending = 'credentials' | 'demo' | null;

export function LoginForm() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<Pending>(null);

  async function signInWith(
    credentials: LoginPayload,
    source: Exclude<Pending, null>,
  ): Promise<void> {
    setError(null);
    setPending(source);
    try {
      await signIn(credentials);
      navigate('/dashboard', { replace: true });
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'Unable to reach the server');
    } finally {
      setPending(null);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void signInWith({ email, password }, 'credentials');
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {error === null ? null : <Alert tone="error">{error}</Alert>}
      <Input
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Input
        label="Password"
        type="password"
        name="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button
        type="submit"
        fullWidth
        loading={pending === 'credentials'}
        disabled={pending !== null}
      >
        Sign in
      </Button>
      <div className="auth-form__divider">
        <span>or</span>
      </div>
      <Button
        type="button"
        variant="secondary"
        fullWidth
        loading={pending === 'demo'}
        disabled={pending !== null}
        onClick={() => void signInWith(DEMO_ACCOUNT, 'demo')}
      >
        Explore with the demo account
      </Button>
    </form>
  );
}
