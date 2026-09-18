// Public landing page shown before sign-in, leading into the app.
import { FeatureGrid } from '@/features/landing/components/FeatureGrid';
import { HowItWorks } from '@/features/landing/components/HowItWorks';
import { LandingClosing } from '@/features/landing/components/LandingClosing';
import { LandingHero } from '@/features/landing/components/LandingHero';
import { LandingNav } from '@/features/landing/components/LandingNav';
import { ProductPreview } from '@/features/landing/components/ProductPreview';
import { TechStrip } from '@/features/landing/components/TechStrip';
import { useAuth } from '@/features/auth/hooks/useAuth';
import '@/features/landing/landing.css';

export function LandingPage() {
  const { user } = useAuth();
  const signedIn = user !== null;
  const startPath = signedIn ? '/dashboard' : '/login';

  return (
    <div className="landing">
      <div className="landing__backdrop" aria-hidden="true">
        <span className="landing__glow landing__glow--green" />
        <span className="landing__glow landing__glow--teal" />
        <span className="landing__glow landing__glow--amber" />
        <span className="landing__dots" />
      </div>
      <LandingNav startPath={startPath} signedIn={signedIn} />
      <main>
        <LandingHero startPath={startPath} />
        <ProductPreview />
        <FeatureGrid />
        <HowItWorks />
        <TechStrip />
        <LandingClosing startPath={startPath} />
      </main>
    </div>
  );
}
