// Root component that wires providers and routing together.
import { AuthProvider } from '@/app/providers/AuthProvider';
import { AppRouter } from '@/app/router/AppRouter';
import '@/shared/styles/global.css';

export function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
