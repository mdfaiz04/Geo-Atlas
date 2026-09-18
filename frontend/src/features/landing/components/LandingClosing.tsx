// A last invitation to get started, followed by the page footer.
import { Link } from 'react-router-dom';
import { Reveal } from '@/features/landing/components/Reveal';
import '@/features/landing/components/LandingClosing.css';

export function LandingClosing({ startPath }: { startPath: string }) {
  return (
    <>
      <div className="landing-section">
        <Reveal>
          <section className="closing" aria-label="Get started">
            <h2 className="closing__title">See your landscapes from above</h2>
            <p className="closing__text">
              Sign in with the demo account and explore four real-geography projects across India,
              or create your own in under a minute.
            </p>
            <Link className="cta" to={startPath}>
              Get Started{' '}
              <span className="cta__arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </section>
        </Reveal>
      </div>
      <footer className="landing-footer">
        © 2026 Darukaa.earth · Geospatial analytics for carbon and biodiversity projects
      </footer>
    </>
  );
}
