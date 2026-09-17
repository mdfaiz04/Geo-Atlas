// Labelled text input that shows its own validation message.
import type { InputHTMLAttributes } from 'react';
import { useId } from 'react';
import '@/shared/ui/Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, ...rest }: InputProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;

  return (
    <div className="field">
      <label className="field__label" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className="field__input"
        aria-invalid={error !== undefined}
        aria-describedby={error === undefined ? undefined : errorId}
        {...rest}
      />
      {error === undefined ? null : (
        <span className="field__error" id={errorId}>
          {error}
        </span>
      )}
    </div>
  );
}
