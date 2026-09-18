// Top navigation with the logo, section links and the way into the app.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BrandMark } from '@/shared/ui/BrandMark';
import '@/features/landing/components/LandingNav.css';

const SCROLL_THRESHOLD = 8;

interface LandingNavProps {
  startPath: string;
  signedIn: boolean;
}

export function LandingNav({ startPath, signedIn }: LandingNavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = (): void => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <header className={`landing-nav ${scrolled ? 'landing-nav--scrolled' : ''}`.trim()}>
      <div className="landing-nav__inner">
        <Link className="landing-nav__home" to="/" aria-label="Darukaa.earth home">
          <BrandMark />
        </Link>
        <nav className="landing-nav__links" aria-label="Page sections">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#platform">Platform</a>
        </nav>
        <div className="landing-nav__actions">
          {signedIn ? null : (
            <Link className="landing-nav__signin" to="/login">
              Sign in
            </Link>
          )}
          <Link className="cta cta--small" to={startPath}>
            {signedIn ? 'Open dashboard' : 'Get Started'}
          </Link>
        </div>
      </div>
    </header>
  );
}
