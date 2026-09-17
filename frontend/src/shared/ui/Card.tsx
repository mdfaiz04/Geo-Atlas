// Raised container used across the dashboard.
import type { ReactNode } from 'react';
import '@/shared/ui/Card.css';

interface CardProps {
  title?: string;
  description?: string;
  children?: ReactNode;
}

export function Card({ title, description, children }: CardProps) {
  return (
    <section className="card">
      {title === undefined ? null : <h2 className="card__title">{title}</h2>}
      {description === undefined ? null : <p className="card__description">{description}</p>}
      {children}
    </section>
  );
}
