// Fades its children up into place the first time they scroll into view.
import type { CSSProperties, ReactNode } from 'react';
import { useRevealOnScroll } from '@/shared/hooks/useRevealOnScroll';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const { ref, revealed } = useRevealOnScroll<HTMLDivElement>();
  const style = { '--reveal-delay': `${delay}ms` } as CSSProperties;

  return (
    <div
      ref={ref}
      style={style}
      className={`reveal ${revealed ? 'reveal--visible' : ''} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
