// Shared action button with variants and a busy state.
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import '@/shared/ui/Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  loading = false,
  disabled = false,
  children,
  ...rest
}: ButtonProps) {
  const classes = ['button', `button--${variant}`, fullWidth ? 'button--full' : ''];

  return (
    <button className={classes.join(' ').trim()} disabled={disabled || loading} {...rest}>
      {loading ? 'Please wait…' : children}
    </button>
  );
}
