import React from 'react';

export interface FlippableCardProps {
  isFlipped: boolean;
  front: React.ReactNode;
  back: React.ReactNode;
  /** Outer perspective wrapper className. Caller controls aspect/sizing. */
  className?: string;
  /** Additional className appended to the inner rotating div. */
  innerClassName?: string;
  /** Additional className appended to the front face wrapper. */
  frontClassName?: string;
  /** Additional className appended to the back face wrapper. */
  backClassName?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const composeClass = (...parts: Array<string | undefined>) =>
  parts.filter(Boolean).join(' ').trim();

/**
 * Shared 3D flip primitive. Renders both faces; back face is rotated 180deg
 * baseline. Outer wrapper applies perspective: 1000px via inline style so
 * tests can locate it with `div[style*="perspective"]`.
 */
export const FlippableCard: React.FC<FlippableCardProps> = ({
  isFlipped,
  front,
  back,
  className,
  innerClassName,
  frontClassName,
  backClassName,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <div
      className={className}
      style={{ perspective: '1000px' }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={composeClass(
          'relative w-full h-full transition-transform duration-700',
          innerClassName,
        )}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <div
          className={composeClass('absolute inset-0', frontClassName)}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {front}
        </div>
        <div
          className={composeClass('absolute inset-0', backClassName)}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {back}
        </div>
      </div>
    </div>
  );
};

export default FlippableCard;
