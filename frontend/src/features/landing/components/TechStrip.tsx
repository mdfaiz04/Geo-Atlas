// The industry-standard stack behind the platform.
import { Reveal } from '@/features/landing/components/Reveal';
import '@/features/landing/components/TechStrip.css';

const STACK = [
  'React 18 + TypeScript',
  'Mapbox GL JS',
  'Highcharts',
  'FastAPI',
  'PostgreSQL + PostGIS',
  'JWT authentication',
  'GitHub Actions CI/CD',
  'Vercel',
];

export function TechStrip() {
  return (
    <section className="landing-section" id="platform">
      <Reveal className="tech-heading">
        <p className="landing-eyebrow">Platform</p>
        <h2 className="landing-title">Built on an industry-standard stack</h2>
        <p className="landing-lede">
          Tested on every change and deployed automatically, only when every check passes.
        </p>
      </Reveal>
      <Reveal delay={120}>
        <ul className="tech">
          {STACK.map((item) => (
            <li className="tech__chip" key={item}>
              {item}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
