// Inline message used for form and request feedback.
import type { ReactNode } from 'react';
import '@/shared/ui/Alert.css';

interface AlertProps {
  tone?: 'error' | 'info';
  children: ReactNode;
}

export function Alert({ tone = 'info', children }: AlertProps) {
  return (
    <div className={`alert alert--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      {children}
    </div>
  );
}
