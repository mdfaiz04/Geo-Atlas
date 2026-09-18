// Loading indicator with a short description of what is loading.
import '@/shared/ui/Spinner.css';

export function Spinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="spinner" role="status">
      <span className="spinner__ring" aria-hidden="true" />
      {label}
    </div>
  );
}
