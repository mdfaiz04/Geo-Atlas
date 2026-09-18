// Two-column frame that wraps the sign-in and sign-up forms.
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BrandMark } from '@/shared/ui/BrandMark';
import '@/features/auth/components/AuthShell.css';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

const HIGHLIGHTS = [
  'Map every project site as a precise polygon',
  'Track carbon and biodiversity performance over time',
  'One dashboard for the whole portfolio',
];

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="auth">
      <aside className="auth__brand">
        <span className="auth__glow auth__glow--one" aria-hidden="true" />
        <span className="auth__glow auth__glow--two" aria-hidden="true" />
        <span className="auth__contours" aria-hidden="true" />
        <Link className="auth__logo" to="/" aria-label="Darukaa.earth home">
          <BrandMark />
        </Link>
        <div className="auth__story">
          <h1 className="auth__headline">Measure what your landscapes are actually doing.</h1>
          <p className="auth__lede">
            A single workspace for carbon and biodiversity projects, from site boundaries to the
            numbers they produce.
          </p>
        </div>
        <ul className="auth__points">
          {HIGHLIGHTS.map((highlight) => (
            <li className="auth__point" key={highlight}>
              <span className="auth__check" aria-hidden="true">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12l5 5L20 7" />
                </svg>
              </span>
              {highlight}
            </li>
          ))}
        </ul>
      </aside>
      <main className="auth__panel">
        <div className="auth__form">
          <Link className="auth__back" to="/">
            ← Back to home
          </Link>
          <h2 className="auth__title">{title}</h2>
          <p className="auth__subtitle">{subtitle}</p>
          {children}
          <p className="auth__switch">{footer}</p>
        </div>
      </main>
    </div>
  );
}
