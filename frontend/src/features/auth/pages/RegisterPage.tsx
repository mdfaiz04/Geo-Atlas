// Screen where a new administrator creates an account.
import { Link } from 'react-router-dom';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Set up the workspace for your projects and sites."
      footer={
        <>
          Already registered? <Link to="/login">Sign in</Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
