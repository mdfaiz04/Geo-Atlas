// Keeps a ref pointing at the newest value so long-lived listeners never read stale props.
import { useLayoutEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';

export function useLatest<T>(value: T): MutableRefObject<T> {
  const ref = useRef(value);
  useLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
}
