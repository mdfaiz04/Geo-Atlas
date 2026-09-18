// Small label with an optional colour dot.
import type { ReactNode } from 'react';
import '@/shared/ui/Badge.css';

interface BadgeProps {
  color?: string;
  children: ReactNode;
}

export function Badge({ color, children }: BadgeProps) {
  return (
    <span className="badge">
      {color === undefined ? null : (
        <span className="badge__dot" style={{ backgroundColor: color }} aria-hidden="true" />
      )}
      {children}
    </span>
  );
}
