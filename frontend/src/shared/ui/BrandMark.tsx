// The Darukaa.Earth logo: a leaf mark beside the wordmark.
import { useId } from 'react';
import '@/shared/ui/BrandMark.css';

export function BrandMark({ size = 32 }: { size?: number }) {
  const gradientId = useId();

  return (
    <span className="brand">
      <svg
        className="brand__mark"
        width={size}
        height={size}
        viewBox="0 0 32 32"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3ecf8e" />
            <stop offset="1" stopColor="#13684c" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill={`url(#${gradientId})`} />
        <path
          d="M9.5 21.5c0-6.6 5.2-11.5 13.5-11.5 0 8.3-4.9 13.5-11.4 13.5-.8 0-1.5-.1-2.1-.3"
          fill="none"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 23.5c2.6-3.8 5.6-6.4 9.5-8.5"
          fill="none"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
      <span className="brand__name">
        Darukaa<span className="brand__dot">.</span>earth
      </span>
    </span>
  );
}
