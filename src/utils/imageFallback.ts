import type { SyntheticEvent } from 'react';

import { PLACEHOLDER_NOT_FOUND_300x300 } from './placeholders';

export interface ImageFallbackOptions {
  /** URL to swap in when the original src fails to load. */
  fallbackSrc?: string;
  /** Optional callback fired after the fallback src is applied. */
  onAfter?: () => void;
}

/**
 * Builds an `onError` handler for `<img>` elements that swaps the failing
 * src for a fallback URL. `onerror` is cleared on first invocation to
 * prevent infinite loops if the fallback itself 404s.
 */
export function createImageFallbackHandler({
  fallbackSrc = PLACEHOLDER_NOT_FOUND_300x300,
  onAfter,
}: ImageFallbackOptions = {}) {
  return (e: SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    img.onerror = null; // prevent infinite loop if fallback also 404s
    img.src = fallbackSrc;
    onAfter?.();
  };
}
