// The three steps from a new project to a site's performance story.
import { Reveal } from '@/features/landing/components/Reveal';
import '@/features/landing/components/HowItWorks.css';

const STEPS = [
  {
    title: 'Create a project',
    text: 'Name it and mark it as a carbon or biodiversity project. It appears on your portfolio at once.',
  },
  {
    title: 'Draw its sites',
    text: 'Search for a place, click the corners of each site on the satellite map and save.',
  },
  {
    title: 'Track the results',
    text: 'Open any site to follow carbon stock, vegetation health and species counts over time.',
  },
];

export function HowItWorks() {
  return (
    <section className="landing-section" id="how-it-works">
      <Reveal>
        <p className="landing-eyebrow">How it works</p>
        <h2 className="landing-title">From a blank map to a clear story in minutes</h2>
      </Reveal>
      <ol className="steps">
        {STEPS.map((step, index) => (
          <li className="step" key={step.title}>
            <Reveal delay={index * 120}>
              <span className="step__number">{index + 1}</span>
              <h3 className="step__title">{step.title}</h3>
              <p className="step__text">{step.text}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
