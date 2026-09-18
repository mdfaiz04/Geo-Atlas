// Marks an element as revealed once it scrolls into view, so it can animate in.
import { useEffect, useRef, useState } from 'react';

const VISIBLE_SHARE = 0.15;

export function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const element = ref.current;
    if (element === null || revealed) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: VISIBLE_SHARE },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [revealed]);

  return { ref, revealed };
}
