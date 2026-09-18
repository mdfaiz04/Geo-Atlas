// Screen where an existing administrator signs in.
import { Link } from 'react-router-dom';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { LoginForm } from '@/features/auth/components/LoginForm';

export function LoginPage() {
  return (
    <AuthShell
      title="Sign in"
      subtitle="Open your carbon and biodiversity portfolio."
      footer={
        <>
          New to Darukaa? <Link to="/register">Create an account</Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
