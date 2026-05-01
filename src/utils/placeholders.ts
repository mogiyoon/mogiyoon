/**
 * Centralized placeholder image URLs.
 *
 * All URLs use placehold.co (the legacy via.placeholder.com host has been
 * standardized away). Naming convention:
 *   PLACEHOLDER_<INTENT>_<DIMENSIONS>
 *
 * Each constant maps to an exact URL previously hard-coded in a consumer,
 * preserving the original size/colors so visual output is unchanged.
 */

// Image-not-found fallbacks (gray on gray) sized to match each consumer's frame.
export const PLACEHOLDER_NOT_FOUND_300x200 =
  'https://placehold.co/300x200/cccccc/333333?text=Image+Not+Found';

export const PLACEHOLDER_NOT_FOUND_300x300 =
  'https://placehold.co/300x300/cccccc/333333?text=Image+Not+Found';

export const PLACEHOLDER_NOT_FOUND_250x400 =
  'https://placehold.co/250x400/cccccc/333333?text=Image+Not+Found';

export const PLACEHOLDER_NOT_FOUND_250x150 =
  'https://placehold.co/250x150/cccccc/333333?text=Image+Not+Found';

// Default project thumbnail when no screenshot is available.
export const PLACEHOLDER_PROJECT_IMAGE_300x300 =
  'https://placehold.co/300x300/cccccc/333333?text=Project+Image';

// "Coming Soon" placeholder used by PreparingCard.
export const PLACEHOLDER_COMING_SOON_300x300 =
  'https://placehold.co/300x300/e2e8f0/9ca3af?text=Coming+Soon';
