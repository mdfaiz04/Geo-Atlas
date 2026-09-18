// Centred dialog that closes on Escape or a click on the backdrop.
import { useEffect, useId } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import '@/shared/ui/Modal.css';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  function closeOnBackdrop(event: MouseEvent<HTMLDivElement>): void {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div className="modal" role="presentation" onMouseDown={closeOnBackdrop}>
      <div className="modal__panel" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <h2 className="modal__title" id={titleId}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
