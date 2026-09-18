// Labelled multi-line input that shares the text field styling.
import type { TextareaHTMLAttributes } from 'react';
import { useId } from 'react';
import '@/shared/ui/Input.css';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function TextArea({ label, ...rest }: TextAreaProps) {
  const inputId = useId();

  return (
    <div className="field">
      <label className="field__label" htmlFor={inputId}>
        {label}
      </label>
      <textarea id={inputId} className="field__input field__input--multiline" {...rest} />
    </div>
  );
}
