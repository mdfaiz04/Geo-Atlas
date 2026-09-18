// Headline number with a short label above it and an optional detail below.
import type { ReactNode } from 'react';
import '@/shared/ui/StatTile.css';

interface StatTileProps {
  label: string;
  value: string;
  detail?: ReactNode;
}

export function StatTile({ label, value, detail }: StatTileProps) {
  return (
    <div className="stat">
      <span className="stat__label">{label}</span>
      <span className="stat__value">{value}</span>
      {detail}
    </div>
  );
}
