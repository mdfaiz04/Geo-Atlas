// The first screen: a clear promise and one obvious way to get started.
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import '@/features/landing/components/LandingHero.css';

// Staggers each hero element so they rise into place one after another.
function enterDelay(milliseconds: number): CSSProperties {
  return { '--enter-delay': `${milliseconds}ms` } as CSSProperties;
}

export function LandingHero({ startPath }: { startPath: string }) {
  return (
    <section className="hero">
      <p className="hero__badge landing-enter" style={enterDelay(0)}>
        <span className="hero__pulse" aria-hidden="true" />
        Satellite maps, PostGIS and live analytics for nature projects
      </p>
      <h1 className="hero__title landing-enter" style={enterDelay(120)}>
        Measure What Your <span className="hero__highlight">Landscapes Are Actually Doing</span>
      </h1>
      <p className="hero__lede landing-enter" style={enterDelay(260)}>
        Draw every project site on a satellite map, then watch carbon, vegetation and biodiversity
        change month by month, all in one clear dashboard.
      </p>
      <div className="hero__actions landing-enter" style={enterDelay(400)}>
        <Link className="cta" to={startPath}>
          Get Started{' '}
          <span className="cta__arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
      <p className="hero__note landing-enter" style={enterDelay(520)}>
        A demo portfolio is ready to explore, no setup needed
      </p>
    </section>
  );
}
