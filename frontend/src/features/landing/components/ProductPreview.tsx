// A framed, gently floating screenshot of the real dashboard.
import dashboardPreview from '@/features/landing/assets/dashboard-preview.webp';
import { Reveal } from '@/features/landing/components/Reveal';
import '@/features/landing/components/ProductPreview.css';

export function ProductPreview() {
  return (
    <Reveal className="preview">
      <div className="preview__frame">
        <div className="preview__bar" aria-hidden="true">
          <span className="preview__light" />
          <span className="preview__light" />
          <span className="preview__light" />
          <span className="preview__url">darukaa-earth-web.vercel.app/dashboard</span>
        </div>
        <img
          className="preview__image"
          src={dashboardPreview}
          alt="The Darukaa.Earth dashboard: four projects and nine sites on a satellite map of India"
          width={1600}
          height={1000}
          loading="lazy"
        />
      </div>
    </Reveal>
  );
}
