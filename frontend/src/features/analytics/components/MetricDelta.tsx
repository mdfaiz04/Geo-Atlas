// Year-on-year change shown with an arrow, words and a named month, never with colour alone.
import type { Delta, DeltaDirection } from '@/features/analytics/lib/delta';
import '@/features/analytics/components/MetricDelta.css';

const ARROWS: Record<DeltaDirection, string> = { up: '▲', down: '▼', flat: '●' };
const SPOKEN: Record<DeltaDirection, string> = { up: 'Up', down: 'Down', flat: 'Unchanged' };

export function MetricDelta({ delta }: { delta: Delta | null }) {
  if (delta === null) {
    return <span className="delta delta--none">No reading a year earlier</span>;
  }

  return (
    <span className={`delta delta--${delta.direction}`}>
      <span aria-hidden="true">{ARROWS[delta.direction]}</span>
      <span className="visually-hidden">{SPOKEN[delta.direction]}</span>
      {delta.percentText}
      <span className="delta__baseline">vs {delta.baselineMonth}</span>
    </span>
  );
}
