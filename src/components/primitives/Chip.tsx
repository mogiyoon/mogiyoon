import React from 'react';

export type ChipTone =
  | 'accentSoft'
  | 'accentSolid'
  | 'neutralSoft'
  | 'outlined'
  | 'outlinedStrong';

export type ChipSize = 'sm' | 'md' | 'mdWide' | 'xs' | 'xsTall';

export type ChipWeight = 'medium' | 'semibold';

const TONE_CLASSES: Record<ChipTone, string> = {
  accentSoft: 'bg-accent-100 text-accent-700',
  accentSolid: 'bg-accent-500 text-white',
  neutralSoft: 'bg-slate-200 text-content-strong',
  outlined: 'border border-line bg-surface text-content-secondary',
  outlinedStrong: 'border border-line bg-surface text-content-strong',
};

const SIZE_CLASSES: Record<ChipSize, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
  mdWide: 'text-xs px-3 py-1',
  xs: 'text-[10px] px-2 py-0.5',
  xsTall: 'text-[10px] px-2 py-1',
};

const WEIGHT_CLASSES: Record<ChipWeight, string> = {
  medium: 'font-medium',
  semibold: 'font-semibold',
};

const BASE_CLASS = 'inline-flex items-center rounded-full';

export interface ChipProps extends React.ComponentPropsWithoutRef<'span'> {
  tone?: ChipTone;
  size?: ChipSize;
  weight?: ChipWeight;
}

export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  (
    {
      tone = 'neutralSoft',
      size = 'sm',
      weight = 'medium',
      className = '',
      children,
      ...rest
    },
    ref,
  ) => {
    const composed = [
      BASE_CLASS,
      TONE_CLASSES[tone],
      SIZE_CLASSES[size],
      WEIGHT_CLASSES[weight],
      className,
    ]
      .filter(Boolean)
      .join(' ')
      .trim();

    return (
      <span ref={ref} className={composed} {...rest}>
        {children}
      </span>
    );
  },
);

Chip.displayName = 'Chip';

export default Chip;
