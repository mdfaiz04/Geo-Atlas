// Reads chart colours from the design tokens and follows the light or dark setting.
import { useEffect, useState } from 'react';

export interface ChartTheme {
  series: string;
  grid: string;
  crosshair: string;
  text: string;
  textMuted: string;
  surface: string;
}

const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';

// Resolves the current value of each chart token from the document.
function readTheme(): ChartTheme {
  const styles = getComputedStyle(document.documentElement);
  const token = (name: string): string => styles.getPropertyValue(name).trim();
  return {
    series: token('--chart-series'),
    grid: token('--chart-grid'),
    crosshair: token('--chart-crosshair'),
    text: token('--color-text'),
    textMuted: token('--color-text-muted'),
    surface: token('--color-surface-raised'),
  };
}

export function useChartTheme(): ChartTheme {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    const scheme = window.matchMedia(DARK_SCHEME_QUERY);
    const refresh = (): void => setTheme(readTheme());
    scheme.addEventListener('change', refresh);
    return () => scheme.removeEventListener('change', refresh);
  }, []);

  return theme;
}
