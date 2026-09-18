// Segmented control for choosing how many months of history the charts show.
import { TIME_RANGES } from '@/features/analytics/lib/timeRange';
import type { TimeRange } from '@/features/analytics/lib/timeRange';
import '@/features/analytics/components/RangeSelector.css';

interface RangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

export function RangeSelector({ value, onChange }: RangeSelectorProps) {
  return (
    <div className="range" role="radiogroup" aria-label="Time range">
      {TIME_RANGES.map((range) => (
        <button
          key={range}
          type="button"
          role="radio"
          aria-checked={range === value}
          className="range__option"
          onClick={() => onChange(range)}
        >
          {range} months
        </button>
      ))}
    </div>
  );
}
