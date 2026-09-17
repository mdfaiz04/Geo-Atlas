// Creates an account and signs the new administrator straight in.
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ApiError } from '@/shared/api/httpClient';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import '@/features/auth/components/AuthForm.css';

const MINIMUM_PASSWORD_LENGTH = 8;

export function RegisterForm() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(null);
    if (password.length < MINIMUM_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters`);
      return;
    }
    setSubmitting(true);
    try {
      await signUp({ email, fullName, password });
      navigate('/dashboard', { replace: true });
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'Unable to reach the server');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={(event) => void handleSubmit(event)} noValidate>
      {error === null ? null : <Alert tone="error">{error}</Alert>}
      <Input
        label="Full name"
        name="fullName"
        autoComplete="name"
        required
        value={fullName}
        onChange={(event) => setFullName(event.target.value)}
      />
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
        autoComplete="new-password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button type="submit" fullWidth loading={submitting}>
        Create account
      </Button>
    </form>
  );
}
