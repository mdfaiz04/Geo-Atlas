// Friendly placeholder that explains what to do when there is no data yet.
import type { ReactNode } from 'react';
import '@/shared/ui/EmptyState.css';

interface EmptyStateProps {
  title: string;
  text: string;
  action?: ReactNode;
}

export function EmptyState({ title, text, action }: EmptyStateProps) {
  return (
    <div className="empty">
      <h3 className="empty__title">{title}</h3>
      <p className="empty__text">{text}</p>
      {action}
    </div>
  );
}
