// The four things the platform does, each with its own card.
import type { ReactNode } from 'react';
import { Reveal } from '@/features/landing/components/Reveal';
import '@/features/landing/components/FeatureGrid.css';

interface Feature {
  title: string;
  text: string;
  icon: ReactNode;
}

const ICON_PROPS = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const FEATURES: Feature[] = [
  {
    title: 'Map every site',
    text: 'Draw exact boundaries on satellite imagery. PostGIS validates each shape and measures its true area in hectares.',
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M4 7l5-3 6 3 5-3v13l-5 3-6-3-5 3z" />
        <path d="M9 4v13M15 7v13" />
      </svg>
    ),
  },
  {
    title: 'Your whole portfolio',
    text: 'Every project and site on one map, with live totals for projects, sites and area under management.',
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    title: 'Performance over time',
    text: 'Carbon, vegetation and biodiversity trends for each site, with year-on-year change and clear interactive charts.',
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M3 17l5-5 4 4 8-9" />
        <path d="M14 7h6v6" />
      </svg>
    ),
  },
  {
    title: 'Numbers you can trust',
    text: 'Overlapping sites are rejected so no hectare is counted twice, and every account only ever sees its own data.',
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

export function FeatureGrid() {
  return (
    <section className="landing-section" id="features">
      <Reveal>
        <p className="landing-eyebrow">Features</p>
        <h2 className="landing-title">Everything a nature project needs</h2>
        <p className="landing-lede">
          From the first boundary you draw to the trend you report, the whole journey lives in one
          place.
        </p>
      </Reveal>
      <div className="features">
        {FEATURES.map((feature, index) => (
          <Reveal key={feature.title} delay={index * 90}>
            <article className="feature">
              <span className="feature__icon">{feature.icon}</span>
              <h3 className="feature__title">{feature.title}</h3>
              <p className="feature__text">{feature.text}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
